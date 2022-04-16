var mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'infosysdb'
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

// global.gRunQueryAsync = function(sql, val) {
//   return new Promise((resolve, reject) => {
//     pool.getConnection(function(err, connection) {
//       if (err) reject(err)
//       connection.query(sql, val, function(err, res) {
//         connection.release() // always put connection back in pool after last query
//         if (err) reject(err)
//         else resolve(res)
//       })
//     })
//   })
// }
module.exports = connection;