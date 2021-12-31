import React, { useLayoutEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { loginRoute, logoutRoute, signupRoute, profileRoute } from '../routeNames';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import history from '../history';
import { Menu, MenuItem, Tooltip, IconButton, Avatar } from '@material-ui/core';
import { axiosInstance } from '../axios';
import { userGetURL } from '../urls';


export default function Header() {
  const userData = useSelector(state => state.user, shallowEqual);
  const dispatch = useDispatch();
  
  useLayoutEffect(() => {
    axiosInstance.get(userGetURL, {params: {redirect: false}}).then((res) => {
      //console.log(res);
      console.log("Header done!");
      const rawData = res.data[0];
      const userData = {
        email: rawData.email,
        username: rawData.username,
        id: rawData.id,
        photo: rawData.photo,
      }
      dispatch({
        type: 'get_user',
        payload: userData,
      })
      
    }).catch((err) => {
      //console.log(err);
      console.log("Header error");
      dispatch({
        type: 'get_user',
        payload: 1,
      })
    });
  }, [])

  // Menu stuff
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Handles redirect
  const handleClickRedirect = (e, route) => {
    handleCloseMenu();
    history.push('/' + route);
  }

  const notLoggedIn = (
    <Box display={'flex'}>
      <Button onClick={e => handleClickRedirect(e, loginRoute)}>Login</Button>
      <Button onClick={e => handleClickRedirect(e, signupRoute)}>Sign up</Button>
    </Box>
  )

  const links = (
    <Box className='links-box'>
      <Link className='header-link' to="/">Home</Link>
      <Link className='header-link' to="/test">About</Link>
      <Link className='header-link' to="/">News</Link>
      <Link className='header-link' to="/">Shop</Link>
    </Box>
  )

  // If tokens were expired this will prevent from rendering loggedIn buttons
  let loggedIn = null;

  if (userData !== null && userData !== 1) {
    loggedIn = (
      <Box display={'flex'}>
        <Button
          id='profile-button'
          aria-controls='profile-menu'
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickMenu}
        >
          {userData.username}
          <img className='avatar' src={userData.photo} />
        </Button>
        <Menu
          id='profile-menu'
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          open={open}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'profile-button',
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={e => handleClickRedirect(e, profileRoute)}>Profile</MenuItem>
          <MenuItem onClick={e => handleClickRedirect(e, logoutRoute)}>Log out</MenuItem>
        </Menu>
      </Box>
    )
  }

  const mainBox = (
    <Box className='header-main'>
      <Box className='header-block'>
        <Box className='logo'>
          <span className='logo-text'>Digital Shop</span>
        </Box>
        {links}
        <Box className='auth-links-box'>
          {
            (userData !== null) ? (
              (userData !== 1) ? loggedIn : notLoggedIn
            ) : null
          }
        </Box>
      </Box>
    </Box>
  )

  return (
    <>
      {mainBox}
    </>
  );
} 
