import React, { useContext, useState } from "react";
import "./ChatLeft.css";
import { ChatifyContext } from "../../context/context";
import { Avatar, Button, IconButton } from "@mui/material";
import CustomColors from "../../constants/colors";
import { useNavigate } from "react-router-dom";
import MoreMenu from "../MoreMenu/MoreMenu";
import NotificationModal from "../NotificationModal/NotificationModal";
import SearchFriendsModal from "../SearchModal/SearchFriendsModal";
import ConnectionList from "../ConnectionList/ConnectionList";

function ChatLeft(props) {
  const navigate = useNavigate();
  const { currentUser } = useContext(ChatifyContext);

  const handleNavigate = (path) => {
    if (path == "/profile") {
      navigate("/profile", { state: { firstTime: false } });
      return;
    }
    navigate(path);
  };
  return (
    <div className="chat_left_wrapper" style={{ ...props.style }}>
      <div className="chat_left_header">
        <div className="chat_left_header_left">
          <IconButton
            onClick={() => {
              handleNavigate("/profile");
            }}
          >
            <Avatar
              src={currentUser?.photoUrl}
              alt={currentUser?.userName}
              sx={{ width: 46, height: 46 }}
            />
          </IconButton>
        </div>
        <div className="chat_left_header_right">
          <NotificationModal />
          <MoreMenu />
        </div>
      </div>
      <SearchFriendsModal anchor="chat_left" />
      <div
        style={{
          margin: "5px auto",
          width: "95%",
          borderBottom: `1px solid ${CustomColors.lightBlue}`,
        }}
      />
      <ConnectionList />
    </div>
  );
}

export default ChatLeft;
