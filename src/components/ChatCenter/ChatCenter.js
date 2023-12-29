import React, { useContext, useEffect, useState } from "react";
import "./ChatCenter.css";
import { ChatifyContext } from "../../context/context";
import ChatContent from "../ChatContent/ChatContent";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.config";
import {
  Avatar,
  Icon,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
} from "@mui/material";
import MoreMenu from "../MoreMenu/MoreMenu";
import ChatMoreMenu from "../MoreMenu/ChatMoreMenu";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CustomColors from "../../constants/colors";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import SendIcon from "@mui/icons-material/Send";
import AttachmentMenu from "../MoreMenu/AttachmentMenu";

function ChatCenter(props) {
  const { selectedFriend, setSelectedFriend } = useContext(ChatifyContext);
  const [chatStatus, setChatStatus] = useState("default");
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    if (selectedFriend) {
      fetchFriend();
    } else {
      setFriend(null);
      setSelectedFriend(null);
      setChatStatus("default");
    }
  }, [selectedFriend]);

  const fetchFriend = async () => {
    let friendRef = doc(db, `users/${selectedFriend.userId}`);
    const unsub = onSnapshot(friendRef, (user) => {
      setFriend({ ...user.data(), userId: user.id });
      setChatStatus("user_result");
    });
  };

  return (
    <div className="chat_center_wrapper" style={{ ...props.style }}>
      {chatStatus === "default" ? (
        <DefaultChat />
      ) : chatStatus === "user_result" ? (
        <>
          <ChatHeader realTimeFriend={friend} setChatStatus={setChatStatus} />
          <ChatContent />
          <ChatFooter />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

const DefaultChat = () => {
  return (
    <div>
      <h2>Default</h2>
    </div>
  );
};

const ChatHeader = ({ realTimeFriend, setChatStatus }) => {
  const { selectedFriend } = useContext(ChatifyContext);

  return (
    <div className="chat_header">
      <div className="chat_header_avatar">
        <Avatar src={selectedFriend?.photoUrl} alt={selectedFriend?.userName} />
      </div>
      <div className="chat_header_right">
        <div className="chat_header_right_left">
          <p className="chat_header_username">{selectedFriend?.userName}</p>
          <p className="chat_header_online">Online</p>
        </div>
        <div className="chat_header_right_right">
          {/* <Tooltip title="Search">
            <IconButton>
              <SearchSharpIcon sx={{ color: CustomColors.blue }} />
            </IconButton>
          </Tooltip> */}

          <ChatMoreMenu setChatStatus={setChatStatus} />
        </div>
      </div>
    </div>
  );
};

const ChatFooter = () => {
  // const actions = [
  //   { icon: <DescriptionIcon />, name: "Document" },
  //   { icon: <VideoLibraryIcon />, name: "Videos" },
  //   { icon: <PhotoLibraryIcon />, name: "Photos" },
  // ];

  return (
    <div className="chat_footer">
      <div className="chat_footer_shadow">
        <div className="chat_footer_dial">
          {/* <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{
              position: "relative",
              top: "-180px",
            }}
            FabProps={{
              size: "small",
              color: CustomColors.lightBlue,
            }}
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </SpeedDial> */}
          <AttachmentMenu />
        </div>
        <div className="chat_footer_input">
          <input placeholder="Type a message here..." />
        </div>
        <div className="chat_footer_right">
          <IconButton sx={{ marginRight: "10px" }}>
            <EmojiEmotionsOutlinedIcon />
          </IconButton>
          <IconButton sx={{ backgroundColor: CustomColors.lightBlue }}>
            <SendIcon sx={{ color: CustomColors.blue, fontSize: "26px" }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatCenter;
