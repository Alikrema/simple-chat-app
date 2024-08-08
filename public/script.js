const socket = io();

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

//* Helper Functions *//

function generateUsername() {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "",
    length: 2,
    style: "capital",
  });

  const number = Math.floor(Math.random() * 1000);
  return `${randomName}${number}`;
}

function joinChat(username) {
  document.getElementById("username").textContent = username;
  socket.emit("join", username);
}

function sendMessage(message) {
  socket.emit("chatMessage", message);
  document.getElementById("messageInput").value = "";
}

//* Event Listeners *//

document.getElementById("sendButton").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  sendMessage(message);
});

document.getElementById("messageInput").addEventListener("input", () => {
  socket.emit("typing");
});

document.getElementById("messageInput").addEventListener("keydown", (event) => {
  const message = document.getElementById("messageInput").value;
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage(message);
  }
});

//* Socket Events *//

socket.on("message", (message, username) => {
  const messageContainer = document.createElement("div");
  if (username === myusername) {
    message = `You: ${message}`;
    messageContainer.className = "my-message";
  } else {
    message = `${username}: ${message}`;
    messageContainer.className = "other-message";
  }
  messageContainer.textContent = message;
  document.getElementById("messages").appendChild(messageContainer);
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
});

socket.on("new-join", (message) => {
  const messageContainer = document.createElement("div");
  messageContainer.className = "notification";
  messageContainer.textContent = message;
  document.getElementById("messages").appendChild(messageContainer);
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
});

socket.on("user-left", (username) => {
  const message = `${username} has left the chat`;
  const messageContainer = document.createElement("div");
  messageContainer.className = "notification";
  messageContainer.textContent = message;
  document.getElementById("messages").appendChild(messageContainer);
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
});

socket.on("typing", (message) => {
  const typingContainer = document.getElementById("typing");
  typingContainer.textContent = message;
  setTimeout(() => {
    typingContainer.textContent = "";
  }, 2000);
});

//* Initialize Chat *//

const myusername = generateUsername();
joinChat(myusername);
