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
          "& .MuiSwitch-thumb": {
            backgroundColor: selectedItems ? "#F59100" : "#9747FF",
          },
        }}
      />
      <Typography>{language === "en" ? "On" : "Ναί"}</Typography>
    </Stack>
  );
};

export default CustomSwitcher;
