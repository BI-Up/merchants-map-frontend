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
    event: React.MouseEvent<HTMLLIElement>,
    index: number,
    paginatedData: merchantsResponse[],
  ) => void;
  isMobile: boolean;
  open?: boolean;
  language: "en" | "gr";
}

const MerchantsList: React.FC<MerchantsListProps> = ({
  data,
  handleClick,
  isMobile,
  open,
  language,
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
      {!isMobile && (
        <Paper elevation={3} sx={{ mt: 2, mb: 5, p: "1rem" }}>
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
                      {item[`mcc_category_${language}`]}
                    </Typography>
                    <Typography variant="h6">
                      {item[`brand_name_${language}`] ?? "Brand Name"}
                    </Typography>
                    <Typography variant="body2">
                      {item[`address_${language}`]},{item[`region_${language}`]}
                      ,{item.zip_code}
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

      {isMobile && openBottomDrawer && (
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
                        {item[`mcc_category_${language}`]}
                      </Typography>
                      <Typography variant="h6">
                        {item[`brand_name_${language}`] ?? "Brand Name"}
                      </Typography>
                      <Typography variant="body2">
                        {item[`address_${language}`]},
                        {item[`region_${language}`]},{item.zip_code}
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
      )}
    </>
  );
};

export default MerchantsList;
