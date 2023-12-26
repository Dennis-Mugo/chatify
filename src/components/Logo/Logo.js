import React from "react";
import "./Logo.css";
import { useNavigate } from "react-router-dom";

const Logo = ({ style }) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <div>
      <h3 onClick={handleLogoClick} style={{ ...style }} className="logo_text">
        Chatify
      </h3>
    </div>
  );
};

export default Logo;
