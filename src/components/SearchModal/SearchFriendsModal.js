import {
  Avatar,
  Button,
  IconButton,
  Modal,
  Skeleton,
  Tooltip,
} from "@mui/material";
import React, { useContext, useState } from "react";
import "./SearchFriendsModal.css";
import CustomColors from "../../constants/colors";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { baseUrl, searchFriendsUrl } from "../../constants/constants";
import { ChatifyContext } from "../../context/context";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import uuid4 from "uuid4";
import { db } from "../../firebase.config";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { doc, setDoc } from "firebase/firestore";

function SearchFriendsModal(props) {
  const { currentUser } = useContext(ChatifyContext);
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState([]);
  const [resultContainer, setResultContainer] = useState("empty");

  const handleQuery = async (e) => {
    setResultContainer("empty");
    let value = e.target.value;
    setQuery(value);
  };

  const clearQuery = () => {
    setQuery("");
    setQueryResult([]);
    setResultContainer("empty");
  };

  const handleSubmitQuery = async () => {
    let key = query.trim();
    if (!key.length) {
      setQueryResult([]);
      return;
    }
    setResultContainer("loading");
    let res = await fetch(`${searchFriendsUrl}/search_friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: currentUser.userId, query: key }),
    });
    res = await res.json();
    console.log(res);
    setQueryResult(res);
    if (res.length) {
      setResultContainer("results");
    } else {
      setResultContainer("no match");
    }
  };

  return (
    <>
      <div className="search_friends">
        <Button
          variant="text"
          onClick={handleClick}
          startIcon={
            // <IconButton
            //   sx={{
            //     backgroundColor: CustomColors.lightBlue,
            //     boxShadow:
            //       "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
            //   }}
            // >
            <SearchSharpIcon
              style={{ fontSize: 25, color: CustomColors.blue }}
            />
            // </IconButton>
          }
          sx={{
            fontFamily: "Nunito",
            textTransform: "none",
            fontSize: "14px",
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
              <div className="search_input_shadow">
                <input
                  className="search_input"
                  type="text"
                  placeholder="Search username or phone number"
                  value={query}
                  onChange={handleQuery}
                />
                {query.length ? (
                  <IconButton onClick={clearQuery}>
                    <CloseRoundedIcon />
                  </IconButton>
                ) : (
                  <></>
                )}
                <Tooltip title="Search">
                  <IconButton onClick={handleSubmitQuery}>
                    <SearchSharpIcon sx={{ color: CustomColors.dark }} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            <div className="search_friends_right">
              <Tooltip title="Close">
                <IconButton
                  onClick={handleClose}
                  sx={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                >
                  <CloseRoundedIcon color="error" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div
            style={{
              width: "95%",
              margin: "10px auto",
              borderBottom: `1px solid ${CustomColors.lightBlue}`,
            }}
          ></div>
          {resultContainer === "results" ? (
            <div className="friend_result_container">
              {queryResult.map((friend) => (
                <FriendMenuItem key={friend.userId} friend={friend} />
              ))}
            </div>
          ) : resultContainer === "loading" ? (
            <>
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={"90%"}
                    height={20}
                    sx={{ margin: "5px auto", borderRadius: "10px" }}
                  />
                ))}
            </>
          ) : resultContainer === "no match" ? (
            <p className="no_friend">{`No match found for '${query}'`}</p>
          ) : (
            <></>
          )}
        </div>
      </Modal>
    </>
  );
}

const FriendMenuItem = ({ friend }) => {
  const { currentUser, fetchConnections } = useContext(ChatifyContext);
  const [addFriendLoading, setAddFriendLoading] = useState(false);
  const [hasConnection, setHasConnection] = useState(friend.hasConnection);

  const handlAddFriend = async () => {
    if (addFriendLoading) return;
    setAddFriendLoading(true);
    setHasConnection(true);
    let connectionObj = {
      user1: currentUser.userId,
      user2: friend.userId,
      dateConnected: Date.now().toString(),
    };
    let connectionId = uuid4();
    let connectionRef = doc(db, `connections/${connectionId}`);
    await setDoc(connectionRef, connectionObj);
    await fetchConnections();
    setAddFriendLoading(false);
  };

  return (
    <div className="friend_result">
      <div className="friend_result_left">
        <div className="friend_result_avatar">
          <Avatar
            sx={{ marginRight: "15px" }}
            src={friend.photoUrl}
            alt={friend.userName}
          />
        </div>
        <div>
          <p className="friend_username">{friend.userName}</p>
          <p className="friend_phone">{friend.phoneNumber}</p>
        </div>
      </div>
      <div className="friend_result_right">
        {hasConnection ? (
          <CheckRoundedIcon sx={{ color: CustomColors.blue }} />
        ) : (
          <Tooltip
            title={`Add ${friend.userName} to my friends`}
            placement="left"
          >
            <IconButton onClick={handlAddFriend}>
              <AddRoundedIcon sx={{ color: CustomColors.pink }} />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default SearchFriendsModal;
