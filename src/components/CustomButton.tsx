// @ts-ignore
import React from "react";
import { Button, SxProps } from "@mui/material";

interface CustomButtonProps {
  label: string;
  variant?: "contained" | "text" | "outlined";
  onClick: () => void;
  sx?: SxProps;
}
const CustomButton = ({
  label,
  variant = "contained",
  onClick,
  sx,
}: CustomButtonProps) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      sx={{
        backgroundColor: "#F59100",
        borderRadius: "100px",
        width: "100%",
        "&:hover": { backgroundColor: "#ee8e03" },
        ...sx,
      }}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
