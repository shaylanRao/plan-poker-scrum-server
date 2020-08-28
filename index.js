const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const userValues = [];

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  assignValue,
} = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
      name: user.name,
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { text: message });

    callback();
  });

  socket.on("resetValues", () => {
    const user = getUser(socket.id);
    getUsersInRoom(user.room).forEach((userData) => {
      assignValue(userData, -1);
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
      name: user.name,
    });
  });

  socket.on("assignValue", (inputValue) => {
    const user = getUser(socket.id);

    assignValue(user, inputValue);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
      name: user.name,
    });
  });

  socket.on("show", (show) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("updateShow", show);
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
