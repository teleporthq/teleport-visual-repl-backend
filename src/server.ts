require("dotenv").config();
import express from "express";
import cors from "cors";
import { authenticationRoute } from "./routes/authentication";
import { uidlRoute } from "./routes/uidl";
import WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 8080;

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ROUTES
app.use("/authentication", authenticationRoute);
app.use("/uidl", uidlRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//SOCKET
const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", function connection(ws: WebSocket) {
  ws.on("message", function message(msg: string) {
    console.log(`Received message ${msg}`);
    ws.send(
      "I have received your message and will do nothing with it. You're welcome!"
    );
  });

  ws.send("Hello there!");
});

wss.on("close", (ws: WebSocket) => {
  ws.close();
  wss.close();
});
