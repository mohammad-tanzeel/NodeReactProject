require("dotenv").config();
const express = require("express");
// const db = require('./config/db-client');

const app = express();
app.use(express.json())
const PORT = 5001;
// db.dbconnect();

// require('./routes/fileupload.js')(app);
require('./routes/Auth.js')(app);
// app.post("/login",user.login);

app.listen(5001, () => {
  console.log("file have uploaded running on port : " + PORT);
});
