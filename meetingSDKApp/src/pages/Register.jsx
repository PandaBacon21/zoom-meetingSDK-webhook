import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { updateAuthState } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const registerUser = async (event) => {
    event.preventDefault();

    if (email.length === 0) {
      alert("Email cannot be left blank!");
    } else if (password.length === 0) {
      alert("Password cannot be left blank!");
    } else if (passwordVerify.length === 0) {
      alert("Please verify your password");
    } else if (password !== passwordVerify) {
    } else {
      try {
        const res = await axios({
          method: "post",
          url: "api/register",
          headers: { "Content-Type": "application/json" },
          data: JSON.stringify({
            email: email,
            password: password,
          }),
        });
        console.log(res.data);
        updateAuthState();
        if (res.status === 201) {
          console.log("navigating to /dashboard");
          navigate("/dashboard");
        }
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
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="filled"
              sx={{ marginTop: 3 }}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              id="verify-password"
              label="Verify Password"
              type="password"
              variant="filled"
              sx={{ marginTop: 3 }}
              onChange={(e) => setPasswordVerify(e.target.value)}
            />
            <Button
              variant="contained"
              size="large"
              sx={{ marginTop: 3 }}
              onClick={registerUser}
            >
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
