import * as React from "react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import CustomButton from "./CustomButton";
import { getFilters } from "../api";
import FilterListIcon from "@mui/icons-material/FilterList";
import { merchantsResponse } from "../type";
import { useMap } from "@vis.gl/react-google-maps";
import MerchantsList from "./MerchantsList";
import LeftMenu from "./LeftMenu";
interface SidebarProps {
  handleSelectedTown: (_town: string[]) => void;
  handleSelectedProducts?: (_products: string[]) => void;
  handleIsHerocorp?: (_is_herocorp: boolean) => void;
  handleSelectedCategory?: (_category: string[]) => void;
  data: merchantsResponse[] | [];
  setOpenLocation: any;
  language: "en" | "gr";
  languageHandler: Dispatch<SetStateAction<"en" | "gr">>;
}

const Sidebar: React.FC<SidebarProps> = ({
  handleSelectedTown,
  handleSelectedProducts,
  handleIsHerocorp,
  handleSelectedCategory,
  setOpenLocation,
  language,
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
  const hasLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  console.log("isMobile", isMobile);
  console.log("hasLargeScreen", hasLargeScreen);
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
    setSubmitted(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loc = await getFilters("town", language);
        setLocationsData(loc);
        const prod = await getFilters("accepted_products", language);
        setProductsData(prod);
        const cat = await getFilters("mcc_category", language);
        setCategoriesData(cat);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [language]);

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
      ev: React.MouseEvent<HTMLLIElement>,
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

  useEffect(() => {
    if (submitted && data.length > 0) {
      map.panTo({
        lat: Number(data[0]?.latitude),
        lng: Number(data[0]?.longitude),
      });
      map.setZoom(18);
    }
  }, [submitted, data, map]);

  if (isMobile) {
    return (
      <Box>
        <Box>
          <CustomButton
            label={language === "en" ? "Filters" : "Φιλτρα"}
            onClick={toggleDrawer}
            sx={{
              width: 250,
              backgroundColor: "#4F5D5B",
              "&:hover": {
                backgroundColor: "#4F5D5B",
              },
              position: "absolute",
              bottom: !submitted
                ? "5%"
                : submitted && data.length < 2
                  ? "30%"
                  : "40%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
            }}
            icon={<FilterListIcon />}
          />

          {submitted && (
            <MerchantsList
              data={data}
              handleClick={handleClick}
              isMobile={isMobile}
              open={submitted}
              setOpen={setSubmitted}
              language={language}
            />
          )}
        </Box>

        <Drawer anchor={"left"} open={openDrawer} onClose={toggleDrawer}>
          <LeftMenu
            isMobile={isMobile}
            hasLargeScreen={hasLargeScreen}
            locationsData={locationsData}
            productsData={productsData}
            categoriesData={categoriesData}
            selectedItems={selectedItems}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
            handleSubmit={handleSubmit}
            language={language}
          />
        </Drawer>
      </Box>
    );
  } else {
    return (
      <LeftMenu
        isMobile={isMobile}
        hasLargeScreen={hasLargeScreen}
        locationsData={locationsData}
        productsData={productsData}
        categoriesData={categoriesData}
        selectedItems={selectedItems}
        handleSelectChange={handleSelectChange}
        handleSwitchChange={handleSwitchChange}
        handleSubmit={handleSubmit}
        language={language}
      >
        {submitted && (
          <MerchantsList
            data={data}
            handleClick={handleClick}
            isMobile={isMobile}
            language={language}
          />
        )}
      </LeftMenu>
    );
  }
};

export default Sidebar;
