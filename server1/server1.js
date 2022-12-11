const port = 3001;
const process = require("node:process");
const express = require("express");
totalCPUs = require("os").cpus().length;
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: "*",
      methods: ["GET", "POST"],
   },
});

let log_server = ""
let log_server_socket = ""

io.on("connection", (socket) => {
   if (log_server != ""){
      socket.to(log_server).emit("log_request", `user ${socket.id} connected`)
   }
   

   socket.on("join_room", (data) => {
      log_server = data
      log_server_socket = socket.id
      socket.join(data);
      console.log("LOG SERVER CONNECTED")
    });

   socket.on("get_info", (args, callback) => {
      if (log_server != ""){
         console.log("hi")
         socket.to(log_server).emit("log_request", `GET request from user ${socket.id}`)
      }
      const time = new Date().getTime();
      callback({
         id: time + socket.id,
         mes: {
            task1: `process arch - ${process.arch}`,
            task2: `count of logical processes - ${totalCPUs}`,
         },
         time: time,
      });
      if (log_server != ""){
         socket.to(log_server).emit("log_request", `Success response to user ${socket.id}`)
      }
      });

   socket.on("disconnect", () => {
      if (log_server != ""){
         if (log_server_socket != socket.id) {
            socket.to(log_server).emit("log_request", `user ${socket.id} disconnected`);
         }
         else {
            log_server = ""
            log_server_socket = ""
            console.log("LOG SERVER DISCONNECTED")
         }
        }
   });
});

server.listen(port, () => {
   console.log("SERVER RUNNING");
});
