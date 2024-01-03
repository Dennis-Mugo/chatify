import React, { useContext, useEffect, useState } from "react";
import "./ChatRight.css";
import { ChatifyContext } from "../../context/context";
import {
  // Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Typography,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CustomColors from "../../constants/colors";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Accordion from "../Accordion/Accordion";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import FileCopyRoundedIcon from "@mui/icons-material/FileCopyRounded";

function ChatRight(props) {
  const { selectedFriend, currentUser } = useContext(ChatifyContext);
  return (
    <div className="chat_right" style={{ ...props.style }}>
      <div className="chat_right_shadow">
        <Avatar
          sx={{ margin: "25px 0 20px", width: 126, height: 126 }}
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

  const [mediaStatus, setMediaStatus] = useState("no-media");

  return (
    <Accordion
      alreadyVisible={false}
      Header={MediaHeader}
      Body={
        <div className="acc_media_body">
          {mediaStatus === "no-media" ? (
            <p style={{ fontFamily: "Nunito", textAlign: "center" }}>
              No media found
            </p>
          ) : (
            <></>
          )}
        </div>
      }
    />
  );
};

const MediaHeader = ({ onClick, state }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(state === "entered");
  }, [state]);
  return (
    <div className="acc_media_header" onClick={onClick}>
      <div className="acc_media_left">
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
        {open ? (
          <ExpandLessRoundedIcon sx={{ color: CustomColors.textGrey }} />
        ) : (
          <ExpandMoreRoundedIcon sx={{ color: CustomColors.textGrey }} />
        )}
      </div>
    </div>
  );
};

const Files = () => {
  // no-files
  // file-results
  // files-loading

  const [fileStatus, setFileStatus] = useState("no-files");

  return (
    <Accordion
      Header={FilesHeader}
      alreadyVisible={true}
      Body={
        <div className="acc_media_body">
          {fileStatus === "no-files" ? (
            <>
              <p style={{ fontFamily: "Nunito", textAlign: "center" }}>
                No files found
              </p>
              {Array(50)
                .fill(null)
                .map((_, i) => (
                  <p key={i}>{i}</p>
                ))}
            </>
          ) : (
            <></>
          )}
        </div>
      }
    />
  );
};

const FilesHeader = ({ onClick, state }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(state === "entered");
  }, [state]);
  return (
    <div className="acc_media_header" onClick={onClick}>
      <div className="acc_media_left">
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
        {open ? (
          <ExpandLessRoundedIcon sx={{ color: CustomColors.textGrey }} />
        ) : (
          <ExpandMoreRoundedIcon sx={{ color: CustomColors.textGrey }} />
        )}
      </div>
    </div>
  );
};

export default ChatRight;
