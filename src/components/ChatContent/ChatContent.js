import React, { useContext, useEffect, useRef, useState } from "react";
import "./ChatContent.css";
import { ChatifyContext } from "../../context/context";
import {
  and,
  collection,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Avatar, CircularProgress } from "@mui/material";
import { Time } from "../../constants/constants";

function ChatContent(props) {
  const { currentUser, selectedFriend } = useContext(ChatifyContext);
  const [chatContentStatus, setChatContentStatus] = useState("chats_loading");
  const [messageList, setMessageList] = useState([]);
  const [snapListener, setSnapListener] = useState();

  const dummyRef = useRef();

  useEffect(() => {
    let snapUnsubscribe;
    if (selectedFriend) {
      snapUnsubscribe = fetchChats();
    } else {
    }
    return snapUnsubscribe;
  }, [selectedFriend]);

  useEffect(() => {
    if (chatContentStatus === "friend_chats") {
      dummyRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedFriend, chatContentStatus, messageList]);

  const fetchChats = () => {
    setChatContentStatus("chats_loading");
    const chatQuerySender = and(
      where("senderId", "==", currentUser.userId),
      where("receiverId", "==", selectedFriend.userId)
    );
    const chatQueryReceiver = and(
      where("senderId", "==", selectedFriend.userId),
      where("receiverId", "==", currentUser.userId)
    );
    const chatQuery = query(
      collection(db, "chats"),
      or(chatQuerySender, chatQueryReceiver),
      orderBy("dateCreated")
    );
    const unsub = onSnapshot(chatQuery, (snapshot) => {
      let chatList = [];
      snapshot.forEach((chat) => {
        chatList.push({ messageId: chat.id, ...chat.data() });
        // console.log(chat.data().message);
      });
      setMessageList(chatList);
      if (chatList.length) {
        setChatContentStatus("friend_chats");
      } else {
        setChatContentStatus("friend_no_chats");
      }
    });
    return unsub;
  };

  return (
    <div className="chat_content_container">
      {chatContentStatus === "friend_chats" ? (
        <>
          {messageList.map((messageObj) => (
            <Message messageObj={messageObj} key={messageObj.messageId} />
          ))}
          <div ref={dummyRef}></div>
        </>
      ) : chatContentStatus === "chats_loading" ? (
        <div className="chat_content_loading_container">
          <div className="chat_content_loading_shadow">
            <CircularProgress disableShrink size={30} />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

const Message = ({ messageObj }) => {
  const { currentUser, selectedFriend } = useContext(ChatifyContext);
  let myMessage = messageObj.senderId === currentUser?.userId;

  return (
    <>
      {!myMessage ? (
        <div className="message_container_left">
          <div className="message_wrapper">
            <div className="chat_avatar">
              <Avatar
                src={selectedFriend?.photoUrl}
                sx={{ width: 35, height: 35 }}
              />
            </div>
            <div className="chat_bubble_left">
              <p className="chat_bubble_message">{messageObj?.message}</p>
              <p className="chat_bubble_timestamp">
                {Time.bubbleRelativeDate(messageObj?.dateCreated)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="message_container_right">
          <div className="message_wrapper">
            <div className="chat_bubble_right">
              <p className="chat_bubble_right_message">{messageObj?.message}</p>
              <p className="chat_bubble_right_timestamp">
                {Time.bubbleRelativeDate(messageObj?.dateCreated)}
              </p>
            </div>
            <div className="chat_avatar">
              <Avatar
                src={currentUser?.photoUrl}
                sx={{ width: 35, height: 35 }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatContent;
