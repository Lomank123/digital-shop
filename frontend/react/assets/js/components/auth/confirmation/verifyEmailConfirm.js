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
    // instead of a box and a link there shop
    return(
      <div>
        <p>Email message has been sent. If you don't see any, try to resend it.</p>
        <Box>
          <Link href="/">Resend confirmation message</Link>
        </Box>
      </div>
    );
  }

}