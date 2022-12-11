// const port = 2999;
// const process = require("node:process");
// const net = require('net');

const io = require('socket.io-client');
const socket1 = io.connect("http://localhost:3001/", {
    reconnection: true
});
const socket2 = io.connect("http://localhost:3002/", {
    reconnection: true
});

const server_room = "log"


socket1.on('connect', function () {
    console.log(`connected to server-${1}`);

    socket1.emit("join_room", server_room)

    socket1.on('log_request', data => {
        const time = new Date().toString()
        console.log(`Server-${1}: [time: ${time}, data: ${data}]`)
    });
});

socket2.on('connect', function () {
    console.log(`connected to server-${2}`);

    socket2.emit("join_room", server_room)

    socket2.on('log_request', data => {
        const time = new Date().toString()
        console.log(`Server-${2}: [time: ${time}, data: ${data}]`)
    });
});


socket1.on("disconnect", () => {
    console.log(`Server-${1} Disconnected`, socket1.id);
});

socket2.on("disconnect", () => {
    console.log(`Server-${2} Disconnected`, socket2.id);
});