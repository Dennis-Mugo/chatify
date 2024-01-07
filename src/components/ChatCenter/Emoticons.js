import React, { useContext, useState } from "react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import { IconButton, Popover } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { ChatifyContext } from "../../context/context";

function Emoticons({ mainChat, handleChange }) {
  const { screenWidth } = useContext(ChatifyContext);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSelect = (emojiObj) => {
    console.log(emojiObj);
    handleChange(emojiObj.emoji);
  };

  return (
    <>
      <IconButton sx={{ marginRight: "10px" }} onClick={handleOpen}>
        <EmojiEmotionsOutlinedIcon />
      </IconButton>
      <Popover
        open={open}
        onClose={handleClose}
        style={{}}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 70, left: screenWidth * 0.75 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <EmojiPicker onEmojiClick={handleSelect} />
      </Popover>
    </>
  );
}

export default Emoticons;
