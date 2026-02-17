import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { motion, AnimatePresence } from "framer-motion";
import { Variants } from "framer-motion";

const PRIMARY = "rgba(0, 94, 184)";

const menuItems = [
  { text: "OMI AFD DocuBot", path: "/Dashboard", icon: <DashboardOutlinedIcon sx={{ fontSize: 20 }} /> },
  {
    text: "Configuration",
    icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} />,
    children: [
      { text: "Users", path: "/accountsettings/user-option" },
      { text: "User Mapping", path: "/accountsettings/user-mapping" },
      { text: "Supplier Management", path: "/accountsettings/supplier" },
    ],
  },
];

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();

  const [openConfig, setOpenConfig] = React.useState(
    location.pathname.startsWith("/accountsettings")
  );

  const isParentActive = (item: any) =>
    item.children?.some((child: any) =>
      location.pathname.startsWith(child.path)
    );

  const submenuVariants: Variants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <Box
      sx={{
        width: collapsed ? 60 : 220,           // 🔹 reduced width
        transition: "width 0.3s ease",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #005EB8, #004a94)",
        px: collapsed ? 1 : 2,
        pt: 2,
        pb: 3,
        display: "flex",
        flexDirection: "column",
        boxShadow: "6px 0 24px rgba(0,0,0,0.18)",
        overflowX: "hidden",
      }}
    >
      {/* Toggle & Logo */}
      <Box
        sx={{
          display: "flex",
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          mb: 2,
          gap: collapsed ? 1 : 0,
        }}
      >
        <Box
          component="img"
          src={
            collapsed
              ? "../images/PNG_Omron_Logo/white_logo_bluebg_square.png"
              : "../images/PNG_Omron_Logo/white_logo_bluebg_rectangle.png"
          }
          alt="Omron"
          sx={{
            height: collapsed ? 32 : 36,      // 🔹 smaller logo
            width: collapsed ? 32 : "auto",
            transition: "all 0.3s ease",
            objectFit: "contain",
          }}
        />
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: "#fff",
            background: "rgba(255,255,255,0.15)",
            width: 28,                     // 🔹 smaller toggle
            height: 28,
            "&:hover": { background: "rgba(255,255,255,0.25)" },
            transition: "all 0.3s ease",
          }}
        >
          {collapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.25)" }} />

      <List>
        {menuItems.map((item) => {
          const hasChildren = Boolean(item.children);
          const isActive = location.pathname === item.path;
          const parentActive = isParentActive(item);

          return (
            <Box key={item.text} mb={0.5}>
              <Tooltip title={collapsed ? item.text : ""} placement="right" arrow>
                <ListItemButton
                  component={!hasChildren ? NavLink : "div"}
                  to={!hasChildren ? item.path : undefined}
                  onClick={hasChildren ? () => setOpenConfig(!openConfig) : undefined}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.5,
                    py: 0.8,                   // 🔹 smaller vertical padding
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1 : 2,
                    background: isActive || parentActive
                      ? "linear-gradient(90deg, #ffffff 0%, #eef5ff 100%)"
                      : "transparent",
                    color: isActive || parentActive ? PRIMARY : "rgba(255,255,255,0.95)",
                    fontSize: 12,               // 🔹 smaller font
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive || parentActive ? PRIMARY : "#fff",
                      minWidth: collapsed ? 0 : 36,  // 🔹 smaller icon space
                      fontSize: 18,                   // 🔹 smaller icon
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: 12,  // 🔹 smaller text
                        fontWeight: 500,
                      }}
                    />
                  )}

                  {hasChildren && !collapsed && (
                    <ExpandMoreIcon
                      sx={{
                        transform: openConfig ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "0.3s",
                        fontSize: 16,   // 🔹 smaller arrow
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>

              {/* Submenu */}
              {hasChildren && !collapsed && (
                <AnimatePresence>
                  {openConfig && (
                    <motion.div variants={submenuVariants} initial="hidden" animate="visible" exit="exit">
                      <List sx={{ pl: 3 }}>
                        {item.children.map((child) => {
                          const childActive = location.pathname === child.path;
                          return (
                            <ListItemButton
                              key={child.text}
                              component={NavLink}
                              to={child.path}
                              sx={{
                                borderRadius: "12px",
                                mb: 0.25,
                                py: 0.6,                 // 🔹 smaller submenu padding
                                background: childActive ? "rgba(255,255,255,0.28)" : "transparent",
                                color: "#fff",
                              }}
                            >
                              <ListItemText
                                primary={child.text}
                                primaryTypographyProps={{
                                  fontSize: 11,           // 🔹 smaller submenu text
                                  fontWeight: childActive ? 500 : 400,
                                }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </Box>
          );
        })}
      </List>

      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,.3)" }} />

      {!collapsed && (
        <Box mt="auto" textAlign="center" fontSize={10} color="rgba(255,255,255,.7)">
          v1.0.0
        </Box>
      )}
    </Box>

  );
};

export default Sidebar;
