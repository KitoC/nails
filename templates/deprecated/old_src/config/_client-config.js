// import endpoints from "./endpoints";
import { schemas, extractKeys, endpoints } from "./schemas";
import { axiosApi } from "./init";



console.log('in client_config',endpoints)
export { endpoints, axiosApi, schemas, extractKeys };
