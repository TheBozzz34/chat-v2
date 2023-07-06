const createServer = require("http").createServer;
const Server = require("socket.io").Server;

const httpServer = createServer();
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3001);