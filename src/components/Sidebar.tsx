import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//import OmronLogo from "../images/omron-logo-Dashboard1.png";
import { motion, AnimatePresence } from "framer-motion";
import { Variants } from "framer-motion";
const PRIMARY = "rgba(0, 94, 184)";

const menuItems = [
  { text: "OMI Dashboard", path: "/Dashboard", icon: <DashboardOutlinedIcon /> },
  {
    text: "Configuration",
    icon: <SettingsOutlinedIcon />,
    children: [
      { text: "Users", path: "/accountsettings/user-option" },
      { text: "User Mapping", path: "/accountsettings/user-mapping" },
      { text: "Supplier Management", path: "/accountsettings/supplier" },
    ],
  },
];


const submenuVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
  exit: { height: 0, opacity: 0 },
};

const Sidebar = () => {
  const location = useLocation();
  const submenuVariants: Variants = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1], // ✅ Material-like easing
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };
  const [openConfig, setOpenConfig] = React.useState(
    location.pathname.startsWith("/accountsettings")
  );

  const isParentActive = (item: any) =>
    item.children?.some((child: any) =>
      location.pathname.startsWith(child.path)
    );

  return (
    <Box
      sx={{
        width: 270,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #005EB8, #004a94)",
        px: 2.5,
        pt: 2,
        pb: 3,
        display: "flex",
        flexDirection: "column",
        boxShadow: "6px 0 24px rgba(0,0,0,0.18)",
      }}
    >
      {/* Logo */}
      <Box textAlign="center" mb={2}>
        <Box
          component="img"
          src={"../images/PNG_Omron_Logo/white_logo_bluebg_rectangle.png"}
          alt="Omron"
          sx={{ height: 55, objectFit: "contain" }}
        />
      </Box>

      {/* Divider below logo */}
      <Divider
        sx={{
          mb: 3,
          borderColor: "rgba(255,255,255,0.25)",
          borderBottomWidth: "1px",
        }}
      />
      <List>
        {menuItems.map((item) => {
          const hasChildren = Boolean(item.children);

          const isActive = item.path === "/"
            ? location.pathname === "/"
            : location.pathname === item.path;
          return (
            <Box key={item.text} mb={1}>
              {/* Parent item */}
              <ListItemButton
                component={hasChildren ? motion.div : NavLink}
                to={!hasChildren ? item.path : undefined}
                onClick={hasChildren ? () => setOpenConfig(!openConfig) : undefined}
                sx={{
                  mb: 1.2,
                  borderRadius: "18px",
                  px: 2.8,
                  py: 1.9,
                  position: "relative",
                  background:
                    isActive || isParentActive(item)
                      ? "linear-gradient(90deg, #ffffff 0%, #eef5ff 100%)"
                      : "transparent",
                  color:
                    isActive || isParentActive(item)
                      ? PRIMARY
                      : "rgba(255,255,255,0.95)",

                  "&::before":
                    isActive || isParentActive(item)
                      ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        height: "60%",
                        width: 5,
                        borderRadius: 6,
                        background: PRIMARY,
                      }
                      : {},
                }}
              >

                <ListItemIcon
                  sx={{ color: isActive ? PRIMARY : "#fff", minWidth: 44 }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: 16, fontWeight: 700 }}
                />

                {hasChildren && (
                  <ExpandMoreIcon
                    sx={{
                      transform: openConfig ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "0.3s",
                    }}
                  />
                )}
              </ListItemButton>

              {/* Submenu */}
              {hasChildren && (
                <AnimatePresence>
                  {openConfig && (
                    <motion.div
                      variants={submenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <List sx={{ pl: 4, pt: 1 }}>
                        {item.children.map((child) => {
                          const childActive =
                            location.pathname === child.path;

                          return (
                            <motion.div
                              key={child.text}
                              whileHover={{ x: 6 }}
                            >
                              <ListItemButton
                                component={NavLink}
                                to={child.path}
                                sx={{
                                  borderRadius: "14px",
                                  mb: 0.6,
                                  py: 1.3,
                                  background: childActive
                                    ? "rgba(255,255,255,0.28)"
                                    : "transparent",
                                  color: "#fff",
                                }}
                              >
                                <ListItemText
                                  primary={child.text}
                                  primaryTypographyProps={{
                                    fontSize: 14.5,
                                    fontWeight: childActive ? 700 : 600,
                                  }}
                                />
                              </ListItemButton>
                            </motion.div>
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

      <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,.3)" }} />

      <Box mt="auto" textAlign="center" fontSize={12} color="rgba(255,255,255,.7)">
        v1.0.0
      </Box>
    </Box>
  );
};


export default Sidebar;
