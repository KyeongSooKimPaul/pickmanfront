import React, { Component, Fragment } from 'react';
import LoginTabset from './loginTabset';
import { ArrowLeft, Sliders } from 'react-feather';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import stats from '../../assets/images/dashboard/stats.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



import {
  getAccessToken,
  setAccessToken,
  getAccessTokenMaster,
} from '../../accessToken/accessToken';

import { onError } from '@apollo/client/link/error';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { SERVER_URI } from '../../config';

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      console.log('👮🏻‍♀️ graphQLErrors', graphQLErrors);
      //console.log('⚛️ GraphQl Error ⚛️',graphQLErrors)
      for (let err of graphQLErrors) {
        switch (err.code) {
          case 'UNAUTHENTICATED':
            const oldHeaders = operation.getContext().headers;
            const accessTokenMaster = window.localStorage.getItem('token');

            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...oldHeaders,
                Authorization: `bearer ${accessTokenMaster}`,
              },
            }));
            // retry the request, returning the new observable

            return forward(operation);
        }
      }
    }

    networkError && console.log('👮🏻‍♀️ network error', networkError);
    if (networkError) {
      console.log('👮🏻‍♀️ network error', networkError);
    }
  }
);

const httpLink = createHttpLink({
  uri: SERVER_URI,
});

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});

const client = new ApolloClient({
  errorLink,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export class Login extends Component {
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      arrows: false,
    };
    return (
      <Fragment>
        <div
          className="page-wrapper"
          style={{
            marginTop: '50px',
          }}
        >
          <div className="authentication-box">
            <div className="container">
              <div className="row">
                <div className="col-md-12 p-0 card-right ">
                  <div className="card tab2-card">
                    <div className="card-body">
                      <LoginTabset />
                    </div>
                  </div>
                </div>
              </div>
    
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Login;
