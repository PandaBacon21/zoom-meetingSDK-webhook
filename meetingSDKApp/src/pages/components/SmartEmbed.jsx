import { Paper, Box, Typography, TextField, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CallLog from "./CallLog";

export default function SmartEmbed() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;

    const handleIframeLoad = () => {
      iframe.contentWindow.postMessage(
        {
          type: "zp-init-config",
          data: {
            enableSavingLog: false,
            enableAutotLog: false,
            enableContactSearching: false,
            enableContactMatching: false,
            notePageConfiguration: [
              {
                fieldName: "Disposition",
                fieldType: "select",
                selectOptions: [
                  {
                    label: "mock_label_1",
                    value: "mock_value_1",
                  },
                  {
                    label: "mock_label_2",
                    value: "mock_value_2",
                  },
                  {
                    label: "mock_label_3",
                    value: "mock_value_3",
                  },
                ],
                placeholder: "Select an Option",
              },
              {
                fieldName: "Description",
                fieldType: "text",
                placeholder: "Enter Notes",
              },
            ],
          },
        },
        "https://applications.zoom.us"
      );
    };

    iframe.addEventListener("load", handleIframeLoad);
    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, []);

  const clickToDial = () => {
    iframeRef.current.contentWindow.postMessage(
      {
        type: "zp-make-call",
        data: {
          number: phoneNumber,
          autoDial: true,
        },
      },
      "https://applications.zoom.us"
    );
    setPhoneNumber("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        margin: 2,
        width: "100%",
        maxWidth: 1000,
        minWidth: 800,
        height: "auto",
        textAlign: "center",
        borderRadius: 5,
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          marginBottom: 2,
          borderBottom: "2px solid black",
        }}
      >
        Zoom Phone Smart Embed
      </Typography>
      <Typography variant="p" sx={{ textDecoration: "underline" }}>
        Click To Dial Example
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <TextField
          sx={{ margin: 2, borderRadius: 2, border: "solid 1px black" }}
          id="phone-number"
          label="Phone Number"
          variant="filled"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Button
          sx={{ margin: 2, borderRadius: 2, paddingInline: 6 }}
          variant="contained"
          size="large"
          onClick={clickToDial}
        >
          Call
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: 500,
            minWidth: 350,
            height: 750,
            backgroundColor: "#f5f5f5",
            boxShadow: "inset 0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            textAlign: "center",
            flex: 1,
          }}
        >
          <CallLog />
        </Paper>
        <Paper
          sx={{
            width: "100%",
            maxWidth: 500,
            minWidth: 350,
            height: 650,
            backgroundColor: "#f5f5f5",
            boxShadow: "inset 0px 2px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            textAlign: "center",
            flex: 1,
          }}
        >
          <iframe
            ref={iframeRef}
            src="https://applications.zoom.us/integration/phone/embeddablephone/home"
            id="zoom-embeddable-phone-iframe"
            allow="clipboard-read; clipboard-write https://applications.zoom.us"
            style={{ width: "100%", height: "100%", border: "none" }}
          ></iframe>
        </Paper>
      </Box>
    </Paper>
  );
}
