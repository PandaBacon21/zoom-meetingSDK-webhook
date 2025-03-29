import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { KJUR } from "jsrsasign";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import qs from "qs";
import cookieParser from "cookie-parser";

import { UserModel } from "./models/userModel.js";
import axios from "axios";
import { TokenModel } from "./models/tokenModel.js";

dotenv.config();

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const WEBHOOK_SECRET = process.env.ZOOM_WEBHOOK_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http: //localhost:5173",
      "https://pangolin-related-mildly.ngrok-free.app", // Ngrok URL
    ],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: [
      "http: //localhost:5173",
      "https://pangolin-related-mildly.ngrok-free.app", // Ngrok URL
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

app.post("/api/zoom-sdk-token", (req, res) => {
  const { meetingNumber, role } = req.body;
  const sdkToken = createMeetingSDKToken(meetingNumber, role);
  return res.send(sdkToken);
});

function createMeetingSDKToken(meetingNumber, role) {
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
  const meetingSDKToken = { signature: sdkKey };
  console.log("Signature created");
  return meetingSDKToken;
}

// GET ZOOM OAUTH TOKEN
app.post("/api/zoom-auth-token", async (req, res) => {
  const authCode = req.body.auth_code;
  if (authCode) {
    console.log("auth_code: " + authCode);
    const sessionToken = req.cookies.token;
    if (!sessionToken) {
      return res
        .status(401)
        .send({ status: "error", message: "No session token" });
    }
    try {
      const decodedSessionToken = jwt.verify(sessionToken, SESSION_SECRET);
      const { email } = decodedSessionToken;
      const currentUser = await UserModel.getUser(email);
      console.log(`Current User: ${currentUser.id}, ${currentUser.email}`);
      const zoomToken = await getZoomToken(authCode, currentUser.id);
      if (zoomToken) {
        return res
          .status(200)
          .send({ status: "success", message: "Zoom successfully authorized" });
      } else {
        return res
          .status(500)
          .send({ status: "error", message: "Internal Server Error" });
      }
    } catch (e) {
      console.log(e.response);
    }
  }
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

app.post("/api/get-webhook-meeting", async (req, res) => {
  const sessionToken = req.cookies.token;
  if (!sessionToken) {
    return res
      .status(401)
      .send({ status: "error", message: "No session token" });
  }
  const decodedSessionToken = jwt.verify(sessionToken, SESSION_SECRET);
  const { email } = decodedSessionToken;
  const currentUser = await UserModel.getUser(email);
  console.log(`Current User: ${currentUser.id}, ${currentUser.email}`);

  const { meetingNumber, role } = req.body;
  const zoomToken = await checkTokenExpiration(currentUser.id);
  try {
    const response = await axios({
      method: "get",
      url: `https://api.zoom.us/v2/meetings/${meetingNumber}`,
      headers: { Authorization: `Bearer ${zoomToken.accessToken}` },
    });

    const passcode = response.data.password;
    const meetingSDK = createMeetingSDKToken(meetingNumber, role);
    const meetingDetails = {
      signature: meetingSDK.signature,
      passcode: passcode,
    };
    console.log(meetingDetails);
    res.status(200).send(meetingDetails);
  } catch (e) {
    console.log(e);
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
        const sessionToken = jwt.sign(
          { userId: newUser.id, user: newUser.email },
          SESSION_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("token", sessionToken, {
          // httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 3600000,
          path: "/",
        });
        console.log({ status: 201, user: newUser.email, message: "success" });
        return res.status(201).send({
          status: "success",
          data: { zoomAuth: newUser.zoomAuth },
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
        path: "/",
      });
      console.log({ status: 200, user: authUser.email, message: "success" });
      return res.status(200).send({
        status: "success",
        data: { zoomAuth: authUser.zoomAuth },
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  }
});

// GET ZOOM ACCESS TOKEN
async function getZoomToken(authCode, userId) {
  const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  try {
    const res = await axios({
      method: "post",
      url: "https://zoom.us/oauth/token",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        code: authCode,
        grant_type: "authorization_code",
        redirect_uri: "https://pangolin-related-mildly.ngrok-free.app/redirect",
      }),
    });
    // console.log(res.data);
    const accessToken = res.data.access_token;
    const currentTime = new Date();
    const accessExpires = new Date(
      currentTime.getTime() + res.data.expires_in * 1000
    );
    const refreshToken = res.data.refresh_token;
    const refreshExpires = new Date(
      currentTime.getTime() + 90 * 24 * 60 * 60 * 1000
    );
    const zoomToken = await TokenModel.addToken(
      userId,
      accessToken,
      accessExpires,
      refreshToken,
      refreshExpires
    );
    return zoomToken;
  } catch (e) {
    console.log(e.response);
  }
}

async function checkTokenExpiration(userId) {
  // check if token already in database
  const existingToken = await TokenModel.getToken(userId);
  if (!existingToken) {
    throw new Error("No Zoom Token Found");
  }
  const timeNow = new Date();
  const timeInFiveMin = new Date(timeNow.getTime() + 5 * 60 * 1000);
  // check if token will expire in 5 minutes or less - if expired or about to expire, get a new token
  if (existingToken.accessExpires > timeInFiveMin) {
    console.log("Token is still valid");
    return existingToken;
  } else {
    try {
      console.log("Token expired. Getting new token");
      const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
      const res = await axios({
        method: "post",
        url: "https://zoom.us/oauth/token",
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify({
          grant_type: "refresh_token",
          refresh_token: existingToken.refreshToken,
        }),
      });
      const accessToken = res.data.access_token;
      const currentTime = new Date();
      const accessExpires = new Date(
        currentTime.getTime() + res.data.expires_in * 1000
      );
      const refreshToken = res.data.refresh_token;
      const refreshExpires = new Date(
        currentTime.getTime() + 90 * 24 * 60 * 60 * 1000
      );
      const zoomToken = await TokenModel.updateToken(
        userId,
        accessToken,
        accessExpires,
        refreshToken,
        refreshExpires
      );
      console.log("New token retrieved");
      return zoomToken;
    } catch (e) {
      console.log(e);
    }
  }
}

// Handle getting a new token if refresh token is expired too - expires after 90 days
function refreshZoomToken(refreshToken) {}
