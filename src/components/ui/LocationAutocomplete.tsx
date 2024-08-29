import * as React from "react";
import { useRef, useState } from "react";
import { Autocomplete, Chip, TextField } from "@mui/material";

interface LocationAutocompleteProps {
  locationsData: string[];
  selectedItems: { locations: string[] };
  language: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  locationsData,
  selectedItems,
  language,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const prevLanguageRef = useRef<string>(language);

  return (
    <Autocomplete
      multiple
      limitTags={1}
      options={locationsData}
      open={open}
      loading={locationsData === null}
      value={selectedItems.locations}
      inputValue={inputValue}
      filterOptions={(options: any, { inputValue }) =>
        options.filter((option) =>
          option.toLowerCase().startsWith(inputValue.toLowerCase()),
        )
      }
      onOpen={() => {
        if (inputValue) {
          setOpen(true);
        }
      }}
      onClose={() => setOpen(false)}
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
            {displayedTags.map((option: any, index) => (
              <Chip label={option} {...getTagProps({ index })} key={index} />
            ))}
            {moreCount > 0 && (
              <Chip label={`+${moreCount}`} /> // Display remaining count as a disabled chip
            )}
          </>
        );
      }}
      onChange={(event, newValue) => {
        if (prevLanguageRef.current !== language) selectedItems.locations = [];
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
  );
};

export default LocationAutocomplete;
