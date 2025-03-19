import { AppBar, Typography, Button, Box, Toolbar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { logout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: 2 }}
          >
            Demo Dashboard
          </Typography>
          <Typography>
            <Button size="large" onClick={logout}>
              Logout
            </Button>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
