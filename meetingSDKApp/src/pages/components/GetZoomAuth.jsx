import { Paper, Box, Typography, Button } from "@mui/material";

const ZOOMAUTHURL = import.meta.env.VITE_ZOOM_AUTH_URL;

export default function GetZoomAuth() {
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
          <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 8 }}>
            Connect Zoom Account
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => (window.location.href = ZOOMAUTHURL)}
          >
            Authorize
          </Button>
        </Paper>
      </Box>
    </>
  );
}
