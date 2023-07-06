import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

export default function Home() {
  return (
    <h1 className="text-3xl font-bold underline">
      Socket.IO Status : {socket.connected ? "Connected" : "Disconnected"}
    </h1>
  );
}
