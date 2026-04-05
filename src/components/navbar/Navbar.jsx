import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const [time, setTime] = useState(new Date());
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ Theme toggle
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Add Transaction", path: "/add-transaction" },
    { name: "Transactions", path: "/transactions" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-logo">Finance Dashboard</div>

        {/* Menu */}
        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)} // close menu on click
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar-right">

          <div className="time">
            {time.toLocaleTimeString()}
          </div>

          <button onClick={toggleTheme} className="theme-btn">
            {isDark ? "🌞" : "🌙"}
          </button>

          {/* Hamburger */}
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