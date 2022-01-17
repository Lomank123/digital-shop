import React from "react";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import { loginRoute } from "../../../routes";


export default function ResetPasswordConfirm() {
  return(
    <>
      <h3>Password reset successful</h3>
      <p>Your password has been reset. Now you need to log in again.</p>
      <Box>
        <Link to={'/' + loginRoute}>Log in</Link>
      </Box>
    </>
  );
}