import { Box } from "@mui/material";

import ManualMeeting from "./components/ManualMeeting";
import Webhook from "./components/Webhook";

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
        <Webhook />
      </Box>
    </>
  );
}

export default App;
