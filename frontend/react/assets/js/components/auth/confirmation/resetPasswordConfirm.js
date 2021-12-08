import { Box, Link } from "@material-ui/core";
import React, { Component } from "react";


export default class ResetPasswordConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // Maybe we should add a button instead of a link here
  render() {
    return(
      <div>
        <h3>Password reset successful</h3>
        <p>Your password has been reset. Now you need to log in again.</p>
        <Box>
          <Link href="/login">Log in</Link>
        </Box>
      </div>
    );
  }

}