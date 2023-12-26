import React from "react";
import "./Home.css";
import storySet from "../../assets/home_storyset.png";
import Logo from "../../components/Logo/Logo";
import { Button } from "@mui/material";
import CustomColors from "../../constants/colors";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/signup');
  };
  return (
    <>
      <HomeNav />
      <div className="home_container">
        <div className="home_left">
          <h2 className="home_title">Chat with Chatify</h2>
          <p className="home_subtitle">
            {" "}
            Connect, chat, and make new friends in this vibrant space. Feel free
            to express yourself, share your thoughts, and engage in exciting
            conversations.
          </p>
          <Button
            variant="contained"
            cap
            onClick={handleGetStarted}
            style={{
              backgroundColor: CustomColors.pink,
              borderRadius: "25px",
              margin: "40px 0",
              textTransform: "none",
              fontFamily: "Mooli",
              fontSize: "18px",
            }}
          >
            Get Started
          </Button>
        </div>
        <div className="home_right">
          <img className="home_image" width="60%" src={storySet} />
        </div>
      </div>
    </>
  );
};

const HomeNav = () => {
  const navigate = useNavigate();
  const navigateSignin = () => {};
  return (
    <div className="home_nav_container">
      <Logo />
      <Button
        onClick={navigateSignin}
        variant="contained"
        style={{
          backgroundColor: CustomColors.pink,
          borderRadius: "20px",
          textTransform: "none",
          fontFamily: "Mooli",
          fontSize: "16px"
        }}
      >
        Sign in
      </Button>
    </div>
  );
};

export default Home;
