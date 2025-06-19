import { useState } from "react";
import { Typography, List, ListItem, ListItemText, Box } from "@mui/material";

export default function CallLog() {
  const [callStatus, setCallStatus] = useState("");
  const [callDetails, setCallDetails] = useState({
    callId: "",
    direction: "",
    caller: {
      name: "",
      phoneNumber: "",
    },
    callee: {
      phoneNumber: "",
    },
    dateTime: "",
    results: "",
  });

  if (callStatus === "Call Ended") {
    setTimeout(() => {
      setCallStatus("");
      setCallDetails({
        callId: "",
        direction: "",
        caller: {
          name: "",
          phoneNumber: "",
        },
        callee: {
          phoneNumber: "",
        },
        dateTime: "",
        result: "",
      });
      console.log("Call Status Reset");
    }, 15000);
  }
  if (callDetails.callId != "") {
    console.log(`Call Details: ${JSON.stringify(callDetails)}`);
  }

  window.addEventListener("message", (e) => {
    const data = e.data;
    if (data) {
      switch (data.type) {
        case "zp-call-ringing-event":
          setCallStatus("Call Ringing");
          setCallDetails({
            callId: "",
            direction: "",
            caller: {
              name: "",
              phoneNumber: "",
            },
            callee: {
              phoneNumber: "",
            },
            dateTime: "",
            result: "",
          });
          console.log("Call Ringing");
          break;
        case "zp-call-connected-event":
          setCallStatus("Call Connected");
          console.log("Call Connected");
          break;
        case "zp-call-ended-event":
          setCallStatus("Call Ended");
          console.log("Call Ended");
          break;
        case "zp-call-log-completed-event":
          setCallDetails({
            ...callDetails,
            callId: data.data.callId,
            direction: data.data.direction,
            caller: {
              name: data.data.caller.name,
              phoneNumber: data.data.caller.didNumber,
            },
            callee: {
              phoneNumber: data.data.callee.number,
            },
            dateTime: data.data.dateTime,
            result: data.data.result,
          });
      }
    }
  });

  return (
    <>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ marginBlock: 2, borderBottom: "2px solid black" }}
      >
        Call Details
      </Typography>
      <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
        Call Status: {callStatus}
      </Typography>
      {callStatus === "Call Ended" ? (
        <Box
          sx={{
            borderTop: "2px solid black",
            padding: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Last Call Details:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                slotProps={{ primary: { fontWeight: "bold" } }}
                primary={`Call ID:      ${callDetails.callId}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                slotProps={{ primary: { fontWeight: "bold" } }}
                primary={`Direction:        ${callDetails.direction}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                slotProps={{ primary: { fontWeight: "bold" } }}
                primary={`Call Date/Time:       ${callDetails.dateTime}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                slotProps={{ primary: { fontWeight: "bold" } }}
                primary={`Callee Phone Number:      ${callDetails.callee.phoneNumber}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                slotProps={{ primary: { fontWeight: "bold" } }}
                primary={`Caller Name:      ${callDetails.caller.name}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                slotProps={{ primary: { fontWeight: "bold" } }}
                primary={`Caller Phone Number:      ${callDetails.caller.phoneNumber}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                slotProps={{ primary: { fontWeight: "bold" } }}
                primary={`Call Result:      ${callDetails.result}`}
              />
            </ListItem>
          </List>
        </Box>
      ) : null}
    </>
  );
}
