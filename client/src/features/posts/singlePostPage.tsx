import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUserId } from '../auth/authSlice'
import { useGetPostQuery, useRemovePostMutation } from '../api/apiSlice'
import { Spinner } from '../../components/Spinner'
import { toastDisplay } from '../../utils/helper'
import PostCard from './PostCard'
import { IconButton, Container, Box, Typography } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

export const SinglePostPage = () => {
  const { postId } = useParams()
  const userId = useAppSelector(selectCurrentUserId)
  const {data: post, isLoading, isSuccess, isError, error} = useGetPostQuery(postId!)
  const [removePost, { isSuccess: isRemovePostSuccess }] = useRemovePostMutation();
  const canEdit = userId === post?.creatorId ? true : false

  if(isLoading) return <Spinner text={"Fetching Post"} size={"5"} />
  if(isError) return <div>Error: {JSON.stringify(error)}</div>
  if (isSuccess && !post) {
    return (
      <Container maxWidth='md' sx={{ pt: 4 }}>
        <Typography variant="h5" textAlign={"center"} color='text.secondary' sx={{ mt:2, ml:2 }}>Post Unavailable</Typography>
      </Container>
    )
  }

  const handleRemovePost = (postId: string) => {
    if(window.confirm("Are you sure you want to delete this post?")) {
      removePost(postId);
    }
  }

  if(isRemovePostSuccess) {
    toastDisplay("Post Deleted successfully");
  }

  if(isSuccess && post) {
    console.log("post -> ", post);
    return (
      <Container maxWidth='md' sx={{ pt: 4 }}>
          <Box sx={{  position: 'relative', display: 'flex'}}>
            <PostCard post={post} />
            { canEdit && 
                <IconButton onClick={() => handleRemovePost(post.id)} sx={{ position: 'absolute', top: 0, right: 0 }}>
                  <DeleteIcon />
                </IconButton>
            }
          </Box>
      </Container>
    )
  }
}