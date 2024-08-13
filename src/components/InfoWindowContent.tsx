import React from "react";
import { Box } from "@mui/material";

const InfoWindowContent = ({ info, language }) => {
  return (
    <>
      {info && (
        <Box
          key={info.id}
          sx={{
            paddingBottom: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {info?.is_hero_corp && (
            <Box
              sx={{
                backgroundColor: "#F59100",
                borderRadius: 100,
                px: 1,
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
                width: 130,
                mb: 0.5,
              }}
            >
              Cashback partner
            </Box>
          )}

          <Box sx={{ fontSize: "15px", mb: 0.5 }}>
            {info[`mcc_category_${language}`]}
          </Box>
          <Box sx={{ fontWeight: "bold", fontSize: "20px", mb: 0.5 }}>
            {info[`brand_name_${language}`] ?? "Brand Name"}
          </Box>
          <Box
            sx={{
              fontSize: "14px",
              mb: 0.5,
              textTransform: "capitalize",
              fontWeight: "normal",
            }}
          >
            {info[`address_${language}`]},{info[`region_${language}`]},
            {info.zip_code}
          </Box>
          <Box display={"flex"} sx={{ mb: 0.5 }}>
            {info?.accepted_products.map((product) => (
              <Box mr={0.5}>•{product} </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default InfoWindowContent;
