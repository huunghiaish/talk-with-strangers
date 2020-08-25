const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const cors = require("cors");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getNumberUsers,
} = require("./user.js");

// variable
const PORT = process.env.PORT || 5000;
const router = require("./router.js");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(router);
app.use(cors());
// socketIO handling

io.on("connection", (socket) => {
  // console.log("We have a new connection!!");

  // event
  // see message
  socket.on("join", ({ name, idUser }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, idUser });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to the room`,
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined!`,
    });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    io.emit("serverData", {
      totalUsers: getNumberUsers(),
    });

    callback();
  });

  // send message
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", {
      idUser: user.idUser,
      user: user.name,
      text: message,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    io.to(user.room).emit("serverData", {
      room: user.room,
      totalUsers: getNumberUsers(),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });

      io.emit("serverData", {
        totalUsers: getNumberUsers(),
      });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
