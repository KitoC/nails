import React from "react";
import styles from "./layout.module.scss";
import Menu from "view/components/menu";
import Routes from "view/components/routes";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import exampleConfig from "view/screens";
console.log({ exampleConfig });

const Layout = () => {
  return (
    <Router>
      <div className={styles.layoutContainer}>
        <div className={styles.menu}>
          <Menu menuItems={exampleConfig} />
        </div>
        <div className={styles.documentationWindow}>
          <Routes menuItems={exampleConfig} />
        </div>
      </div>
    </Router>
  );
};

export default Layout;
