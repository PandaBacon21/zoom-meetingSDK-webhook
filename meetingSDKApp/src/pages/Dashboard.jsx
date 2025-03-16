import { io } from "socket.io-client";

import { Box } from "@mui/material";

import ManualMeeting from "./components/ManualMeeting";
import Webhook from "./components/Webhook";
import GetZoomAuth from "./components/GetZoomAuth";

const socket = io("http://localhost:3000/");

const Dashboard = ({ zoomAuth, setZoomAuth }) => {
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
        {zoomAuth ? (
          <>
            <ManualMeeting />
            <Webhook socket={socket} />
          </>
        ) : (
          <GetZoomAuth />
        )}
      </Box>
    </>
  );
};

export default Dashboard;
