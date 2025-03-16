import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { KJUR } from "jsrsasign";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { UserModel } from "./models/models.js";

dotenv.config();

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const WEBHOOK_SECRET = process.env.ZOOM_WEBHOOK_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

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

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });
});

app.post("/api/zoom-token", (req, res) => {
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
  return res.send(signatureResponse);
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

    return res.status(200).send({ status: "success" });
  } else {
    console.log("verification failed");
    console.log(req.headers["x-zm-signature"]);
    console.log(signature);
    return res
      .status(401)
      .send({ status: "error", message: "Invalid signature" });
  }
});

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.getUser(email);
  if (user) {
    console.log({ status: 400, message: `user ${email} already exists` });
    return res.status(400).send({ error: "User already exists" });
  } else {
    try {
      const newUser = await UserModel.createUser(email, password);
      if (newUser) {
        console.log({ status: 201, user: newUser });
        return res.status(201).send({
          status: "success",
          token: "taco",
          zoomAuth: newUser.zoomAuth,
        });
      }
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.getUser(email);
  if (!user) {
    res.status(404).send({ status: "error", message: "User not found" });
  } else {
    try {
      const authUser = await UserModel.authenticate(email, password);
      if (!authUser) {
        console.log({ status: 401, user: email, message: "Invalid password" });
        return res
          .status(401)
          .send({ status: "error", message: "Invalid email or password" });
      }
      const sessionToken = jwt.sign(
        { userId: authUser.id, email: authUser.email },
        SESSION_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("token", sessionToken, {
        // httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3600000,
      });
      console.log({ status: 200, user: authUser.email, message: "success" });
      return res.status(200).send({
        status: "success",
        data: { token: sessionToken, zoomAuth: authUser.zoomAuth },
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
});
