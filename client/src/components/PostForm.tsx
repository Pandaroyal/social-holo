import { useState } from 'react';
import { Box, Button, TextField, IconButton, Typography, Input, ImageList, ImageListItem } from '@mui/material';
import Picker from '@emoji-mart/react';
import Cropper from 'react-easy-crop';
import { Cancel, AddPhotoAlternate, Height } from '@mui/icons-material';
import { getCroppedImg } from '../utils/getCropImg'

const PostForm: React.FC = () => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1);
  const [point, setPoint] = useState({x: 0, y: 0});
  const [crop, setCrop] = useState({ x:0, y:0, width:100, height: 100 });
  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  // Add emoji to text
  const addEmoji = (emoji: any) => {
    setText(text + emoji.native);
  };

  // Handle image crop zoom
  const handleZoomChange = (value: number) => {
    setZoom(value);
  };

  const handleCrop = async (selectedImage: any) => {
    const file = await getCroppedImg(URL.createObjectURL(selectedImage), crop);
    console.log("file -> ", file);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4">Create a Post</Typography>

      {/* Text Field for post content */}
      <TextField
        label="Write something"
        multiline
        rows={4}
        fullWidth
        value={text}
        onChange={handleTextChange}
        variant="outlined"
      />

      {/* Emoji Picker Toggle */}
      <Box sx={{ position: 'relative' }}>
        <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          Add Emoji
        </Button>
        {showEmojiPicker && (
          <Box sx={{ position: 'absolute', zIndex: 100 }}>
            <Picker onSelect={addEmoji} />
          </Box>
        )}
      </Box>

      {/* File input to select multiple images/videos */}
      <Button
        variant="contained"
        component="label"
        startIcon={<AddPhotoAlternate />}
      >
        Upload Images/Videos
        <Input
          type="file"
          hidden
          inputProps={{ multiple: true }}
          onChange={handleFileChange}
        />
      </Button>

      {/* Display selected files (images/videos) */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {files.map((file, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <img
              src={URL.createObjectURL(file)}
              alt={`selected-file-${index}`}
              width={100}
              height={100}
              style={{ objectFit: "cover" }}
              onClick={() => setSelectedImage(file)}
            />
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => setFiles(files.filter((_, i) => i !== index))}
            >
              <Cancel />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {files.map((file, index) => (
          <ImageListItem key={index}>
            <img
              srcSet={URL.createObjectURL(file)}
              src={URL.createObjectURL(file)}
              alt={file.name}
              loading="lazy"
              onClick={ () => setSelectedImage(file)}
            />
          </ImageListItem>
        ))}
      </ImageList> */}

      {/* Image Editor (only shows if an image is selected) */}
      {selectedImage && (
        <Box sx={{ mt: 2, position: 'relative', width: '100%', height: 300 }}>
          <Typography variant="h6">Edit Image</Typography>
          <Cropper
            image={URL.createObjectURL(selectedImage)}
            zoom={zoom}
            onZoomChange={handleZoomChange}
            aspect={1.5}
            crop={point} // initial crop values
            onCropChange={(crop) => setPoint(crop)} // handle crop changes
            onCropComplete={(crop) => setCrop(crop)}
          />
          <Button variant="contained" onClick={() => handleCrop(selectedImage)}>
            Done
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PostForm;
