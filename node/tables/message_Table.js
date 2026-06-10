// message_Table.js

const { mySqlPool } = require("../config/db");
const colors = require("colors");

const createMessagesTable = () => {
  try {
    const createMessagesTable = mySqlPool.query(`
      CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    sender_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (room_id)
    REFERENCES rooms(id)
    ON DELETE CASCADE,

    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

`);
        console.log("messages table created successfully".bgGreen);
  } catch (error) {
    console.error(error);
  }
};

createMessagesTable();
