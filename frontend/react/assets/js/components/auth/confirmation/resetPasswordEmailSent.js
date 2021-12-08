import React, { Component } from "react";
import { passwordResetURL } from "../../../urls";
import { blankAxiosInstance } from "../../../axios";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import history from "../../../history";



export default class ResetPasswordEmailSent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: history.location.state.email,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      passwordResetURL, { email: this.state.email }).then((res) => {
				console.log(res.data.detail);
      }).catch((err) => {
        console.log(err.response);
      });
  }

  render() {
    return(
      <div>
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
						onClick={this.handleSubmit}
					>
						Resend confirmation message
					</Button>
        </Box>
      </div>
    );
  }
}