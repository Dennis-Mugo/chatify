import React, { useEffect, useState } from "react";
import "./Attachment.css";
import {
  Button,
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

  useEffect(() => {
    setIsPhoto(label === "Photo");
    setIsDoc(label === "Document");
    setIsVideo(label === "Video");
  }, [label]);

  useEffect(() => {
    console.log(uploadResult);
    if (
      filePreviews.length > 0 &&
      filePreviews.length === uploadResult.length
    ) {
      setUploading(false);
      setFilePreviews([]);
      setUploadResult([]);
      setStageStatus("empty");
      setMessage("");
      setOpen(false);
    }
  }, [uploadResult]);

  const handleClose = () => setOpen(false);

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
    let value = e.target.value;
    setMessage(value);
  };

  const handleFileChange = (e) => {
    if (!e.target.files.length) return;
    let allFiles = toList(e.target.files);
    console.log(allFiles);
    setSelectedPreview(allFiles.length - 1);
    setFilePreviews(allFiles);
    if (isPhoto) {
      setStageStatus("preview_photo");
    }
  };

  const handleSelectorClick = (index) => {
    setSelectedPreview(index);
  };

  const handleSend = () => {
    if (!filePreviews.length || uploading) return;
    setUploading(true);
  };

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          {isPhoto ? <PhotoLibraryIcon fontSize="small" /> : <></>}
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
          <div className="att_modal_body">
            {stageStatus === "empty" ? (
              <div className="att_modal_stage flex_center">
                <Button variant="contained" component="label">
                  Browse
                  <VisuallyHiddenInput
                    type="file"
                    accept={
                      isPhoto
                        ? "image/*"
                        : isVideo
                        ? "video/*"
                        : isDoc
                        ? ".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf"
                        : ""
                    }
                    multiple
                    onChange={handleFileChange}
                  />
                </Button>
              </div>
            ) : stageStatus === "preview_photo" ? (
              <ImagePreview file={filePreviews[selectedFilePreview]} />
            ) : (
              <></>
            )}
            <div className="att_modal_shadow">
              <input
                placeholder="Type a message"
                value={message}
                onChange={handleMessage}
              />
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
                            ? ".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf"
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
          </div>
        </div>
      </Modal>
    </>
  );
}

const ImagePreview = ({ file }) => {
  return (
    <div className="att_modal_stage">
      <img style={{ maxHeight: "45vh" }} src={file.localUrl} alt={file.name} />
    </div>
  );
};

export default AttachmentModal;