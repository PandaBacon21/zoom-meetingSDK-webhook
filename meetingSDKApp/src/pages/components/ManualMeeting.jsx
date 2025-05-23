import { useState } from "react";
import { Paper, Typography } from "@mui/material";
import MeetingInput from "./MeetingInput";
import Zoom from "./Zoom";

export default function ManualMeeting() {
  const [userName, setUserName] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [password, setPassword] = useState("");

  const clearInputs = () => {
    setUserName("");
    setMeetingId("");
    setPassword("");
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          margin: 2,
          width: "100%",
          maxWidth: 600,
          minWidth: 400,
          minHeight: 400,
          maxHeight: 600,
          textAlign: "center",
          borderRadius: 5,
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Join Meeting Manually
        </Typography>
        <MeetingInput
          userName={userName}
          meetingId={meetingId}
          password={password}
          setUserName={setUserName}
          setMeetingId={setMeetingId}
          setPassword={setPassword}
          sx={{ margin: 1 }}
        />
        <Zoom
          userName={userName}
          meetingId={meetingId}
          password={password}
          clearInputs={clearInputs}
          sx={{ marginTop: 3 }}
        />
      </Paper>
    </>
  );
}
