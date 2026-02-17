import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useEffect } from "react";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import OMI from "./pages/OMI";
import Login from "./pages/Login";
import UserOption from "./accountsettings/Useroption";
import UserMapping from "./accountsettings/UserMapping";
import Role from "./accountsettings/Role";
import Supplier from "./accountsettings/SupplierManagement";
import LandingOMI from "./pages/LandingOMI";

import theme from "./theme";

// 🔥 AUTH TOKEN API
const AUTH_URL =
  "https://mzx9xifx1h.execute-api.ap-southeast-1.amazonaws.com/dev/auth/token";

function App() {

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const expiry = localStorage.getItem("token_expiry");

        // If no token OR expired → fetch new
        if (!expiry || Date.now() > Number(expiry)) {

          const response = await fetch(AUTH_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              client_id: "myclientid",
              client_secret: "mysecret",
            }),
          });

          if (!response.ok) {
            throw new Error("Token fetch failed");
          }

          const data = await response.json();

          // Save token
          localStorage.setItem("access_token", data.access_token);

          // Save expiry (1 hour)
          localStorage.setItem(
            "token_expiry",
            (Date.now() + 60 * 60 * 1000).toString()
          );

          console.log("Auth token initialized");
        }

      } catch (error) {
        console.error("Auth error:", error);
      }
    };

    fetchToken();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          {/* ===== No Layout ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingOMI />} />

          {/* ===== With Sidebar Layout ===== */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/omi" element={<OMI />} />
            <Route path="accountsettings/user-option" element={<UserOption />} />
            <Route path="accountsettings/user-mapping" element={<UserMapping />} />
            <Route path="accountsettings/role" element={<Role />} />
            <Route path="accountsettings/supplier" element={<Supplier />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
