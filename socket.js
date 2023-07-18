import io from "socket.io-client";
let server = "http://localhost:3001";

const socket = io(server, {});

export default socket;