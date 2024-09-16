import * as React from "react";
import { createRoot } from "react-dom/client";
import AppWrapper from "./wrapper/AppWrapper";
import MerchantsMap from "./index";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { themeLight } from "./theme/theme";

const theme = createTheme(themeLight);
const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppWrapper>
      <MerchantsMap />
    </AppWrapper>
  </ThemeProvider>
);

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);
