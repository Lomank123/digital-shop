import { Box, Link } from "@material-ui/core";
import React, { Component } from "react";


export default class ChangePasswordConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return(
      <div>
        <p>Your password has been reset. Now you need to log in again.</p>
        <Box>
          <Link href="/login">Log in</Link>
        </Box>
      </div>
    );
  }

}