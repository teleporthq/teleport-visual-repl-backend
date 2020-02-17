require("dotenv").config();
import express from "express";
import cors from "cors";
import { authenticationRoute } from "./routes/authentication";
import { uidlRoute } from "./routes/uidl";

const app = express();
const PORT = process.env.PORT || 8080;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/authentication", authenticationRoute);
app.use("/uidl", uidlRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
