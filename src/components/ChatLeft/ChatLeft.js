import React, { useContext, useState } from "react";
import "./ChatLeft.css";
import { ChatifyContext } from "../../context/context";
import { Avatar, IconButton } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomColors from "../../constants/colors";
import { useNavigate } from "react-router-dom";

function ChatLeft(props) {
  const navigate = useNavigate();
  const { currentUser, signOut } = useContext(ChatifyContext);
  const [signoutLoading, setSignoutLoading] = useState(false);

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
          <IconButton sx={{ marginRight: "10px" }}>
            <NotificationsOutlinedIcon sx={{ color: CustomColors.blue }} />
          </IconButton>
          <IconButton sx={{ marginRight: "10px" }}>
            <MoreVertIcon sx={{ color: CustomColors.blue }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default ChatLeft;
