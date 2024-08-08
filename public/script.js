// public/script.js

const socket = io();

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

function generateUsername() {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals], // Use predefined dictionaries
    separator: "",
    length: 2, // Generate a name with two words
    style: "capital", // Capitalize each word
  });

  const number = Math.floor(Math.random() * 1000);
  return `${randomName}${number}`;
}

// Function to join the chat with a username
function joinChat(username) {
  document.getElementById("username").textContent = username;
  socket.emit("join", username);
}

// Function to send a chat message
function sendMessage(message) {
  socket.emit("chatMessage", message);
  document.getElementById("messageInput").value = "";
}

// Listen for incoming messages
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

// Listen for typing events
socket.on("typing", (message) => {
  const typingContainer = document.getElementById("typing");
  typingContainer.textContent = message;
  setTimeout(() => {
    typingContainer.textContent = "";
  }, 2000);
});

// Event listener for the send button
document.getElementById("sendButton").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  sendMessage(message);
});

// Event listener for the message input to detect typing
document.getElementById("messageInput").addEventListener("input", () => {
  socket.emit("typing");
});

document.getElementById("messageInput").addEventListener("keydown", (event) => {
  const message = document.getElementById("messageInput").value;
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default action (form submission, if any)
    sendMessage(message);
  }
});

// Join the chat with a default username for simplicity
// Generate random username
const myusername = generateUsername();
joinChat(myusername);
