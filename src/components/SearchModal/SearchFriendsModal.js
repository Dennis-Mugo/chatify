import { Button, IconButton, Modal } from "@mui/material";
import React, { useState } from "react";
import "./SearchFriendsModal.css";
import CustomColors from "../../constants/colors";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

function SearchFriendsModal(props) {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="search_friends">
        <Button
          variant="text"
          onClick={handleClick}
          startIcon={
            <IconButton
              sx={{
                backgroundColor: CustomColors.lightBlue,
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
              }}
            >
              <SearchSharpIcon
                style={{ fontSize: 25, color: CustomColors.blue }}
              />
            </IconButton>
          }
          sx={{
            fontFamily: "Nunito",
            textTransform: "none",
            fontSize: "16px",
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: "27px",
          }}
        >
          &nbsp;&nbsp;Search new friends
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div className="modal_container">
          <div className="search_friends_header">
            <div className="search_friends_left">
              <div className="input_shadow">
                <SearchSharpIcon />
                <input
                  className="search_input"
                  type="text"
                  placeholder="Search username or phone number"
                />
              </div>
            </div>
            <div className="search_friends_right"></div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SearchFriendsModal;
