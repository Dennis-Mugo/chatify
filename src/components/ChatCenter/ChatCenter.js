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
  Dialog,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MoreMenu from "../MoreMenu/MoreMenu";
import ChatMoreMenu from "../MoreMenu/ChatMoreMenu";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CustomColors from "../../constants/colors";
import SendIcon from "@mui/icons-material/Send";
import AttachmentMenu from "../MoreMenu/AttachmentMenu";
import defaultImage from "../../assets/chat_default.png";
import LockIcon from "@mui/icons-material/Lock";
import SearchFriendsModal from "../SearchModal/SearchFriendsModal";
import ChatHeader from "./ChatHeader";
import Emoticons from "./Emoticons";

function ChatCenter(props) {
  const { selectedFriend, setSelectedFriend } = useContext(ChatifyContext);
  const [chatStatus, setChatStatus] = useState("default");
  const [friend, setFriend] = useState(null);

  useEffect(() => {
    if (selectedFriend) {
      let friendRef = doc(db, `users/${selectedFriend.userId}`);
      let unsub = onSnapshot(friendRef, (snapshot) => {
        // console.log(snapshot.data()?.onlineStatus);
        setFriend(snapshot.data());
      });
      setChatStatus("user_result");
      return unsub;
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
          <ChatHeader
            realTimeFriend={friend}
            setChatStatus={setChatStatus}
            showMenu={true}
          />
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
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // border: "1px solid black",
        height: "90vh",
        borderRadius: "0 20px 20px 0",
        overflowY: "scroll",
      }}
    >
      <img src={defaultImage} width="40%" style={{ margin: "10vh 0 0" }} />
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

const ChatFooter = () => {
  // const actions = [
  //   { icon: <DescriptionIcon />, name: "Document" },
  //   { icon: <VideoLibraryIcon />, name: "Videos" },
  //   { icon: <PhotoLibraryIcon />, name: "Photos" },
  // ];
  const { sendChat, selectedFriend, currentUser } = useContext(ChatifyContext);
  const [chat, setChat] = useState("");
  const [blockedDialog, setBlockedDialog] = useState(false);
  const [blocked, setBlocked] = useState(selectedFriend?.blocked);

  useEffect(() => {
    setBlocked(selectedFriend?.blocked);
  }, [selectedFriend]);

  let submitRef = useRef();

  const handleChatChange = (e) => {
    let value;
    if (e?.target) {
      value = e.target.value;
    } else {
      value = chat + e;
    }
    setChat(value);
  };

  const handleBlockedDialogOpen = () => setBlockedDialog(true);
  const handleBlockedDialogClose = () => setBlockedDialog(false);

  const checkBlocked = () => {
    if (blocked) {
      handleBlockedDialogOpen();
      return true;
    }
    return false;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    let finalValue = chat.trim();
    let isBlocked = checkBlocked();
    if (isBlocked) return;
    setChat("");
    if (!finalValue.length) return;
    await sendChat(finalValue);
  };

  const handleSendClick = () => {
    submitRef.current.click();
  };

  return (
    <>
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
            <Emoticons handleChange={handleChatChange} />

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
      <Dialog open={blockedDialog} onClose={handleBlockedDialogClose}>
        <DialogTitle>Could not send message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {blocked === currentUser.userId
              ? `You have blocked ${selectedFriend?.userName}. You need to unblock ${selectedFriend?.userName} in order to send messages.`
              : `${selectedFriend?.userName} has blocked you. ${selectedFriend?.userName} has to unblock you in order to send message.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBlockedDialogClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatCenter;
