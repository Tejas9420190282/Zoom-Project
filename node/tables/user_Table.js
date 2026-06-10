// user_Table.js

const { mySqlPool } = require("../config/db");

const createUserTable = () => {
  try {
    const createTableQuery = mySqlPool.query(`
        CREATE TABLE users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(255),
            profile_image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
`);
  } catch (error) {
    console.error(error);
  }
};

createUserTable();