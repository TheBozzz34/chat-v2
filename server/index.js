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
  socket.on("message", (data) => {
    console.log("Got message: " + data);
    socket.broadcast.emit("message", data);
  });
});

httpServer.listen(3001);