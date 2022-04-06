import React, { useLayoutEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { loginRoute, logoutRoute, signupRoute, profileRoute, addProductRoute, cartRoute, ordersRoute, adminRoute } from '../routes';
import { shallowEqual, useSelector } from 'react-redux';
import history from '../history';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { getCart, getUser, getCartProductIds, getEmailAddress } from '../utils';
import { noImageURL, userDeleteCartCookieURL } from '../urls';
import { blankAxiosInstance } from '../axios';

import '../../styles/main/header.css';
import { ShoppingCart } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';


export default function Header() {
  const userData = useSelector(state => state.user, shallowEqual);
  const userCart = useSelector(state => state.cart, shallowEqual);
  const cartProductIds = useSelector(state => state.cartProductIds);
  // Use it to display different messages connected with unverified email
  const emailAddress = useSelector(state => state.emailAddress);

  // Translation
  const {t, i18n} = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  async function getData() {
    await getUser().then((res) => {
      console.log("Header done!");
    }).catch(async (err) => {
      console.log("Header error.");
      // Deleting user cart cookie if no user found
      await blankAxiosInstance.get(userDeleteCartCookieURL).then((res) => {
        console.log("User cart cookie has been deleted.");
      }).catch((error) => {
        console.log(error);
        console.log("Cart cookie deletion error.");
      });
    });

    await getCart().then((res) => {
      console.log("Get cart header done!");
    }).catch((err) => {
      console.log("Header get cart error.");
    });

    getCartProductIds().then((res) => {
      console.log("Get product ids header done!");
    }).catch((err) => {
      console.log("Product ids error.");
    });

    await getEmailAddress().then((res) => {
      console.log("EmailAddress get done!");
    }).catch((err) => {
      console.log("EmailAddress get error.");
    })
  }

  // Getting (and setting) user data
  useLayoutEffect(() => {
    getData();
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
      <Button onClick={e => handleClickRedirect(e, loginRoute)}>{t("login-text")}</Button>
      <Button onClick={e => handleClickRedirect(e, signupRoute)}>{t("signup-text")}</Button>
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

        {
          (userData.is_superuser) ? (
            <Button className='add-product-btn' onClick={e => {window.location.href = '/admin/'}}>
              Admin site
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
          <MenuItem onClick={e => handleClickRedirect(e, `${profileRoute}/${userData.id}/`)}>Profile</MenuItem>
          <MenuItem onClick={e => handleClickRedirect(e, ordersRoute)}>My orders</MenuItem>
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

  const langBox = (
    <Box className='language-change-block'>
      <Button className='ru-button' onClick={() => {changeLanguage("ru")}}>RU</Button>
      <Button className='en-button' onClick={() => {changeLanguage("en")}}>EN</Button>
    </Box>
  );

  const mainBox = (
    <Box className='header-main'>
      <Box className='header-block'>
        <Box className='logo'>
          <Link className='logo-text' to={'/'}>Digital Shop</Link>
        </Box>
        {langBox}
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
