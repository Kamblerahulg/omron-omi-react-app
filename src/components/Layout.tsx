import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          background: "#f5f6f8",
          transition: "all 0.3s ease",
        }}
      >
        <Topbar />

        <div
          style={{
            flex: 1,
            padding: "0 5px 30px 10px", // remove top padding only
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
