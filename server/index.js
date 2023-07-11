const createServer = require("http").createServer;
const Server = require("socket.io").Server;
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
const { ImgurClient } = require('imgur');
const { client_id, client_secret } = require('./config.json');
const client = new ImgurClient({ clientId: client_id, clientSecret: client_secret });
const { createReadStream } = require('fs');

const httpServer = createServer();
const io = require("socket.io")(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log("Emitting message: " + data.message);
    io.emit("message", data);
  });

  ss(socket).on('image', function(stream, data) {
    var tempPath = path.join(__dirname, 'uploads', data.name);
    var username = data.username;
    stream.pipe(fs.createWriteStream(tempPath));
    stream.on('end', function() {
      sendImage(tempPath).then((link) => {
        console.log("Sending link: " + {username: username, link: link});
        io.emit("image", {username: username, link: link});
        fs.unlink(tempPath, (err) => {
          if (err) {
            console.error(err)
            return
          }
        });
      });
    });
  });
});

async function sendImage(path) {
  console.log("Sending " + path +  " to image server");
  const response = await client.upload({
    image: createReadStream(path),
    type: 'stream',
  });
  if (response.status !== 200) {
    console.error(response.data);
    return response.data;
  } else {
    return response.data.link;
    console.log(response.data.link)
  }
}



httpServer.listen(3001);