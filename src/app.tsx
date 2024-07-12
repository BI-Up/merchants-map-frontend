// @ts-ignore
import React from "react";
import { createRoot } from "react-dom/client";
import AppWrapper from "./AppWrapper";
import MerchantsMap from "./components/MerchantsMap";

const App = () => (
  <AppWrapper>
    <MerchantsMap />
  </AppWrapper>
);

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);
