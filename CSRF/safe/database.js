const SETUP_DB = [
  { id: '7SDDyf', username: 'thibault', password: 'qwerty' },
  { id: 'z4LmeT', username: 'ruben', password: 'azerty' },
  { id: 'S84EmH', username: 'morsay', password: 'cliquez' },
  { id: 'eG6Js8', username: 'cortex', password: 'pyramides91' },
];

const SUPER_SECURE_USERS_DB = [];

function init() {
  SUPER_SECURE_USERS_DB.splice(0, SUPER_SECURE_USERS_DB.length);

  for (const entry of SETUP_DB) {
    SUPER_SECURE_USERS_DB.push(entry);
  }
  
  console.log('DB initialized.');
  console.log(SUPER_SECURE_USERS_DB);
}

function getUser (username, pwd) {
  return SUPER_SECURE_USERS_DB.find(user => user.username === username && user.password === pwd);
}

function getUserByUsername (username) {
  return SUPER_SECURE_USERS_DB.find(user => user.username === username);
}

function getUserById (id) {
  return SUPER_SECURE_USERS_DB.find(u => u.id === id);
}

function deleteUser (userId) {
  if (SUPER_SECURE_USERS_DB.some(user => user.id === userId)) {

    for (let i = 0; i < SUPER_SECURE_USERS_DB.length; i++) {
      if (SUPER_SECURE_USERS_DB[i].id === userId) {
        SUPER_SECURE_USERS_DB.splice(i, 1);
        i--;
      }
    }

    console.log('User deleted: ' + userId);
    console.log(SUPER_SECURE_USERS_DB);
    return userId;
  }

  return undefined;
}

const db = {
  init,
  getUser,
  getUserByUsername,
  getUserById,
  deleteUser
};

module.exports = { db };
