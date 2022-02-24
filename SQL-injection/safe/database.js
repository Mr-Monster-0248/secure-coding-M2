const connect = require('@databases/sqlite');
const { sql } = require('@databases/sqlite');

const USERS = [
  { id: 0, name: "admin", email: "admin@mail.com", pwd: "admin1234" },
  { id: 1, name: "user", email: "user@mail.com", pwd: "user1234" },
  { id: 2, name: "other_user", email: "other_user@mail.com", pwd: "other_user1234" },
];

const db = connect();

const create_table_query = sql`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER NOT NULL PRIMARY KEY,
    name varchar,
    email varchar UNIQUE,
    password varchar,
    CONSTRAINT email_unique UNIQUE (email)
  );
`;

async function dbSetup() {
  await db.query(create_table_query);
  console.log('Table created.');

  for (const user of USERS) {
    await db.query(sql`
      INSERT INTO users (id, name, email, password)
      VALUES (
        ${user.id},
        ${user.name},
        ${user.email},
        ${user.pwd}
      );
    `);
  }

  console.log('Table populated.');
}

dbSetup()
  .then(() => { console.log('DB setup done.') })
  .catch((err) => { console.error(err) });

module.exports = {
  db
};
