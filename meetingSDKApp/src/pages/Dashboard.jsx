import { io } from "socket.io-client";

import { Box } from "@mui/material";

import ManualMeeting from "./components/ManualMeeting";
import CurrentMeetings from "./components/CurrentMeetings";
import GetZoomAuth from "./components/GetZoomAuth";
import NavBar from "./components/NavBar";

const socket = io("http://localhost:3000/");

const Dashboard = ({ zoomAuth, setZoomAuth }) => {
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
        {zoomAuth ? (
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
