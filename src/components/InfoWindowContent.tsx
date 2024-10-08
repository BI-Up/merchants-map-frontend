import * as React from "react";
import { Box, Theme, Typography } from "@mui/material";

interface Info {
  vat_name_gr?: string;
  is_hero_corp?: boolean;
  mcc_category_en?: string;
  mcc_category_gr?: string;
  brand_name_en?: string;
  brand_name_gr?: string;
  address_en?: string;
  address_gr?: string;
  region_en?: string;
  region_gr?: string;
  zip_code?: string;
  accepted_products?: string[];
}

interface InfoWindowContentProps {
  info: Info;
  language: "en" | "gr";
}
const InfoWindowContent = ({ info, language }: InfoWindowContentProps) => {
  return (
    <Box key={info.vat_name_gr} position={"relative"} zIndex={20000}>
      {info && (
        <Box
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
                backgroundColor: (theme: Theme) => theme.palette.primary.main,
                borderRadius: 100,
                px: 1,
                fontSize: "14px",
                fontWeight: 600,
                color: (theme: Theme) => theme.palette.common.white,
                width: 130,
                mb: 0.2,
              }}
            >
              Cashback partner
            </Box>
          )}

          <Typography
            variant={"body2"}
            color={"text.primary"}
            sx={{ fontSize: "15px", mb: 0.2 }}
          >
            {info[`mcc_category_${language}`]}
          </Typography>
          <Typography
            variant={"h6"}
            color={"text.primary"}
            sx={{ fontSize: "20px", mb: 0.2 }}
          >
            {info[`brand_name_${language}`] ?? "Brand Name"}
          </Typography>
          <Typography
            variant={"body2"}
            color={"text.primary"}
            sx={{
              fontSize: "14px",
              mb: 0.2,
              textTransform: "capitalize",
              fontWeight: "normal",
            }}
          >
            {info[`address_${language}`]},{info[`region_${language}`]},
            {info.zip_code}
          </Typography>
          <Typography
            variant={"body2"}
            color={"text.secondary"}
            display={"flex"}
            sx={{ mt: 0.2 }}
          >
            {info?.accepted_products.map((product) => (
              <Box mr={0.5}>•{product} </Box>
            ))}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default InfoWindowContent;
