import React, { Fragment } from "react";
import RenderModel from "../views/generic-model-view";
import { Route, withRouter } from "react-router-dom";

import { connect } from "react-redux";

const mapStateToProps = state => ({
  endpoints: state.endpoints,
  api: state.api,
  omittedFields: state.omittedFields,
  models: state.models
});

const mapDispatchToProps = dispatch => ({});

const GenerateRoutes = ({ endpoints, api, omittedFields, models }) => {
  const generatedRoutes = endpoints.map(endpoint => (
    <Route
      path={`/${endpoint}`}
      key={"route" + endpoint}
      render={() => (
        <RenderModel
          endpoint={endpoint}
          api={api[endpoint]}
          omittedFields={omittedFields}
          models={models}
        />
      )}
    />
  ));
  return (
    <Fragment>
      <Route exact path={`/`} render={() => <p>home</p>} />
      {generatedRoutes}
    </Fragment>
  );
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GenerateRoutes)
);
