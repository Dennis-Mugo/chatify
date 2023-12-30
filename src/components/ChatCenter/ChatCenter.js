import React, { useContext, useEffect, useRef, useState } from "react";
import "./ChatCenter.css";
import { ChatifyContext } from "../../context/context";
import ChatContent from "../ChatContent/ChatContent";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.config";
import {
  Avatar,
  Button,
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
import defaultImage from "../../assets/chat_default.png";
import LockIcon from "@mui/icons-material/Lock";
import SearchFriendsModal from "../SearchModal/SearchFriendsModal";

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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img src={defaultImage} width="50%" style={{ margin: "10vh 0 0" }} />
      <h2
        style={{
          padding: 0,
          margin: "0 0 1vh",
          fontFamily: "Mooli",
          color: CustomColors.grey,
        }}
      >
        Chat with Chatify
      </h2>
      <SearchFriendsModal anchor="chat_center" />

      <p
        style={{
          color: CustomColors.grey,

          padding: "0",
          fontSize: "14px",
          fontFamily: "Nunito",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LockIcon sx={{ color: CustomColors.grey, fontSize: "14px" }} />
        Your private messages are end-to-end encrypted
      </p>
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
  const { sendChat } = useContext(ChatifyContext);
  const [chat, setChat] = useState("");
  let submitRef = useRef();

  const handleChatChange = (e) => {
    let value = e.target.value;
    setChat(value);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setChat("");
    let finalValue = chat.trim();
    if (!finalValue.length) return;
    await sendChat(finalValue);
  };

  const handleSendClick = () => {
    submitRef.current.click();
  };

  return (
    <div className="chat_footer">
      <form className="chat_footer_shadow" onSubmit={handleSend}>
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
          <input
            value={chat}
            onChange={handleChatChange}
            placeholder="Type a message here..."
          />
        </div>
        <div className="chat_footer_right">
          <IconButton sx={{ marginRight: "10px" }}>
            <EmojiEmotionsOutlinedIcon />
          </IconButton>

          <IconButton
            sx={{ backgroundColor: CustomColors.lightBlue }}
            onClick={handleSendClick}
          >
            <SendIcon sx={{ color: CustomColors.blue, fontSize: "26px" }} />
          </IconButton>
          <input type="submit" hidden ref={submitRef} />
        </div>
      </form>
    </div>
  );
};

export default ChatCenter;
