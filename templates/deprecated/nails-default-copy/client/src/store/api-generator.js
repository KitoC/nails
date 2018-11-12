import { endpoints, axiosApi } from "../config/_client-config";
import store from "./store";

class ApiGenerator {
  constructor(endpoint) {
    this.endpoint = `/${endpoint}`;
  }

  create = async (newObj, callback) => {
    try {
      const response = await axiosApi.post(this.endpoint, newObj);
      store.dispatch({
        type_action: "CREATE",
        type: "CRUD",
        endpoint: this.endpoint,
        response
      });
      callback && callback()
    } catch (err) {
      store.dispatch({
        type: "SET_ERROR_STATE",
        error: err
      });
    }
  };

  readOne = async (id, callback) => {
    try {
      const response = await axiosApi.get(this.endpoint + `/${id}`);
      store.dispatch({
        type_action: "READ_ONE",
        type: "CRUD",
        endpoint: this.endpoint,
        response
      });
      callback && callback()
    } catch (err) {
      store.dispatch({
        type: "SET_ERROR_STATE",
        error: err
      });
    }
  };

  readAll = async (callback) => {
    try {
      const response = await axiosApi.get(this.endpoint);
      store.dispatch({
        type_action: "READ_ALL",
        type: "CRUD",
        endpoint: this.endpoint,
        response
      });
     callback && callback()
    } catch (err) {
      store.dispatch({
        type: "SET_ERROR_STATE",
        error: err
      });
    }
  };

  update = async (updatedObject, callback) => {
    try {
      const response = await axiosApi.put(
        this.endpoint + `/${updatedObject._id}`,
        updatedObject
      );
      store.dispatch({
        type_action: "UPDATE",
        type: "CRUD",
        endpoint: this.endpoint,
        response
      });
      callback && callback()
    } catch (err) {
      store.dispatch({
        type: "SET_ERROR_STATE",
        error: err
      });
    }

    // TODO: write logic for updating obj using new redux-store and api generator
  };

  destroy = async (objId, callback) => {
    try {
      const response = await axiosApi.delete(this.endpoint + `/${objId}`)  
       
      store.dispatch({
         type_action: "DESTROY",
         type: "CRUD",
         endpoint: this.endpoint,
         response
      });
      callback && callback()
    } catch (err) {
      store.dispatch({
        type: "SET_ERROR_STATE",
        error: err
      });
    }
  };
}

const api = {};

endpoints.map(endpoint => {
  api[endpoint] = new ApiGenerator(endpoint);
});


export default api;
