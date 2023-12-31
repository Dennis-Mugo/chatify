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
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

function ChatMoreMenu(props) {
  const navigate = useNavigate();
  const { currentUser, signOut, setSelectedFriend, selectedFriend } =
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
        {selectedFriend?.blocked &&
        selectedFriend?.blocked !== currentUser.userId ? (
          <></>
        ) : (
          <BlockChatDialog />
        )}
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

const BlockChatDialog = ({}) => {
  const { selectedFriend, setSelectedFriend, fetchConnections, currentUser } =
    useContext(ChatifyContext);
  const [open, setOpen] = useState(false);
  const [blocked, setBlocked] = useState(selectedFriend?.blocked);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleBlockChat = async () => {
    let connectionRef = doc(db, `connections/${selectedFriend?.connectionId}`);
    await updateDoc(connectionRef, { blocked: currentUser?.userId });
    // console.log("blocked");
    handleClose();
    setSelectedFriend(null);
    await fetchConnections(false);
  };

  const handleUnblockChat = async () => {
    let connectionRef = doc(db, `connections/${selectedFriend?.connectionId}`);
    await updateDoc(connectionRef, { blocked: false });
    // console.log("unblocked");
    handleClose();
    setSelectedFriend(null);
    await fetchConnections(false);
  };

  return (
    <>
      <MenuItem sx={{ fontFamily: "Nunito" }} onClick={handleOpen}>
        {blocked === currentUser?.userId ? "Unblock chat" : "Block chat"}
      </MenuItem>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {blocked === currentUser.userId ? "Unblock" : "Block"}{" "}
          {`${selectedFriend?.userName}`}?{" "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {blocked === currentUser?.userId
              ? `You will now be able to send and receive messages from ${selectedFriend?.userName}.`
              : `You will not be able to send messages to ${selectedFriend?.userName}.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={
              blocked === currentUser?.userId
                ? handleUnblockChat
                : handleBlockChat
            }
            autoFocus
          >
            {blocked === currentUser?.userId ? "Unblock" : "Block"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatMoreMenu;
