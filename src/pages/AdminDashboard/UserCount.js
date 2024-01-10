import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { getNumUsersUrl } from "../../constants/constants";
import { IconButton, Skeleton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

function UserCount(props) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchUserCount();
  }, []);

  const fetchUserCount = async () => {
    setLoading(true);
    let res = await fetch(`${getNumUsersUrl}/get_num_users`);
    res = await res.json();
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="admin_row1col1">
      <h2>Total Users</h2>

      {!loading ? (
        <>
          <Tooltip title="Refresh" placement="right">
            <IconButton onClick={fetchUserCount}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <h1>{result?.userCount}</h1>
        </>
      ) : (
        <Skeleton width={30} height={30} variant="rounded" />
      )}
    </div>
  );
}

export default UserCount;
