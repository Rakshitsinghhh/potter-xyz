
import connection from "../../index.js";  // specify exact file


export function Potallocation() {
  return new Promise((resolve, reject) => {
    const selectQuery = "SELECT id, user_count FROM pots WHERE user_count < 10 AND status = 'active' LIMIT 1";

    connection.query(selectQuery, (err, result) => {
      if (err) {
        console.error("Pot allocation error:", err);
        return reject("Pot ID allocation failed");
      }

      if (result.length > 0) {
        const potId = result[0].id;
        const currentCount = result[0].user_count;

        // ✅ Increase the user_count
        const updateQuery = "UPDATE pots SET user_count = ? WHERE id = ?";
        connection.query(updateQuery, [currentCount + 1, potId], (updateErr) => {
          if (updateErr) {
            console.error("Failed to update user_count:", updateErr);
            return reject("User count update failed");
          }

          console.log("Allocated existing Pot ID:", potId);
          return resolve(potId);
        });

      } else {
        // 🆕 No existing pot, create new one
        const insertQuery = `
          INSERT INTO pots (user_count, start_timer, end_timer, amount, last_bet_mobile, winner_mobile, status)
          VALUES (1, NOW(), DATE_ADD(NOW(), INTERVAL 12 HOUR), 0.00, NULL, NULL, 'active')
        `;

        connection.query(insertQuery, (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error creating new pot:", insertErr);
            return reject("Failed to create a new pot");
          }

          const newPotId = insertResult.insertId;
          console.log("Created new Pot ID:", newPotId);
          return resolve(newPotId);
        });
      }
    });
  });
}

// export default Potallocation;