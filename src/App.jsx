import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import LoginSignUp from "./compomnnents/LoginSignUp/LoginSignUp";
import Home from "./compomnnents/Home/Home";
import Profile from "./compomnnents/Profile/Profile"; // <-- make sure path matches your folder

function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("home"); // "home" or "profile"

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setPage("home"); // reset page on login/logout
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <LoginSignUp />;

  if (page === "profile") {
    return <Profile onGoHome={() => setPage("home")} />;
  }

  return <Home onOpenProfile={() => setPage("profile")} />;
}

export default App;