import * as React from "react";
import { useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import CustomButton from "./CustomButton";
import { Search, Close } from "@mui/icons-material";

interface InputFieldProps {
  items: string[];
  selectedItems: string[];
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
  label: string;
  language: "en" | "gr";
  hasSearch?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  items,
  selectedItems,
  onChange,
  label,
  language,
  hasSearch,
}) => {
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [finalQuery, setFinalQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    setFinalQuery(searchQuery);
  };
  const handleClearClick = () => {
    setSearchQuery("");
    setFinalQuery("");
  };

  const filteredItems = items.filter((item) =>
    item.toUpperCase().includes(finalQuery.toUpperCase()),
  );

  return (
    <Box p={1}>
      <FormControl>
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-label`}
          id={`simple-select-${label}`}
          value={selectedItems}
          label={label}
          multiple
          onChange={onChange}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (selected as string[]).join(", ")}
          sx={{ width: 300, borderRadius: "100px" }}
          MenuProps={{ autoFocus: false }}
        >
          {hasSearch && (
            <Box p={1}>
              <TextField
                autoFocus
                variant="outlined"
                fullWidth
                placeholder={language === "en" ? "Search..." : "Αναζήτηση..."}
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position={"end"}>
                      {finalQuery ? (
                        <IconButton onClick={handleClearClick}>
                          <Close />
                        </IconButton>
                      ) : (
                        <IconButton onClick={handleSearchClick}>
                          <Search />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{
                  marginBottom: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "100px",
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") {
                    e.stopPropagation();
                  }
                  if (e.key === "Enter") {
                    handleSearchClick();
                    e.preventDefault();
                  }
                }}
              />
            </Box>
          )}

          {(hasSearch && filteredItems ? filteredItems : items).map((item) => (
            <MenuItem key={item} value={item}>
              <Checkbox
                checked={selectedItems.indexOf(item) > -1}
                sx={{
                  color: "#F59100",
                  "&.Mui-checked": { color: "#F59100" },
                }}
              />
              <ListItemText primary={item} />
            </MenuItem>
          ))}

          <Box display="flex" justifyContent="center" p={2}>
            <CustomButton
              label={language === "en" ? "Select" : "Επιλογη"}
              onClick={() => setOpen(false)}
            />
          </Box>
        </Select>
      </FormControl>
    </Box>
  );
};

export default InputField;
