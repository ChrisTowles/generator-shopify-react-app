import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { UnexpectedError } from "../components/UnexpectedError";

interface IErrorContainerState {
    hasError: boolean;
}

export class UnexpectedErrorContainer extends React.Component<{}, IErrorContainerState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    public componentDidCatch(error: Error, info: any): void {
        console.error(error);
        console.error(info);

        // ADD REMOTE LOGGING HERE

        this.setState({hasError: true});
    }

    // Renders a demo homepage
    public render(): React.ReactNode {
        document.title = "Shopify App — Error";

        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className="application">
                <UnexpectedError />
            </div>
        );
    }
}
