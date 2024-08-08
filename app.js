const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (username) => {
    socket.username = username;
    socket.broadcast.emit("new-join", `${username} has joined the chat`);
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg, socket.username);
  });

  socket.on("typing", () => {
    console.log(`${socket.username} is typing...`);
    socket.broadcast.emit("typing", `${socket.username} is typing...`);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("user-left", socket.username);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
