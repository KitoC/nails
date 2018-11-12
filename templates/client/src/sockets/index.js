import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:8080");

const getSchema = callback => {
  socket.on("schema", schema => {
    callback(null, schema);
  });
};

export { getSchema };
