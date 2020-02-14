require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const authorizeRoute = require("./routes/authorize");
const uidlRoute = require("./routes/uidl");

app.use("/authorize", authorizeRoute);
app.use("/uidl", uidlRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
