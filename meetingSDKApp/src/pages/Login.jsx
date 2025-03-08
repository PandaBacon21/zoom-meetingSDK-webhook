import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import SessionToken from "./components/SessionToken";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Could add data validation
  const logInUser = async (event) => {
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
        });
        console.log(res.data);
        // SessionToken.saveToken(res.data.token);
        navigate("/dashboard");
      } catch (e) {
        console.log(e.response.data);
        if (e.response.data) {
          alert(`An error occurred: ${e.response.data.error}`);
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
            <Button variant="contained" size="large" onClick={logInUser}>
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
