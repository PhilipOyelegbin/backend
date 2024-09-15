#!/usr/bin/env node
const net = require("net");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST;

// List of connected clients
let clients = [];

// -------------------- Server section ------------------------
if (process.argv[2] === "start") {
  // Create a new server
  const server = net.createServer((socket) => {
    console.log(
      `New client connected, Client IP: ${socket.remoteAddress}, Port: ${socket.remotePort}`
    );

    // Add client to the list of connected clients
    clients.push(socket);

    // Handle incoming messages from the client
    socket.on("data", (data) => {
      console.log(`Received message from client ${socket.remotePort}: ${data}`);
      broadcast(data, socket);
    });

    // Handle client disconnections
    socket.on("end", () => {
      console.log("Client disconnected");
      clients = clients.filter((client) => client !== socket);
    });

    // Handle errors
    socket.on("error", (error) => {
      // Handle ECONNRESET error
      if (error.code === "ECONNRESET") {
        console.log("Client disconnected abruptly");
        clients = clients.filter((client) => client !== socket);
      } else {
        console.error("Error occurred:", error);
      }
    });
  });

  // Broadcast a message to all connected clients
  function broadcast(message, sender) {
    const senderPort = sender.remotePort;
    const messageWithSender = `from ${senderPort}: ${message}`;

    clients.forEach((client) => {
      if (client !== sender) {
        client.write(messageWithSender);
      }
    });
  }

  // Start the server
  server.listen(port, host, () => {
    console.log(`Server listening on ${host}:${port}`);
  });

  // Handle server shutdown
  process.on("SIGINT", () => {
    console.log("Shutting down server...");
    server.close();
    process.exit(0);
  });
}

// ------------------------Client section-------------------------
if (process.argv[2] === "connect") {
  // Create a new client
  const client = net.createConnection(port, host, () => {
    console.log("Connected to server");
  });

  // Handle incoming messages from the server
  client.on("data", (data) => {
    console.log(`Server message ${data}`);
  });

  // Handle errors
  client.on("error", (error) => {
    if (error.code === "ECONNRESET") {
      console.log("Server disconnected abruptly");
      clients = clients.filter((client) => client !== socket);
    } else {
      console.error("Error occurred:", error);
    }
  });

  // Handle disconnections
  client.on("end", () => {
    console.log("Disconnected from server");
  });

  // Send a message to the server
  function sendMessage(message) {
    client.write(message);
  }

  // Dynamically send a message to the server
  process.stdin.on("data", (data) => {
    const message = data.toString().trim();
    if (message !== "") {
      sendMessage(message);
    }
  });
}
