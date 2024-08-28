import * as React from "react";
import { ReactNode, useState } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InputField from "./ui/InputField";
import CustomSwitcher from "./ui/CustomSwitcher";
import CustomButton from "./ui/CustomButton";

interface LeftMenuProps {
  isMobile: boolean;
  hasLargeScreen: boolean;
  locationsData: string[];
  categoriesData: string[];
  productsData: string[];
  selectedItems: {
    locations: string[];
    products: string[];
    categories: string[];
    has_cashback: boolean;
  };
  handleSelectChange: (
    _type: "locations" | "products" | "categories",
  ) => (event: React.ChangeEvent<{ value: unknown }>) => void;
  handleSwitchChange: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  language: "en" | "gr";
  children?: ReactNode;
}

const LeftMenu = ({
  isMobile,
  hasLargeScreen,
  locationsData,
  productsData,
  categoriesData,
  selectedItems,
  handleSelectChange,
  handleSwitchChange,
  handleSubmit,
  language,
  children,
}: LeftMenuProps) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  console.log(inputValue);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "white",
          width:
            hasLargeScreen && !isMobile
              ? "25%"
              : !hasLargeScreen && !isMobile
                ? "35%"
                : "100%",

          color: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "auto",
          pt: 4,
          px: !hasLargeScreen && !isMobile && 6,
        }}
        height={"calc(100vh - 84px)"}
        mt={1}
      >
        <Stack spacing={3} width={300}>
          <Autocomplete
            multiple
            limitTags={1}
            options={locationsData}
            loading={locationsData === null}
            filterOptions={(options, { inputValue }) =>
              options.filter((option) =>
                option.toLowerCase().startsWith(inputValue.toLowerCase()),
              )
            }
            open={open}
            onOpen={() => {
              if (inputValue) {
                setOpen(true);
              }
            }}
            onClose={() => setOpen(false)}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              setOpen(!!newInputValue); // Open only when there's input
            }}
            renderTags={(value, getTagProps) => {
              // Limit the tags shown even when focused
              const displayedTags = value.slice(0, 1);
              const moreCount = value.length - displayedTags.length;

              return (
                <>
                  {displayedTags.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))}
                  {moreCount > 0 && (
                    <Chip label={`+${moreCount}`} /> // Display remaining count as a disabled chip
                  )}
                </>
              );
            }}
            onChange={(event, newValue) => {
              selectedItems.locations = newValue;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={language === "en" ? "Locations" : "Τοποθεσίες"}
                variant={"outlined"}
                sx={{
                  minWidth: 200, // Ensure minimum width
                  maxWidth: "100%", // Allow growth within parent
                  marginBottom: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "100px",
                    overflowX: "auto", // Enable horizontal scrolling
                    display: "flex",
                    flexWrap: "nowrap",
                    flexGrow: 1, // Make the input grow with content
                  },
                }}
              />
            )}
          />
        </Stack>

        {/*<Stack spacing={3} width={300}>*/}
        {/*  <Autocomplete*/}
        {/*    multiple*/}
        {/*    open={open}*/}
        {/*    limitTags={2}*/}
        {/*    onOpen={() => {*/}
        {/*      if (inputValue) {*/}
        {/*        setOpen(true);*/}
        {/*      }*/}
        {/*    }}*/}
        {/*    onClose={() => setOpen(false)}*/}
        {/*    inputValue={inputValue}*/}
        {/*    onInputChange={(event, newInputValue) => {*/}
        {/*      setInputValue(newInputValue);*/}
        {/*      setOpen(!!newInputValue); // Open only when there's input*/}
        {/*    }}*/}
        {/*    onChange={(event, newValue) => {*/}
        {/*      selectedItems.locations = newValue;*/}
        {/*    }}*/}
        {/*    getOptionLabel={(option) => option || ""}*/}
        {/*    filterOptions={(options, { inputValue }) =>*/}
        {/*      options.filter((option) =>*/}
        {/*        option.toLowerCase().includes(inputValue.toLowerCase()),*/}
        {/*      )*/}
        {/*    }*/}
        {/*    clearOnEscape*/}
        {/*    renderInput={(params) => (*/}
        {/*      <TextField*/}
        {/*        {...params}*/}
        {/*        autoFocus*/}
        {/*        label={language === "en" ? "Locations" : "Τοποθεσίες"}*/}
        {/*        variant="outlined"*/}
        {/*        sx={{*/}
        {/*          minWidth: 200,*/}
        {/*          maxWidth: "100%",*/}
        {/*          marginBottom: 1,*/}
        {/*          "& .MuiOutlinedInput-root": {*/}
        {/*            borderRadius: "100px",*/}
        {/*            overflowX: "auto",*/}
        {/*            display: "flex",*/}
        {/*            flexWrap: "nowrap",*/}
        {/*            flexGrow: 1,*/}
        {/*          },*/}
        {/*        }}*/}
        {/*        onKeyDown={(e) => {*/}
        {/*          if (e.key !== "Escape") {*/}
        {/*            e.stopPropagation();*/}
        {/*          }*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*    options={locationsData}*/}
        {/*    value={selectedItems.locations}*/}
        {/*    disableCloseOnSelect={true}*/}
        {/*  />*/}
        {/*</Stack>*/}

        {/*<InputField*/}
        {/*  items={locationsData}*/}
        {/*  selectedItems={selectedItems.locations ?? []}*/}
        {/*  onChange={handleSelectChange("locations")}*/}
        {/*  label={language === "en" ? "Locations" : "Τοποθεσίες"}*/}
        {/*  language={language}*/}
        {/*  hasSearch={true}*/}
        {/*/>*/}
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
        {!isMobile && children}
      </Box>
    </>
  );
};

export default LeftMenu;
