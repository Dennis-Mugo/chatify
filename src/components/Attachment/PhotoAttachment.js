import React, { useContext, useEffect, useState } from "react";
import "./Attachment.css";
import CustomColors from "../../constants/colors";
import { ChatifyContext } from "../../context/context";
import { Box, CircularProgress, Typography } from "@mui/material";
import uuid4 from "uuid4";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

function PhotoAttachment({
  selected,
  onClick,
  index,
  fileObj,
  uploading,
  setUploadResult,
  message,
}) {
  const { uploadFile, currentUser, selectedFriend } =
    useContext(ChatifyContext);

  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    (async () => {
      if (!uploading) return;
      await uploadFile(
        fileObj.file,
        sendChat,
        "chat_images",
        setUploadProgress
      );
    })();
  }, [uploading]);

  const sendChat = async (photoUrl) => {
    let chatObj;
    let chatMessage = message.trim();
    let messageId = uuid4();
    if (selected) {
      chatObj = {
        senderId: currentUser.userId,
        receiverId: selectedFriend.userId,
        dateCreated: Date.now().toString(),
        message: chatMessage,
        attachmentType: "image",
        attachmentUrl: photoUrl,
        size: fileObj.size,
        status: "unread",
      };
    } else {
      chatObj = {
        senderId: currentUser.userId,
        receiverId: selectedFriend.userId,
        dateCreated: Date.now().toString(),
        message: "",
        attachmentType: "image",
        attachmentUrl: photoUrl,
        size: fileObj.size,
        status: "unread",
      };
    }
    let chatRef = doc(db, `chats/${messageId}`);
    await setDoc(chatRef, chatObj);
    setUploadResult((prev) => [...prev, photoUrl]);
  };

  return (
    <div
      className="att_modal_select"
      onClick={(e) => onClick(index)}
      style={{
        border: selected
          ? `3px solid ${CustomColors.blue}`
          : `1px solid ${CustomColors.lightGrey}`,
        backgroundImage: `url(${fileObj.localUrl})`,
        backgroundPosition: "center",
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {uploading ? (
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "20px",
            backgroundColor: CustomColors.pureWhite,
          }}
        >
          <CircularProgressWithLabel value={uploadProgress} />
        </div>
      ) : (
        <></>
      )}

      {/* <img
        style={{
          borderRadius: "5px",
          transition: "all 100ms ease",
          maxHeight: selected ? "47px" : "51px",
          maxWidth: selected ? "47px" : "51px",
        }}
        src={fileObj.localUrl}
      /> */}
    </div>
  );
}

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: CustomColors.dark }}
          //   color="text.secondary"
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default PhotoAttachment;
