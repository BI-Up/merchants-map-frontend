import * as React from "react";
import { Stack, Switch, Typography } from "@mui/material";

interface CustomSwitcherProps {
  selectedItems: string[] | boolean;
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  language: "en" | "gr";
}
const CustomSwitcher = ({
  selectedItems,
  onChange,
  language,
}: CustomSwitcherProps) => {
  return (
    <Stack direction={"row"} spacing={1} alignItems={"center"}>
      <Typography>{language === "en" ? "Off" : "Όχι"}</Typography>
      {/*@ts-ignore*/}
      <Switch
        checked={selectedItems as boolean}
        onChange={onChange}
        sx={{
          width: 51,
          height: 26,
          borderRadius: 3,
          border: "2px solid #303644",
          boxShadow: `inset 1px 2px 0 #30364466`,
          backgroundColor: selectedItems
            ? "white"
            : "hsla(0,0%,78.4%,.64)!important",

          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: "2px",
            transitionDuration: "300ms",
            border: "2px solid #303644",
            // boxShadow: "0 2px 0 #303644",

            "&.Mui-checked": {
              transform: "translateX(23px)",
              color: "#ee8e03",
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            width: 16,
            height: 15,
            ml: "0.5px",
            my: "1px",
            backgroundColor: selectedItems ? "#F59100" : "#9747FF",
          },
          "& .MuiSwitch-track": {
            borderRadius: 26 / 2,
            opacity: 1,
          },
        }}
      />
      <Typography>{language === "en" ? "On" : "Ναί"}</Typography>
    </Stack>
  );
};

export default CustomSwitcher;
