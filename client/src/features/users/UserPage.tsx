import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { Box, Tab } from '@mui/material'
import { CustomTabs } from '../../components/CustomTabs'
import { TabPanel } from '../../components/TabPanel'
import UsersRecord from './UsersRecord'
import { selectCurrentUserId } from '../auth/authSlice'
import { UsersListType } from '../../utils/constants'

export const UserPage = () => {

  const [tabIndex, setTabIndex] = useState(0);
  const userId = useAppSelector(selectCurrentUserId);


  const handleTabChange = (event: any, newValue: number) => {
    setTabIndex(newValue);
  };

  if(userId === null) {
    return (
      <section>
        <h2>User not found!</h2>
      </section>
    )
  }

  return (
    <Box sx={{ height: '100%' }}>
       <Box borderBottom={1} borderColor="divider">
        <CustomTabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="All Users" />
          <Tab label={UsersListType.FOLLOWERS} />
          <Tab label={UsersListType.FOLLOWINGS} />
          <Tab label={UsersListType.REQUESTS} />
        </CustomTabs>
      </Box>
      {/* Tab Panels */}
      <TabPanel value={tabIndex} index={0}>
        <UsersRecord height="90%" id={userId} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <UsersRecord  type={UsersListType.FOLLOWERS} id={userId} />
        {/* <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No Reels yet
        </Typography> */}
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <UsersRecord type={UsersListType.FOLLOWINGS} id={userId} />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <UsersRecord height="100%" type={UsersListType.REQUESTS} id={userId} />
      </TabPanel>
    </Box>
  )
}