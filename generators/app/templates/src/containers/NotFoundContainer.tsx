import { EmptyState, Page } from "@shopify/polaris";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { IWithShopProps } from "../hoc/withShop";

export class NotFoundContainer extends React.Component<RouteComponentProps<{}> & IWithShopProps, {}> {
    constructor(props: RouteComponentProps<{}> & IWithShopProps) {
        super(props);
        this.state = {};
    }

    // Renders the not found page
    public render(): JSX.Element {
        document.title = "Shopify App — Page Not Found";

        return (
            <div className="application">
                <Page title="Page Not Found">
                    <EmptyState
                        heading="Page Not Found"
                        action={{
                            content: "Go to Dashboard",
                            url: "/",
                        }}
                        image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                    >
                        <p>Oh no! We could not find the page you were looking for.</p>
                    </EmptyState>
                </Page>
            </div>
        );
    }
}
