import { Box, Paper, Typography } from "@mui/material";

const Webhook = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        margin: 2,
        width: 600,
        minHeight: 400,
        maxHeight: 300,
        textAlign: "center",
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Receive Webhook
      </Typography>
      <Paper
        sx={{
          width: 500,
          height: 300,
          backgroundColor: "#f5f5f5",
          boxShadow: "inset 0px 2px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          textAlign: "center",
        }}
      ></Paper>
    </Paper>
  );
};

export default Webhook;
