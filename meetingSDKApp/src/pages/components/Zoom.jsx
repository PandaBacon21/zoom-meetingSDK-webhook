import axios from "axios";
import { ZoomMtg } from "@zoom/meetingsdk";
import { Box, Button, Typography } from "@mui/material";

// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();

// ZoomMtg.i18n.load("en-US");

// const zoomMeetingSDK = document.getElementById("zmmtg-root");

// zoomMeetingSDK.style.display = "none";

const SDKKEY = import.meta.env.VITE_ZOOM_CLIENT_ID;
const LEAVEURL = import.meta.env.VITE_LEAVE_URL;

const Zoom = ({
  userName,
  meetingId,
  password,
  signature,
  clearInputs,
  sx,
}) => {
  const authEndpoint = "/api/zoom-sdk-token";
  const sdkKey = SDKKEY;
  const role = 0;
  //   const userEmail = "";
  //   const registrantToken = "";
  //   const zakToken = "";
  const leaveUrl = LEAVEURL;

  const getSignature = async () => {
    try {
      const res = await axios({
        method: "post",
        url: authEndpoint,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          meetingNumber: meetingId,
          role: role,
        }),
      });
      console.log(res.data);

      const signature = res.data.signature;
      return signature;
    } catch (e) {
      console.log(e);
    }
  };

  const joinMeeting = async () => {
    let zoomMeetingSDK = document.getElementById("zmmtg-root");

    zoomMeetingSDK.style.display = "block";
    const jwt = await getSignature();

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        ZoomMtg.join({
          sdkKey: sdkKey,
          signature: jwt,
          meetingNumber: meetingId,
          passWord: password,
          userName: userName,
          success: (success) => {
            console.log(success);
            clearInputs();
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Box sx={sx}>
      <Button
        sx={{ borderRadius: 2 }}
        variant="contained"
        size="large"
        onClick={joinMeeting}
      >
        <Typography>Join Meeting</Typography>
      </Button>
    </Box>
  );
};

export default Zoom;
