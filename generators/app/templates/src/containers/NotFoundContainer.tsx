import { EmptyState, Page } from "@shopify/polaris";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router-dom";

export class NotFoundContainer extends React.Component<RouteComponentProps<undefined>, any> {
    constructor(props: RouteComponentProps<undefined>) {
        super(props);
    }

    // Renders a demo homepage. The only import thing here is using Helmet to replace the stylesheet with the
    // stylesheet for Polaris.
    public render(): JSX.Element {
        return (
            <div className="application">
                <Helmet>
                    <title>Shopify App &mdash; Page Not Found</title>
                </Helmet>
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
