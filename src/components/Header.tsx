import { Dispatch, SetStateAction, useState } from "react";
import * as React from "react";
import {
  AppBar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
// @ts-ignore
import logo from "../../assets/logo.svg";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

interface HeaderProps {
  language: "en" | "gr";
  languageHandler: Dispatch<SetStateAction<"en" | "gr">>;
}

const Header = ({ language, languageHandler }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (language) => {
    languageHandler(language);
    handleClose();
  };

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
        <Box component={"a"} href={"https://www.uphellas.gr"} target={"_blank"}>
          <Box
            component={"img"}
            src={logo}
            alt={"uphellas-map-logo"}
            width={50}
            height={50}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant={"contained"}
          disableElevation={false}
          component="a"
          href="https://www.uphellas.gr/contact"
          sx={{
            borderRadius: 100,
            backgroundColor: "white",
            color: "#4F5D5B",
            fontSize: { xs: "14px", sm: "16px" },
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          {language == "en" ? "Contact" : "Επικοινωνια"}
        </Button>
        <Box ml={2}>
          <Button
            variant="contained"
            onClick={handleClick}
            disableElevation={false}
            endIcon={open ? <ArrowDropUp /> : <ArrowDropDown />}
            sx={{
              borderRadius: 100,
              backgroundColor: "white",
              color: "#4F5D5B",

              fontSize: { xs: "14px", sm: "16px" },
              fontWeight: 700,
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            {language === "en" ? "English" : "Ελληνικα"}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "language-button",
            }}
          >
            <MenuItem
              key={"en"}
              selected={"en" === language}
              onClick={() => handleMenuItemClick("en")}
            >
              {language === "en" ? "English" : "Αγγλικά"}
            </MenuItem>

            <MenuItem
              key={"gr"}
              selected={"gr" === language}
              onClick={() => handleMenuItemClick("gr")}
            >
              {language === "en" ? "Greek" : "Ελληνικά"}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
