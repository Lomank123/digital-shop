import React from "react";
import { Box, Link } from "@material-ui/core";
import { loginURL } from "../../../urls";


export default function ResetPasswordConfirm() {
  return(
    <>
      <h3>Password reset successful</h3>
      <p>Your password has been reset. Now you need to log in again.</p>
      <Box>
        <Link href={loginURL}>Log in</Link>
      </Box>
    </>
  );
}