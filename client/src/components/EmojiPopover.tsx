// components/EmojiPopover.js
import React, { useState } from 'react';
import { IconButton, Popover } from '@mui/material';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

const EmojiPopover = ({ onEmojiClick }: { onEmojiClick: any }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'emoji-popover' : undefined;

  return (
    <div>
      <IconButton aria-label="open emoji picker" onClick={handleClick}>
        <InsertEmoticonIcon />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Picker data={data} onEmojiSelect={(emoji: { native: any; }) => onEmojiClick(emoji.native)} />
      </Popover>
    </div>
  );
};

export default EmojiPopover;
