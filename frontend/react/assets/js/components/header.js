import React, { useLayoutEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { loginRoute, logoutRoute, signupRoute, profileRoute, addProductRoute, cartRoute } from '../routes';
import { shallowEqual, useSelector } from 'react-redux';
import history from '../history';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { getCart, getUser, getCartProductIds } from '../utils';
import { noImageURL } from '../urls';

import '../../styles/main/header.css';
import { ShoppingCart } from '@material-ui/icons';


export default function Header() {
  const userData = useSelector(state => state.user, shallowEqual);
  const userCart = useSelector(state => state.cart, shallowEqual);
  const cartProductIds = useSelector(state => state.cartProductIds, shallowEqual);
  
  // Getting (and setting) user data
  useLayoutEffect(() => {
    getUser(false).then((res) => {
      console.log("Header done!");
    }).catch((err) => {
      console.log("Header error.");
    });

    getCart().then((res) => {
      console.log("Get cart header done!");
    }).catch((err) => {
      console.log("Header get cart error.");
    });

    getCartProductIds().then((res) => {
      console.log("Get product ids header done!");
    }).catch((err) => {
      console.log("Product ids error.");
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

  if (cartProductIds === null) {
    return null;
  }

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
            <img
              className='avatar'
              src={
                    (userData.photo !== null && userData.photo !== "")
                    ? userData.photo
                    : noImageURL
                  } 
            />
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
          <MenuItem onClick={e => handleClickRedirect(e, profileRoute + '/' + userData.id + '/')}>Profile</MenuItem>
          <MenuItem onClick={e => handleClickRedirect(e, logoutRoute)}>Log out</MenuItem>
        </Menu>
      </Box>
    )
  }

  let cartBox = null;

  if (userCart !== null) {
    cartBox = (
      <Box className='cart-btn-block'>
        <IconButton
          className='cart-page-btn'
          onClick={e => handleClickRedirect(e, cartRoute + '/')}
        >
          <ShoppingCart />
          <span className='cart-products-number'>{cartProductIds.length}</span>
        </IconButton>
      </Box>
    );
  }

  const mainBox = (
    <Box className='header-main'>
      <Box className='header-block'>
        <Box className='logo'>
          <span className='logo-text'>Digital Shop</span>
        </Box>
        {links}
        {cartBox}
        <Box className='header-auth-block'>
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
