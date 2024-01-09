import { Avatar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ChatMoreMenu from "../MoreMenu/ChatMoreMenu";
import { ChatifyContext } from "../../context/context";
import CustomColors from "../../constants/colors";
import { Time } from "../../constants/constants";

function ChatHeader({ realTimeFriend, setChatStatus, showMenu, style }) {
  const { selectedFriend } = useContext(ChatifyContext);
  const [lastSeen, setLastSeen] = useState(realTimeFriend?.onlineStatus);

  useEffect(() => {
    setLastSeen(realTimeFriend?.onlineStatus);
  }, [realTimeFriend]);

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
            {lastSeen
              ? Time.formatLastSeen(lastSeen)
              : selectedFriend?.phoneNumber}
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
