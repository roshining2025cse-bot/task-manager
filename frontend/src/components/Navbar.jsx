import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error reading user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // Get first letter of user's name
  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/dashboard">
          Task Manager
        </Link>
      </div>

      {/* Right side */}
      <div className="navbar-right">

        {/* Dashboard */}
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>

        {/* User Profile */}
        {user && (
          <div className="profile-section">

            {/* User name FIRST */}
            <span className="profile-name">
              {user.name}
            </span>

            {/* Profile image AFTER name */}
            <div className="profile-image">
              {firstLetter}
            </div>

          </div>
        )}

        {/* Logout */}
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;