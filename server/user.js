const { v4: uuidv4 } = require("uuid");
var _ = require("lodash");

const users = [];
const userTypings = [];
const maxUserInRoom = 2;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeAllWords(str) {
  return str.split(' ').map(capitalize).join(' ');
}

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

const addUser = ({ id, name, idUser, avatar, country }) => {
  name = capitalizeAllWords(name.trim());
  room = getRoom();

  if (!name) return { error: "Username are required." };

  const existingUser = users.find((user) => user.idUser === idUser);

  if (existingUser) return { error: "idUser is taken." };

  const user = { id, name, room, idUser, avatar, country };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const addUserTyping = ({ idUser, isTyping }) => {

  const index = userTypings.findIndex((userTyping) => userTyping.idUser === idUser);

  if (index !== -1) userTypings.splice(index, 1)[0];

  const userTyping = { idUser, isTyping };

  userTypings.push(userTyping);

  return { userTyping };
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const getNumberUsers = () => users.length;

const getUserTypings = () => userTypings;

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getNumberUsers,
  addUserTyping,
  getUserTypings
};
