import React, { useContext, useEffect } from "react";
import "./ChatContent.css";
import { ChatifyContext } from "../../context/context";

function ChatContent(props) {
  const { selectedFriend } = useContext(ChatifyContext);

  useEffect(() => {
    if (selectedFriend) {
      fetchChats();
    } else {
    }
  }, [selectedFriend]);

  const fetchChats = () => {};

  return <div className="chat_content_container"></div>;
}

export default ChatContent;
