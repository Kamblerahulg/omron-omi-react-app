import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Box } from "@mui/material";
import { useState } from "react";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false); // 🔥 ADD THIS

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#F6F7FB",
      }}
    >
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <Topbar />
        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;