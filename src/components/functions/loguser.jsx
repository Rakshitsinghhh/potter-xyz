function logUserAction(mobile, action, req) {
  return new Promise((resolve, reject) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

    const insertQuery = `
      INSERT INTO logs (mobile, action, ip, time)
      SELECT ?, ?, ?, NOW()
      FROM DUAL
      WHERE NOT EXISTS (
        SELECT 1 FROM logs
        WHERE mobile = ? AND action = ? AND ip = ?
        ORDER BY time DESC
        LIMIT 1
        HAVING TIMESTAMPDIFF(SECOND, MAX(time), NOW()) < 2
      );
    `;

    connection.query(
      insertQuery,
      [mobile, action, ip, mobile, action, ip],
      (err, result) => {
        if (err) {
          console.error("🔴 Logging failed:", err);
          return reject("Logging error");
        }
        console.log(`📘 Log inserted: ${action} by ${mobile}`);
        resolve();
      }
    );
  });
}
