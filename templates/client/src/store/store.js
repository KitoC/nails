import { createStore } from "redux";
import crudReducer from "./crud-reducer.js";
import apiGenerator from "./api-generator";
import { getSchema } from "../config/_client-config";

const initialState = {};

// endpoints.map(endpoint => {
//   initialState[endpoint] = [];
// });

initialState.endpoints = [];
initialState.schema = {};

// NOTE: be wary when applying custom state fields so that you dont accidentally override any endpoints

initialState.error = null;

const reducer = (state, action) => {
  // console.log(state);
  switch (action.type) {
    case "CRUD":
      return crudReducer(state, action);

    case "SET_ERROR_STATE":
      return { ...state, error: reducer.error };

    case "SET_SCHEMA":
      const api = {};
      const { endpoints, models } = action.schema;
      endpoints.map(endpoint => {
        return (api[endpoint] = new apiGenerator(endpoint));
      });
      const omittedFields = { created_at: true, updated_at: true };

      return { ...state, models, endpoints, omittedFields, api };

    default:
      if (!action.type.match(/@@redux.*/)) {
        console.log(`Redux: Action not recognized: ${action.type}`);
      }
      return state;
  }
};

export default createStore(reducer, initialState);
