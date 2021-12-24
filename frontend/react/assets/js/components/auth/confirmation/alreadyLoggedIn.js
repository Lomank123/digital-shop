import React from "react";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import { logoutRoute } from "../../../routeNames";


export default function AlreadyLoggedIn() {
  return (
    <>
      <h3>Already logged in</h3>
      <p>You have already logged in. Maybe you want to logout or go to home page?</p>
      <Box>
        <Link to="/">Home</Link>
        <br />
        <Link to={'/' + logoutRoute}>Logout</Link>
      </Box>
    </>
  );
}