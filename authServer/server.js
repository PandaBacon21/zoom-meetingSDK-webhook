import express from "express";
import { KJUR } from "jsrsasign";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

app.post("/api", (req, res) => {
  const { meetingNumber, role } = req.body;

  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  const header = { alg: "HS256", typ: "JWT" };
  const clientId = CLIENT_ID;
  const secret = CLIENT_SECRET;

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
