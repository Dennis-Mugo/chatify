import { Avatar, Button, IconButton, Modal, Tooltip } from "@mui/material";
import React, { useContext, useState } from "react";
import "./SearchFriendsModal.css";
import CustomColors from "../../constants/colors";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { baseUrl, searchFriendsUrl } from "../../constants/constants";
import { ChatifyContext } from "../../context/context";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

function SearchFriendsModal(props) {
  const { currentUser } = useContext(ChatifyContext);
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleQuery = async (e) => {
    let value = e.target.value;
    setQuery(value);
    value = value.trim();
    if (!value.length) {
      setQueryResult([]);
      return;
    }
    await handleSubmitQuery(value);
  };

  const clearQuery = () => {
    setQuery("");
    setQueryResult([]);
  };

  const handleSubmitQuery = async (key) => {
    setSearchLoading(true);
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
    setSearchLoading(false);
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
            fontSize: "16px",
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
                <SearchSharpIcon sx={{ margin: "0 15px" }} />
                <input
                  className="search_input"
                  type="text"
                  placeholder="Search username or phone number"
                  value={query}
                  onChange={handleQuery}
                />
                <IconButton onClick={clearQuery}>
                  <CloseRoundedIcon />
                </IconButton>
              </div>
            </div>
            <div className="search_friends_right">
              <IconButton
                onClick={handleClose}
                sx={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
              >
                <CloseRoundedIcon color="error" />
              </IconButton>
            </div>
          </div>
          <div
            style={{
              width: "95%",
              margin: "10px auto",
              borderBottom: `1px solid ${CustomColors.lightBlue}`,
            }}
          ></div>
          {queryResult.length ? (
            <div className="friend_result_container">
              {queryResult.map((friend) => (
                <FriendMenuItem key={friend.userId} friend={friend} />
              ))}
            </div>
          ) : searchLoading || !query.length ? (
            <></>
          ) : (
            <p className="no_friend">{`No match found for '${query}'`}</p>
          )}
        </div>
      </Modal>
    </>
  );
}

const FriendMenuItem = ({ friend }) => {
  const handlAddFriend = async () => {};

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
        <Tooltip
          title={`Add ${friend.userName} to my friends`}
          placement="left"
        >
          <IconButton onClick={handlAddFriend}>
            <AddRoundedIcon sx={{ color: CustomColors.pink }} />
          </IconButton>
        </Tooltip>
      </div>
      <div></div>
    </div>
  );
};

export default SearchFriendsModal;
