import React from "react";
import "./ChatRight.css";

function ChatRight(props) {
  return (
    <div className="chat_right" style={{ ...props.style }}>
      <div className="chat_right_shadow"></div>
    </div>
  );
}

export default ChatRight;
