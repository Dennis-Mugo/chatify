import React, { useContext, useEffect, useState } from "react";
import "./ChatCenter.css";
import { ChatifyContext } from "../../context/context";
import ChatContent from "../ChatContent/ChatContent";

function ChatCenter(props) {
  const { selectedFriend } = useContext(ChatifyContext);
  const [chatStatus, setChatStatus] = useState("default");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (selectedFriend) {
      fetchChats();
    }
  }, [selectedFriend]);

  const fetchChats = async () => {};

  return (
    <div className="chat_center_wrapper" style={{ ...props.style }}>
      {chatStatus === "default" ? (
        <DeafultChat />
      ) : chatStatus === "friend_chats" ? (
        <>
          <ChatHeader />
          <ChatContent chatStatus={chatStatus} />
          <ChatFooter setChats={setChats} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

const DeafultChat = () => {
  return <div></div>;
};

const ChatHeader = () => {
  return <div className="chat_header"></div>;
};

const ChatFooter = () => {
  return <div className="chat_footer"></div>;
};

export default ChatCenter;
