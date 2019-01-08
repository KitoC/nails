import React, { PureComponent } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Layout from "view/layout/";

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      theme: false
    };
  }

  render() {
    const theme = this.state.theme ? "light" : "dark";
    return (
      <div className={"theme-" + theme}>
        <button onClick={() => this.setState({ theme: !this.state.theme })}>
          change theme
        </button>
        <Layout />
      </div>
    );
  }
}
export default App;
