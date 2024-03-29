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

function MoreMenu(props) {
  const navigate = useNavigate();
  const { currentUser, signOut } = useContext(ChatifyContext);
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

  const handleSignOut = async () => {
    setSignoutLoading(true);
    await signOut();
    navigate("/signin");
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
        // MenuListProps={{
        //   'aria-labelledby': 'basic-button',
        // }}
      >
        <MenuItem
          sx={{ fontFamily: "Nunito" }}
          onClick={() => {
            handleNavigate("/profile");
          }}
        >
          My Profile
        </MenuItem>

        {currentUser?.isAdmin ? (
          <MenuItem
            sx={{ fontFamily: "Nunito" }}
            onClick={() => {
              handleNavigate("/admin-dashboard");
            }}
          >
            Admin
          </MenuItem>
        ) : (
          <></>
        )}

        <LogoutDialog handleSignOut={handleSignOut} />
      </Menu>
    </>
  );
}

const LogoutDialog = ({ handleSignOut }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <MenuItem sx={{ fontFamily: "Nunito" }} onClick={handleOpen}>
        Logout
      </MenuItem>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Logout?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSignOut} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MoreMenu;
