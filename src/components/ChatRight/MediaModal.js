import React, { useEffect, useState } from "react";
import "./ChatRight.css";
import CustomColors from "../../constants/colors";
import PlayArrowSharpIcon from "@mui/icons-material/PlayArrowSharp";
import { IconButton, Modal, Tooltip } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function MediaModal({ style, mediaChat }) {
  const [isPhoto, setIsPhoto] = useState(mediaChat?.attachmentType === "image");
  const [isVideo, setIsVideo] = useState(mediaChat?.attachmentType === "video");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsPhoto(mediaChat?.attachmentType === "image");
    setIsVideo(mediaChat?.attachmentType === "video");
  }, [mediaChat]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        onClick={handleOpen}
        className="media_item"
        style={{
          ...style,
          background: isPhoto
            ? `url(${mediaChat?.attachmentUrl})`
            : CustomColors.dark,
          backgroundColor: isPhoto ? CustomColors.lightGrey : CustomColors.dark,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {isVideo ? (
          <div className="video_thumb">
            <div className="video_thumb_left">
              {Array(7)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="dots"></div>
                ))}
            </div>
            <div className="video_thumb_center">
              <PlayArrowSharpIcon sx={{ color: CustomColors.pureWhite }} />
            </div>
            <div className="video_thumb_right">
              {Array(7)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="dots"></div>
                ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div
          style={{
            // border: "1px solid black",
            position: "relative",
          }}
        >
          <Tooltip title="Close">
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              style={{
                zIndex: "99",
                backgroundColor: CustomColors.pureWhite,
              }}
            >
              <CloseRoundedIcon sx={{ color: CustomColors.pink }} />
            </IconButton>
          </Tooltip>
          {isPhoto ? (
            <img
              src={mediaChat?.attachmentUrl}
              alt={mediaChat?.attachmentType}
              style={{ maxHeight: "90vh", borderRadius: "10px" }}
            />
          ) : (
            <video
              src={mediaChat?.attachmentUrl}
              controls
              autoPlay
              style={{ maxHeight: "90vh", borderRadius: "10px" }}
            />
          )}
        </div>
      </Modal>
    </>
  );
}

export default MediaModal;
