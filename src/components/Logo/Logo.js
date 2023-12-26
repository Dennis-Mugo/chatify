import React, { useContext } from "react";
import "./Logo.css";
import { useNavigate } from "react-router-dom";
import { ChatifyContext } from "../../context/context";

const Logo = ({ style }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(ChatifyContext);
  const handleLogoClick = () => {
    if (currentUser) {
      navigate("/chat");
    } else {
      navigate("/");
    }
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
