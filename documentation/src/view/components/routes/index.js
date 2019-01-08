import React, { PureComponent, Fragment } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import exampleConfig from "config/routes";

const RouteRenderer = ({ RouteList, route }) => {
  console.log({ route });
  if (route.screen) {
    return (
      <Fragment>
        <Route path={route.path} component={route.screen} />
      </Fragment>
    );
  }

  if (route.subMenuItemList) {
    return (
      <Fragment>
        <RouteList menuItems={route.subMenuItemList} />
      </Fragment>
    );
  }
};

const RouteList = ({ menuItems }) => {
  const routes = Object.keys(menuItems);
  console.log({ routes });
  return routes.map((route, index) => (
    <RouteRenderer key={index} RouteList={RouteList} route={menuItems[route]} />
  ));
};

export default RouteList;
