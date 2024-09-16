import * as React from "react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";

interface LocationAutocompleteProps {
  locationsData: string[];
  selectedItems: { locations: string[] };
  setSelectedItems: Dispatch<
    SetStateAction<{
      locations: string[];
      products: string[];
      categories: string[];
      has_cashback: boolean;
    }>
  >;
  language: "en" | "gr";
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  locationsData,
  selectedItems,
  language,
  setSelectedItems,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const prevLanguageRef = useRef<string>(language);

  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      setSelectedItems((prevState) => ({ ...prevState, locations: [] })); // Clear selected items when language changes
    }
    prevLanguageRef.current = language;
  }, [language, setSelectedItems]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<{}>, newInputValue: string) => {
      setInputValue(newInputValue);
      setOpen(!!newInputValue); // Open only when there's input
    },
    [],
  );

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: string[]) => {
      setSelectedItems((prevState) => ({ ...prevState, locations: newValue }));
    },
    [setSelectedItems],
  );

  const handleOpen = useCallback(() => {
    if (inputValue) setOpen(true);
  }, [inputValue]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Autocomplete
      multiple
      limitTags={1}
      options={locationsData}
      open={open}
      loading={locationsData.length === 0}
      value={selectedItems.locations}
      inputValue={inputValue}
      filterOptions={(options, { inputValue }) =>
        options.filter((option) =>
          option.toLowerCase().startsWith(inputValue.toLowerCase()),
        )
      }
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={handleInputChange}
      onChange={handleChange}
      renderTags={(value, getTagProps) => {
        const displayedTags = value.slice(0, 1);
        const moreCount = value.length - displayedTags.length;

        return (
          <>
            {displayedTags.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} key={index} />
            ))}
            {moreCount > 0 && <Chip label={`+${moreCount}`} />}
          </>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={language === "en" ? "Locations" : "Τοποθεσίες"}
          variant="outlined"
          sx={{
            minWidth: 200,
            maxWidth: "100%",
            marginBottom: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "100px",
              overflowX: "auto",
              display: "flex",
              flexWrap: "nowrap",
              flexGrow: 1,
            },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {locationsData.length === 0 ? (
                  <CircularProgress sx={{ color: "#FF9018" }} size={24} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default LocationAutocomplete;
