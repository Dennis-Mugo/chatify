import React, { useContext, useEffect, useState } from "react";
import "./Attachment.css";
import CustomColors from "../../constants/colors";
import { ChatifyContext } from "../../context/context";
import { Badge, Box, CircularProgress, Typography } from "@mui/material";
import uuid4 from "uuid4";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function DocAttachment({
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
      await uploadFile(fileObj.file, sendChat, "chat_docs", setUploadProgress);
    })();
  }, [uploading]);

  const sendChat = async (docUrl) => {
    let chatObj;
    let chatMessage = message.trim();
    let messageId = uuid4();
    if (selected) {
      chatObj = {
        senderId: currentUser.userId,
        receiverId: selectedFriend.userId,
        dateCreated: Date.now().toString(),
        message: chatMessage,
        attachmentType: "doc",
        attachmentUrl: docUrl,
        docName: fileObj.name,
        size: fileObj.size,
        status: "unread",
      };
    } else {
      chatObj = {
        senderId: currentUser.userId,
        receiverId: selectedFriend.userId,
        dateCreated: Date.now().toString(),
        message: "",
        attachmentType: "doc",
        attachmentUrl: docUrl,
        docName: fileObj.name,
        size: fileObj.size,
        status: "unread",
      };
    }
    let chatRef = doc(db, `chats/${messageId}`);
    await setDoc(chatRef, chatObj);
    setUploadResult((prev) => [...prev, docUrl]);
  };

  return (
    <div
      className="att_modal_select"
      onClick={(e) => onClick(index)}
      style={{
        border: selected
          ? `3px solid ${CustomColors.blue}`
          : `1px solid ${CustomColors.lightGrey}`,

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
        <Badge badgeContent={index + 1}>
          <InsertDriveFileIcon
            sx={{ color: CustomColors.textGrey }}
            fontSize="small"
          />
        </Badge>
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

export default DocAttachment;
