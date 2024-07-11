// @ts-ignore
import React, { useState } from "react";
import {
  Box,
  Button,
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
}

const InputField: React.FC<InputFieldProps> = ({
  items,
  selectedItems,
  onChange,
  label,
  handleSubmit,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box p={2}>
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
        >
          {items.map((item) => (
            <MenuItem key={item} value={item}>
              <Checkbox
                checked={selectedItems.indexOf(item) > -1}
                sx={{ color: "#F59100", "&.Mui-checked": { color: "#F59100" } }}
              />
              <ListItemText primary={item} />
            </MenuItem>
          ))}

          <Box display="flex" justifyContent="center" p={2}>
            <CustomButton label={"Select"} onClick={() => setOpen(false)} />
          </Box>
        </Select>
      </FormControl>
    </Box>
  );
};

export default InputField;
