const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQzLCJpYXQiOjE3NjMwNTQxNzF9.QAA1CS1ViD9o8GczDteDKfGszbH8dCSn9lqn0i1813Y"
  }
});

socket.on("connect", () => {
  console.log("Connected!", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});
