const { v4: uuidv4 } = require("uuid");
var _ = require("lodash");

const users = [];
const maxUserInRoom = 2;

const getRoom = () => {
  const listRoomIncludeUser = [];
  for (const user of users) {
    const countUser = _.sumBy(users, function (item) {
      return item.room === user.room;
    });
    if (countUser < maxUserInRoom) {
      listRoomIncludeUser.push(user);
    }
  }

  if (listRoomIncludeUser.length === 0) {
    return uuidv4();
  } else {
    return listRoomIncludeUser[0].room;
  }
};

const addUser = ({ id, name, idUser }) => {
  name = name.trim().toLowerCase();
  room = getRoom();

  if (!name) return { error: "Username are required." };

  const existingUser = users.find((user) => user.idUser === idUser);

  if (existingUser) return { error: "idUser is taken." };

  const user = { id, name, room, idUser };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getNumberUsers = () => users.length;

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getNumberUsers,
};
