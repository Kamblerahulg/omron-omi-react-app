import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import OMI from "./pages/OMI";
import Login from "./pages/Login";
import UserOption from "./accountsettings/Useroption";
import UserMapping from "./accountsettings/UserMapping";
import Role from "./accountsettings/Role";
import Supplier from "./accountsettings/SupplierManagement";
import LandingOMI from "./pages/LandingOMI";

import theme from "./theme"; // 👈 your Shorai Sans theme

function App() {
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
