import { useEffect, useRef, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Custom Components & Pages
import { SinglePostPage } from "./features/posts/singlePostPage"
import { Header } from "./components/Header"
import { PageNotFound } from "./components/PageNotFound"
import Profile from "./features/users/profile"
import LoginPage from "./features/auth/LoginPage"
import SignupPage from "./features/auth/SignupPage"

// Other inbuilt components
import { Box, Container } from "@mui/material"

// socket related imports
import { socketService } from "./socket/socket"
import { listenForEvents } from "./socket/events/listenEvent"
import { events } from "./socket/socketEvents.constants"

// store & rtk query imports
import { connect } from "react-redux"
import { RootState } from "./app/store"
import { useAppDispatch } from "./app/hooks"
import { getUser } from "./features/auth/authSlice"

// theme imports
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material'
import Dashboard from "./pages/Dashboard"
import Home from "./components/Home"

import { lightTheme, darkTheme } from "./theme/theme"
import { UserPage } from "./features/users/UserPage"
import Settings from "./pages/Settings"
import { Account } from "./features/settings/Account"
import { User } from "./features/users/usersSlice"
import { Toaster } from 'react-hot-toast';
import { Privacy } from "./features/settings/Privacy"
import { Notifications } from "./features/settings/Notifications"
import ProtectedRoute from "./features/auth/ProtectedRoute"
import Footer from "./components/Footer"

const App = ({user}: {user: User | null}) => {

  const dispatch = useAppDispatch();
  const [isDarkMode, setIsDarkMode] = useState(user ? user.theme === 'dark' : true);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  // Use useRef to ensure the socket is only initialized once
  const socketInitialized = useRef(false);
  useEffect(() => {
    if(!user){
      dispatch(getUser());
    }
    if(user && !socketInitialized.current){
      console.log(user);
      socketService.initializeSocket('http://localhost:8000', { withCredentials: true });
      socketService.emitEvent(events.JOIN, user.id);
      listenForEvents(user);

      socketInitialized.current = true;
    }

    return () => {
      socketService.disconnect();
      socketInitialized.current = false; // In case you want to handle re-initialization elsewhere
    }
  }, [user]);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh'}}>
        <Router>
          <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>
          <Container maxWidth="xl" sx={{ paddingTop: '80px', height: "94vh", overflow: "hidden"}}>
            <Routes>
              <Route path="*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="/" element={<Home />} /> 
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="search" element={<UserPage />} />
                      <Route path="/posts/:postId" element={<SinglePostPage />} />
                      <Route path="/profile/:id" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} >
                        <Route path="account" element={<Account />} />
                        <Route path="privacy" element={<Privacy />} />
                        <Route path="notifications" element={<Notifications />} />
                      </Route>
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <Toaster />
          </Container>
          <Footer />
        </Router>
      </Box>
    </ThemeProvider>
  )
}

const MapStateToProps = (state: RootState) => ({
  user: state?.auth?.user
})

export default  connect(MapStateToProps)(App)