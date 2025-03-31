import { useState, useEffect } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";

import { Button, Paper, Typography } from "@mui/material";
import axios from "axios";

const SDKKEY = import.meta.env.VITE_ZOOM_CLIENT_ID;
const LEAVEURL = import.meta.env.VITE_LEAVE_URL;

export default function CurrentMeetings({ socket }) {
  const authEndpoint = "/api/get-webhook-meeting";
  const sdkKey = SDKKEY;
  const role = 0;
  //   const userEmail = "";
  //   const registrantToken = "";
  //   const zakToken = "";
  const leaveUrl = LEAVEURL;
  const [webhookData, setWebhookData] = useState(null);

  useEffect(() => {
    socket.on("webhookEvent", (data) => {
      console.log("received webhook:", data);
      if (data.event === "meeting.started") {
        setWebhookData(data);
      } else if (data.event === "meeting.ended") {
        setWebhookData(null);
      }
    });
    return () => {
      socket.off("webhookEvent");
    };
  });

  const getSignature = async () => {
    try {
      const res = await axios({
        method: "post",
        url: authEndpoint,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          meetingNumber: webhookData.payload.object.id,
          role: 0,
        }),
      });
      console.log(res.data);
      const jwt = res.data.signature;
      const passcode = res.data.passcode;
      return { jwt, passcode };
    } catch (e) {
      console.log(e);
    }
  };

  // Works but a little cluncky at the moment...

  const joinMeeting = async () => {
    let zoomMeetingSDK = document.getElementById("zmmtg-root");

    zoomMeetingSDK.style.display = "block";
    const { jwt, passcode } = await getSignature();
    console.log("jwt;" + jwt);
    console.log("passcode: " + passcode);
    console.log("meetingId: " + webhookData.payload.object.id);

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        ZoomMtg.join({
          sdkKey: sdkKey,
          signature: jwt,
          meetingNumber: webhookData.payload.object.id,
          passWord: passcode,
          userName: "Josh",
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        margin: 2,
        width: "100%",
        maxWidth: 600,
        minWidth: 400,
        minHeight: 400,
        maxHeight: 300,
        textAlign: "center",
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Current Active Meetings
      </Typography>
      <Paper
        sx={{
          width: "100%",
          maxWidth: 500,
          minWidth: 300,
          height: 300,
          backgroundColor: "#f5f5f5",
          boxShadow: "inset 0px 2px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {webhookData ? (
          <>
            <Typography variant="h6" sx={{ marginTop: 3 }}>
              {"New Meeting: " + webhookData.payload.object.topic}
            </Typography>
            <Button
              sx={{ marginTop: 2 }}
              variant="contained"
              size="small"
              onClick={joinMeeting}
            >
              <Typography variant="h6">Join Meeting</Typography>
            </Button>
          </>
        ) : null}
      </Paper>
    </Paper>
  );
}
