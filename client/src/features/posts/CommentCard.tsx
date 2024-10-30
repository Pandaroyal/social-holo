import { ReactNode, useState } from 'react';
import { Card, CardContent, CardActions, IconButton, Typography, Box, Toolbar, TextField } from '@mui/material';
import { Reply } from '@mui/icons-material'
import { PostAuthor } from './PostAuthor';
import { useGetCommentsQuery } from '../api/apiSlice';
import { Comment } from './postsSlice';

interface CommentCardProps {
  postId: string
  parentCommentId?: string, 
  onReplyClick: (parentCommentId: string, commenterName: string, content: string) => void 
}

const CommentCard = ({ postId, parentCommentId, onReplyClick }: CommentCardProps) => {

  const [openComments, setOpenComments] = useState(false);
  let comments: Comment[] = [];
  if(parentCommentId){
    const { data, isSuccess } = useGetCommentsQuery({postId, parentCommentId});
    comments = isSuccess ? [...data] : [];
  }else{ 
    const { data, isSuccess } = useGetCommentsQuery({postId});
    comments = isSuccess ? [...data] : [];
  }
  let cardContent: ReactNode | ReactNode[]
  if(comments.length > 0){
    cardContent = comments.map(comment => {  
        return (
          <Card key={comment.id} sx={{ maxWidth:"600px", backgroundColor: "#252525", padding: 2 }}>
            <PostAuthor style={{padding: "0 20px"}} userId={comment.commenterId} createdAt={comment.createdAt} />
            <CardContent sx={{padding: "0 75px"}}>
              <Typography variant="body1" color="text.primary">
                {comment?.content}
              </Typography>
            </CardContent>
          
            <CardActions sx={{height: "40px", padding: "0 35px"}}> 
              <Toolbar>
                <IconButton onClick={() => onReplyClick(comment.id, comment.commenterName, comment.content)} aria-label="comment">
                  <Reply />
                  <Typography>reply</Typography>
                </IconButton>              
              </Toolbar>
            </CardActions>
            { comment.replies_count != 0 && <Typography sx={{textAlign: "center"}} onClick={() => setOpenComments(!openComments)}>{openComments ? "Hide Replies" : `------ View ${comment.replies_count} Replies ------`}</Typography>}
            { openComments && 
              <CommentCard postId={comment.postId} parentCommentId={comment.id} onReplyClick={onReplyClick} />
            }
          </Card>
      )})
  }else{
    cardContent =
      <Card>
        <Typography>No comments</Typography>
      </Card>
  } 
  
  return (
    <Box position="relative" maxHeight="300px" overflow="auto"
      sx={{ 
        backgroundColor:"#212121",
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        'msOverflowStyle': 'none', // hide scrollbar in IE and Edge
        'scrollbarWidth': 'none',    // hide scrollbar in Firefox
    }} >
        {cardContent}
    </Box>
  );
};

export default CommentCard;
