import React, { Component, Fragment } from "react";
import Sidebar from "./common/sidebar_components/sidebar";

import Footer from "./common/footer";
import Header from "./common/header_components/header";
//import {ApolloProvider} from 'react-apollo';

//import  ApolloClient  from 'apollo-boost';

import { Provider } from "react-redux";


import { READDATA } from "../components/graphql/graphql";
import { connect } from "react-redux";
import { Mutation, Query } from "react-apollo";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "apollo-link-error";
import { ApolloProvider } from "@apollo/client";

const searchData = [];

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: 1,
    };
  }

  render() {
    const { _id } = this.state;
    return (
      <Fragment>
        {/* <ApolloProvider client = {client} > */}

          <div className="page-wrapper">
            <Header />
            <div className="page-body-wrapper">
              <Sidebar />
              <div className="page-body">{this.props.children}</div>
              <Footer />
            </div>
          </div>
      
        {/* </ApolloProvider> */}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  pickerdate5: state.movies.text5,
  pickerdate4: state.movies.text4,
  pickerdate3: state.movies.text3,
  pickerdate2: state.movies.text2,
  pickerdate1: state.movies.text1,
});

export default App;
