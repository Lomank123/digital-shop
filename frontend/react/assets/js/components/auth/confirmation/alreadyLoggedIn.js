import React from "react";
import { Box, Button } from "@material-ui/core";
import history from "../../../history";

import '../../../../styles/auth/auth.css';


export default function AlreadyLoggedIn() {

  const handleRedirect = (e) => {
    e.preventDefault();
    history.push('/');
  } 

  return (
    <Box className="default-block auth-block">
      <h3 className="auth-h3">Already logged in</h3>

      <Box textAlign={'center'}>
        <p>You have already logged in. Maybe you want to go to home page?</p>
      </Box>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn"
          type="button"
          variant="contained"
          color="primary"
          onClick={handleRedirect}
        >
          Home
        </Button>
      </Box>

    </Box>
  );
}