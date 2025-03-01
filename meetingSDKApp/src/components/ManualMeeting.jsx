import { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import MeetingInput from "./MeetingInput";
import Zoom from "./Zoom";

const ManualMeeting = () => {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            margin: 2,
            width: 750,
            textAlign: "center",
            borderRadius: 5,
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Meeting SDK Demo
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
      </Box>
    </>
  );
};

export default ManualMeeting;
