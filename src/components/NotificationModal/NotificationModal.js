import { IconButton, Modal } from "@mui/material";
import React, { useState } from "react";
import "./NotificationModal.css";
import CustomColors from "../../constants/colors";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

function NotificationModal(props) {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton onClick={handleClick} sx={{ marginRight: "10px" }}>
        <NotificationsOutlinedIcon sx={{ color: CustomColors.blue }} />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
      >
        <div className="modal_container"></div>
      </Modal>
    </>
  );
}

export default NotificationModal;
