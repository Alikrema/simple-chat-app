const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// Initialize the app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static("public"));

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Store the username for each socket
  socket.on("join", (username) => {
    socket.username = username;
    socket.broadcast.emit("new-join", `${username} has joined the chat`);
  });

  // Listen for chat messages
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg, socket.username);
  });

  // Listen for typing events
  socket.on("typing", () => {
    console.log(`${socket.username} is typing...`);
    socket.broadcast.emit("typing", `${socket.username} is typing...`);
  });

  // Broadcast when a user disconnects
  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("user-left", socket.username);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
