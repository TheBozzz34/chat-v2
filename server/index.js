const createServer = require("http").createServer;
const Server = require("socket.io").Server;
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
const { ImgurClient } = require('imgur');
const { client_id, client_secret, auth0_audience, auth0_client_id, auth0_client_secret, auth0_domain } = require('./config.json');
const client = new ImgurClient({ clientId: client_id, clientSecret: client_secret });
const { createReadStream } = require('fs');
const express = require('express');
const axios = require('axios');
const { json } = require("stream/consumers");
const e = require("express");
let token = null;

const app = express();
app.use(express.urlencoded({ extended: false }));




log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

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
    log("Message: " + data.message + " from user: " + data.user);
  });

  socket.on("requestUsername", async (data) => {
    if (fs.existsSync('token.json')) {
      token = require('./token.json').access_token;
      console.log("Token loaded from token.json, checking if it's still valid");
      let goodToken = await checkAuth0ManagementAPIToken(token);
      if (goodToken) {
        console.log("Token is still valid");
      } else {
        console.log("Generating new token");
        generateAuth0ManagementAPIToken().then((response) => {
          token = response.data.access_token;
          fs.writeFile('token.json', JSON.stringify(response.data), function (err) {
            if (err) return console.log(err);
            console.log('Token saved to token.json');
          });
        });
      }
    } else {
      console.log("Generating new token");
      generateAuth0ManagementAPIToken().then((response) => {
        token = response.data.access_token;
        fs.writeFile('token.json', JSON.stringify(response.data), function (err) {
          if (err) return console.log(err);
          console.log('Token saved to token.json');
        });
      });
    }
    let username = await GetAuth0ManagementAPIGetUserName(data);
    console.log("Emitting username: " + username);
    socket.emit("sendUsername", username);
  });

  socket.on("signup", async (data) => {
    if (fs.existsSync('token.json')) {
      token = require('./token.json').access_token;
      console.log("Token loaded from token.json, checking if it's still valid");
      let goodToken = await checkAuth0ManagementAPIToken(token);
      if (goodToken) {
        console.log("Token is still valid");
      } else {
        console.log("Generating new token");
        generateAuth0ManagementAPIToken().then((response) => {
          token = response.data.access_token;
          fs.writeFile('token.json', JSON.stringify(response.data), function (err) {
            if (err) return console.log(err);
            console.log('Token saved to token.json');
          });
        });
      }
    } else {
      console.log("Generating new token");
      generateAuth0ManagementAPIToken().then((response) => {
        token = response.data.access_token;
        fs.writeFile('token.json', JSON.stringify(response.data), function (err) {
          if (err) return console.log(err);
          console.log('Token saved to token.json');
        });
      });
    }
    console.log("Registering user with Auth0 Management API: " + data.username);
    try {
      let goodToken = await checkAuth0ManagementAPIToken(token);
      if (goodToken) {
        const config = {
          method: 'post',
          url: 'https://dev-dc57y-7a.us.auth0.com/api/v2/users',
          headers: {
            Authorization: 'Bearer ' + token,
          },
          data: {
            "connection": "Username-Password-Authentication",
            "email": data.email,
            "password": data.password,
            "username": data.username
          }
        };
        const response = await axios(config);
        const statusCode = response.data.statusCode;
        console.log(JSON.stringify(response.data.statusCode));
        console.log("User: " + data.username + " signed up");
        socket.emit("signupResponse", { username: data.username, success: true });
        log("User: " + data.username + " signed up");
      } else {
        console.log("Bad token, generating a new one");
        const tokenResponse = await generateAuth0ManagementAPIToken();
        token = tokenResponse.data.access_token;
        fs.writeFile('token.json', JSON.stringify(tokenResponse.data), function (err) {
          if (err) return console.log(err);
          console.log('Token saved to token.json');
        });
        const config = {
          method: 'post',
          url: 'https://dev-dc57y-7a.us.auth0.com/api/v2/users',
          headers: {
            Authorization: 'Bearer ' + token,
          },
          data: {
            "connection": "Username-Password-Authentication",
            "email": data.email,
            "password": data.password,
            "username": data.username
          }
        };
        log(JSON.stringify(data.password));
        const response = await axios(config);
        const statusCode = response.data.statusCode;
        console.log(JSON.stringify(response.data.statusCode));
          console.log("User: " + data.username + " signed up");
          socket.emit("signupResponse", { username: data.username, success: true });
        log("User: " + data.username + " signed up");
      }
    } catch (error) {
      console.log(error);
      socket.emit("signupResponse", { username: data.username, success: false, message: error.response.data.message });
      log("User: " + data.username + " failed to sign up");
    }
  });
  
  async function checkAuth0ManagementAPIToken(token) {
    const config = {
      method: 'get',
      url: 'https://dev-dc57y-7a.us.auth0.com/api/v2/users',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
  
    try {
      const response = await axios(config);
      console.log(JSON.stringify(response.data));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async function GetAuth0ManagementAPIGetUserName(email) {
    const config = {
      method: 'get',
      url: 'https://dev-dc57y-7a.us.auth0.com/api/v2/users-by-email?email=' + email,
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
  
    try {
      const response = await axios(config);
      console.log(JSON.stringify(response.data));
      return response.data[0].username;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  
  async function generateAuth0ManagementAPIToken() {
    const config = {
      method: 'post',
      url: 'https://dev-dc57y-7a.us.auth0.com/oauth/token',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        "client_id": auth0_client_id,
        "client_secret": auth0_client_secret,
        "audience": auth0_audience,
        "grant_type": "client_credentials"
      }
    };
  
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response;
  }
  

  ss(socket).on('image', function(stream, data) {
    var tempPath = path.join(__dirname, 'uploads', data.name);
    var username = data.username;
    stream.pipe(fs.createWriteStream(tempPath));
    stream.on('end', function() {
      sendImage(tempPath).then((link) => {
        // console.log("Sending link: " + {username: username, link: link});
        io.emit("image", {username: username, link: link});
        log("Image " + data.link + " uploaded by: " + data.username);
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
    console.log(response.data.link)
    return response.data.link;
  }
}




app.listen(3002, () => {
  console.log('Management API server running on port 3002');
});





httpServer.listen(3001);