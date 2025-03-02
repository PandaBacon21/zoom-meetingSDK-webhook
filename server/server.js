import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { KJUR } from "jsrsasign";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: [
      "http: //localhost:5173",
      "https://pangolin-related-mildly.ngrok-free.app", // Add your Ngrok URL
    ],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: [
      "http: //localhost:5173",
      "https://pangolin-related-mildly.ngrok-free.app", // Add your Ngrok URL
    ],
    methods: ["GET", "POST"],
  },
});
const port = 3000;

server.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const WEBHOOK_SECRET = process.env.ZOOM_WEBHOOK_SECRET;

app.post("/api/token", (req, res) => {
  // probably need to move into it's own utility function later to clean up the endpoint
  const { meetingNumber, role } = req.body;

  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const header = { alg: "HS256", typ: "JWT" };
  const clientId = CLIENT_ID;
  const secret = CLIENT_SECRET;
  console.log("meetingID: " + meetingNumber);
  console.log("meeting role: " + role);
  console.log("client id: " + clientId);
  console.log("client secret: " + secret);

  const payload = {
    sdkKey: clientId,
    appKey: clientId,
    mn: meetingNumber,
    role: role,
    iat: iat,
    exp: exp,
    tokenExp: exp,
  };

  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(payload);
  const sdkKey = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secret);
  const signatureResponse = { signature: sdkKey };
  console.log("Signature created");
  res.send(signatureResponse);
});

app.post("/api/webhook", (req, res) => {
  // verify webhook
  // probably need to move into it's own utility function later to clean up the endpoint
  const message = `v0:${req.headers["x-zm-request-timestamp"]}:${JSON.stringify(
    req.body
  )}`;
  const hashForVerify = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(message)
    .digest("hex");
  const signature = `v0=${hashForVerify}`;

  if (req.headers["x-zm-signature"] === signature) {
    console.log(req.body);

    io.emit("webhookEvent", req.body);

    res.status(200).send({ status: "success" });
  } else {
    console.log("verification failed");
    console.log(req.headers["x-zm-signature"]);
    console.log(signature);
    res.status(401).send({ status: "error", message: "Invalid signature" });
  }
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });
});
