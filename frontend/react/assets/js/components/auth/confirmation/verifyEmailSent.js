import { Box, Button } from "@material-ui/core";
import React, { Component } from "react";
import { blankAxiosInstance } from "../../../axios";
import { signupEmailResendURL } from "../../../urls";
import history from "../../../history";


export default function VerifyEmailSent() {
  const email = history.location.state.email;

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      signupEmailResendURL,
      { email: email },
      { withCredentials: true }
    ).then((res) => {
        //console.log(res.data);
    }).catch((err) => {
      console.log(err.response);
    });
  }

  return(
    <>
      <h3>Email verification message sent</h3>
      <p>
        Email message has been sent. Check your mail.
        If you don't see any, try to resend it by pressing the button below.
      </p>
      <Box>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Resend confirmation message
        </Button>
      </Box>
    </>
  );
}