import { useState } from "react";
import * as React from "react";

import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Pagination,
  SxProps,
} from "@mui/material";
import { merchantsResponse } from "../type";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

interface MerchantsListProps {
  data: merchantsResponse[]; // Replace with the actual type of your data
  handleClick: (
    event: React.MouseEvent<HTMLLIElement>,
    index: number,
    paginatedData: merchantsResponse[],
  ) => void;
  isMobile: boolean;
  language: "en" | "gr";
  sx?: SxProps;
}

const MerchantsList: React.FC<MerchantsListProps> = ({
  data,
  handleClick,
  isMobile,
  language,
  sx,
  ...rest
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = !isMobile ? 4 : 2; // Number of items per page
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Paper elevation={3} sx={{ ...sx }} {...rest}>
        <List>
          {paginatedData.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                key={index}
                onClick={(ev) => {
                  handleClick(ev, index, paginatedData);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#FEF9F1",
                    cursor: "pointer",
                  },
                  transition: "background-color 0.3s",
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
                    {item[`address_${language}`]},{item[`region_${language}`]},
                    {item.zip_code}
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
    </>
  );
};

export default MerchantsList;
