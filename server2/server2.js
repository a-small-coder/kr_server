const { fork, exec } = require("child_process");
const port = 3002;
const process = require("node:process");
const express = require("express");

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
         socket.to(log_server).emit("log_request", `GET request from user ${socket.id}`)
      }

      exec("ps -x", (err, stdout, stderr) => {
         if (err) {
            socket.emit("log_request", `FAIL to response to user ${socket.id}, error: ${err}`)
            return;
         }
         psList = stdout.split("\n");
         const used = process.memoryUsage();
         mu = []
         for (let key in used) {
            mu.push(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
         }
         const time = new Date().getTime();
         callback({
            id: time + socket.id,
            mes: {
               task1: `process in system - ${psList.length}`,
               task2: mu,
            },
            time: time,
         });
         if (log_server != ""){
            socket.to(log_server).emit("log_request", `Success response to user ${socket.id}`)
         }
      });
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
   // socket.emit(`log_request", "server start in process ${process.pid}`);
});
