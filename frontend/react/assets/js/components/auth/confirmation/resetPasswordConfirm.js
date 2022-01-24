import React from "react";
import { Box, Button } from "@material-ui/core";
import { loginURL } from "../../../urls";
import history from "../../../history";

import '../../../../styles/auth/auth.css';

export default function ResetPasswordConfirm() {

  const handleRedirect = (e) => {
    e.preventDefault();
    history.push(loginURL);
  } 

  return(
    <Box className="default-block auth-block">
      <h3 className="auth-h3">Password reset successful</h3>

      <Box textAlign={'center'}>
        <p>Your password has been reset. Now you need to log in again.</p>
      </Box>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn"
          type="button"
          variant="contained"
          color="primary"
          onClick={handleRedirect}
        >
          Log in
        </Button>
      </Box>

    </Box>
  );
}