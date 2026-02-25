import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Home.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  // Get current user from Supabase
  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to login page or update state
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
                  <div className="profile-icon">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="profile-menu">
                    <p className="profile-email">{user.email}</p>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
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
    </div>
  );
};

export default Home;
