import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import SessionToken from "./components/SessionToken";

const Login = () => {
  const navigate = useNavigate();

  const saveToken = () => {
    SessionToken.saveToken("taco");
    navigate("/");
  };

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
          <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Login
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
          >
            <TextField
              id="email"
              label="Email"
              variant="filled"
              sx={{ margin: 3 }}
            />
            <TextField
              id="password"
              label="Password"
              variant="filled"
              sx={{ margin: 3 }}
            />
            <Button variant="contained" size="large">
              Login
            </Button>
            <Box sx={{ marginTop: 7 }}>
              <Link to="/register">Not Registered? Sign Up Here!</Link>
            </Box>
          </Paper>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
