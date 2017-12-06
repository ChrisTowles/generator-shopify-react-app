import * as React from "react";
import { graphql, MutationFunc, QueryProps } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";

import { Callback } from "../components/Callback";
import { parseQueryString } from "../lib/query-string";
import { ShopifyAuthCompleteInput, ShopifyAuthCompleteMutation, ShopifyAuthCompleteMutationVariables } from "../schema";

declare const AUTH_TOKEN_KEY: string;
declare const TOKEN_KEY: string;

import * as ShopifyAuthCompleteMutationGQL from "../graphql/ShopifyAuthCompleteMutation.graphql";

interface ICallbackContainerState {
    callbackSuccess: boolean;
    errorMessage: string | null;
    shop: string | undefined;
    sessionToken: string | undefined;
}

interface ICallbackContainerProps extends RouteComponentProps<{}> {
    data?: QueryProps;
    children?: React.ReactNode;
    mutate: MutationFunc<ShopifyAuthCompleteMutation>;
}

class CallbackContainer extends React.Component<ICallbackContainerProps, ICallbackContainerState> {
    constructor(props: ICallbackContainerProps) {
        super(props);
        this.state = {
            callbackSuccess: false,
            errorMessage: null,
            sessionToken: undefined,
            shop: undefined,
        };
    }

    // This calls our API passing all of the query string parameters plus the token we receive when we started the
    // OAuth process. If it succeeds then set callbackSuccess to true triggering a redirect. If it fails then set
    // the errorMessage in the state so we display an error
    public componentDidMount(): void {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token === null) {
            return this.setState({ errorMessage: "Missing token" });
        }

        const querystring = parseQueryString(this.props.location.search);
        const params: ShopifyAuthCompleteInput = {
            code: querystring.code,
            hmac: querystring.hmac,
            shop: querystring.shop,
            state: querystring.state,
            timestamp: querystring.timestamp,
        };
        const variables: ShopifyAuthCompleteMutationVariables = { token, params };
        this.props.mutate({ variables })
            .then((resp) => {
                if (resp.data.shopifyAuthComplete === undefined || resp.data.shopifyAuthComplete === null) {
                    return this.setState({
                        errorMessage: "API Call Failed.",
                    });
                }
                const sessionToken = resp.data.shopifyAuthComplete.token;
                localStorage.setItem(TOKEN_KEY, sessionToken);

                this.setState({
                    callbackSuccess: true,
                    sessionToken,
                    shop: querystring.shop,
                });
            })
            .catch((err) => {
                console.error(err);
                this.setState({
                    errorMessage: "API Call Failed.",
                });
            });
    }

    // This first time this is called it will render "Please wait..." while the API call is performed. If that
    // is successfull then we'll redirect to / otherwise we'll update the page to display the errorMessage
    public render(): JSX.Element {
        if (this.state.callbackSuccess) {
            // Use this instead of react-router for Safari
            window.location.href = `/?_sh=${this.state.shop}&_st=${this.state.sessionToken}`;
        }

        document.title = "Shopify App — Callback";

        return (
            <div className="application">
                <Callback errorMessage={this.state.errorMessage} loginUrl={`/login`} />
            </div>
        );
    }
}

export const CallbackContainerWithData =
    graphql<ShopifyAuthCompleteMutation, ICallbackContainerProps, ICallbackContainerProps>
        (ShopifyAuthCompleteMutationGQL)(CallbackContainer);
