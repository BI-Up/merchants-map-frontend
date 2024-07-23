import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InputField from "./InputField";
import CustomSwitcher from "./CustomSwitcher";
import CustomButton from "./CustomButton";
import { getFilters } from "../api";
import FilterListIcon from "@mui/icons-material/FilterList";
import { merchantsResponse } from "../type";
import { useMap } from "@vis.gl/react-google-maps";
interface SidebarProps {
  handleSelectedTown: (_town: string[]) => void;
  handleSelectedProducts?: (_products: string[]) => void;
  handleIsHerocorp?: (_is_herocorp: boolean) => void;
  handleSelectedCategory?: (_category: string[]) => void;
  data: merchantsResponse[] | [];
  openLocation: any;
  setOpenLocation: any;
}

const Sidebar: React.FC<SidebarProps> = ({
  handleSelectedTown,
  handleSelectedProducts,
  handleIsHerocorp,
  handleSelectedCategory,
  openLocation,
  setOpenLocation,
  data,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [locationsData, setLocationsData] = useState<string[]>([]);
  const [productsData, setProductsData] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<string[]>([]);
  const map = useMap();

  const [page, setPage] = React.useState(1);
  const itemsPerPage = 4; // Number of items per page

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  console.log("startIndex: " + startIndex, "endIndex", endIndex);

  const [selectedItems, setSelectedItems] = React.useState({
    locations: [] as string[],
    products: [] as string[],
    categories: [] as string[],
    has_cashback: false,
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, index: number) => {
      if (!map) return;
      const merchantData = paginatedData[index];
      if (!merchantData) return;
      const latLng = new google.maps.LatLng(
        Number(merchantData.latitude),
        Number(merchantData.longitude),
      );
      console.log("marker clicked: ", latLng.toString());
      map.panTo(latLng);

      setOpenLocation(index);
    },
    [map, paginatedData],
  );

  const handleSubmit = () => {
    handleSelectedTown(selectedItems.locations);
    handleSelectedProducts(selectedItems.products);
    handleIsHerocorp(selectedItems.has_cashback);
    handleSelectedCategory(selectedItems.categories);
    setOpen(false);
  };

  console.log("data", data);

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
          {data && (
            <Paper sx={{ mt: 2, p: "1rem" }}>
              <List>
                {paginatedData.map((item, index) => (
                  <>
                    <ListItem
                      //@ts-ignore
                      onClick={(ev: google.maps.MapMouseEvent) => {
                        handleClick(ev, index);
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#FEF9F1",
                          cursor: "pointer",
                        },
                        transition: "background-color 0.3s", // Smooth transition effect
                      }}
                    >
                      <ListItemText>
                        <Typography typography={"body2"}>
                          {item.mcc_category_en}
                        </Typography>
                        <Typography typography={"h6"}>
                          {item.brand_name_en ?? "Brand Name"}
                        </Typography>
                        <Typography typography={"body2"}>
                          {item.address_en},{item.region_en}, {item.zip_code}
                        </Typography>
                      </ListItemText>
                    </ListItem>
                    <Divider component={"li"} textAlign={"center"} />
                  </>
                ))}
              </List>
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  color="standard"
                  shape={"circular"}
                />
              </Box>
            </Paper>
          )}
        </Box>
      </>
    );
  }
};

export default Sidebar;
