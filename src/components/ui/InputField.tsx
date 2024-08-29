import * as React from "react";
import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import CustomButton from "./CustomButton";

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
}) => {
  const [open, setOpen] = useState(false);
  // Filter and sort items
  const filteredItems = items.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
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
          multiple // @ts-ignore
          onChange={onChange}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => (selected as string[]).join(", ")}
          sx={{ width: 300, borderRadius: "100px" }}
          MenuProps={{ autoFocus: false }}
        >
          {(filteredItems ? filteredItems : items).map((item) => (
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
