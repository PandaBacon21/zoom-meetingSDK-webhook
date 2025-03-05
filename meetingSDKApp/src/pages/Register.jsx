import { Link } from "react-router-dom";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";

const Register = () => {
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
            minHeight: 600,
            // maxHeight: 300,
            textAlign: "center",
            borderRadius: 5,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", marginBottom: 2, marginRight: 3 }}
          >
            Register
          </Typography>
          <Paper
            sx={{
              width: 500,
              height: 500,
              backgroundColor: "#f5f5f5",
              boxShadow: "inset 0px 2px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <TextField
              id="email"
              label="Email"
              variant="filled"
              sx={{ marginTop: 5 }}
            />
            <TextField
              id="password"
              label="Password"
              variant="filled"
              sx={{ marginTop: 3 }}
            />
            <TextField
              id="verify-password"
              label="Verify Password"
              variant="filled"
              sx={{ marginTop: 3 }}
            />
            <Button variant="contained" size="large" sx={{ marginTop: 3 }}>
              Register
            </Button>
            <Box sx={{ marginTop: 15 }}>
              <Link to="/login">Already Registered? Login Here!</Link>
            </Box>
          </Paper>
        </Paper>
      </Box>
    </>
  );
};

export default Register;
