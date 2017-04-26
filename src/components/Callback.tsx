import * as React from "react";

class CallbackProps {
    errorMessage: string | null;
}

export function Callback(props: CallbackProps) {
    const error = props.errorMessage ? <div className="alert error"><dl><dt>Error Alert</dt><dd>{props.errorMessage}</dd></dl></div> : null;
    return (
        <main className="container" role="main">
            <header>
                <h1>Shopify App — Installation</h1>
                <p className="subhead">
                    <label htmlFor="shop">Redirecting, please wait...</label>
                </p>
            </header>

            <div className="container__form">
                ERROR: {error}
            </div>
        </main>
    );
}