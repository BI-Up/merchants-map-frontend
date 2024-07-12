import React, { useState } from "react";
import { Drawer } from "@mui/material";

const MobileMenu = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = (openState: boolean) => () => {
    setOpen(openState);
  };

  return (
    <Drawer open={open} onClose={toggleDrawer(false)}>
      {children}
    </Drawer>
  );
};

export default MobileMenu;
