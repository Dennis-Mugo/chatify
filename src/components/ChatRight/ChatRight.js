import React, { useContext, useEffect, useState } from "react";
import "./ChatRight.css";
import { ChatifyContext } from "../../context/context";
import {
  // Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CustomColors from "../../constants/colors";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Accordion from "../Accordion/Accordion";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";
import {
  and,
  collection,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import FileCard from "../FileCard/FileCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import MediaModal from "./MediaModal";

function ChatRight(props) {
  const { selectedFriend, currentUser } = useContext(ChatifyContext);
  return (
    <div className="chat_right" style={{ ...props.style }}>
      <div className="chat_right_shadow">
        <Avatar
          sx={{
            margin: "25px 0 20px",
            width: 126,
            height: 126,
            backgroundColor: CustomColors.lightGrey,
          }}
          src={selectedFriend?.photoUrl}
          alt={selectedFriend?.userName}
        />
        <h3 className="chat_right_username">{selectedFriend?.userName}</h3>
        <p className="chat_right_bio">{selectedFriend?.bio}</p>
        <Media />
        <Files />
      </div>
    </div>
  );
}

const Media = () => {
  // no-media
  // media-results
  // media-loading
  const { currentUser, selectedFriend } = useContext(ChatifyContext);
  const [mediaStatus, setMediaStatus] = useState("media-loading");
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    fetchMedia();
  }, [selectedFriend, currentUser]);

  const fetchMedia = async (showLoading = true) => {
    if (!currentUser || !selectedFriend) return;
    if (showLoading) setMediaStatus("media-loading");

    const senderQuery = and(
      where("senderId", "==", currentUser.userId),
      where("receiverId", "==", selectedFriend.userId)
    );

    const receiverQuery = and(
      where("senderId", "==", selectedFriend.userId),
      where("receiverId", "==", currentUser.userId)
    );
    const mediaTypeQuery = or(
      where("attachmentType", "==", "video"),
      where("attachmentType", "==", "image")
    );

    const fileQuery = query(
      collection(db, "chats"),
      and(mediaTypeQuery, or(senderQuery, receiverQuery)),
      orderBy("dateCreated", "desc")
    );

    const docs = await getDocs(fileQuery);
    let res = [];
    docs.forEach((doc) => {
      res.push({
        messageId: doc.id,
        ...doc.data(),
      });
    });
    // console.log(res);
    setMediaList(res);
    if (res.length) {
      setMediaStatus("media-results");
    } else {
      setMediaStatus("no-media");
    }
  };

  return (
    <Accordion
      alreadyVisible={false}
      onRefresh={fetchMedia}
      Header={MediaHeader}
      Body={
        <div className="acc_media_body">
          {mediaStatus === "no-media" ? (
            <p style={{ fontFamily: "Nunito", textAlign: "center" }}>
              No media found
            </p>
          ) : mediaStatus === "media-results" ? (
            <div className="media_container">
              {mediaList.map((mediaChat) => (
                <MediaModal key={mediaChat.messageId} mediaChat={mediaChat} />
              ))}
            </div>
          ) : mediaStatus === "media-loading" ? (
            <div className="media_container">
              {Array(10)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "60px",
                      height: "60px",
                      margin: "0 5px 5px 0",
                      backgroundColor: CustomColors.lightGrey,
                    }}
                  ></div>
                ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      }
    />
  );
};

const MediaHeader = ({ onClick, state, onRefresh }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(state === "entered");
  }, [state]);

  return (
    <div className="acc_media_header">
      <div className="acc_media_left" onClick={onClick}>
        <div className="acc_media_icon">
          <PhotoLibraryIcon sx={{ color: CustomColors.blue }} />
        </div>
        <p
          style={{
            fontFamily: "Nunito Sans",
            fontWeight: "700",
            margin: "0",
            padding: "0",
          }}
        >
          Media
        </p>
      </div>
      <div className="acc_media_right">
        <Tooltip title="Reload" placement="top">
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {open ? (
          <ExpandLessRoundedIcon
            onClick={onClick}
            sx={{ color: CustomColors.textGrey }}
          />
        ) : (
          <ExpandMoreRoundedIcon
            onClick={onClick}
            sx={{ color: CustomColors.textGrey }}
          />
        )}
      </div>
    </div>
  );
};

const Files = () => {
  // no-files
  // file-results
  // files-loading
  const { currentUser, selectedFriend } = useContext(ChatifyContext);
  const [fileStatus, setFileStatus] = useState("files-loading");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, [selectedFriend, currentUser]);

  const fetchFiles = async (showLoading = true) => {
    if (!currentUser || !selectedFriend) return;
    if (showLoading) setFileStatus("files-loading");

    const senderQuery = and(
      where("senderId", "==", currentUser.userId),
      where("receiverId", "==", selectedFriend.userId)
    );

    const receiverQuery = and(
      where("senderId", "==", selectedFriend.userId),
      where("receiverId", "==", currentUser.userId)
    );
    const fileQuery = query(
      collection(db, "chats"),
      and(where("attachmentType", "==", "doc"), or(senderQuery, receiverQuery)),
      orderBy("dateCreated", "desc")
    );

    const docs = await getDocs(fileQuery);
    let res = [];
    docs.forEach((doc) => {
      res.push({
        messageId: doc.id,
        ...doc.data(),
      });
    });
    setFileList(res);
    if (res.length) {
      setFileStatus("file-results");
    } else {
      setFileStatus("no-files");
    }
  };

  return (
    <Accordion
      Header={FilesHeader}
      onRefresh={fetchFiles}
      alreadyVisible={true}
      Body={
        <div className="acc_media_body">
          {fileStatus === "no-files" ? (
            <>
              <p style={{ fontFamily: "Nunito", textAlign: "center" }}>
                No files found
              </p>
            </>
          ) : fileStatus === "file-results" ? (
            fileList.map((fileObj) => (
              <FileCard
                style={{ width: "95%", margin: "0 auto 10px" }}
                key={fileObj.messageId}
                messageObj={fileObj}
              />
            ))
          ) : fileStatus === "files-loading" ? (
            Array(3)
              .fill(null)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width="90%"
                  height="65px"
                  sx={{ margin: "0 auto 10px" }}
                />
              ))
          ) : (
            <></>
          )}
        </div>
      }
    />
  );
};

const FilesHeader = ({ onClick, state, onRefresh }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(state === "entered");
  }, [state]);

  return (
    <div className="acc_media_header">
      <div className="acc_media_left" onClick={onClick}>
        <div className="acc_media_icon">
          <FileCopyRoundedIcon sx={{ color: CustomColors.blue }} />
        </div>
        <p
          style={{
            fontFamily: "Nunito Sans",
            fontWeight: "700",
            margin: "0",
            padding: "0",
          }}
        >
          Files & docs
        </p>
      </div>
      <div className="acc_media_right">
        <Tooltip title="Reload" placement="top">
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {open ? (
          <ExpandLessRoundedIcon
            onClick={onClick}
            sx={{ color: CustomColors.textGrey }}
          />
        ) : (
          <ExpandMoreRoundedIcon
            onClick={onClick}
            sx={{ color: CustomColors.textGrey }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRight;
