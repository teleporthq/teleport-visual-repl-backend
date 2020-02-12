const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 8080;

// CONNECT TO DB
const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password4$",
  database: "teleportVisualReplDb"
});

dbConnection.connect(function(err) {
  if (err) {
    throw err;
  }
  console.log("Connected to DB");
  dbConnection.query("select * from Users", (err, res) => {
    if (err) {
      throw err;
    }
    console.log(res);
  });
});

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const authorizeRoute = require("./routes/authorize");
app.use("/authorize", authorizeRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
