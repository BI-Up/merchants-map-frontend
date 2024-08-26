import * as React from "react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Drawer,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomButton from "../ui/CustomButton";
import { getFilters } from "../../api/api";
import FilterListIcon from "@mui/icons-material/FilterList";
import { merchantsResponse } from "../../type";
import { useMap } from "@vis.gl/react-google-maps";
import MerchantsList from "../MerchantsList";
import LeftMenu from "../LeftMenu";
interface SidebarProps {
  handleSelectedTowns: (_towns: string[]) => void;
  handleSelectedProducts?: (_products: string[]) => void;
  handleIsHerocorp?: (_is_herocorp: boolean) => void;
  handleSelectedCategories?: (_categories: string[]) => void;
  data: merchantsResponse[] | [];
  setOpenLocation: Dispatch<SetStateAction<Object | number | null>>;
  language: "en" | "gr";
  languageHandler: Dispatch<SetStateAction<"en" | "gr">>;
}

const Sidebar: React.FC<SidebarProps> = ({
  handleSelectedTowns,
  handleSelectedProducts,
  handleIsHerocorp,
  handleSelectedCategories,
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
    (event: React.ChangeEvent<{ value: string[] }>) => {
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

      console.log("ev", ev);
      const latLng = new google.maps.LatLng(
        Number(merchantData.latitude),
        Number(merchantData.longitude),
      );
      map.panTo(latLng);
      map.setZoom(17);

      // smoothZoom(map, 18, setOpenLocation, index);
    },
    [map],
  );

  const handleSubmit = () => {
    handleSelectedTowns(selectedItems.locations);
    handleSelectedProducts(selectedItems.products);
    handleIsHerocorp(selectedItems.has_cashback);
    handleSelectedCategories(selectedItems.categories);
    setOpenDrawer(false);
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted && data.length > 0) {
      map.setCenter({
        lat: Number(data[0]?.latitude),
        lng: Number(data[0]?.longitude),
      });

      // map.setZoom(9);

      // smoothZoom(map, 18, setOpenLocation, {
      //   lat: Number(data[0]?.latitude),
      //   lng: Number(data[0]?.longitude),
      // });
    }
  }, [submitted, data, setOpenLocation, map]);

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
            <SwipeableDrawer
              anchor={"bottom"}
              open={submitted}
              onClose={() => setSubmitted(false)}
              onOpen={() => setSubmitted(true)}
              slotProps={{
                backdrop: {
                  invisible: true,
                },
              }}
            >
              <MerchantsList
                data={data}
                handleClick={handleClick}
                isMobile={isMobile}
                language={language}
                sx={{ py: "0.5rem" }}
              />
            </SwipeableDrawer>
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
            sx={{
              mt: 2,
              mb: 5,
              p: "1rem",
            }}
          />
        )}
      </LeftMenu>
    );
  }
};

export default Sidebar;
