import { useEffect, useState } from "react";
import * as React from "react";

import {
  Drawer,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Pagination,
  SwipeableDrawer,
} from "@mui/material";
import { merchantsResponse } from "../type";

interface MerchantsListProps {
  data: merchantsResponse[]; // Replace with the actual type of your data
  handleClick: (
    event: google.maps.MapMouseEvent,
    index: number,
    paginatedData: merchantsResponse[],
  ) => void;
  isMobile: boolean;
  open?: boolean;
}

const MerchantsList: React.FC<MerchantsListProps> = ({
  data,
  handleClick,
  isMobile,
  open,
}) => {
  const [page, setPage] = useState(1);
  // const [openList, setOpenList] = useState(false);
  const itemsPerPage = !isMobile ? 4 : 2; // Number of items per page
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(open);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenBottomDrawer(newOpen);
  };

  return (
    <>
      {isMobile ? (
        <SwipeableDrawer
          anchor={"bottom"}
          open={openBottomDrawer}
          hideBackdrop={true}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <Paper sx={{ py: "0.5rem" }}>
            <List>
              {paginatedData.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    onClick={(ev) => {
                      handleClick(ev, index, paginatedData);
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
                      <Typography variant="body2">
                        {item.mcc_category_en}
                      </Typography>
                      <Typography variant="h6">
                        {item.brand_name_en ?? "Brand Name"}
                      </Typography>
                      <Typography variant="body2">
                        {item.address_en},{item.region_en}, {item.zip_code}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                  <Divider component={"li"} textAlign={"center"} />
                </React.Fragment>
              ))}
            </List>

            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="standard"
                shape="circular"
              />
            </Box>
          </Paper>
        </SwipeableDrawer>
      ) : (
        <Paper sx={{ mt: 2, p: "1rem" }}>
          <List>
            {paginatedData.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  onClick={(ev) => {
                    handleClick(ev, index, paginatedData);
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
                    <Typography variant="body2">
                      {item.mcc_category_en}
                    </Typography>
                    <Typography variant="h6">
                      {item.brand_name_en ?? "Brand Name"}
                    </Typography>
                    <Typography variant="body2">
                      {item.address_en},{item.region_en}, {item.zip_code}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <Divider component={"li"} textAlign={"center"} />
              </React.Fragment>
            ))}
          </List>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handlePageChange}
              color="standard"
              shape="circular"
            />
          </Box>
        </Paper>
      )}
    </>
  );
};

export default MerchantsList;
