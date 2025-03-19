import { io } from "socket.io-client";

import { Box } from "@mui/material";

import ManualMeeting from "./components/ManualMeeting";
import CurrentMeetings from "./components/CurrentMeetings";
import GetZoomAuth from "./components/GetZoomAuth";
import NavBar from "./components/NavBar";
import { useZoomAuth } from "../context/ZoomContext";

const socket = io("http://localhost:3000/");

const Dashboard = () => {
  const { zoomAuthenticated } = useZoomAuth();

  return (
    <>
      <NavBar />
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
        {zoomAuthenticated ? (
          <>
            <ManualMeeting />
            <CurrentMeetings socket={socket} />
          </>
        ) : (
          <GetZoomAuth />
        )}
      </Box>
    </>
  );
};

export default Dashboard;
