import React, { useContext, useEffect, useState } from "react";
import "./ConnectionList.css";
import { ChatifyContext } from "../../context/context";
import { Avatar, Skeleton } from "@mui/material";
import { Time } from "../../constants/constants";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CustomColors from "../../constants/colors";

function ConnectionList(props) {
  const {
    fetchConnections,
    currentUser,
    connectionsStatus,
    setConnectionsStatus,
    connections,
    screenWidth,
  } = useContext(ChatifyContext);

  const [filteredConnections, setFilteredConnections] = useState([]);
  const [connectionsQuery, setConnectionsQuery] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    fetchConnections();
  }, [currentUser]);

  const connectionsSearch = (e) => {
    setFilteredConnections([]);
    let value = e.target.value;
    setConnectionsQuery(value);
    value = value.trim();
    if (!value.length) {
      setConnectionsStatus("results");
    }
    value = value.toLowerCase();
    let filtered = connections.filter((connection) => {
      let nameMatch = connection.userName.toLowerCase().includes(value);
      let numberMatch = connection.phoneNumber.toLowerCase().includes(value);
      return nameMatch || numberMatch;
    });
    setFilteredConnections(filtered);
    if (filtered.length) {
      setConnectionsStatus("filtered");
    } else {
      setConnectionsStatus("filtered_empty");
    }
  };

  return (
    <>
      {connectionsStatus === "filtered" ||
      connectionsStatus === "results" ||
      connectionsStatus === "filtered_empty" ? (
        <ConnectionSearch
          searchValue={connectionsQuery}
          handleChange={connectionsSearch}
        />
      ) : connectionsStatus === "loading" ? (
        <Skeleton
          variant="rounded"
          height={30}
          width="90%"
          sx={{ margin: "10px auto" }}
        />
      ) : (
        <></>
      )}
      <div className="friend_list_container">
        {connectionsStatus === "loading" ? (
          Array(10)
            .fill(null)
            .map((_, i) => (
              <div key={i} style={{ display: "flex", margin: "5px 15px" }}>
                <div style={{ marginRight: "15px" }}>
                  <Skeleton variant="circular" width={40} height={40} />
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    sx={{ margin: "2px 0" }}
                    width="80%"
                    height={10}
                  />
                  <Skeleton
                    variant="rounded"
                    sx={{ margin: "2px 0" }}
                    width="80%"
                    height={10}
                  />
                </div>
              </div>
            ))
        ) : connectionsStatus === "no results" ? (
          <p className="no_friend">
            There is no friend in this list. Click search friends to add friends
          </p>
        ) : connectionsStatus === "results" ? (
          <>
            {connections.map((connection) => (
              <ConnectionListItem
                connection={connection}
                key={connection.userId}
              />
            ))}
          </>
        ) : connectionsStatus === "filtered" ? (
          <>
            {filteredConnections.map((connection) => (
              <ConnectionListItem
                connection={connection}
                key={connection.userId}
              />
            ))}
          </>
        ) : connectionsStatus === "filtered_empty" ? (
          <p className="no_friend">No friend found!</p>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

const ConnectionListItem = ({ connection }) => {
  const { clipWords, setSelectedFriend, selectedFriend } =
    useContext(ChatifyContext);
  const [hovered, setHovered] = useState(false);

  const handleFriendClick = () => {
    setSelectedFriend(connection);
  };

  return (
    <div
      className="connection_container"
      style={{
        backgroundColor:
          selectedFriend?.userId === connection.userId || hovered
            ? CustomColors.lightBlue
            : CustomColors.pureWhite,
      }}
      onClick={handleFriendClick}
      onMouseEnter={(e) => setHovered(true)}
      onMouseLeave={(e) => setHovered(false)}
    >
      <div className="connection_avatar">
        <Avatar src={connection?.photoUrl} alt={connection?.userName} />
      </div>
      <div className="connection_content">
        <p className="connection_username">{connection?.userName}</p>
        <p className="connection_lastmessage">
          {clipWords(connection?.lastMessage?.content, 25)}
        </p>
      </div>
      <div className="connection_auxiliary">
        <p
          className="last_message_time"
          style={{
            color: connection?.unreadCount
              ? CustomColors.blue
              : CustomColors.textGrey,
          }}
        >
          {Time.relativeDate(connection?.lastMessage?.dateCreated)}
        </p>
        {connection?.unreadCount ? (
          <div className="unread_badge">
            <p>{connection?.unreadCount}</p>
          </div>
        ) : (
          <div className="unread_badge_hidden">
            <p>{connection?.unreadCount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ConnectionSearch = ({ searchValue, handleChange }) => {
  return (
    <div className="conn_search_wrapper">
      <SearchSharpIcon sx={{ margin: "0 15px" }} />
      <input
        className="conn_search_input"
        placeholder="Search my friends"
        value={searchValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default ConnectionList;
