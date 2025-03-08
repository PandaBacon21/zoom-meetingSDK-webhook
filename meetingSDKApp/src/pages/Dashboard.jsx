import { io } from "socket.io-client";

import { Box } from "@mui/material";

import ManualMeeting from "./components/ManualMeeting";
import Webhook from "./components/Webhook";

const socket = io("http://localhost:3000/");

const Dashboard = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          height: "100vh",
        }}
      >
        <ManualMeeting />
        <Webhook socket={socket} />
      </Box>
    </>
  );
};

export default Dashboard;
