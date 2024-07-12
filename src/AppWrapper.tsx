import * as React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Box } from "@mui/material";

const AppWrapper = ({ children }) => {
  return (
    <APIProvider
      apiKey={process.env.GOOGLE_MAPS_API_KEY}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Box sx={{ height: "100vh", width: "100vw", display: "flex" }}>
        {children}
      </Box>
    </APIProvider>
  );
};

export default AppWrapper;
