import { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";

export default function CurrentMeetings({ socket }) {
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
      <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
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
          <Typography variant="h3">
            Meeting ID: {webhookData.payload.object.id}
          </Typography>
        ) : null}
      </Paper>
    </Paper>
  );
}
