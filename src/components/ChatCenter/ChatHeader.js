import { Avatar } from "@mui/material";
import React, { useContext } from "react";
import ChatMoreMenu from "../MoreMenu/ChatMoreMenu";
import { ChatifyContext } from "../../context/context";
import CustomColors from "../../constants/colors";

function ChatHeader({ realTimeFriend, setChatStatus, showMenu, style }) {
  const { selectedFriend } = useContext(ChatifyContext);

  return (
    <div className="chat_header" style={{ ...style }}>
      <div className="chat_header_avatar">
        <Avatar
          src={selectedFriend?.photoUrl}
          sx={{ backgroundColor: CustomColors.lightGrey }}
          alt={selectedFriend?.userName}
        />
      </div>
      <div className="chat_header_right">
        <div className="chat_header_right_left">
          <p className="chat_header_username">{selectedFriend?.userName}</p>

          <p className="chat_header_online">
            {realTimeFriend ? "Online" : selectedFriend?.phoneNumber}
          </p>
        </div>
        <div className="chat_header_right_right">
          {/* <Tooltip title="Search">
              <IconButton>
                <SearchSharpIcon sx={{ color: CustomColors.blue }} />
              </IconButton>
            </Tooltip> */}

          {showMenu ? <ChatMoreMenu setChatStatus={setChatStatus} /> : <></>}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
