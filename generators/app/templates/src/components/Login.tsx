import { Button, DisplayText, FormLayout, TextField } from "@shopify/polaris";
import * as React from "react";

import * as styles from "./login.scss";

interface ILoginProps {
    disableInstall: boolean;
    handleSubmit: () => void;
    handleStoreChanged: (value: string, id: string) => void;
    errorMessage: string | undefined;
    installMessage: string;
    shop: string;
}

export function Login(props: ILoginProps) {
    return (
        <main role="main" className={styles.main}>
            <header className={styles.header}>
                <DisplayText size="extraLarge">Shopify App — Installation</DisplayText>
            </header>
            <div className={styles.form}>
                <FormLayout>
                    <TextField
                        error={props.errorMessage}
                        id="shop"
                        label="Please enter the “myshopify” domain of your store"
                        name="shop"
                        onChange={props.handleStoreChanged}
                        placeholder="example.myshopify.com"
                        value={props.shop}
                    />
                    <Button
                        primary
                        fullWidth
                        onClick={props.handleSubmit}
                        size="large"
                        disabled={props.disableInstall}>{props.installMessage}</Button>
                </FormLayout>
            </div>
        </main>
    );
}
