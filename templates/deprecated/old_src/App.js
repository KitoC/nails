import React, { Component } from "react";
import logo from "./assets/images/nails.png";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { endpoints } from "./config/_client-config";
import RenderRoutes from "./routes";

const linkStyle = { margin: "5px", color: "white" };

class App extends Component {
  renderLinks = () => {
    return endpoints.map(endpoint => {
      return (
        <Link style={linkStyle} to={endpoint}>
          {endpoint}
        </Link>
      );
    });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Nails</h1>
            <Link style={linkStyle} to={"/"}>
              Home
            </Link>
            {this.renderLinks()}
          </header>
          <Route exact path={`/`} render={rProps => (
            <div>
              <div>Home Page</div>
              
            </div>
          )} />
          <RenderRoutes />
          
        </div>
      </Router>
    );
  }
}

export default App;
