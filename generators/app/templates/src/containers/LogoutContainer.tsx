import * as React from "react";
import { ApolloClient, withApollo } from "react-apollo";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router";

declare const AUTH_TOKEN_KEY: string;
declare const SHOP_KEY: string;
declare const TOKEN_KEY: string;

interface ILogoutContainerProps {
    client: ApolloClient;
}

class LogoutContainer extends React.Component<ILogoutContainerProps, undefined> {
    constructor(props: ILogoutContainerProps) {
        super(props);
    }

    public render(): JSX.Element {
        // Remove the token and shop from our session storage. These are used by the CheckAuth to determine if someone
        // is logged in
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SHOP_KEY);

        this.props.client.resetStore();

        // Redirect the user to login page
        return (
            <div className="application">
                <Helmet>
                    <title>Shopify App &mdash; Logout</title>
                </Helmet>
                <Redirect to="/login" />
            </div>
        );
    }
}

export const LogoutContainerWithData = withApollo(LogoutContainer);
