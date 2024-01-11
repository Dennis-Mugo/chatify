import { IconButton, Modal, Tooltip } from "@mui/material";
import React, { useState } from "react";
import "./NotificationModal.css";
import CustomColors from "../../constants/colors";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function NotificationModal(props) {
  //no-results
  //loading
  //results
  const [status, setStatus] = useState("no-results");
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleClick} sx={{ marginRight: "10px" }}>
          <NotificationsOutlinedIcon sx={{ color: CustomColors.blue }} />
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
      >
        <div className="notification_modal_container">
          <div className="notification_container_header">
            <h2>Notifications</h2>
            <Tooltip title="Close">
              <IconButton
                onClick={handleClose}
                sx={{
                  backgroundColor: CustomColors.lightPink,
                  margin: "0 20px",
                }}
              >
                <CloseRoundedIcon sx={{ color: CustomColors.crimson }} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="notification_container_no_results">
            <CircleNotificationsIcon
              sx={{
                color: CustomColors.pink,
                fontSize: "10rem",
                margin: "20px 0",
              }}
            />
            <h3>There are no notifications today</h3>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default NotificationModal;
