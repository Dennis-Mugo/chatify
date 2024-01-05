import React, { useContext } from "react";
import CustomColors from "../../constants/colors";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { ChatifyContext } from "../../context/context";
import { getFileSize } from "../../constants/constants";
import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import "./FileCard.css";

function FileCard({ messageObj, style, leftChat }) {
  const { clipWords } = useContext(ChatifyContext);
  return (
    <div
      style={{ ...style }}
      className="att_doc_wrapper"
      onClick={() => {
        window.open(messageObj?.attachmentUrl);
      }}
    >
      <div className="att_doc_left">
        {leftChat ? (
          <InsertDriveFileIcon
            sx={{ fontSize: 40, color: CustomColors.white }}
          />
        ) : (
          <InsertDriveFileIcon
            sx={{ fontSize: 40, color: CustomColors.dark }}
          />
        )}
      </div>
      <div className="att_doc_center">
        <p title={messageObj.docName} className="att_doc_name">
          {clipWords(messageObj?.docName, 15)}
        </p>
        <p className="att_doc_size">{getFileSize(messageObj?.size)}</p>
      </div>
      <div className="att_doc_right">
        <IconButton>
          {leftChat ? (
            <DownloadIcon sx={{ color: CustomColors.white }} />
          ) : (
            <DownloadIcon sx={{ color: CustomColors.dark }} />
          )}
        </IconButton>
      </div>
    </div>
  );
}

export default FileCard;
