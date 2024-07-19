import * as React from "react";
import { Stack, Switch, Typography } from "@mui/material";

interface CustomSwitcherProps {
  selectedItems: string[] | boolean;
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}
const CustomSwitcher = ({ selectedItems, onChange }: CustomSwitcherProps) => {
  return (
    <Stack direction={"row"} spacing={1} alignItems={"center"}>
      <Typography>Off</Typography>
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
      <Typography>On</Typography>
    </Stack>
  );
};

export default CustomSwitcher;
