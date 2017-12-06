import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { createHttpLink } from "apollo-link-http";
import { ConnectedFlagsProvider, createFlagsReducer } from "flag";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { combineReducers, createStore } from "redux";

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
const httpLink = createHttpLink({
    uri: BASE_API_URL,
});

// Automatically add the token from localStorage as the Authorization header
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem(TOKEN_KEY);
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null,
        },
    };
});

// Automatically redirect to /login if the GraphQL API returns 403 (Forbidden)
const errorLink = onError(({ }) => {
    // if (networkError && networkError.statusCode === 403) {
    //     localStorage.removeItem("token");
    //     window.location.pathname = "/login";
    // }
});

// Replace the token in out session storage if the server sends back a new one
const refreshTokenLink = new ApolloLink((operation, forward) => {
    // @ts-ignore
    return forward(operation).map((response) => {
        const context = operation.getContext();
        const { response: { headers } } = context;

        if (headers) {
            const newToken = headers.get("x-new-token");

            if (newToken) {
                localStorage.setItem(TOKEN_KEY, newToken);
            }

        }
        return response;
    });
});

// Create an Apollo client
const client = new ApolloClient({
    cache: new InMemoryCache(),
    connectToDevTools: true,
    link: errorLink.concat(authLink).concat(refreshTokenLink).concat(httpLink),
});

// Create the redux store
const store = createStore(
    combineReducers({
        flags: createFlagsReducer({}),
    }),
    {}, // initial state
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

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
                <Provider store={store}>
                    <ApolloProvider client={client}>
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
                </Provider>
            </UnexpectedErrorContainer>
        );
    }
}
