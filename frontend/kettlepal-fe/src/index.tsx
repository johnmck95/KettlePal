import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { backendURL } from "./utils/urls";

const httpLink = createHttpLink({
  uri: backendURL(),
  credentials: "include",
});

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        workouts: {
          keyArgs: ["uid"],
          // @ts-expect-error TODO: Fix TS. https://www.apollographql.com/docs/react/pagination/core-api#paginated-read-functions
          merge(
            existing = [],
            incoming,
            { args }: { args?: { offset?: number } }
          ) {
            const offset = (args?.offset as unknown as any) || 0;
            const merged = existing ? existing.slice(0) : [];
            for (let i = 0; i < incoming.length; i++) {
              merged[offset + i] = incoming[i];
            }
            return merged;
          },
          read(existing = []) {
            return existing;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: backendURL(),
  cache: cache,
  link: httpLink,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <BrowserRouter>
        <ColorModeScript />
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ApolloProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
