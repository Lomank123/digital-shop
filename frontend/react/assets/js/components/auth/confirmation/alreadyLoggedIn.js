import React from "react";
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';


export default function AlreadyLoggedIn() {
  return (
    <>
      <h3>Already logged in</h3>
      <p>You have already logged in. Maybe you want to logout or go to home page?</p>
      <Box>
        <Link href="/" variant="body2">Home</Link>
        <br />
        <Link href="/logout" variant="body2">Logout</Link>
      </Box>
    </>
  );
}