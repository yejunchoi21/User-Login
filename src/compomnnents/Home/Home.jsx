import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

import "./Home.css";
import {RiHome5Line,RiSearchLine, RiAddBoxLine,
  RiHeart3Line, RiUserLine,
} from "react-icons/ri";  

const Home = ({ onOpenProfile }) => {  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  // NEW: controls whether the logout menu is visible
  const [menuOpen, setMenuOpen] = useState(false);

  // Get current user from Supabase
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="home-container">
      {/* Header with Profile */}
      <header className="home-header">
        <div className="header-content">
          <h1 className="logo">Your App</h1>

          <div className="header-right">
            <div className="search-container">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  🔍
                </button>
              </form>
            </div>

            <div className="profile-section">
              {user ? (
                <div className="profile-dropdown">
                  {/* CHANGED: make this clickable */}
                  <button
                    type="button"
                    className="profile-icon"
                    onClick={() => setMenuOpen((prev) => !prev)}
                  >
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </button>

                  {/* CHANGED: only show menu if menuOpen is true */}
                  {menuOpen && (
                    <div className="profile-menu">
                      <p className="profile-email">{user.email}</p>
                      <button onClick={handleLogout} className="logout-btn">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="profile-icon">U</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="home-main">
        <div className="content-area">
          <h2>Welcome to Home Page!</h2>
          <p>Your content goes here...</p>
        </div>
      </main>

      <nav className="bottom-nav">
  <button className="nav-btn" type="button" aria-label="Home">
    <RiHome5Line className="nav-icon" />
  </button>

  <button className="nav-btn" type="button" aria-label="Search">
    <RiSearchLine className="nav-icon" />
  </button>

  <button className="nav-btn" type="button" aria-label="Create">
    <RiAddBoxLine className="nav-icon" />
  </button>

  <button className="nav-btn" type="button" aria-label="Activity">
    <RiHeart3Line className="nav-icon" />
  </button>

  {/* Only ONE profile button, this one navigates to Profile */}
  <button
    className="nav-btn"
    type="button"
    aria-label="Profile"
    onClick={onOpenProfile}
  >
    <RiUserLine className="nav-icon" />
  </button>
</nav>
    </div>
  );
};

export default Home;