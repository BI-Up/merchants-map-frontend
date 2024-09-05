import * as React from "react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Alert,
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
import { checkCoordinates } from "../../helper";
import { FeatureCollection, Point } from "geojson";
import { colors } from "../../theme/colors";
interface SidebarProps {
  handleSelectedTowns: (_towns: string[]) => void;
  handleSelectedProducts?: (_products: string[]) => void;
  handleIsHerocorp?: (_is_herocorp: boolean) => void;
  handleSelectedCategories?: (_categories: string[]) => void;
  data: merchantsResponse[] | [];
  setInfoWindowData: Dispatch<SetStateAction<Object | number | null>>;
  language: "en" | "gr";
  languageHandler: Dispatch<SetStateAction<"en" | "gr">>;
  geojson: FeatureCollection<Point>;
}

const Sidebar: React.FC<SidebarProps> = ({
  handleSelectedTowns,
  handleSelectedProducts,
  handleIsHerocorp,
  handleSelectedCategories,
  setInfoWindowData,
  language,
  data,
  geojson,
}) => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [paginatedDataLength, setPaginatedDataLength] = useState(0);

  const [filterValues, setFilterValues] = useState({
    locations: [],
    products: [],
    categories: [],
  });
  const {
    locations: locationsData,
    products: productsData,
    categories: categoriesData,
  } = filterValues;

  const [selectedItems, setSelectedItems] = React.useState({
    locations: [] as string[],
    products: [] as string[],
    categories: [] as string[],
    has_cashback: false,
  });
  const [selectedListItem, setSelectedListItem] = useState(null);

  const theme = useTheme();

  const smallScreens = useMediaQuery(theme.breakpoints.down("md")); //900px
  const mediumScreens = useMediaQuery(theme.breakpoints.down("lg")); //1200px
  const largeScreens = useMediaQuery(theme.breakpoints.up("xl")); //1525px
  const map = useMap();

  const handlePaginatedDataChange = (length) => {
    setPaginatedDataLength(length);
  };

  const fetchFilters = useCallback(async () => {
    try {
      const [loc, prod, cat] = await Promise.all([
        getFilters("town", language),
        getFilters("accepted_products", language),
        getFilters("mcc_category", language),
      ]);
      setFilterValues({ locations: loc, products: prod, categories: cat });
    } catch (error) {
      console.error(error);
    }
  }, [language]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const toggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
    setSubmitted(false);
  }, []);

  const handleSelectChange = useCallback(
    (type: "locations" | "products" | "categories") =>
      (event: React.ChangeEvent<{ value: string[] }>) => {
        setSubmitted(false);
        const { value } = event.target;
        setSelectedItems((prevSelectedItems) => ({
          ...prevSelectedItems,
          [type]: value as string[],
        }));
      },
    [],
  );

  const handleSwitchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedItems((prevSelectedItems) => ({
        ...prevSelectedItems,
        has_cashback: event.target.checked,
      }));
    },
    [],
  );

  const handleClick = useCallback(
    (
      event: React.MouseEvent<HTMLElement>,
      index: number,
      paginatedData: merchantsResponse[],
    ) => {
      if (!map) return;
      const merchantData = paginatedData[index];
      if (!merchantData) return;

      const merchantLat = Number(merchantData.latitude);
      const merchantLng = Number(merchantData.longitude);

      const latLng = {
        lat: merchantLat,
        lng: merchantLng,
      };

      let matchingGeojson: any = null;

      if (geojson && Array.isArray(geojson.features)) {
        matchingGeojson = geojson.features.find((geojsonItem) =>
          checkCoordinates(geojsonItem, merchantLat, merchantLng),
        );
      } else if (
        geojson &&
        checkCoordinates(geojson, merchantLat, merchantLng)
      ) {
        matchingGeojson = geojson;
      }

      if (matchingGeojson && latLng) {
        setSelectedListItem({
          anchor: "",
          features: [matchingGeojson],
        });
        map.setZoom(17);
        map.setCenter(latLng);
      }
    },
    [map, geojson],
  );

  useEffect(() => {
    setInfoWindowData(selectedListItem);
  }, [selectedListItem, setInfoWindowData]);

  const handleSubmit = useCallback(() => {
    handleSelectedTowns(selectedItems.locations);
    handleSelectedProducts(selectedItems.products);
    handleIsHerocorp(selectedItems.has_cashback);
    handleSelectedCategories(selectedItems.categories);
    setOpenDrawer(false);
    setSubmitted(true);
  }, [
    selectedItems,
    handleSelectedTowns,
    handleSelectedProducts,
    handleIsHerocorp,
    handleSelectedCategories,
  ]);

  useEffect(() => {
    if (submitted && data.length > 0) {
      map.setCenter({
        lat: Number(data[0]?.latitude),
        lng: Number(data[0]?.longitude),
      });
    }
  }, [submitted, data, map]);

  const commonProps = {
    smallScreens,
    mediumScreens,
    largeScreens,
    locationsData,
    productsData,
    categoriesData,
    selectedItems,
    setSelectedItems,
    handleSelectChange,
    handleSwitchChange,
    handleSubmit,
    language,
  };

  if (smallScreens) {
    return (
      <Box>
        <Box>
          {!submitted && (
            <CustomButton
              label={language === "en" ? "Filters" : "Φιλτρα"}
              onClick={toggleDrawer}
              sx={{
                width: 250,
                backgroundColor: colors.grey4f,
                "&:hover": {
                  backgroundColor: colors.grey4f,
                },
                position: "absolute",
                bottom: "5%",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
              }}
              icon={<FilterListIcon />}
            />
          )}

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
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                "& .MuiPaper-root": {
                  backgroundColor: "transparent",
                  boxShadow: "unset",
                },
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                py={2}
              >
                <CustomButton
                  label={language === "en" ? "Filters" : "Φιλτρα"}
                  onClick={toggleDrawer}
                  sx={{
                    width: 250,
                    backgroundColor: colors.grey4f,
                    "&:hover": {
                      backgroundColor: colors.grey4f,
                    },
                    zIndex: 1000,
                  }}
                  icon={<FilterListIcon />}
                />
              </Box>
              {data.length > 0 ? (
                <MerchantsList
                  data={data}
                  handleClick={handleClick}
                  smallScreens={smallScreens}
                  language={language}
                  onPaginatedDataChange={handlePaginatedDataChange}
                  sx={{ backgroundColor: "white !important" }}
                />
              ) : (
                <Alert
                  severity={"warning"}
                  sx={{ backgroundColor: "white !important" }}
                >
                  {language === "en"
                    ? "No results found."
                    : "Δεν βρέθηκαν αποτελέσματα."}
                </Alert>
              )}
            </SwipeableDrawer>
          )}
        </Box>

        <Drawer
          anchor={"left"}
          open={openDrawer}
          onClose={toggleDrawer}
          sx={{
            "& .MuiPaper-root": {
              top: 84,
            },
          }}
        >
          <LeftMenu {...commonProps} />
        </Drawer>
      </Box>
    );
  } else {
    return (
      <LeftMenu {...commonProps}>
        {submitted && (
          <>
            {data?.length > 0 ? (
              <MerchantsList
                data={data}
                handleClick={handleClick}
                smallScreens={smallScreens}
                onPaginatedDataChange={handlePaginatedDataChange}
                language={language}
                sx={{
                  mt: 2,
                  mb: 5,
                  p: "1rem",
                }}
              />
            ) : (
              <Alert severity={"warning"} sx={{ mt: 2 }}>
                {language === "en"
                  ? "No results found."
                  : "Δεν βρέθηκαν αποτελέσματα."}
              </Alert>
            )}
          </>
        )}
      </LeftMenu>
    );
  }
};

export default Sidebar;
