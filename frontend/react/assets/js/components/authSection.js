import React, { Component, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../utils";
import { Box, Button } from "@material-ui/core";
import { logoutRoute, loginRoute, signupRoute } from "../routeNames";


// Rename to LoginBox
export default function Auth(props) {

  const dispatch = useDispatch();
  const userData = useSelector(state => state.user);

  // Perhaps if we want to get user data we should use useSelector() instead of an additional api call
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

  return (
    <>
      <Box
        id="buttons-box"
        border={3}
        width={200}
        height={150}
        display={'inline'}
        borderColor={'primary.main'}
        sx={{ 
          float: 'right',
        }}
      >
        { (userData !== null) ? 
          ((userData !== 1) ? logoutbutton : loginbutton) :
          (<></>)
        }
      </Box>
      <p>This is Auth component!</p>
    </>
  );
}