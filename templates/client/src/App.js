import React, { Component } from "react";
import logo from "./assets/images/nails.png";
import "./App.css";
import {
  BrowserRouter as Router,
  Link,
  Route,
  withRouter
} from "react-router-dom";
import { connect } from "react-redux";
import { RenderLinks, RenderRoutes } from "./routes";
import { getSchema } from "./sockets";
import { store } from "./store";

const linkStyle = { margin: "5px", color: "white" };

class App extends Component {
  componentDidMount() {
    getSchema((err, schema) => {
      store.dispatch({ type: "SET_SCHEMA", schema });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Nails</h1>
          <RenderLinks />
        </header>
        <RenderRoutes />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  schema: state.schema
});

const mapDispatchToProps = dispatch => ({});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
