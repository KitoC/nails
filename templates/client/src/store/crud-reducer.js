const crudReducer = (state, action) => {
  const endpoint = action.endpoint.split("/")[1];
  switch (action.type_action) {
    case "CREATE":
      return {
        ...state,
        [endpoint]: [...state[endpoint], action.response.data]
      };

    case "READ_ONE":
      return action.response.data;

    case "READ_ALL":
      return {
        ...state,
        [endpoint]: action.response.data
      };

    case "UPDATE":
      let indexUpdate = state[endpoint].findIndex(
        obj => obj.id === action.response.data.id
      );

      if (indexUpdate >= 0) {
        const updatedArray = [...state[endpoint]];
        updatedArray[indexUpdate] = action.response.data;

        return { ...state, [endpoint]: updatedArray };
      }
      return state;

    case "DESTROY":
      let indexDelete = state[endpoint].findIndex(
        obj => obj._id === action.response.data._id
      );

      if (indexDelete >= 0) {
        const alteredArray = [...state[endpoint]];
        alteredArray.splice(indexDelete, 1);

        return { ...state, [endpoint]: alteredArray };
      }
      return state;

    default:
      if (!action.type.match(/@@redux.*/)) {
        console.log(
          `Redux: Action not recognized (IN CRUD REDUCER): ${
            action.type_action
          }`
        );
      }
      return state;
  }
};

export default crudReducer;
