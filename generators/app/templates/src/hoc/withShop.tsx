import * as React from "react";
import { Redirect } from "react-router-dom";

declare const SHOP_KEY: string;
declare const TOKEN_KEY: string;

export interface IWithShopProps {
    shop: string;
}

// Check if the user is logged in (session storage has a token and shop). If they don't then redirect to the login
// page, otherwise display the children
export function withShop<P extends IWithShopProps>(
    WrappedComponent: React.ComponentClass<P> | React.StatelessComponent<P>): React.ComponentClass<P> {
    return class WithShop extends React.Component<P> {
        constructor(props: P) {
            super(props);
        }

        public render(): JSX.Element {
            const shop = localStorage.getItem(SHOP_KEY);
            const token = localStorage.getItem(TOKEN_KEY);

            if (!token || !shop) {
                return <Redirect push={true} to="/login" />;
            }
            return <WrappedComponent shop={shop} {...this.props} />;
        }
    };
}
