import * as React from "react";
import { graphql, MutationFunc, QueryProps } from "react-apollo";
import { RouteComponentProps } from "react-router";

import { Login } from "../components/Login";
import { parseQueryString } from "../lib/query-string";
import { ShopifyAuthBeginMutation, ShopifyAuthBeginMutationVariables } from "../schema";

declare const AUTH_TOKEN_KEY: string;
declare const SHOP_KEY: string;

import * as ShopifyAuthBeginMutationGQL from "../graphql/ShopifyAuthBeginMutation.graphql";

interface ILoginContainerState {
    disableInstall: boolean;
    errorMessage: string | undefined;
    installMessage: string;
    shop: string;
}

interface ILoginContainerProps extends RouteComponentProps<{}> {
    data?: QueryProps;
    children?: React.ReactNode;
    mutate: MutationFunc<ShopifyAuthBeginMutation>;
}

class LoginContainer extends React.Component<ILoginContainerProps, ILoginContainerState> {
    constructor(props: ILoginContainerProps) {
        super(props);
        this.state = {
            disableInstall: false,
            errorMessage: undefined,
            installMessage: "Install",
            shop: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        console.log("constructor()");
    }

    // Once the component has mounted we should check to see if the shop query string parameter was provided and
    // automatically log into that store.
    public componentDidMount(): void {
        const params = parseQueryString(this.props.location.search);
        const shop = params.shop;
        if (shop !== undefined) {
            // Validate the shop domain and set the state
            const errorMessage = this.shopErrorMessage(shop);
            this.setState({
                errorMessage,
                shop,
            });

            // Iff there was no error message the attempt to login
            if (errorMessage === undefined) {
                this.doLogin(shop);
            }
        }
    }

    // Render the login page
    public render(): JSX.Element {
        if (window.top !== window.self) {
            window.top.location.href = window.self.location.href;
        }

        document.title = "Shopify App — Installation";

        return (
            <div className="application">
                <Login
                    shop={this.state.shop}
                    disableInstall={this.state.disableInstall}
                    handleSubmit={this.handleSubmit}
                    handleStoreChanged={this.handleChange}
                    errorMessage={this.state.errorMessage}
                    installMessage={this.state.installMessage} />
            </div>
        );
    }

    // Obtain the OAuth URL and redirect the user to it.
    private doLogin(shop: string): void {
        this.setState({
            disableInstall: true,
            installMessage: "Please wait...",
        }, () => {
            localStorage.setItem(SHOP_KEY, shop);
            const callbackUrl =
                `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
                + "/auth/shopify/callback";
            const variables: ShopifyAuthBeginMutationVariables = { shop, callbackUrl, perUser: false };
            this.props.mutate({ variables })
                .then((resp) => {
                    if (resp.data.shopifyAuthBegin === undefined || resp.data.shopifyAuthBegin === null) {
                        this.setState({
                            disableInstall: false,
                            errorMessage: "API Call Failed.",
                            installMessage: "Install",
                        });
                        return;
                    }
                    localStorage.setItem(AUTH_TOKEN_KEY, resp.data.shopifyAuthBegin.token);
                    // If the current window is the 'parent', change the URL by setting location.href
                    if (window.top === window.self) {
                        window.location.href = resp.data.shopifyAuthBegin.authUrl;

                        // If the current window is the 'child', change the parent's URL with postMessage
                    } else {
                        const message = JSON.stringify({
                            data: { location: window.location.origin + "?shop=" + shop },
                            message: "Shopify.API.remoteRedirect",
                        });
                        window.parent.postMessage(message, `https://${shop}`);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.setState({
                        disableInstall: false,
                        errorMessage: "API Call Failed.",
                        installMessage: "Install",
                    });
                });
        });
    }

    // Update our state as the shop component changed
    private handleChange(value: string, id: string): void {
        this.setState({ [id as keyof ILoginContainerState]: value } as any);
    }

    // Returns the error message if the shop domain is invalid, otherwise null
    private shopErrorMessage(shop: string): string | undefined {
        if (shop.match(/^[a-z][a-z0-9\-]*\.myshopify\.com$/i) == null) {
            return "Shop URL must end with .myshopify.com";
        }
        return undefined;
    }

    // Validate the shop domain and attempt the OAuth process it there is no error
    private handleSubmit(evt: React.FormEvent<HTMLFormElement>): void {
        evt.preventDefault();
        const errorMessage = this.shopErrorMessage(this.state.shop);
        this.setState({
            errorMessage,
        });
        if (errorMessage === undefined) {
            this.doLogin(this.state.shop);
        }
    }
}

export const LoginContainerWithData =
    graphql<ShopifyAuthBeginMutation, ILoginContainerProps, ILoginContainerProps>
        (ShopifyAuthBeginMutationGQL)(LoginContainer);
