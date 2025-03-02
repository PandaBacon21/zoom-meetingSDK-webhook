import { Box } from "@mui/material";
import { io } from "socket.io-client";

import ManualMeeting from "./components/ManualMeeting";
import Webhook from "./components/Webhook";

const socket = io("http://localhost:3000/");

function App() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
          height: "100vh",
        }}
      >
        <ManualMeeting />
        <Webhook socket={socket} />
      </Box>
    </>
  );
}

export default App;
