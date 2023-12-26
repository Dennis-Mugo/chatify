import React, { useContext, useState } from "react";
import "./Chat.css";
import Logo from "../../components/Logo/Logo";
import { ChatifyContext } from "../../context/context";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatLeft from "../../components/ChatLeft/ChatLeft";
import ChatCenter from "../../components/ChatCenter/ChatCenter";
import ChatRight from "../../components/ChatRight/ChatRight";

function Chat(props) {
  const navigate = useNavigate();
  const { currentUser, signOut } = useContext(ChatifyContext);
  const [signoutLoading, setSignoutLoading] = useState(false);
  console.log(currentUser);

  const handleSignOut = async () => {
    setSignoutLoading(true);
    await signOut();
    navigate("/signin");
  };

  const handleNavigate = (path) => {
    if (path == "/profile") {
      navigate("/profile", { state: { firstTime: false } });
      return;
    }
    navigate(path);
  };

  return (
    <div className="chat_container">
        <div className="chat_left_container" style={{flex: "75"}}>
            <div className="chat_left_shadow">
                <ChatLeft style={{flex: "40"}} />
                <ChatCenter style={{flex: "60"}} />
            </div>
        </div>
      
      <ChatRight style={{flex: "25"}} />
    </div>
  );
}

export default Chat;
