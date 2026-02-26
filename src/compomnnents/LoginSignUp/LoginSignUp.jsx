import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import "./LoginSignUp.css";

const LogIinSignUp = () => {
  //email is the current value setEmail is the updated change (refreshes)
  const [email, setEmail] = useState("");

  //whole point is to keep track of whats updating in the input box
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [userName, setUserName] = useState("");

  // clears the input boxes (because inputs are controlled by value={...})
  const clearFields = () => {
    setEmail("");
    setPassword("");
    setUserName("");
  };

  const handleSignup = async () => {
    // 1) actually create the auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    // 2) build a username (from input or email prefix)
    const username =
      userName?.trim() || data.user?.email?.split("@")[0] || "user";
  
    // 3) create/upsert profile row
    if (data.user) {
      const { data: profileData, error: upsertErr } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          username,
          avatar_url: null,
          followers_count: 0,
          following_count: 0,
        })
        .select();
  
      console.log("PROFILE UPSERT DATA:", profileData);
      console.log("PROFILE UPSERT ERROR:", upsertErr);
  
      if (upsertErr) {
        alert("Profile create failed: " + upsertErr.message);
        // don't return; signup still succeeded
      }
    }
  
    alert("Signup success! Now log in.");
    clearFields();
    setIsSignup(false);
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    // optional: ensure profile exists after login too
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
  
    if (user) {
      const username = userName?.trim() || user.email?.split("@")[0] || "user";
  
      const { error: upsertErr } = await supabase.from("profiles").upsert({
        id: user.id,
        username,
        avatar_url: null,
        followers_count: 0,
        following_count: 0,
      });
  
      console.log("LOGIN PROFILE UPSERT ERROR:", upsertErr);
    }
  
    alert("Login success!");
    clearFields();
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>

        {/* if it is signup mode, show username input */}
        {isSignup ? (
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        ) : null}

        {/* Email input (shows in both login and signup) */}
        <div className="form-group">
          <label>Email</label>
          <input
            //can provide warnings if @ isnt used
            type="email"
            placeholder="Enter your email"
            //displays whatever is stored in the input box (email state)
            value={email}
            //everytime the user types something, store it in var email
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="debug-text">Email state is: {email}</p>
        </div>

        {/* Password input (shows in both login and signup) */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Debug only: usually DON'T display password */}
          <p className="debug-text">Password length: {password.length}</p>
        </div>

        {/* Main button changes based on mode if tarue, print creaste accouabnt , else  print login */}
        <button
            className="login-btn"
            type="button"
            onClick={isSignup ? handleSignup : handleLogin}
            >
        {isSignup ? "Sign up" : "Login"}
        </button>

        {!isSignup && (
          <button
            className="secondary-btn"
            type="button"
            onClick={() => {
              clearFields(); // clears email/password when switching pages
              setIsSignup(true);
            }}
          >
            Sign Up
          </button>
        )}

        {/* NEW: Back to Login button (only shows in signup mode) */}
        {isSignup && (
          <button
            className="secondary-btn"
            type="button"
            onClick={() => {
              clearFields(); // clears username/email/password when switching pages
              setIsSignup(false);
            }}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default LogIinSignUp;