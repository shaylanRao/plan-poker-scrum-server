const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  const value = -1;
  const user = { id, name, room, value };

  users.push(user);

  return { user };
};

const assignValue = (user, value) => {
  user.value = value;
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

// const getAdmin = (id, room) => {
//   if (getUsersInRoom(room)[0].id == id) {
//     return true;
//   }
//   return false;
// };

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  assignValue,
};
