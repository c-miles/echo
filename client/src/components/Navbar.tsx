import React, { CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { useAuth0 } from "@auth0/auth0-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth0();
  const navigate = useNavigate();
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: process.env.REACT_APP_AUTH0_LOGOUT_REDIRECT_URI,
      },
    });
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <AppBar position="static" style={styles.container}>
      <Toolbar>
        <Box style={styles.box}>
          <Typography variant="h6">yap</Typography>
          <Typography
            variant="h6"
            style={styles.lounge}
            onClick={navigateToDashboard}
          >
            Lounge
          </Typography>
        </Box>
        {user && (
          <>
            <IconButton onClick={handleMenu} size="large">
              <Avatar alt={user.name} src={user.picture} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

const useStyles = (): { [key: string]: CSSProperties } => ({
  container: {
    backgroundColor: "#424242",
  },
  box: {
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
  },
  lounge: {
    cursor: "pointer",
    marginLeft: "3%",
  },
});
