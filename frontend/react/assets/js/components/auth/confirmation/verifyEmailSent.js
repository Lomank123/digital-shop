import { Box, Button } from "@material-ui/core";
import React, { Component } from "react";
import { blankAxiosInstance } from "../../../axios";
import { signupEmailResendURL } from "../../../urls";
import history from "../../../history";

import '../../../../styles/auth/auth.css';


export default function VerifyEmailSent() {
  const email = history.location.state.email;

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      signupEmailResendURL,
      { email: email },
      { withCredentials: true }
    ).catch((err) => {
      console.log(err.response);
    });
  }

  return(
    <Box className="default-block auth-block">
      <h3 className="auth-h3">Email verification message sent</h3>
      <Box textAlign={'center'}>
        <span>
          Email message has been sent. Check your mail.
          If you don't see any, try to resend it by pressing the button below.
        </span>
      </Box>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn resend-confirm-btn"
          type="button"
          fullWidth
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