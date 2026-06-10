// meeting_Histry_Table.js

const { mySqlPool } = require("../config/db");
const colors = require("colors");

const createMeetingHistoryTable = () => {
  try {
    const createMeetingHistoryTable = mySqlPool.query(`
      CREATE TABLE meeting_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    user_id INT,
    joined_at DATETIME,
    left_at DATETIME,

    FOREIGN KEY (room_id)
    REFERENCES rooms(id)
    ON DELETE CASCADE,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

`);
    console.log("meeting_history table created successfully".bgGreen);
  } catch (error) {
    console.error(error);
  }
};

createMeetingHistoryTable();
