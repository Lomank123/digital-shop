import React from "react";
import { useSelector } from "react-redux";
import { Box, Button } from "@material-ui/core";
import { logoutRoute, loginRoute, signupRoute } from "../routeNames";


export default function LoginBox() {

  const userData = useSelector(state => state.user);

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

  let renderButton = logoutbutton;
  if (userData === 1) {
    renderButton = loginbutton;
  }

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
        {renderButton}
      </Box>
      <p>This is Auth component!</p>
    </>
  );
}