import React from "react";
import "./AdminDashboard.css";
import { LineChart } from "@mui/x-charts";

import Navbar from "./Navbar";
import UserCount from "./UserCount";
import UserGrowth from "./UserGrowth";
import UsersTable from "./UsersTable";

function AdminDashboard(props) {
  
  
  return (<>
    <Navbar />
    <div className="dummy_nav"></div>
    <div className="admin_container">
        
      <div className="admin_row1">
        <UserCount />
        <UserGrowth />
      </div>
      <div className="admin_row2">
        <UsersTable />
      </div>
    </div>
    </>
  );
}

export default AdminDashboard;
