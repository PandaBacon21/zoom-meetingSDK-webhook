import { io } from "socket.io-client";
import { Box, Grid2, Stack, Typography, Link } from "@mui/material";

import { ZoomMtg } from "@zoom/meetingsdk";

import ManualMeeting from "./components/ManualMeeting";
import CurrentMeetings from "./components/CurrentMeetings";
import GetZoomAuth from "./components/GetZoomAuth";
import NavBar from "./components/NavBar";
import { useZoomAuth } from "../context/ZoomContext";
import SmartEmbed from "./components/SmartEmbed";

const socket = io("http://localhost:3000/");

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

ZoomMtg.i18n.load("en-US");

const zoomMeetingSDK = document.getElementById("zmmtg-root");

zoomMeetingSDK.style.display = "none";

const Dashboard = () => {
  const { zoomAuthenticated } = useZoomAuth();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <NavBar />
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          color: "black",
          textAlign: "center",
          py: 4,
          borderBottom: "4px solid black",
        }}
      >
        <Grid2 container spacing={2} alignItems="center">
          <Grid2 size={{ xs: 8 }} sx={{ paddingLeft: 4 }}>
            <Typography variant="h2" fontWeight="bold">
              Zoom Integration Examples
            </Typography>
          </Grid2>
          <Grid2
            size={{ xs: 4 }}
            sx={{
              paddingInline: 4,
              textAlign: "center",
              borderLeft: "2px solid black",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ borderBottom: "1px solid black" }}>
                Zoom Documentation
              </Typography>
              <Link
                href="https://developers.zoom.us/docs/api/"
                underline="none"
                target="_blank"
                rel="noopener"
                sx={{ color: "black", "&:hover": { color: "grey" } }}
              >
                Zoom API references
              </Link>
              <Link
                href="https://developers.zoom.us/docs/meeting-sdk/"
                underline="none"
                target="_blank"
                rel="noopener"
                sx={{ color: "black", "&:hover": { color: "grey" } }}
              >
                Zoom Meeting SDK Documentation
              </Link>
              <Link
                href="https://developers.zoom.us/docs/phone/smart-embed-guide/"
                underline="none"
                target="_blank"
                rel="noopener"
                sx={{ color: "black", "&:hover": { color: "grey" } }}
              >
                Zoom Smart Embed Documentation
              </Link>
              <Link
                href="https://developers.zoom.us/docs/api/webhooks/ "
                underline="none"
                target="_blank"
                rel="noopener"
                sx={{ color: "black", "&:hover": { color: "grey" } }}
              >
                Zoom Webhook Documentation
              </Link>
            </Stack>
          </Grid2>
        </Grid2>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          overflow: "auto",
          paddingBottom: 2,
        }}
      >
        {zoomAuthenticated ? (
          <>
            <ManualMeeting />
            <CurrentMeetings socket={socket} />
            <SmartEmbed />
          </>
        ) : (
          <GetZoomAuth />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
