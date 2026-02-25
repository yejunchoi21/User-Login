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
    // DATA means success, error means something went wrong
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // note: email and password come from the useState values (user input)
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup success! Check your email if confirmation is on.");
    clearFields();
  };
 
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
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