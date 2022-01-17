import React, { useLayoutEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { loginRoute, logoutRoute, signupRoute, profileRoute, addProductRoute } from '../routes';
import { shallowEqual, useSelector } from 'react-redux';
import history from '../history';
import { Menu, MenuItem } from '@material-ui/core';
import { getUser } from '../utils';

import '../../styles/main/header.css';


export default function Header() {
  const userData = useSelector(state => state.user, shallowEqual);
  
  // Getting (and setting) user data
  useLayoutEffect(() => {
    getUser(false).then((res) => {
      console.log("Header done!");
    }).catch((err) => {
      console.log("Header error.");
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
    <Box className='no-login-btns'>
      <Button onClick={e => handleClickRedirect(e, loginRoute)}>Login</Button>
      <Button onClick={e => handleClickRedirect(e, signupRoute)}>Sign up</Button>
    </Box>
  )

  const links = (
    <Box className='links-block'>
      <Link className='link' to="/">Home</Link>
      <Link className='link' to="/test">About</Link>
      <Link className='link' to="/">News</Link>
      <Link className='link' to="/">Shop</Link>
    </Box>
  )

  // If tokens were expired this will prevent from rendering loggedIn buttons
  let loggedIn = null;

  if (userData !== null && userData !== 1) {
    loggedIn = (
      <Box className='loggedin-btns'>

        {
          (userData.seller) ? (
            <Button className='add-product-btn' onClick={e => handleClickRedirect(e, addProductRoute)}>
              Add product
            </Button>
          ) : null
        }

        <Button
          id='profile-button'
          aria-controls='profile-menu'
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickMenu}
        >
          <Box className='profile-btn'>
            <span>{userData.username}</span>
          </Box>
          <Box className='profile-btn'>
            <img className='avatar' src={userData.photo} />
          </Box>
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
        <Box className='auth-block'>
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
