import React from "react";
import { passwordResetURL } from "../../../urls";
import { blankAxiosInstance } from "../../../axios";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import history from "../../../history";


export default function ResetPasswordEmailSent() {
  const email = history.location.state.email;

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      passwordResetURL, { email: email }).then((res) => {
				console.log(res.data.detail);
      }).catch((err) => {
        console.log(err.response);
      });
  }

  return(
    <>
      <h3>Reset password email sent</h3>
      <p>
        Email confirmation message has been sent. If you don't see any, press the button below to resend it.
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