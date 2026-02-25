import "./Topbar.css";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const Topbar = () => {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("userName") || "Admin";

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="brand"></div>

      <div className="user">
        <span className="avatar">{userName[0]}</span>
        <span className="name">{userName}</span>

        {/* Logout Icon */}
        <button className="logout-btn" onClick={logout}>
          <LogoutIcon fontSize="small" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;