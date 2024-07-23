import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Drawer,
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
import MerchantsList from "./MerchantsList";
interface SidebarProps {
  handleSelectedTown: (_town: string[]) => void;
  handleSelectedProducts?: (_products: string[]) => void;
  handleIsHerocorp?: (_is_herocorp: boolean) => void;
  handleSelectedCategory?: (_category: string[]) => void;
  data: merchantsResponse[] | [];
  setOpenLocation: any;
}

const Sidebar: React.FC<SidebarProps> = ({
  handleSelectedTown,
  handleSelectedProducts,
  handleIsHerocorp,
  handleSelectedCategory,
  setOpenLocation,
  data,
}) => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [locationsData, setLocationsData] = useState<string[]>([]);
  const [productsData, setProductsData] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<string[]>([]);
  const map = useMap();

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
    setOpenDrawer(!openDrawer);
    setSubmitted(false);
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
      setSubmitted(false);
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
    (
      ev: google.maps.MapMouseEvent,
      index: number,
      paginatedData: merchantsResponse[],
    ) => {
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
    [map],
  );

  const handleSubmit = () => {
    handleSelectedTown(selectedItems.locations);
    handleSelectedProducts(selectedItems.products);
    handleIsHerocorp(selectedItems.has_cashback);
    handleSelectedCategory(selectedItems.categories);
    setOpenDrawer(false);
    setSubmitted(true);
  };

  console.log("openDrawer", openDrawer);

  if (isMobile) {
    return (
      <Box>
        <Box
          sx={{
            position: "absolute",
            bottom: !submitted
              ? "5%"
              : submitted && data.length < 2
                ? "25%"
                : "35%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
          }}
        >
          <CustomButton
            label={"Filters"}
            onClick={toggleDrawer}
            sx={{
              width: 250,
            }}
            icon={<FilterListIcon />}
          />

          {submitted && (
            <MerchantsList
              data={data}
              handleClick={handleClick}
              isMobile={isMobile}
              open={submitted}
            />
          )}
        </Box>

        <Drawer anchor={"left"} open={openDrawer} onClose={toggleDrawer}>
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
          {submitted && (
            <MerchantsList
              data={data}
              handleClick={handleClick}
              isMobile={isMobile}
            />
          )}
        </Box>
      </>
    );
  }
};

export default Sidebar;
