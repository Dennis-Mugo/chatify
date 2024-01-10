import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.config";
import { Avatar } from "@mui/material";
import { Time } from "../../constants/constants";

function UsersTable(props) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let usersRef = collection(db, "users");
      //   let userCollection = await getDocs(usersRef);

      let unsub = onSnapshot(usersRef, (snapshot) => {
        let lst = [];
        snapshot.forEach((doc) => {
          lst.push({ ...doc.data(), userId: doc.id });
        });
        setResults(lst);
      });

      setLoading(false);
      return unsub;
    })();
  }, []);

  return (
    <TableContainer
      sx={{
        width: "75%",
        borderRadius: "15px",
        margin: "auto",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
      }}
      component={Paper}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center">Username</TableCell>

            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Phone Number</TableCell>
            <TableCell align="center">Account created on</TableCell>
            <TableCell align="center">Last seen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((user) => (
            <TableRow
              key={user?.userId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" align="center" scope="row">
                <Avatar src={user?.photoUrl} alt={user?.userName} />
              </TableCell>
              <TableCell align="center">{user?.userName}</TableCell>
              <TableCell align="center">{user?.email}</TableCell>
              <TableCell align="center">{user?.phoneNumber}</TableCell>
              <TableCell align="center">
                {Time.bubbleRelativeDate(user?.dateCreated)}
              </TableCell>
              <TableCell align="center">
                {user?.onlineStatus
                  ? Time.formatLastSeen(user?.onlineStatus)
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersTable;
