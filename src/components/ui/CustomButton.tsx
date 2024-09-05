// @ts-ignore
import React, { ReactNode } from "react";
import { Button, SxProps, Theme } from "@mui/material";

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
        backgroundColor: (theme: Theme) => theme.palette.primary.main,
        borderRadius: "100px",
        width: "100%",
        color: (theme: Theme) => theme.palette.common.white,
        "&:hover": {
          backgroundColor: (theme: Theme) => theme.palette.primary.dark,
        },
        ...sx,
      }}
    >
      {icon && icon} {label}
    </Button>
  );
};

export default CustomButton;
