import React from "react";
import { passwordResetURL } from "../../../urls";
import { blankAxiosInstance } from "../../../axios";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import history from "../../../history";

import '../../../../styles/auth/auth.css';


export default function ResetPasswordEmailSent() {
  const email = history.location.state.email;

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      passwordResetURL, { email: email }).then((res) => {
      }).catch((err) => {
        console.log(err.response);
      });
  }

  return(
    <Box className="default-block auth-block">
      <h3 className="auth-h3">Reset password email sent</h3>

      <Box textAlign={'center'}>
        <span>
          Email confirmation message has been sent. If you don't see any, press the button below to resend it.
        </span>
      </Box>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn reset-resend-btn"
          type="button"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Send again
        </Button>
      </Box>

    </Box>
  );
}