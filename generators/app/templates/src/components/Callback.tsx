import { Banner, DisplayText } from "@shopify/polaris";
import * as React from "react";

import * as styles from "./callback.scss";

interface ICallbackProps {
    errorMessage: string | null;
    loginUrl: string;
}

export function Callback(props: ICallbackProps) {
    const body = props.errorMessage ? (
        <Banner
            title="Authentication Error"
            status="critical"
            action={{ content: "Try again", url: props.loginUrl}}
        >
            <p>{props.errorMessage}</p>
        </Banner>
    ) : (
            <p>Redirecting, please wait...</p>
        );
    return (
        <main role="main" className={styles.main}>
            <header className={styles.header}>
                <DisplayText size="extraLarge">Shopify App — Installation</DisplayText>
            </header>
            <div className={styles.body}>
                {body}
            </div>
        </main>
    );
}
