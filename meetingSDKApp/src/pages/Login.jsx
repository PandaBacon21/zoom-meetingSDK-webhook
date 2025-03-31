import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useZoomAuth } from "../context/ZoomContext";

const Login = () => {
  const navigate = useNavigate();
  const { updateAuthState, isAuthenticated } = useAuth();
  const { updateZoomAuthState } = useZoomAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Could add data validation
  const logInUser = async (event) => {
    event.preventDefault();

    if (email.length === 0) {
      alert("Email cannot be left blank!");
    } else if (password.length === 0) {
      alert("Password cannot be left blank!");
    } else {
      try {
        const res = await axios({
          method: "post",
          url: "api/login",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({
            email: email,
            password: password,
          }),
          withCredentials: true,
        });
        console.log(res.data);
        updateAuthState();
        updateZoomAuthState(res.data.data.zoomAuth);
        // console.log(res.data.data.zoomAuth);
        console.log(res.status);
        if (res.status === 200) {
          console.log("navigating to /dashboard");
          navigate("/dashboard");
        }
      } catch (e) {
        console.log(e.response.data);
        if (e.response.data) {
          alert(`An error occurred: ${e.response.data.message}`);
        } else {
          alert("An error occurred");
        }
      }
    }
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
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
              paddingBottom: 2,
              borderBottom: "2px solid black",
              display: "inline-block",
            }}
          >
            Zoom Meeting SDK Example
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 1 }}>
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="filled"
              sx={{ margin: 3 }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              size="large"
              onClick={logInUser}
              sx={{ paddingInline: 10 }}
            >
              Login
            </Button>
            <Box sx={{ marginTop: 7, marginBottom: 1 }}>
              <Link to="/register">Not Registered? Sign Up Here!</Link>
            </Box>
          </Paper>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
