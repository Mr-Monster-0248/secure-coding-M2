const SUPER_SECURE_USERS_DB = [
  { id: '1', username: 'thibault', password: 'qwerty' },
  { id: '2', username: 'ruben', password: 'azerty' },
];

function addUser (userData) {
  SUPER_SECURE_USERS_DB.push({
    id: SUPER_SECURE_USERS_DB.length,
    username: userData.username,
    password: userData.password
  });

  return SUPER_SECURE_USERS_DB[SUPER_SECURE_USERS_DB.length];
}

function getUser (userId) {
  return SUPER_SECURE_USERS_DB.find(user => user.id === userId);
}

function updateUser (userData) {
  if (SUPER_SECURE_USERS_DB.some(user => user.id === userData.id)) {
    SUPER_SECURE_USERS_DB[userData.id] = {
      id: userData.id,
      username: userData.username,
      password: userData.password
    };

    return SUPER_SECURE_USERS_DB[userData.id];
  }

  return undefined;
}

function deleteUser (userId) {
  if (SUPER_SECURE_USERS_DB.some(user => user.id === userId)) {
    SUPER_SECURE_USERS_DB.filter(user => user.id !== userId);

    return userId;
  }

  return undefined;
}

export const db = {
  addUser,
  getUser,
  updateUser,
  deleteUser
};
