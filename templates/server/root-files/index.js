module.exports = () => {
  return `
const cors = require("cors");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const logger = require("./utils/logger");

const bodyParser = require("body-parser");
const routes = require("./routes");

app.use(bodyParser.json());

app.use(cors());

// routes
if (routes) {
  for (let key in routes) {
    app.use(routes[key]);
  }
  logger.success({ code: "all_routes_connected" });
}

// sockets
io.on("connection", client => {
  require("./sockets").then(sockets => {
    sockets.map(socket => {
      logger.info({ code: "socket_connected", info: socket });

      client.emit(socket.event, socket.data);
    });
  });
});

server.listen(8080, () =>
  logger.success({ code: "server_connected", info: 8080 })
);

module.exports = app;
  `;
};
