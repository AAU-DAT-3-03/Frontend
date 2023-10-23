// @ts-ignore
import express, { Express } from "express";
import * as http from "http";
import * as admin from "firebase-admin";
import { BatchResponse } from "firebase-admin/lib/messaging/messaging-api";
import { messaging } from "firebase-admin";

/**
 * This is not good code, but is only for test purposes
 * Go to: localhost:8888 in a browser to trigger a notification on the app.
 */

interface data {
  key: string;
}

const registeredTokens: Set<string> = new Set<string>();

const serviceAccount = require("./firebasecert.json");
1;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function time(): string {
  return `[${new Date(Date.now()).getHours()}:${new Date(
    Date.now()
  ).getMinutes()}:${new Date(Date.now()).getSeconds()}]`;
}

// Create express app
let app: Express = express();
app.use(express.json());
app.post("/", (req, res) => {
  console.log("Got request", req.body, req.headers);
  let data: data = req.body;
  registeredTokens.add(data.key);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ success: true }));
});

app.get("/", (req, res) => {
  res.send("Alive");
  const message = {
    data: {
      type: "alarm",
      title: "Oh no alarm",
      body: `Service dead - ${time()}`,
    },
    tokens: Array.from(registeredTokens),
  };

  console.log(time(), "Sending notifications with message: ", message);

  messaging()
    .sendEachForMulticast(message)
    .then((response: BatchResponse) => {
      console.log(response.successCount + " messages were sent successfully");
      response.responses.forEach((value) => console.log(value));
    });
});

// Create HTTPS server with provided credentials
let server = http.createServer(app);
server.listen(8888);
