import * as React from "react";
import { useEffect, useState } from "react";
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
import { getFilters } from "../api";
import FilterListIcon from "@mui/icons-material/FilterList";
interface SidebarProps {
  handleSelectedTown: (_town: string[]) => void;
  handleSelectedProducts?: (_products: string[]) => void;
  handleIsHerocorp?: (_is_herocorp: boolean) => void;
  handleSelectedCategory?: (_category: string[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  handleSelectedTown,
  handleSelectedProducts,
  handleIsHerocorp,
  handleSelectedCategory,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [locationsData, setLocationsData] = useState<string[]>([]);
  const [productsData, setProductsData] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<string[]>([]);

  const [selectedItems, setSelectedItems] = React.useState({
    locations: [] as string[],
    products: [] as string[],
    categories: [] as string[],
    has_cashback: false,
  });

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const hasLargeScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loc = await getFilters("town");
        setLocationsData(loc);
        const prod = await getFilters("accepted_products");
        setProductsData(prod);
        const cat = await getFilters("mcc_category");
        setCategoriesData(cat);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

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
    handleSelectedTown(selectedItems.locations);
    handleSelectedProducts(selectedItems.products);
    handleIsHerocorp(selectedItems.has_cashback);
    handleSelectedCategory(selectedItems.categories);
    setOpen(false);
  };

  if (isMobile) {
    return (
      <Box>
        <Box>
          <CustomButton
            label={"Filters"}
            onClick={toggleDrawer}
            sx={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              width: 250,
            }}
            icon={<FilterListIcon />}
          />
        </Box>

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
      </Box>
    );
  } else {
    return (
      <>
        <Box
          sx={{
            backgroundColor: "white",
            width: hasLargeScreen ? "40%" : "25%",
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          padding={"1rem"}
        >
          <InputField
            items={locationsData}
            selectedItems={selectedItems.locations ?? []}
            onChange={handleSelectChange("locations")}
            label={"Locations"}
          />
          <InputField
            items={productsData}
            selectedItems={selectedItems.products ?? []}
            onChange={handleSelectChange("products")}
            label={"Products"}
          />
          <InputField
            items={categoriesData}
            selectedItems={selectedItems.categories ?? []}
            onChange={handleSelectChange("categories")}
            label={"Categories"}
          />

          <Box display={"flex"} alignItems={"center"} gap={2} padding={"1rem"}>
            <Typography>Has Cashback officers?</Typography>
            <CustomSwitcher
              selectedItems={selectedItems.has_cashback ?? false}
              onChange={handleSwitchChange}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            padding={"1rem"}
            width={300}
          >
            <CustomButton
              label={"Search"}
              onClick={handleSubmit}
              sx={{ padding: 1.5 }}
            />
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
