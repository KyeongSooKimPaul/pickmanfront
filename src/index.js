//import React, { Component, Fragment } from 'react'
import React, { useState, Fragment } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./index.scss";
import App from "./components/app";
import { ScrollContext } from "react-router-scroll-4";
import Dashboard from "./components/dashboard";
import UploadOrder from "./components/products/digital/upload-order";

import Logout from "./components/logout";

import ViewOrders from "./components/products/digital/view-orders";
import Download from "./components/assets/download";
import FinishProcess from "./components/settings/finishProcess";

import Datatable from "./components/common/datatable";
import Login from "./components/auth/login";


import ResetPassword from "./pages/ResetPassword";




import { createUploadLink } from "apollo-upload-client";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "@apollo/client/link/error";
import { SERVER_URI } from "./config";
const searchData = [];

const client = new ApolloClient({
  uri: SERVER_URI,
  cache: new InMemoryCache(),
});

function Root(props) {
  return (
    <Fragment>
      <BrowserRouter basename={"/"}>
        <ScrollContext>
          <Switch>
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/`}
              component={Login}
            />
            <Route
              exact
              path={`${process.env.PUBLIC_URL}/auth/login`}
              component={Login}
            />

  

            <Route
              exact
              path={`${process.env.PUBLIC_URL}/resetpassword`}
              component={ResetPassword}
            />

            <App>
              <Route
                path={`${process.env.PUBLIC_URL}/dashboard`}
                component={Dashboard}
              />

              <Route
                path={`${process.env.PUBLIC_URL}/products/digital/upload-order`}
                component={UploadOrder}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/products/digital/view-orders`}
                component={ViewOrders}
              />

              <Route
                path={`${process.env.PUBLIC_URL}/assets/download`}
                component={Download}
              />

              <Route
                path={`${process.env.PUBLIC_URL}/settings/finishProcess`}
                component={FinishProcess}
              />

              <Route
                path={`${process.env.PUBLIC_URL}/data-table`}
                component={Datatable}
              />

              <Route
                path={`${process.env.PUBLIC_URL}/logout`}
                component={Logout}
              />
            </App>
          </Switch>
        </ScrollContext>
      </BrowserRouter>
    </Fragment>
  );
}

render(
  <ApolloProvider client={client}>
    
      <Root />
 
  </ApolloProvider>,
  document.getElementById("root")
);
