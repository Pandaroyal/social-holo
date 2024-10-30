import React, { useRef, useState } from 'react'
import { useAddNewPostMutation } from '../api/apiSlice'
import '../../index.css'
import { Spinner } from '../../components/Spinner'
import { Box, Button, IconButton, ImageList, ImageListItem, Input, TextField, Toolbar, Typography } from '@mui/material'
import { AddPhotoAlternate, Cancel } from '@mui/icons-material'
import EmojiPopover from '../../components/EmojiPopover'

export const AddPostForm = () => {

  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [addPost, { isLoading }] = useAddNewPostMutation();
  const inputRef = useRef(null);
  const cursorPositionRef = useRef(null);  // To store cursor position

  if(isLoading) return <Spinner text={"Saving Post"} size={"5"} />

  // Handle Emoji Selection
  const handleEmojiClick = (emoji: string) => {
    console.log(emoji);
    setContent(content => content+emoji);
    const emojiCode = emoji;
    const input = inputRef.current as any;
    const cursorPos = cursorPositionRef.current;

    if(cursorPos && input){
      // Insert emoji at the last recorded cursor position
      const textBeforeCursor = content.substring(0, cursorPos);
      const textAfterCursor = content.substring(cursorPos);

      const newText = textBeforeCursor + emojiCode + textAfterCursor;
      setContent(newText);

      // Restore the cursor position after inserting the emoji
      const newPos = cursorPos + emojiCode.length;
      setTimeout(() => {
        input.setSelectionRange(newPos, newPos); // Set the cursor position
        input.focus();
      }, 0);
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      console.log("select files -> ",files);
    }
  };

  // Handle post submission
  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content || files.length > 0) {
      const formData = new FormData();
      formData.append('content', content);
      files.forEach((file) => formData.append('files', file));
  
      // Call the addPost mutation
      addPost(formData).unwrap();

      // Reset the form
      setContent('');
      setFiles([]);
      e.currentTarget.reset();
    } else {
      console.warn('Both content and files are empty');
    }
  }

  const handleCursorChange = () => {
    const input = inputRef?.current as any;
    cursorPositionRef.current = input && input.selectionStart;  // Save the cursor position
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box component={'form'} onSubmit={handlePostSubmit} encType='multipart/form-data'>
        <Typography variant="h6">Add a Post</Typography>
        <TextField
          inputRef={inputRef}
          fullWidth
          value={content}
          onChange={(e)=> setContent(e.target.value)}
          onClick={handleCursorChange}  // Update cursor position on click
          onKeyUp={handleCursorChange}  // Update cursor position on key up
          placeholder="Write and share your post with your friends..."
          multiline
          rows={4}
        />
        { files && files.length > 0 &&
        <ImageList sx={{ mt:1, width: 500 }} cols={3} rowHeight={164}>
          {files.map((file, index) => (
              <ImageListItem key={index} sx={{ position: 'relative' }}>
                <img
                  srcSet={URL.createObjectURL(file)}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  width="100px"
                  height="100px"
                  loading="lazy"
                  style={{ objectFit: "cover" }}
                />
                <IconButton
                  sx={{ position: 'absolute', top: 0, right: 0 }}
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  <Cancel />
                </IconButton>
              </ImageListItem>
          ))}
        </ImageList>
        } 
        <Box sx={{ my:1, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <EmojiPopover onEmojiClick={handleEmojiClick}/>
            <Button
              variant="contained"
              component="label"
              sx={{ padding: 0, minWidth: '32px', background: 'transparent', boxShadow: "none", '&:hover': { boxShadow: "none" }}}
            > 
              <AddPhotoAlternate color='info' sx={{ boxShadow: "none"}}/> 
              <Input
                type="file"
                hidden={true}
                inputProps={{ multiple: true }}
                onChange={handleFileChange}
                sx={{display:'none'}}
              />
            </Button>
          </Box>
          <Box>
            <Button variant="contained" type="submit">Post</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}