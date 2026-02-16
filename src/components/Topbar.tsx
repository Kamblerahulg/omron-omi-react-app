import "./Topbar.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Topbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const userName = sessionStorage.getItem("userName") || "Admin";

  const logout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="topbar">
      <div className="brand"></div>

      <div className="user" ref={ref}>
        <button className="user-btn" onClick={() => setOpen(!open)}>
          <span className="avatar">{userName[0]}</span>
          <span className="name">{userName}</span>
        </button>

        {open && (
          <div className="menu">
            <button onClick={logout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
