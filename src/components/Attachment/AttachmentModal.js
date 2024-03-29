import React, { useContext, useEffect, useRef, useState } from "react";
import "./Attachment.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import DescriptionIcon from "@mui/icons-material/Description";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ChatHeader from "../ChatCenter/ChatHeader";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SendIcon from "@mui/icons-material/Send";
import CustomColors from "../../constants/colors";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PhotoAttachment from "./PhotoAttachment";
import uuid4 from "uuid4";
import VideoAttachment from "./VideoAttachment";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DocAttachment from "./DocAttachment";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Link } from "react-router-dom";
import { allowedDocumentFiles } from "../../constants/constants";
import { ChatifyContext } from "../../context/context";
import Emoticons from "../ChatCenter/Emoticons";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AttachmentModal({ label }) {
  const { selectedFriend, currentUser } = useContext(ChatifyContext);
  const [open, setOpen] = useState(false);
  const [isPhoto, setIsPhoto] = useState();
  const [isDoc, setIsDoc] = useState();
  const [isVideo, setIsVideo] = useState();
  const [stageStatus, setStageStatus] = useState("empty");
  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedFilePreview, setSelectedPreview] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState([]);
  const [message, setMessage] = useState("");
  const [blockedDialog, setBlockedDialog] = useState(false);
  const [blocked, setBlocked] = useState(selectedFriend?.blocked);

  useEffect(() => {
    setBlocked(selectedFriend?.blocked);
  }, [selectedFriend]);

  const inputRef = useRef();
  let submitRef = useRef();

  useEffect(() => {
    setIsPhoto(label === "Photo");
    setIsDoc(label === "Document");
    setIsVideo(label === "Video");
  }, [label]);

  const reset = () => {
    setUploading(false);
    setFilePreviews([]);
    setUploadResult([]);
    setStageStatus("empty");
    setSelectedPreview(0);
    setMessage("");
    setOpen(false);
  };

  useEffect(() => {
    // console.log(uploadResult);
    if (
      filePreviews.length > 0 &&
      filePreviews.length === uploadResult.length
    ) {
      reset();
    }
  }, [uploadResult]);

  const handleBlockedDialogOpen = () => setBlockedDialog(true);
  const handleBlockedDialogClose = () => setBlockedDialog(false);

  const checkBlocked = () => {
    if (blocked) {
      handleBlockedDialogOpen();
      return true;
    }
    return false;
  };

  const handleClose = () => {
    if (uploading) return;
    setOpen(false);
    reset();
  };

  const handleOpen = () => setOpen(true);

  const toList = (fileList) => {
    let res = [];
    for (let file of fileList) {
      res.push({
        name: file.name,
        size: file.size,
        localUrl: URL.createObjectURL(file),
        type: file.type,
        uid: uuid4(),
        file: file,
      });
    }
    return res;
  };

  const handleMessage = (e) => {
    if (uploading) return;
    let value;
    if (e?.target) {
      value = e.target.value;
    } else {
      value = message + e;
    }
    setMessage(value);
  };

  const handleFileChange = (e) => {
    if (!e.target.files.length) return;
    let listFiles = toList(e.target.files);
    e.target.value = "";
    let allFiles = filePreviews.concat(listFiles);
    // console.log(allFiles);
    setSelectedPreview(allFiles.length - 1);
    setFilePreviews(allFiles);
    if (isPhoto) {
      setStageStatus("preview_photo");
    } else if (isVideo) {
      setStageStatus("preview_video");
    } else if (isDoc) {
      setStageStatus("preview_doc");
    }
  };

  const handleSelectorClick = (index) => {
    setSelectedPreview(index);
  };

  const handleFileRemove = (uid) => {
    let newFiles = filePreviews.filter((file) => file.uid !== uid);
    if (!newFiles.length) {
      setStageStatus("empty");
      setSelectedPreview(0);
    } else {
      setSelectedPreview(newFiles.length - 1);
    }
    setFilePreviews(newFiles);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleSend = () => {
    if (!filePreviews.length || uploading) return;
    let isBlocked = checkBlocked();
    if (isBlocked) return;
    setUploading(true);
  };

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          {isPhoto ? (
            <PhotoLibraryIcon fontSize="small" />
          ) : isVideo ? (
            <VideoLibraryIcon fontSize="small" />
          ) : isDoc ? (
            <DescriptionIcon fontSize="small" />
          ) : (
            <></>
          )}
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="att_modal_container">
          <div className="att_modal_header">
            <ChatHeader showMenu={false} style={{ flex: "90" }} />
            <div className="att_modal_close">
              <Tooltip title="Close">
                <IconButton onClick={handleClose}>
                  <CloseRoundedIcon color="error" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <form className="att_modal_body" onSubmit={handleFormSubmit}>
            {stageStatus === "empty" ? (
              <div className="att_modal_stage flex_center">
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    fontFamily: "Mooli",
                    fontSize: "14px",
                  }}
                  startIcon={
                    isPhoto ? (
                      <PhotoLibraryIcon />
                    ) : isVideo ? (
                      <VideoLibraryIcon />
                    ) : (
                      <LibraryBooksIcon />
                    )
                  }
                  component="label"
                >
                  {`Choose ${label}`}
                  <VisuallyHiddenInput
                    type="file"
                    accept={
                      isPhoto
                        ? "image/*"
                        : isVideo
                        ? "video/*"
                        : isDoc
                        ? allowedDocumentFiles
                        : ""
                    }
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
              </div>
            ) : stageStatus === "preview_photo" ? (
              <ImagePreview
                file={filePreviews[selectedFilePreview]}
                handleRemove={handleFileRemove}
              />
            ) : stageStatus === "preview_video" ? (
              <VideoPreview
                file={filePreviews[selectedFilePreview]}
                handleRemove={handleFileRemove}
              />
            ) : stageStatus === "preview_doc" ? (
              <DocPreview
                file={filePreviews[selectedFilePreview]}
                handleRemove={handleFileRemove}
              />
            ) : (
              <></>
            )}
            <div className="att_modal_shadow">
              <input
                placeholder="Type a message"
                value={message}
                onChange={handleMessage}
              />
              <Emoticons handleChange={handleMessage} />
            </div>
            <div className="att_footer_container">
              <div className="att_modal_selector">
                <>
                  {filePreviews.map((fileObj, i) => (
                    <div key={fileObj.uid}>
                      {isPhoto ? (
                        <PhotoAttachment
                          fileObj={fileObj}
                          onClick={handleSelectorClick}
                          index={i}
                          selected={selectedFilePreview === i}
                          uploading={uploading}
                          setUploadResult={setUploadResult}
                          message={message}
                        />
                      ) : isVideo ? (
                        <VideoAttachment
                          fileObj={fileObj}
                          onClick={handleSelectorClick}
                          index={i}
                          selected={selectedFilePreview === i}
                          uploading={uploading}
                          setUploadResult={setUploadResult}
                          message={message}
                        />
                      ) : isDoc ? (
                        <DocAttachment
                          fileObj={fileObj}
                          onClick={handleSelectorClick}
                          index={i}
                          selected={selectedFilePreview === i}
                          uploading={uploading}
                          setUploadResult={setUploadResult}
                          message={message}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                  <div className="att_modal_select">
                    <IconButton component="label">
                      <AddOutlinedIcon />
                      <VisuallyHiddenInput
                        type="file"
                        accept={
                          isPhoto
                            ? "image/*"
                            : isVideo
                            ? "video/*"
                            : isDoc
                            ? allowedDocumentFiles
                            : ""
                        }
                        multiple
                        onChange={handleFileChange}
                      />
                    </IconButton>
                  </div>
                </>
              </div>
              <div className="att_modal_send">
                <div className="att_modal_send_btn" onClick={handleSend}>
                  <SendIcon
                    sx={{ color: CustomColors.pureWhite, fontSize: 25 }}
                  />
                </div>
              </div>
            </div>
            <input type="submit" hidden ref={submitRef} />
          </form>
        </div>
      </Modal>
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
}

const ImagePreview = ({ file, handleRemove }) => {
  return (
    <div className="att_modal_stage">
      <img
        style={{ maxHeight: "45vh" }}
        src={file?.localUrl}
        alt={file?.name}
      />
      <Tooltip
        title="Remove"
        sx={{ position: "absolute", top: "15px", right: "15px" }}
      >
        <IconButton
          onClick={() => {
            handleRemove(file?.uid);
          }}
        >
          <CloseRoundedIcon color="error" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const VideoPreview = ({ file, handleRemove }) => {
  return (
    <div className="att_modal_stage">
      <video
        style={{ maxHeight: "45vh" }}
        autoPlay
        controls
        src={file.localUrl}
      >
        {/* <source src={file.localUrl} type="video/mp4" /> */}
        Your browser does not support the video tag.
      </video>
      <Tooltip
        title="Remove"
        sx={{ position: "absolute", top: "15px", right: "15px" }}
      >
        <IconButton
          onClick={() => {
            handleRemove(file?.uid);
          }}
        >
          <CloseRoundedIcon color="error" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const DocPreview = ({ file, handleRemove }) => {
  return (
    <div className="att_modal_stage_doc">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h3 className="file_name">{file.name}</h3>
        <Link to={file.localUrl} target="_blank" rel="noopener noreferrer">
          <IconButton>
            <OpenInNewIcon sx={{ color: CustomColors.blue }} />
          </IconButton>
        </Link>
      </div>

      <InsertDriveFileIcon sx={{ fontSize: 190, color: CustomColors.grey }} />
      <Tooltip
        title="Remove"
        sx={{ position: "absolute", top: "15px", right: "15px" }}
      >
        <IconButton
          onClick={() => {
            handleRemove(file?.uid);
          }}
        >
          <CloseRoundedIcon color="error" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default AttachmentModal;
