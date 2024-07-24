import React from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import logo from "../../assets/logo.svg";

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#FF9018",
        py: 2,
        height: 84,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar>
        <Box
          component={"img"}
          src={logo}
          alt={"uphellas-map-logo"}
          width={50}
          height={50}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant={"contained"}
          disableElevation={false}
          sx={{
            borderRadius: 100,
            backgroundColor: "white",
            color: "#4F5D5B",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Contact
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
