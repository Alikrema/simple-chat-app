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

//TODO: implement client-side event handlers

//* Initialize Chat *//

const myusername = generateUsername();
joinChat(myusername);
