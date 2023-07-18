import React, { useState, useEffect, useRef } from "react";
import {
  BsFillArrowRightSquareFill,
  BsFillArrowUpRightSquareFill,
  BsFillEraserFill,
  BsFillImageFill,
} from "react-icons/bs";
import { SiScrollreveal } from "react-icons/si";
import io from "socket.io-client";
import ss from "socket.io-stream";
/* cloudflare borked  */
import { useUser } from '@auth0/nextjs-auth0/client';
import AuthenticationButton from "../components/authentication-button";
let server = "http://localhost:3001";

const socket = io(server, {});

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatDivRef = useRef(null); // Ref for the chat div element
  const [socketState, setSocketState] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [username, setUsername] = useState("");
  const { user } = useUser();

  const env = process.env.NODE_ENV;


  useEffect(() => {
    if (user) {
      socket.emit("requestUsername", user.email);
        socket.on("sendUsername", (data) => {
          setUsername(data);
        });
    }
  }, [user]);


  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (data) => {
      setChat((prevState) => [...prevState, data]);
    });

    socket.on("connect", () => {
      setSocketState(socket.connected);
      setShowServerError(false);
    });

    socket.on("disconnect", () => {
      setSocketState(socket.connected);
      setShowServerError(true);
    });

    socket.on("image", (data) => {
      if (matchImgurLink(data.link) !== null) {
        let setByUser = false;
        let message = {
          message: data.link,
          user: username,
          timestamp: new Date().getTime(),
          image: true,
          sentByUser: setByUser,
          env: env,
        };
        message.timestamp = new Date().getTime();
        setChat((prevState) => [...prevState, message]);
      } else {
        alert(data.link);
      }
    });

    // Clean up the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat div when chat state changes
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [chat]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  function scrollChatDiv() {
    var element = document.getElementById("chatDiv");
    element.scrollTop = element.scrollHeight;
  }

  function clearChatDiv() {
    setChat([]);
  }

  const handleFiles = (files) => {
    var file = files[0];
    var stream = ss.createStream();
    var fileExtension = file.name.split(".").pop();
    var filename = randomFileName() + "." + fileExtension;
    ss(socket).emit("image", stream, { name: filename, username: username });
    ss.createBlobReadStream(file).pipe(stream);
  };

  const randomFileName = () => {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  function humanDateString(unixTimestamp) {
    var date = new Date(unixTimestamp);
    return date.toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  function matchImgurLink(url) {
    const regex =
      /^(https?:\/\/)?(i\.)?imgur.com\/((gallery\/(?<galleryid>\w+))|(a\/(?<albumid>\w+))#?)?(?<imgid>\w*)/;

    const match = url.match(regex);

    if (match) {
      const { groups } = match;

      if (groups.galleryid) {
        return {
          type: "gallery",
          id: groups.galleryid,
        };
      } else if (groups.albumid) {
        return {
          type: "album",
          id: groups.albumid,
        };
      } else if (groups.imgid) {
        return {
          type: "image",
          id: groups.imgid,
        };
      }
    }

    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.length > 0) {
      let setByUser = true;
      let messageData = {
        message: message,
        user: username,
        timestamp: new Date().getTime(),
        image: false,
        sentByUser: setByUser,
        env: env,
      };
      socket.emit("message", messageData);
      setMessage("");
    }
  };


  return (
    <div className="container mx-auto p-4 bg-background">
      <div className="ml-auto bg-primary rounded">
        <div className="text-xs text-backround mt-1 p-4">
          WS Server status: {socketState ? "Connected" : "Disconnected"}
          <div className="float-right text-xs text-backround">
         {/* <AuthenticationButton /> */}
         Currently disabvled for maintenance
        </div>  
        </div>
      </div>

      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Synthy1</h1>
      </div>

      {showServerError && (
        <div
          className="p-4 mb-4 text-sm text-onError rounded-lg bg-error mt-4"
          role="alert"
        >
          <span className="font-bold">WS Server Disconnected!</span> This is a
          big problem, please refresh the page or try again later.
        </div>
      )}
    
      {!user && (
        <div className="p-4 mb-4 text-sm text-onError rounded-lg bg-error mt-4">
          <span className="font-bold">Please login to continue!</span>
        </div>
      )}

      {/* Chat App */}
      {user && (
        <div className="rounded-lg shadow-md p-4 mb-4 bg-surface border border-primary">
          <div className="mb-4"></div>
          <div
            className="mb-4 h-[25vh] overflow-auto"
            id="chatDiv"
            ref={chatDivRef}
          >
            {chat.map((msg, index) => (
              <div key={index} className="flex items-start mb-4">
                <div className="flex-grow">
                  <div
                    className={`border-b pb-2 ${
                      msg.sentByUser ? "text-secondary" : "text-primary"
                    }`}
                  >
                    <div className="flex items-baseline">
                      <span className="align-baseline">
                        {msg.image ? (
                          <img
                            src={msg.message}
                            alt="imgur"
                            className="w-[33.333%]"
                          />
                        ) : (
                          msg.message
                        )}
                      </span>

                      <div className="ml-auto">
                        <div className="text-xs text-onBackground">
                          {humanDateString(msg.timestamp)}
                        </div>
                        <div className="text-xs text-primary mt-1">
                          User: {msg.user}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex">
              <input
                type="text"
                className="w-full border rounded-l-md p-2 bg-surface text-onSurface border-primary focus:outline-none"
                placeholder="Enter your message..."
                value={message}
                onChange={handleMessageChange}
                autoFocus
              />
              <button
                type="submit"
                className="bg-primary text-onPrimary font-bold px-4 py-2 ml-2 hover:bg-opacity-90"
              >
                <BsFillArrowUpRightSquareFill />
              </button>
              <button className="bg-primary text-onPrimary font-bold px-4 py-2 ml-2 hover:bg-opacity-90">
                <label htmlFor="file-upload">
                  <div className="flex items-center">
                    <BsFillImageFill />
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
              </button>

              <button onClick={clearChatDiv}>
                <div className="bg-primary text-onPrimary text-2xl ml-2 p-3">
                  <BsFillEraserFill />
                </div>
              </button>
              <button onClick={scrollChatDiv}>
                <div className="bg-primary text-onPrimary text-2xl ml-2 p-3 rounded-r-lg">
                  <SiScrollreveal />
                </div>
              </button>
            </div>
          </form>
          <div className="bg-primary text-onPrimary mt-2 p-3 rounded-lg flex justify-between">
            <div>Username: {username}</div>
            <div className="flex items-center">
              <div className="flex items-center mr-1">
                <BsFillArrowUpRightSquareFill className="mr-1" /> Send Chat
              </div>
              <div className="flex items-center ml-2 border-l mr-2">
                <BsFillImageFill className="mr-1 ml-1" /> Send Image
              </div>
              <div className="flex items-center border-l">
                <BsFillEraserFill className="ml-1 mr-1" /> Clear Chat
              </div>
              <div className="flex items-center ml-2 border-l">
                <SiScrollreveal className="mr-1 ml-1" /> Scroll
              </div>
            </div>
          </div>
        </div>
        )}
      <div className="flex justify-center">
        <div className="text-xs text-onBackground">
          <a
            href="tes"
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            Synthy1
          </a>{" "}
          is a chat app built with{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            NextJS
          </a>{" "}
          and{" "}
          <a
            href="https://socket.io/"
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            Socket.IO
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
