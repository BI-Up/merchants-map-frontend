import { ThemeOptions } from "@mui/material";

const commonPalette = {
  primary: {
    light: "#f3a34e",
    main: "#ff9018",
    dark: "#f87d02",
  },
  secondary: {
    light: "#ab92ee",
    main: "#6750a4",
    dark: "#4f2baf",
  },
  error: {
    light: "#f72b2b",
    main: "#c50e1f",
    dark: "#a80f22",
  },
  warning: {
    light: "#fcd37a",
    main: "#ffcc66",
    dark: "#ffbc27",
  },
  info: {
    light: "#4eccef",
    main: "#1ba0ce",
    dark: "#0066cc",
  },
  success: {
    light: "#4caf50",
    main: "#2e7d32",
    dark: "#1b5e20",
  },
  common: {
    black: "#000",
    white: "#fff",
  },
};

const typography = {
  fontFamily: "Roboto, Arial, sans-serif",
};

export const themeLight: ThemeOptions = {
  palette: {
    ...commonPalette,
    text: {
      primary: "#444141",
      secondary: "#6b6b6b",
      disabled: "#999",
    },
  },
  typography: typography,
};
