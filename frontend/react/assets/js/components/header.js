import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import history from '../history';
import { loginRoute, logoutRoute, signupRoute } from '../routeNames';
import { blankAxiosInstance } from '../axios';
import { userGetURL } from '../urls';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../utils';
import { CircularProgress } from '@material-ui/core';


export default function Header() {

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch])

  const logoutbutton = (
    <Box sx={{ display: 'inline', }}>
      <Button
        variant="outlined"
        href={'/' + logoutRoute}
        color="primary"
      >
        Logout
      </Button>
    </Box>
  )

  const loginbutton = (
    <Box sx={{
      display: 'inline',
    }}>
      <Button
        variant="outlined"
        href={'/' + loginRoute}
        color="primary"
      >
        Log in
      </Button>
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        Sign up
      </Button>
    </Box>
  )

  const button1 = (
    <Box
      sx={{ display: 'inline', }}
      className="box1" 
      id="box1">
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        1
      </Button>
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        6
      </Button>

      <Box id="buttons-box" sx={{ display: 'inline', }}>
        { (userData !== null) ? 
        ((userData !== 1) ? logoutbutton : loginbutton) :
        (<></>)
        }
      </Box>
      
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        2
      </Button>
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        3
      </Button>
      <Button
        variant="outlined"
        href={'/' + signupRoute}
        color="primary"
      >
        4
      </Button>

      <p>Loading...</p>
    </Box>
  )


  return (
    <React.Fragment>
      {button1}
      <p>This is the header!</p>
    </React.Fragment>
  );
} 
