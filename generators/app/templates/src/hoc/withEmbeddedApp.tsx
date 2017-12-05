import { EmbeddedApp } from "@shopify/polaris/embedded";
import * as React from "react";

import { IWithShopProps } from "./withShop";

declare const ENABLED_EMBEDDED: boolean;
declare const SHOPIFY_API_KEY: string;

// Check if the user is logged in (session storage has a token and shop). If they don't then redirect to the login
// page, otherwise display the children
export function withEmbeddedApp<P extends IWithShopProps>(
    WrappedComponent: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<P> {
    return class HomeContainer extends React.Component<P> {
        constructor(props: P) {
            super(props);
        }

        public render(): JSX.Element {
            if (ENABLED_EMBEDDED) {
                return (
                    <EmbeddedApp
                        apiKey={SHOPIFY_API_KEY}
                        shopOrigin={`https://${this.props.shop}`}
                        forceRedirect={true}>
                        <WrappedComponent {...this.props} />;
                    </EmbeddedApp>
                );
            }

            return <WrappedComponent {...this.props} />;
        }
    };
}
