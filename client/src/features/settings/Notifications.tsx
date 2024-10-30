import { Box, Typography, List, ListItem, ListItemText, Switch, useTheme, Skeleton, ListItemIcon, Tooltip, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { HelpOutline } from '@mui/icons-material';
import { useToggleNotificationsMutation, useUpdateNotificationsSettingsMutation, NotificationsSettings } from './settingsSlice';
import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { editNotificationsSettings, switchNotification } from '../auth/authSlice';

interface EditNotificationsSettingsFormFields extends HTMLFormControlsCollection {
  followsNotification : HTMLInputElement
  requestsNotification : HTMLInputElement
  acceptsNotification : HTMLInputElement
  addPostsNotification : HTMLInputElement
  likesNotification : HTMLInputElement
  commentsNotification : HTMLInputElement
  repliesNotification : HTMLInputElement
  sharesNotification : HTMLInputElement
}
interface EditNotificationsSettingsFormElements extends HTMLFormElement {
  readonly elements: EditNotificationsSettingsFormFields
}

export const Notifications = () => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const [toggleNotification] = useToggleNotificationsMutation();
    const [updateNotificationsSettings] = useUpdateNotificationsSettingsMutation();


    const debounceToggleNotification = useCallback(debounce((isNotificationsOn: boolean) => {
      console.log("debounce toggle notification")  
      toggleNotification(isNotificationsOn);
    }, 500), []);

    const debounceUpdateNotificationsSettings = useCallback(debounce((data: NotificationsSettings ) => {
      console.log("debounce update notifications settings")
      updateNotificationsSettings(data);
    }, 500), []);

    const handleToggleNotificationSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
      const isNotificationsOn = event.target.checked;
      debounceToggleNotification(isNotificationsOn);
      dispatch(switchNotification(isNotificationsOn));
    }

    const handleNotificationsSettings = (event: React.FormEvent<EditNotificationsSettingsFormElements>) => {
      const elements = event.currentTarget.elements;
      const follows = elements.followsNotification.checked;
      const requests = elements.requestsNotification.checked;
      const accepts = elements.acceptsNotification.checked;
      const addPosts = elements.addPostsNotification.checked;
      const likes = elements.likesNotification.checked;
      const comments = elements.commentsNotification.checked;
      const replies = elements.repliesNotification.checked;
      const shares = elements.sharesNotification.checked;
      const data: NotificationsSettings = {follows, requests, accepts, addPosts, likes, comments, replies, shares}
      if(!(!follows && !requests && !accepts && !addPosts && !likes && !comments && !replies && !shares)) {
        console.log("update notifications settings")
        dispatch(editNotificationsSettings(data));
        debounceUpdateNotificationsSettings(data);
      }else{
        console.log("toggle notifications")
        debounceToggleNotification(!user?.isNotificationsOn);
        dispatch(switchNotification(!user?.isNotificationsOn));
      }
    }

    return (
      <Box p={2}>
        <Typography variant="h4" mb={2}>Account</Typography>
        {/* Settings List with Switches */}
        <List sx={{ flexGrow: 1, width: '100%' }}>
            { user
              ? <>
                  <ListItem
                      key={'isNotificationsOn'}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                        marginBottom: 2,
                        padding: "10px 20px",
                        borderRadius: 2,
                        width: '100%',
                      }}
                  >
                    <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <ListItemText primary={"Notifications"} />
                      <Tooltip title="If off, all notifications will turn off, and will not popup" followCursor>
                        <HelpOutline sx={{ fontSize: '20px' }}/> 
                      </Tooltip>
                    </Box>
                    <Switch edge="end" checked={!!user.isNotificationsOn} onChange={handleToggleNotificationSwitch}/>
                  </ListItem>
                  { user.isNotificationsOn ?
                      <form onChange={handleNotificationsSettings}>
                        <ListItem
                            key={'follow'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              marginBottom: 2,
                              padding: "10px 20px",
                              borderRadius: 2,
                              width: '100%',
                            }}
                        >
                          <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListItemText primary={"Follow"} />
                            <ListItemIcon> 
                              <Tooltip title="If off, follow notifications will not popup" followCursor>
                                <HelpOutline sx={{ fontSize: '20px' }}/> 
                              </Tooltip>
                            </ListItemIcon>
                          </Box>
                          <Switch name="followsNotification" edge="end" checked={!!user.follows} />
                        </ListItem>
                        <ListItem
                            key={'request'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              marginBottom: 2,
                              padding: "10px 20px",
                              borderRadius: 2,
                              width: '100%',
                            }}
                        >
                          <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListItemText primary={"Request"} />
                            <ListItemIcon> 
                              <Tooltip title="If off, follow request notifications will not popup" followCursor>
                                <HelpOutline sx={{ fontSize: '20px' }}/> 
                              </Tooltip>
                            </ListItemIcon>
                          </Box>
                          <Switch name="requestsNotification" edge="end" checked={!!user.requests} />
                        </ListItem>
                        <ListItem
                            key={'accept'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              marginBottom: 2,
                              padding: "10px 20px",
                              borderRadius: 2,
                              width: '100%',
                            }}
                        >
                          <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListItemText primary={"Accept"} />
                            <ListItemIcon> 
                              <Tooltip title="If off, request accept notifications will not popup" followCursor>
                                <HelpOutline sx={{ fontSize: '20px' }}/> 
                              </Tooltip>
                            </ListItemIcon>
                          </Box>
                          <Switch name="acceptsNotification" edge="end" checked={!!user.accepts} />
                        </ListItem>
                        <ListItem
                            key={'addPost'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              marginBottom: 2,
                              padding: "10px 20px",
                              borderRadius: 2,
                              width: '100%',
                            }}
                        >
                          <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListItemText primary={"Add Post"} />
                            <ListItemIcon> 
                              <Tooltip title="If off, add post notifications will not popup" followCursor>
                                <HelpOutline sx={{ fontSize: '20px' }}/> 
                              </Tooltip>
                            </ListItemIcon>
                          </Box>
                          <Switch name="addPostsNotification" edge="end" checked={!!user.addPosts} />
                        </ListItem>
                        <ListItem
                            key={'like'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              marginBottom: 2,
                              padding: "10px 20px",
                              borderRadius: 2,
                              width: '100%',
                            }}
                        >
                          <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListItemText primary={"Like"} />
                            <ListItemIcon> 
                              <Tooltip title="If off, likes notifications will not popup" followCursor>
                                <HelpOutline sx={{ fontSize: '20px' }}/> 
                              </Tooltip>
                            </ListItemIcon>
                          </Box>
                          <Switch name="likesNotification" edge="end" checked={!!user.likes} />
                        </ListItem>
                        <ListItem
                            key={'comment'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              marginBottom: 2,
                              padding: "10px 20px",
                              borderRadius: 2,
                              width: '100%',
                            }}
                        >
                          <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListItemText primary={"Comment"} />
                            <ListItemIcon> 
                              <Tooltip title="If off, comments notifications will not popup" followCursor>
                                <HelpOutline sx={{ fontSize: '20px' }}/> 
                              </Tooltip>
                            </ListItemIcon>
                          </Box>
                          <Switch name="commentsNotification" edge="end" checked={!!user.comments} />
                        </ListItem>
                        <ListItem
                            key={'reply'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              marginBottom: 2,
                              padding: "10px 20px",
                              borderRadius: 2,
                              width: '100%',
                            }}
                        >
                          <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListItemText primary={"Reply"} />
                            <ListItemIcon> 
                              <Tooltip title="If off, replies notifications will not popup" followCursor>
                                <HelpOutline sx={{ fontSize: '20px' }}/> 
                              </Tooltip>
                            </ListItemIcon>
                          </Box>  
                          <Switch name="repliesNotification" edge="end" checked={!!user.replies} />
                        </ListItem>

                        <ListItem
                            key={'share'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              marginBottom: 2,
                              padding: "10px 20px",
                              borderRadius: 2,
                              width: '100%',
                            }}
                        >
                          <Box display={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <ListItemText primary={"Share"} />
                            <ListItemIcon> 
                              <Tooltip title="If off, replies notifications will not popup" followCursor>
                                <HelpOutline sx={{ fontSize: '20px' }}/> 
                              </Tooltip>
                            </ListItemIcon>
                          </Box>  
                          <Switch name="sharesNotification" edge="end" checked={!!user.shares} />
                        </ListItem>
                    </form>
                    : <Typography textAlign={'center'} color='text.secondary'>All Notifications are turned off</Typography>
                  }   
                </>
              : <Skeleton variant="rectangular" width="100%" height={60} />
            }
        </List>
      </Box>
    )
}