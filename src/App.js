import logo from "./logo.svg";
import "./App.css";
import { useContext } from "react";
import { ChatifyContext } from "./context/context";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateAccount from "./pages/CreateAccount/CreateAccount";
import VerifyTel from "./pages/VerifyTel/VerifyTel";
import ProfileSetup from "./pages/ProfileSetup/ProfileSetup";
import StarterPage from "./pages/StarterPage/StarterPage";
import Chat from "./pages/Chat/Chat";
import Signin from "./pages/Signin/Signin";
import Starter from "./components/Starter/Starter";
import SigninVerify from "./pages/SigninVerify/SigninVerify";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify-phone" element={<VerifyTel />} />
        <Route path="/signin-verify-phone" element={<SigninVerify />} />
        <Route path="/profile" element={<RequireAuth Page={ProfileSetup} />} />
        <Route path="/chat" element={<RequireAuth Page={Chat} />} />

        <Route
          path="/admin-dashboard"
          element={<RequireAuthAdmin Page={AdminDashboard} />}
        />
      </Routes>
    </Router>
  );
}

const RequireAuth = ({ Page }) => {
  return (
    <>
      <Starter userType="user" Page={Page} />
    </>
  );
};

const RequireAuthAdmin = ({ Page }) => {
  return (
    <>
      <Starter userType="admin" Page={Page} />
    </>
  );
};

export default App;
