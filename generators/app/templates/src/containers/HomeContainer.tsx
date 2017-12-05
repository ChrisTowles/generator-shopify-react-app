import { Card, DisplayText, FooterHelp, Page, Subheading } from "@shopify/polaris";
import { Alert } from "@shopify/polaris/embedded";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { IWithShopProps } from "../hoc/withShop";

interface IHomeContainerState {
    showModal: boolean;
}

export class HomeContainer extends React.Component<RouteComponentProps<{}> & IWithShopProps, IHomeContainerState> {
    constructor(props: RouteComponentProps<{}> & IWithShopProps) {
        super(props);
        this.state = {
            showModal: false,
        };
        this.handleSave = this.handleSave.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    // Renders a demo homepage
    public render(): JSX.Element {
        document.title = "Shopify App — Home";

        return (
            <div className="application">
                <Page title="Example application" primaryAction={{ content: "Save", onAction: this.handleSave }}>

                    <Card sectioned>
                        <DisplayText size="small">
                            This starter kit makes it easy to get started building embedded Shopify apps using React.
                        </DisplayText>
                    </Card>

                    <Card sectioned>
                        <Subheading>The Tech Stack</Subheading>
                        <ul>
                            <li><a href="https://facebook.github.io/react/" target="_blank">React</a></li>
                            <li><a href="http://www.uptowncss.com/" target="_blank">TypeScript</a></li>
                            <li><a href="https://palantir.github.io/tslint/" target="_blank">TSLint</a></li>
                            <li><a href="https://polaris.shopify.com/" target="_blank">Polaris</a></li>
                        </ul>
                        <p>
                            For more information please see the
                            <a href="https://github.com/buggy/shopify-react-starter">README</a>.
                        </p>
                    </Card>

                    <Alert open={this.state.showModal} onConfirm={this.hideModal} confirmContent="Ok" >Saved!!</Alert>

                    <FooterHelp>
                        Shopify Serverless Starter Kit &mdash; &copy; 2017
                        <a href="http://www.growingecommerce.com/" target="_blank">Growing eCommerce Pty Ltd</a>.
                    </FooterHelp>
                </Page>
            </div>
        );
    }

    // Called when the Alert is confirmed. By changing showModal to false here when render() is called it outputs
    // the Alert with open = false
    private hideModal(): void {
        this.setState({
            showModal: false,
        });
    }

    // Called when the save button is clicked. By changing showModal to true here when render() is called it outputs
    // the Alert with open = true
    private handleSave(): void {
        this.setState({
            showModal: true,
        });
    }
}
