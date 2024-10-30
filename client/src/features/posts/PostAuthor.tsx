import { Avatar, CardHeader, Typography, Skeleton } from '@mui/material'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../auth/authSlice'
import { TimeAgo } from '../../components/TimeAgo'
import { useGetUserQuery } from '../users/usersSlice'
import { Link } from 'react-router-dom'

interface PostAuthorProps {
  userId: string | null
  createdAt?: string
  style?: React.CSSProperties
}

export const PostAuthor = ({ userId, createdAt, style }: PostAuthorProps) => {
  const { data: author } = useGetUserQuery(userId as string);
  const user = useAppSelector(selectCurrentUser);
  if(!author){
    return (
      <CardHeader sx={style}
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" width={130} />}
        subheader={<Skeleton variant="text" width={110} />}
      />
    )
  }
  return (
    createdAt
    ? <CardHeader sx={style} component={Link} to={`/profile/${author.id}`}
      avatar={<Avatar src={author.avatar} aria-label="user-avatar" />}
      title={ user ? author.id === user.id ? 'You' : author.username : <Skeleton variant="text" width={130} />}
      subheader={<TimeAgo timestamp={createdAt} />}
    />
    : <Typography sx={{ color: "#212121"}}>@{author.avatar}</Typography>
  );
}