import React from "react";
import "./AdminDashboard.css";
import Logo from "../../components/Logo/Logo";
import { Icon, IconButton, Tooltip } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import DownloadIcon from "@mui/icons-material/Download";
import CustomColors from "../../constants/colors";

function Navbar(props) {
  return (
    <div className="admin_nav_container">
      <Logo
        style={{ margin: 0, padding: 0, fontSize: "2rem", margin: "0 20px" }}
      />

      <div className="admin_nav_right">
        <Tooltip title="Send broadcast message">
          <IconButton sx={{ marginRight: "10px" }}>
            <MessageIcon sx={{ color: CustomColors.blue }} />
          </IconButton>
        </Tooltip>

        <DownloadMenu />
      </div>
    </div>
  );
}

const DownloadMenu = ({}) => {
  return (
    <Tooltip title="Download">
      <IconButton sx={{ marginRight: "10px" }}>
        <DownloadIcon sx={{ color: CustomColors.blue }} />
      </IconButton>
    </Tooltip>
  );
};

export default Navbar;
