// @ts-ignore
import React, { ReactNode } from "react";
import { Button, SxProps } from "@mui/material";

interface CustomButtonProps {
  label: string;
  variant?: "contained" | "text" | "outlined";
  onClick: () => void;
  sx?: SxProps;
  icon?: ReactNode;
}
const CustomButton = ({
  label,
  variant = "contained",
  onClick,
  icon,
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
      {icon && icon} {label}
    </Button>
  );
};

export default CustomButton;
