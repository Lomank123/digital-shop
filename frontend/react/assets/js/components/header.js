import React, { Component, useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import history from '../history';
import { loginRoute, logoutRoute, signupRoute } from '../routeNames';
import { blankAxiosInstance } from '../axios';
import { userGetURL } from '../urls';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../utils';


export default function Header() {
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);
  const firstRender = useRef(false);

  const logoutbutton = (
    <Box>
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

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch])

  useEffect(() => {
    if (userData !== null) {
      return logoutbutton;
    } else {
      return loginbutton;
    }
    //console.log(userData);
  }, [userData])

  return (
    <React.Fragment>
      { (userData !== null) ? logoutbutton : loginbutton
      
      }
      <p>This is the header!</p>
    </React.Fragment>
  );
} 
