import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { loginRoute, logoutRoute, signupRoute, profileRoute } from '../routeNames';
import { useSelector } from 'react-redux';


export default function Header() {

  const userData = useSelector(state => state.user);

  const notLoggedIn = (
    <Box display={'flex'}>
      <Button href={'/' + loginRoute}>Login</Button>
      <Button href={'/' + signupRoute}>Sign up</Button>
    </Box>
  )

  const links = (
    <Box className='links-box'>
      <Link className='header-link' href="/">Home</Link>
      <Link className='header-link' to="/">About</Link>
      <Link className='header-link' to="/">News</Link>
      <Link className='header-link' to="/">Shop</Link>
    </Box>
  )

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
              (userData === 1) ? notLoggedIn : (
                <Box display={'flex'}>
                  <Button href={'/' + profileRoute}>{userData[0].username}</Button>
                  <Button href={'/' + logoutRoute}>Log out</Button>
                </Box>
              )
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
