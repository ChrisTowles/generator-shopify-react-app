import { ConnectedFlagsProvider, createFlagsReducer } from "flag";
import * as React from "react";
import { ApolloClient, ApolloProvider, createNetworkInterface } from "react-apollo";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { applyMiddleware, combineReducers, compose, createStore, Reducer } from "redux";

import { CallbackContainerWithData } from "../containers/CallbackContainer";
import { HomeContainer } from "../containers/HomeContainer";
import { LoginContainerWithData } from "../containers/LoginContainer";
import { LogoutContainerWithData } from "../containers/LogoutContainer";
import { NotFoundContainer } from "../containers/NotFoundContainer";
import { UnexpectedErrorContainer } from "../containers/UnexpectedErrorContainer";
import { withEmbeddedApp } from "../hoc/withEmbeddedApp";
import { withShop } from "../hoc/withShop";
import { parseQueryString } from "../lib/query-string";

declare const BASE_API_URL: string;
declare const SHOP_KEY: string;
declare const TOKEN_KEY: string;

// Create a network interface with the config for our GraphQL API
const networkInterface = createNetworkInterface({
    uri: BASE_API_URL,
});

// Automatically add the token from localStorage as the Authorization header
networkInterface.use([{
    applyMiddleware(req, next) {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            if (!req.options.headers) {
                // @ts-ignore
                req.options.headers = {};  // Create the header object if needed.
            }
            // get the authentication token from local storage if it exists
            // @ts-ignore
            req.options.headers.authorization = `Bearer ${token}`;
        }
        next();
    },
}]);

networkInterface.useAfter([{
    applyAfterware({ response }, next) {
        // Replace the token in out session storage if the server sends back a new one
        const newToken = response.headers.get("x-new-token");
        if (newToken) {
            localStorage.setItem(TOKEN_KEY, newToken);
        }

        // Automatically redirect to /login if the GraphQL API returns 403 (Forbidden)
        if (response.status === 403) {
            localStorage.removeItem("token");
            window.location.pathname = "/login";
        }
        next();
    },
}]);

// Create an Apollo client
const client = new ApolloClient({
    dataIdFromObject: (o: any) => o.id,
    networkInterface,
});

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the redux store
const store = createStore(
    combineReducers({
        apollo: client.reducer() as Reducer<any>,
        flags: createFlagsReducer({}),
    }),
    {}, // initial state
    composeEnhancers(
        applyMiddleware(client.middleware()),
        // If you are using the devToolsExtension, you can add it here also
    ),
);

// This is the routing for our app. /login, /logout and /auth/shopify/callback should all be unauthenticated. The
// rest of the app should check that the user is authenticated and initialize the embedded app code if enabled
export class App extends React.Component<{}, {}> {
    public render(): JSX.Element {
        // Re-populate the SHOP_KEY and TOKEN_KEY local storage from the query string parameters if they are provided
        // and we don't have them. This gets around Safari not making the available inside an iframe if set outside.
        const { _sh, _st } = parseQueryString(window.location.search);
        if (_sh !== undefined && _st !== undefined) {
            if (localStorage.getItem(SHOP_KEY) === null) {
                localStorage.setItem(SHOP_KEY, _sh);
            }
            if (localStorage.getItem(TOKEN_KEY) === null) {
                localStorage.setItem(TOKEN_KEY, _st);
            }
        }

        return (
            <UnexpectedErrorContainer>
                <ApolloProvider client={client} store={store}>
                    <ConnectedFlagsProvider>
                        <BrowserRouter>
                            <Switch>
                                <Route path="/login" component={LoginContainerWithData} />
                                <Route path="/logout" component={LogoutContainerWithData} />
                                <Route path="/auth/shopify/callback" component={CallbackContainerWithData} />
                                <Switch>
                                    <Route exact path="/" component={withShop(withEmbeddedApp(HomeContainer))} />
                                    <Route component={withShop(withEmbeddedApp(NotFoundContainer))} />
                                </Switch>
                            </Switch>
                        </BrowserRouter>
                    </ConnectedFlagsProvider>
                </ApolloProvider>
            </UnexpectedErrorContainer>
        );
    }
}
