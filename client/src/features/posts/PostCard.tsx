import { SetStateAction, useRef, useState } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography, Toolbar, TextField, InputAdornment, Dialog } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { Send as SendIcon } from '@mui/icons-material';
import { Post } from './postsSlice';
import { PostAuthor } from './PostAuthor';
import PostMediaSlider from '../../components/PostMediaSlider';
import LikeButton from './LikeButton';
import CommentCard from './CommentCard';
import { useAddCommentMutation } from '../api/apiSlice';
import EmojiPopover from '../../components/EmojiPopover';

const PostCard = ({ post }: { post: Post }) => {

  const [openComments, setOpenComments] = useState(false);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState({commentId: "", commenterName: "", comment: ""});
  const inputRef = useRef(null);
  const cursorPositionRef = useRef(null);  // To store cursor position

  const [addComment] = useAddCommentMutation();
  const handleCommentClick = () => {
    console.log("comment clikced");
    setOpenComments(prev => !prev);
  }

  const handleCursorChange = () => {
    const input = inputRef?.current as any;
    cursorPositionRef.current = input && input.selectionStart;  // Save the cursor position
  };


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

  const handelReplyClick = (commentId: string, commenterName: string, comment: string) => {
    setReplyTo({commentId, commenterName, comment});
    setContent(`@${commenterName} ${content}`) ;
  }

  const handleContentChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setContent(event?.target.value);
  }

  const handleSubmitComment = () => {
    if(replyTo.commentId) {
      addComment({ id: post.id, userId: post?.creatorId || '', body: { content, parentCommentId: replyTo.commentId } })
    }else{
      addComment({ id: post.id, userId: post?.creatorId || '', body: { content } })
    }
    setReplyTo({commentId: "", commenterName: "", comment: ""});
    setContent("");
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const isBackspace = event.key === 'Backspace';

    if (isBackspace && replyTo?.commenterName && (content.length <= replyTo.commenterName.length+2)) {
      event.preventDefault();
    }
  };
  
  return (
    <Card sx={{ margin: '20px auto', maxWidth:"800px" }}>
      <PostAuthor userId={post.creatorId} createdAt={post.createdAt} />
      { post?.content && (
        <CardContent sx={{padding: "10px 70px"}}>
          <Typography variant="body1" color="text.primary">
            {post.content}
          </Typography>
        </CardContent>
      )}
      
      { post?.media && <PostMediaSlider media={post?.media} /> }

      <CardActions sx={{marginTop: `${post.media && post.media.length > 1 ? '10px' : 0}`, padding: "0 40px"}}>
        <LikeButton post={post} />
        <Toolbar sx={{ minHeight: "40px", padding: "0 20px",
          '@media (max-width: 600px)': { minHeight: "40px", padding: "0 10px" }
        }} onClick={handleCommentClick}>
          <IconButton aria-label="comment">
            <CommentIcon />
            <Typography>{post.comments_count}</Typography>
          </IconButton>
          <Typography>Comment</Typography>
        </Toolbar>
      </CardActions>
      <Dialog open={openComments} maxWidth="xl" onClose={() => setOpenComments(false)}>
        <Typography variant='h5' padding={2}>Comment</Typography>
        <CommentCard postId={post.id} onReplyClick={handelReplyClick} />
        <TextField 
          inputRef={inputRef}
          type='text'
          label={replyTo.comment ? `Replying to ${replyTo.comment}` : "Add a comment"}  // "Replying to @${replyTo.commenterName}" : "comment"
          variant='filled'
          fullWidth
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}  // Capture keyboard events
          onKeyUp ={handleCursorChange}
          onClick = {handleCursorChange}
          sx={{ position: "sticky", bottom: "0"}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmojiPopover onEmojiClick={handleEmojiClick}/>
                <IconButton onClick={handleSubmitComment} disabled={!content.trim() || (content.trim() === replyTo?.commenterName)}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Dialog>
    </Card>
  );
};

export default PostCard;
