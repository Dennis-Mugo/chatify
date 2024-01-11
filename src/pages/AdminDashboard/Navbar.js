import React, { useEffect, useRef, useState } from "react";
import "./AdminDashboard.css";
import Logo from "../../components/Logo/Logo";
import { Icon, IconButton, Tooltip } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import DownloadIcon from "@mui/icons-material/Download";
import CustomColors from "../../constants/colors";
import * as XLSX from "xlsx";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Time } from "../../constants/constants";

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
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // fetchUsers();
  }, []);

  const fetchUsers = async () => {
    let usersRef = collection(db, `users`);
    let usersCollection = await getDocs(usersRef);
    let lst = [];
    usersCollection.forEach((user) => {
      lst.push({ ...user.data(), userId: user.id });
    });
    setUsers(lst);
    return lst;
  };

  const handleExcel = async () => {
    let result = await fetchUsers();
    const rows = result.map((user) => ({
      id: user.userId,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateCreated: Time.getDateTime(user.dateCreated),
    }));
    // create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // customize header names
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["User ID", "User Name", "Email", "Phone number", "Account created on"],
    ]);

    XLSX.writeFile(workbook, "users.xlsx", { compression: true });
  };

  return (
    <>
      <Tooltip title="Export to excel">
        <IconButton sx={{ marginRight: "10px" }} onClick={handleExcel}>
          <DownloadIcon sx={{ color: CustomColors.blue }} />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default Navbar;
