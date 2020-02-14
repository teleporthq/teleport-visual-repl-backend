require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const authenticationRoute = require("./routes/authentication");
const uidlRoute = require("./routes/uidl");

app.use("/authentication", authenticationRoute);
app.use("/uidl", uidlRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
