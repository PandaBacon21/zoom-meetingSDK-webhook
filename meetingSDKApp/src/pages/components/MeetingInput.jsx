import { TextField } from "@mui/material";

export default function MeetingInput({
  userName,
  meetingId,
  password,
  setUserName,
  setMeetingId,
  setPassword,
  sx,
}) {
  return (
    <>
      <TextField
        sx={sx}
        id="user-name"
        label="User Name"
        variant="filled"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextField
        sx={sx}
        id="meeting-id"
        label="Meeting ID"
        variant="filled"
        value={meetingId}
        onChange={(e) => {
          let input = e.target.value;
          setMeetingId(input.replace(/\s+/g, ""));
        }}
      />
      <TextField
        sx={sx}
        id="meeting-password"
        label="Meeting Password"
        variant="filled"
        value={password}
        onChange={(e) => {
          let input = e.target.value;
          setPassword(input.replace(/\s+/g, ""));
        }}
      />
    </>
  );
}
