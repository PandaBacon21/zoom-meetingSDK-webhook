import { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";

const Webhook = ({ socket }) => {
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
        width: 600,
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
        Receive Webhook
      </Typography>
      <Paper
        sx={{
          width: 500,
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
};

export default Webhook;
