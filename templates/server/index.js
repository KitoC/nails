const cors = require("cors");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { socketDBSchema } = require("./sockets");

const { logger } = require("./utils");

const bodyParser = require("body-parser");
const routes = require("./routes");

app.use(bodyParser.json());

app.use(cors());

// routes;
if (routes) {
  for (let key in routes) {
    app.use(routes[key]);
  }
  logger.success({ code: "all_routes_connected" });
}

// sockets
io.on("connection", client => {
  client.emit(socketDBSchema.event, socketDBSchema.data);
  logger.info({ code: "socket_connected", info: socketDBSchema.event });
});

server.listen(8080, () =>
  logger.success({ code: "server_connected", info: 8080 })
);

module.exports = app;
