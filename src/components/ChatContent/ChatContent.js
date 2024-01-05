import React, { useContext, useEffect, useRef, useState } from "react";
import "./ChatContent.css";
import { ChatifyContext } from "../../context/context";
import {
  and,
  collection,
  doc,
  onSnapshot,
  or,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Avatar, CircularProgress, IconButton } from "@mui/material";
import { Time, getFileSize } from "../../constants/constants";
import { Link } from "react-router-dom";
import CustomColors from "../../constants/colors";
import FileCard from "../FileCard/FileCard";
import { PiChecks, PiChecksBold } from "react-icons/pi";
import { DoneAllRounded, DoneRounded } from "@mui/icons-material";

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
      dummyRef.current
        ?.scrollIntoView
        // { behavior: "smooth" }
        ();
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
  const { currentUser, selectedFriend, fetchConnections, clipWords } =
    useContext(ChatifyContext);
  let myMessage = messageObj.senderId === currentUser?.userId;
  //text, image, video, doc
  const [messageType, setMessageType] = useState(
    messageObj?.attachmentType || "text"
  );

  useEffect(() => {
    if (messageObj?.attachmentType) {
      let attType = messageObj?.attachmentType;
      setMessageType(attType);
    } else {
      setMessageType("text");
    }
  }, [messageObj]);

  useEffect(() => {
    (async () => {
      if (myMessage || messageObj.status == "read") return;
      let messageRef = doc(db, `chats/${messageObj.messageId}`);
      await updateDoc(messageRef, { status: "read" });
      await fetchConnections(false);
    })();
  }, [messageObj]);

  return (
    <>
      {!myMessage ? (
        <div className="message_container_left">
          <div className="message_wrapper">
            <div className="chat_avatar">
              <Avatar
                src={selectedFriend?.photoUrl}
                sx={{
                  width: 35,
                  height: 35,
                  backgroundColor: CustomColors.lightGrey,
                }}
              />
            </div>
            <div className="chat_bubble_left">
              {messageType === "image" ? (
                <div className="image_att_wrapper">
                  <img src={messageObj?.attachmentUrl} className="image_att" />
                </div>
              ) : messageType === "video" ? (
                <div className="image_att_wrapper">
                  <video
                    src={messageObj?.attachmentUrl}
                    className="video_att"
                    autoPlay={false}
                    controls
                  />
                </div>
              ) : messageType === "doc" ? (
                <FileCard leftChat={true} messageObj={messageObj} />
              ) : (
                <></>
              )}
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
              {messageType === "image" ? (
                <div className="image_att_wrapper">
                  <img src={messageObj?.attachmentUrl} className="image_att" />
                </div>
              ) : messageType === "video" ? (
                <div className="image_att_wrapper">
                  <video
                    src={messageObj?.attachmentUrl}
                    className="video_att"
                    autoPlay={false}
                    controls
                  />
                </div>
              ) : messageType === "doc" ? (
                <FileCard leftChat={false} messageObj={messageObj} />
              ) : (
                <></>
              )}
              <p className="chat_bubble_right_message">{messageObj?.message}</p>
              <div className="chat_bubble_right_timestamp">
                <p>{Time.bubbleRelativeDate(messageObj?.dateCreated)}</p>
                <div style={{ width: "20px" }}>
                  {messageObj?.status === "read" ? (
                    <DoneAllRounded
                      sx={{
                        marginLeft: "7px",
                        color: CustomColors.white,
                        fontSize: "18px",
                      }}
                    />
                  ) : (
                    <DoneRounded
                      sx={{
                        marginLeft: "7px",
                        color: CustomColors.white,
                        fontSize: "18px",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="chat_avatar">
              <Avatar
                src={currentUser?.photoUrl}
                sx={{
                  width: 35,
                  height: 35,
                  backgroundColor: CustomColors.lightGrey,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatContent;
