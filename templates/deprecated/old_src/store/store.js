import { createStore } from "redux";
import { endpoints } from "../config/_client-config";
import crudReducer from "./crud-reducer.js";

const initialState = {};

endpoints.map(endpoint => {
  initialState[endpoint] = [];
});

// NOTE: be wary when applying custom state fields so that you dont accidentally override any endpoints

initialState.error = null;

const reducer = (state, action) => {
  // console.log(state);
  switch (action.type) {
    case "CRUD":
      // console.log(crudReducer(state, action));
      return crudReducer(state, action);

    case "SET_ERROR_STATE":
      return { ...state, error: reducer.error };

    default:
      if (!action.type.match(/@@redux.*/)) {
        console.log(`Redux: Action not recognized: ${action.type}`);
      }
      return state;
  }
};

export default createStore(reducer, initialState);
