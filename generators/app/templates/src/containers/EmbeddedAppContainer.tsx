import { EmbeddedApp } from "@shopify/polaris/embedded";
import * as React from "react";

declare const ENABLED_EMBEDDED: boolean;
declare const SHOP_KEY: string;
declare const SHOPIFY_API_KEY: string;

// This component conditionally includes the EmbeddedApp component based on the enableEmbedded setting in the config
export function EmbeddedAppContainer(props: { children?: any }): JSX.Element {
    if (ENABLED_EMBEDDED) {
        const shop = localStorage.getItem(SHOP_KEY);

        return (
            <EmbeddedApp apiKey={SHOPIFY_API_KEY} shopOrigin={`https://${shop}`} forceRedirect={true}>
                {props.children}
            </EmbeddedApp>
        );

    }

    return props.children;
}
