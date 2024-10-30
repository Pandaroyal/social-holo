import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, CardContent, Grid, Typography, List, ListItem, ListItemAvatar, ListItemText, Container, TextField, InputAdornment, IconButton } from '@mui/material';
import { Followers, useFollowMutation, useGetFollowersQuery, useGetFollowingQuery, useGetRequestsQuery, useSearchQuery, useUnfollowMutation } from './usersSlice';
import { useAppSelector } from '../../app/hooks';
import { Link } from 'react-router-dom';
import { UserCard } from './UserCard';
import { UsersListType } from '../../utils/constants';

const UsersRecord = ({listName, type, id, height}: {listName?: string, type?: string, id?: string, height?: string}) => {
  console.log("searchTerm -> ", id, type, listName);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // Debounced value
  let users = [] as Followers[];

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if(searchTerm.length > 3)
        setDebouncedSearchTerm(searchTerm); // Update debounced value after delay
    }, 500); // 500ms debounce time

    // Clean up the timeout if the searchTerm changes before the delay is over
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, type, id]); // Only run this effect if searchTerm changes

  if(type === UsersListType.FOLLOWERS && id){
    const { data } = useGetFollowersQuery({followerId: id, search: debouncedSearchTerm});
    users = data || [];
  }else if(type === UsersListType.FOLLOWINGS && id){
    const { data } = useGetFollowingQuery({followingId: id, search: debouncedSearchTerm});
    users = data || [];
  }else if(type === UsersListType.REQUESTS && id){
    const { data } = useGetRequestsQuery();
    users = data || [];
  }else{
    const { data } = useSearchQuery(debouncedSearchTerm);
    users = data || [];
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update input value
  };

  return (
    <Container maxWidth={"xl"} sx={{ height: `${height || "100%"}`}} >
      {listName && <Typography paddingLeft={2} variant="h5">{listName}</Typography>}
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 2 }}>
        <TextField
          label="Search"
          variant="standard"
          value={searchTerm}
          onChange={handleInputChange}
          sx={{ 
            marginTop: 1,
            minWidth: "300px",
            maxWidth: "500px",
            position: 'sticky',
          }}
        />
      </Container>
      <List sx={{ height: "90%", overflow: "auto"}}>
        {users.length > 0 
          ? users.map((user) => (
              <UserCard key={user.id} {...user} />
            ))
          : <Typography sx={{ textAlign: 'center' }} variant="h6">No users found</Typography>
      }
      </List>
    </Container>
  );
};

export default UsersRecord;
