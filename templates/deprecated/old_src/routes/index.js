import React, {Fragment} from "react";
import { endpoints } from "../config/_client-config";
import RenderModel from "../views/generic-model-view";
import { Route } from "react-router-dom";



const generatedRoutes = () => {
  return endpoints.map(endpoint => {
    return(
      <Route
        path={`/${endpoint}`}
        render={rProps => (
          <RenderModel endpoint={`${endpoint}`} /> 
      )} />
    )
  })
}  

const RenderRoutes = () => {
  return (
    <Fragment>
      {generatedRoutes()}
      {/* Your custom routes can go here. */}
    </Fragment>
  )
}

        

export default RenderRoutes;
