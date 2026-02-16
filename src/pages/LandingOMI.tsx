import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Collapse,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useNavigate } from "react-router-dom";

const CARD_HEIGHT = 280;
const SIDEBAR_WIDTH = 260;

const SidebarItem = ({
  icon,
  label,
  active = false,
  onClick,
  isChild = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isChild?: boolean;
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      px: isChild ? 4 : 2,
      py: 1.2,
      mb: 0.8,
      borderRadius: 2,
      cursor: "pointer",
      backgroundColor: active ? "rgba(0,94,184,0.15)" : "transparent",
      color: active ? "#005eb8" : "#FFFFFF",
      fontWeight: active ? 600 : 500,
      borderLeft: active ? "3px solid #005eb8" : "3px solid transparent",
      transition: "all 0.2s ease",
      "& svg": {
        fontSize: 18,
        color: active ? "#005eb8" : "#CBD5E1",
      },
      "&:hover": {
        backgroundColor: "rgba(0,94,184,0.1)",
        color: "#005eb8",
        "& svg": { color: "#005eb8" },
      },
    }}
  >
    {icon}
    <Typography fontSize={14}>{label}</Typography>
  </Box>
);

const LandingOMI = () => {
  const navigate = useNavigate();
  const [configOpen, setConfigOpen] = useState(false); // collapsed by default
  const [activeMenu, setActiveMenu] = useState(""); // no active child initially

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#F1F3F8" }}>
      {/* ================= LEFT SIDEBAR ================= */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          backgroundColor: "#0F1A2B",
          display: "flex",
          flexDirection: "column",
          px: 3,
          py: 3,
          borderRight: "1px solid #1E2A40",
          boxShadow: "4px 0 12px rgba(0, 94, 184, 0.1)",
        }}
      >
        {/* Brand */}
        <Typography fontSize={18} fontWeight={700} mb={4} color="#FFFFFF">
          OMI Home
        </Typography>

        {/* Configuration Parent */}
        <Box>
          <Box
            onClick={() => setConfigOpen(!configOpen)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.2,
              mb: 0.8,
              borderRadius: 2,
              cursor: "pointer",
              backgroundColor: "transparent",
              color: "#FFFFFF",
              fontWeight: 600,
              "& svg": { color: "#005eb8", fontSize: 18 },
              "&:hover": {
                backgroundColor: "rgba(0,94,184,0.08)",
                color: "#005eb8",
                "& svg": { color: "#005eb8" },
              },
            }}
          >
            <SettingsIcon />
            <Typography fontSize={14}>Configuration</Typography>
            <Box sx={{ marginLeft: "auto" }}>
              {configOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Box>

          <Collapse in={configOpen} timeout="auto" unmountOnExit>
            <SidebarItem
              icon={<PeopleIcon />}
              label="Users"
              active={activeMenu === "Users"}
              onClick={() => {
                setActiveMenu("Users");
                navigate("/accountsettings/user-option");
              }}
              isChild
            />

            <SidebarItem
              icon={<SecurityIcon />}
              label="User Mapping"
              active={activeMenu === "User Mapping"}
              onClick={() => {
                setActiveMenu("User Mapping");
                navigate("/accountsettings/UserMapping");
              }}
              isChild
            />
          </Collapse>
        </Box>
      </Box>

      {/* ================= RIGHT CONTENT ================= */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 4,
          alignContent: "flex-start",
        }}
      >
        {/* Box 1: DocuBot */}
        <Paper
          elevation={6}
          sx={{
            height: CARD_HEIGHT,
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={1}>
            OMI AFD DocuBot
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            AI-powered document extraction & validation
          </Typography>
          <Button
            size="large"
            variant="contained"
            onClick={() => navigate("/Dashboard")}
            sx={{
              alignSelf: "center",
              px: 6,
              py: 1.6,
              borderRadius: 3,
              background: "#005eb8",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Launch
          </Button>
        </Paper>

        {/* Empty placeholders */}
        {[2, 3, 4].map((i) => (
          <Paper
            key={i}
            elevation={2}
            sx={{
              height: CARD_HEIGHT,
              borderRadius: 4,
              backgroundColor: "#F8FAFC",
              border: "1px dashed #CBD5E1",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LandingOMI;
