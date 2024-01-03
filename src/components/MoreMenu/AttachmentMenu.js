import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Tooltip,
} from "@mui/material";
import React, { useContext, useState } from "react";
import CustomColors from "../../constants/colors";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import { ChatifyContext } from "../../context/context";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AttachmentModal from "../Attachment/AttachmentModal";

function AttachmentMenu(props) {
  const navigate = useNavigate();
  const { currentUser } = useContext(ChatifyContext);
  const [anchorElem, setAnchorElem] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorElem(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorElem(null);
    setOpen(false);
  };

  const handleNavigate = (path) => {
    if (path == "/profile") {
      navigate("/profile", { state: { firstTime: false } });
      return;
    }
    navigate(path);
  };
  return (
    <>
      <Tooltip title="Attach">
        <IconButton
          onClick={handleClick}
          sx={{ backgroundColor: CustomColors.lightBlue, marginLeft: "10px" }}
        >
          <AddRoundedIcon sx={{ color: CustomColors.blue }} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElem}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* <MenuList> */}
        <MenuItem>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText style={{ fontFamily: "Nunito" }}>Document</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <VideoLibraryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Video</ListItemText>
        </MenuItem>
        <AttachmentModal label="Photo" />
        {/* </MenuList> */}
      </Menu>
    </>
  );
}

export default AttachmentMenu;
