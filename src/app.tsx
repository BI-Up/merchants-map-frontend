import * as React from "react";
import { createRoot } from "react-dom/client";
import AppWrapper from "./wrapper/AppWrapper";
import MerchantsMap from "./index";

const App = () => (
  <AppWrapper>
    <MerchantsMap />
  </AppWrapper>
);

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);
