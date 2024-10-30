import { IconButton, Toolbar, Typography } from "@mui/material";
import { FavoriteBorderOutlined, Favorite} from '@mui/icons-material';
import { Post } from "./postsSlice";
import { useCallback } from "react";
import { debounce } from 'lodash'
import { useLikePostMutation } from "../api/apiSlice";


const LikeButton = ({post}: { post: Post}) => {

    const [ likePost ] = useLikePostMutation();
    const debounceLikePost = useCallback(debounce((postId) => {
        likePost(postId).unwrap();
      }, 200), [likePost]);

      const handleLikePost = async () => {
        try {
          debounceLikePost({userId: post.creatorId, postId: post.id })
        } catch (err) {
          console.error('Failed to add reaction: ', err)
        }
      }

    return (
        <Toolbar onClick={handleLikePost}>
            <IconButton aria-label="like">
              {post.likes_count > 0 && post.isLiked ? <Favorite sx={{ color: "red"}} /> : <FavoriteBorderOutlined /> }
              <Typography>{post.likes_count}</Typography>
            </IconButton>
            <Typography>Like</Typography>
        </Toolbar>
    )
}

export default LikeButton;