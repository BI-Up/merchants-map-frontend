import * as React from "react";
import { useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InputField from "./InputField";
import CustomSwitcher from "./CustomSwitcher";
import CustomButton from "./CustomButton";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
interface SidebarProps {
  data: {
    locations: string[];
    products: string[];
    categories: string[];
  };
}

const Sidebar: React.FC<SidebarProps> = ({ data }) => {
  const { locationsData, productsData, categoriesData } = data;
  const [open, setOpen] = useState<boolean>(false);

  const [selectedItems, setSelectedItems] = React.useState({
    locations: [] as string[],
    products: [] as string[],
    categories: [] as string[],
    has_cashback: false,
  });

  const [formData, setFormData] = React.useState({
    locations: [] as string[],
    products: [] as string[],
    categories: [] as string[],
    has_cashback: false,
  });

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const hasLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  console.log("lg", hasLargeScreen);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSelectChange =
    (type: "locations" | "products" | "categories") =>
    (event: React.ChangeEvent<{ value: unknown }>) => {
      const { value } = event.target;
      setSelectedItems((prevSelectedItems) => ({
        ...prevSelectedItems,
        [type]: value as string[],
      }));
    };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      has_cashback: checked,
    }));
  };

  const handleSubmit = () => {
    setFormData(selectedItems);
  };

  if (isMobile) {
    return (
      <>
        <IconButton onClick={toggleDrawer} color={"inherit"}>
          <MenuIcon />
        </IconButton>
        <Drawer anchor={"left"} open={open} onClose={toggleDrawer}>
          <Box
            sx={{
              backgroundColor: "white",
              width: "95%",
              color: "black",
              pt: 4,
            }}
          >
            <InputField
              items={locationsData}
              selectedItems={selectedItems.locations}
              onChange={handleSelectChange("locations")}
              label={"Locations"}
            />
            <InputField
              items={productsData}
              selectedItems={selectedItems.products}
              onChange={handleSelectChange("products")}
              label={"Products"}
            />
            <InputField
              items={categoriesData}
              selectedItems={selectedItems.categories}
              onChange={handleSelectChange("categories")}
              label={"Categories"}
            />

            <Box
              display={"flex"}
              alignItems={"center"}
              gap={2}
              padding={"1rem"}
            >
              <Typography>Has Cashback officers?</Typography>
              <CustomSwitcher
                selectedItems={selectedItems.has_cashback}
                onChange={handleSwitchChange}
              />
            </Box>
            <Box display="flex" justifyContent="center" padding={"1rem"}>
              <CustomButton label={"Search"} onClick={handleSubmit} />
            </Box>
          </Box>
        </Drawer>
      </>
    );
  } else {
    return (
      <>
        <Box
          sx={{
            backgroundColor: "white",
            width: hasLargeScreen ? "40%" : "25%",
            color: "black",
          }}
          padding={"1rem"}
        >
          <InputField
            items={locationsData}
            selectedItems={selectedItems.locations}
            onChange={handleSelectChange("locations")}
            label={"Locations"}
          />
          <InputField
            items={productsData}
            selectedItems={selectedItems.products}
            onChange={handleSelectChange("products")}
            label={"Products"}
          />
          <InputField
            items={categoriesData}
            selectedItems={selectedItems.categories}
            onChange={handleSelectChange("categories")}
            label={"Categories"}
          />

          <Box display={"flex"} alignItems={"center"} gap={2} padding={"1rem"}>
            <Typography>Has Cashback officers?</Typography>
            <CustomSwitcher
              selectedItems={selectedItems.has_cashback}
              onChange={handleSwitchChange}
            />
          </Box>
          <Box display="flex" justifyContent="center" padding={"1rem"}>
            <CustomButton label={"Search"} onClick={handleSubmit} />
          </Box>
          {/*<Paper sx={{ mt: 2, p: "1rem" }}>*/}
          {/*  <List>*/}
          {/*    <ListItem>*/}
          {/*      <ListItemText*/}
          {/*        sx={{*/}
          {/*          display: "flex",*/}
          {/*          flexDirection: "column",*/}
          {/*          alignItems: "center",*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <Typography typography={"body2"}>Supermarket</Typography>*/}
          {/*        <Typography typography={"h6"}>Brand Name</Typography>*/}
          {/*        <Typography typography={"body2"}>*/}
          {/*          Dragatsaniou 6, Athens*/}
          {/*        </Typography>*/}
          {/*      </ListItemText>*/}
          {/*    </ListItem>*/}
          {/*    <Divider component={"li"} textAlign={"center"} />*/}

          {/*    <ListItem>*/}
          {/*      <ListItemText*/}
          {/*        sx={{*/}
          {/*          display: "flex",*/}
          {/*          flexDirection: "column",*/}
          {/*          alignItems: "center",*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <Typography typography={"body2"}>Supermarket</Typography>*/}
          {/*        <Typography typography={"h6"}>Brand Name</Typography>*/}
          {/*        <Typography typography={"body2"}>*/}
          {/*          Dragatsaniou 6, Athens*/}
          {/*        </Typography>*/}
          {/*      </ListItemText>*/}
          {/*    </ListItem>*/}

          {/*    <Divider component={"li"} textAlign={"center"} />*/}

          {/*    <ListItem>*/}
          {/*      <ListItemText*/}
          {/*        sx={{*/}
          {/*          display: "flex",*/}
          {/*          flexDirection: "column",*/}
          {/*          alignItems: "center",*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <Typography typography={"body2"}>Supermarket</Typography>*/}
          {/*        <Typography typography={"h6"}>Brand Name</Typography>*/}
          {/*        <Typography typography={"body2"}>*/}
          {/*          Dragatsaniou 6, Athens*/}
          {/*        </Typography>*/}
          {/*      </ListItemText>*/}
          {/*    </ListItem>*/}
          {/*  </List>*/}
          {/*</Paper>*/}
        </Box>
      </>
    );
  }
};

export default Sidebar;
