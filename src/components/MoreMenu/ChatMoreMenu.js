import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import React, { useContext, useState } from "react";
import CustomColors from "../../constants/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { ChatifyContext } from "../../context/context";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.config";

function ChatMoreMenu(props) {
  const navigate = useNavigate();
  const { currentUser, signOut, setSelectedFriend } =
    useContext(ChatifyContext);
  const [signoutLoading, setSignoutLoading] = useState(false);
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

  const handleBlockChat = async () => {};

  const handleCloseChat = () => {
    setSelectedFriend(null);
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
      <Tooltip title="Menu">
        <IconButton onClick={handleClick} sx={{ marginRight: "10px" }}>
          <MoreVertIcon sx={{ color: CustomColors.blue }} />
        </IconButton>
      </Tooltip>
      <Menu
        // id="basic-menu"
        anchorEl={anchorElem}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        // MenuListProps={{
        //   'aria-labelledby': 'basic-button',
        // }}
      >
        <MenuItem sx={{ fontFamily: "Nunito" }} onClick={handleCloseChat}>
          Close chat
        </MenuItem>
        <UnfriendDialog />
        <MenuItem sx={{ fontFamily: "Nunito" }} onClick={handleBlockChat}>
          Block chat
        </MenuItem>
      </Menu>
    </>
  );
}

const UnfriendDialog = ({}) => {
  const { selectedFriend, setSelectedFriend, fetchConnections } =
    useContext(ChatifyContext);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUnfriend = async () => {
    let connectionId = selectedFriend?.connectionId;
    setSelectedFriend(null);
    await deleteDoc(doc(db, `connections/${connectionId}`));
    await fetchConnections(false);
    // console.log("Deleted", connectionId);
  };

  return (
    <>
      <MenuItem sx={{ fontFamily: "Nunito" }} onClick={handleOpen}>
        Unfriend chat
      </MenuItem>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Unfriend {`${selectedFriend?.userName}`}? </DialogTitle>
        <DialogContent>
          <DialogContentText>{`${selectedFriend?.userName} will not appear on your friend list.`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUnfriend} autoFocus>
            Unfriend
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatMoreMenu;
