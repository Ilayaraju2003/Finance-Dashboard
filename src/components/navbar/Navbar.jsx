import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ role, setRole }) => {
  const location = useLocation();

  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [menuOpen, setMenuOpen] = useState(false);



  //  Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  //  Theme toggle
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  //  Role-based nav items
  const navItems = [
    { name: "Dashboard", path: "/", roles: ["admin", "viewer"] },
    { name: "Add Transaction", path: "/add-transaction", roles: ["admin"] },
    { name: "Transactions", path: "/transactions", roles: ["admin", "viewer"] },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(role)
  );



  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-logo">Finance Dashboard</div>

        {/* Menu */}
        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`nav-link ${location.pathname === item.path ? "active" : ""
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar-right">

          {/* ⏰ Time */}
          <div className="time">
            {time.toLocaleTimeString()}
          </div>

          {/* 🌙 Theme */}
          <button onClick={toggleTheme} className="theme-btn">
            {isDark ? "🌞" : "🌙"}
          </button>

          {/* 🔽 Role Dropdown */}
          <select
            className="role-dropdown"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>

          </select>

          {/* ☰ Hamburger */}
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;