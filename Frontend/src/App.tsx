import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/Landing/LandingPage";
import { useEffect } from "react";
import { useGlobals } from "./Store/useGlobals";
import SignUp from "./Pages/Auth/SignUp";
import SignIn from "./Pages/Auth/SignIn";
import Verification from "./Pages/Auth/Verification";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";

const App = () => {
  const { setUser } = useGlobals();

  useEffect(() => {
    const currentUser = localStorage.getItem("user");
    if (currentUser) setUser(JSON.parse(currentUser));
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="auth">
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify">
            <Route index element={<Verification />} />
            <Route path="sign-up" element={<Verification signUp />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
