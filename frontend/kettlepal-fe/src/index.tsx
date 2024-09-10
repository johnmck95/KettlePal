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

const client = new ApolloClient({
  uri: backendURL(),
  cache: new InMemoryCache(),
  link: httpLink,
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
