import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/Landing/LandingPage";
import AuthPage from "./Pages/Auth/AuthPage";
import { useEffect } from "react";
import { useGlobals } from "./Store/useGlobals";

const App = () => {
  const { setUser } = useGlobals();

  useEffect(() => {
    const currentUser = localStorage.getItem("chat-user");
    if (currentUser) setUser( JSON.parse(currentUser) );
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/signin" element={<AuthPage signIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;