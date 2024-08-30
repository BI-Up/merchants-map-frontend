import * as React from "react";
import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { Box, Stack, SxProps, Typography } from "@mui/material";
import InputField from "./ui/InputField";
import CustomSwitcher from "./ui/CustomSwitcher";
import CustomButton from "./ui/CustomButton";
import LocationAutocomplete from "./ui/LocationAutocomplete";

interface LeftMenuProps {
  smallScreens: boolean;
  mediumScreens: boolean;
  largeScreens: boolean;
  locationsData: string[];
  categoriesData: string[];
  productsData: string[];
  selectedItems: {
    locations: string[];
    products: string[];
    categories: string[];
    has_cashback: boolean;
  };
  setSelectedItems: Dispatch<
    SetStateAction<{
      locations: string[];
      products: string[];
      categories: string[];
      has_cashback: boolean;
    }>
  >;
  handleSelectChange: (
    _type: "locations" | "products" | "categories",
  ) => (event: React.ChangeEvent<{ value: unknown }>) => void;
  handleSwitchChange: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  language: "en" | "gr";
  children?: ReactNode;
}

const LeftMenu = ({
  smallScreens,
  mediumScreens,
  largeScreens,
  locationsData,
  productsData,
  categoriesData,
  selectedItems,
  handleSelectChange,
  handleSwitchChange,
  handleSubmit,
  language,
  children,
  setSelectedItems,
}: LeftMenuProps) => {
  useEffect(() => {
    setSelectedItems({
      locations: [],
      products: [],
      categories: [],
      has_cashback: false,
    });
  }, [language]);

  const containerStyles: SxProps = {
    backgroundColor: "white",
    color: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "auto",
    pt: 4,
    px: largeScreens ? 5 : !largeScreens && !smallScreens ? 4 : 0,
    width:
      largeScreens && !smallScreens
        ? "25%"
        : !smallScreens && mediumScreens
          ? "45%"
          : smallScreens
            ? "100%"
            : "30%",
    height: "calc(100vh - 84px)",
    mt: 1,
  };

  return (
    <>
      <Box sx={containerStyles}>
        <Stack spacing={3} width={300}>
          <LocationAutocomplete
            locationsData={locationsData}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            language={language}
          />
        </Stack>

        <InputField
          items={productsData}
          selectedItems={selectedItems.products ?? []}
          onChange={handleSelectChange("products")}
          label={language === "en" ? "Products" : "Προϊόντα"}
          language={language}
        />
        <InputField
          items={categoriesData}
          selectedItems={selectedItems.categories ?? []}
          onChange={handleSelectChange("categories")}
          label={language === "en" ? "Categories" : "Κατηγορίες"}
          language={language}
        />

        <Box display={"flex"} alignItems={"center"} gap={2} padding={"1rem"}>
          <Typography>
            {language === "en" ? "Has Cashback officers?" : "Παροχή Cashback;"}
          </Typography>
          <CustomSwitcher
            selectedItems={selectedItems.has_cashback ?? false}
            onChange={handleSwitchChange}
            language={language}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          padding={"1rem"}
          width={300}
        >
          <CustomButton
            label={language === "en" ? "Search" : "Αναζητηση"}
            onClick={handleSubmit}
            sx={{ padding: 1.5 }}
          />
        </Box>
        {!smallScreens && children}
      </Box>
    </>
  );
};

export default LeftMenu;
