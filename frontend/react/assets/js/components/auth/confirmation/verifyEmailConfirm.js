import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { blankAxiosInstance } from "../../../axios";
import { signupVerifyEmailURL } from "../../../urls";


export default class VerifyEmailConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: this.props.match.params.key,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(signupVerifyEmailURL,
      { key: this.state.key, },
      { withCredentials: true, }
    ).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.log(err.response);
    });
  }

  render() {
    return(
      <div>
        <h3>Email confirmation</h3>
        <p>To confirm your email click the button below.</p>
        <Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					onClick={this.handleSubmit}
				>
					Confirm
				</Button>
      </div>
    );
  }

}