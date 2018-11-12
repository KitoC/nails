import axios from "axios";
import { store } from "../store";

// Create an axios instance
const axiosApi = axios.create({
  baseURL: "http://localhost:8080" // API server dev
});

// Add the bearer token to the axios instance
// Axios will then add this header with every subsequent request
const setJwt = user => {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  axiosApi.defaults.headers.common["user"] = user;
};

// const getSchema = async () => {
//   try {
//     const schemaJson = await axiosApi.get("/getSchema");

//     store.dispatch({
//       type: "SET_SCHEMA",
//       schema: schemaJson.data.models,
//       endpoints: schemaJson.data.endpoints
//     });
//   } catch (err) {
//     console.error("getSchema func", err);
//   }
// };

// getSchema();

export { axiosApi, setJwt };
