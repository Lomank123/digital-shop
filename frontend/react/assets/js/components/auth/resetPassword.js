import React, { Component } from 'react';
import { blankAxiosInstance } from '../../axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { passwordResetConfirmURL } from '../../urls';
import history from '../../history';
import { resetRoute, confirmRoute } from '../../routeNames';


export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password1: '',
      password2: '',
      errors: {
        uid: '',
        token: '',
        password1: '',
        password2: '',
      },
    }
  }

  // Handles changes in text fields
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value.trim()});
  }

  handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      passwordResetConfirmURL, {
        new_password1: this.state.password1,
        new_password2: this.state.password2,
        uid: this.props.match.params.uid,
        token: this.props.match.params.token,
      }).then((res) => {
        history.push(`/${resetRoute}/${confirmRoute}`);
        //console.log(res);
      }).catch((err) => {
        this.setState({ errors: {
          password1: err.response.data.new_password1,
          password2: err.response.data.new_password2,
          // Maybe need to create separate error block for errors like this (invalid token or uid)
          uid: err.response.data.uid,
          token: err.response.data.token,
        }})
        console.log(err.response);
      })
  }

  render() {
    return(
      <div>
        <h3>Reset password</h3>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="password1"
					label="Password"
					type="password"
					id="password1"
					autoComplete="current-password"
          error={Boolean(this.state.errors.password1) || Boolean(this.state.errors.uid) || Boolean(this.state.errors.token)}
          helperText={this.state.errors.password1 || this.state.errors.uid || this.state.errors.token}
					onChange={this.handleChange}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="password2"
					label="Confirm password"
					type="password"
					id="password2"
					autoComplete="confirm-password"
					onChange={this.handleChange}
          error={Boolean(this.state.errors.password2)}
          helperText={this.state.errors.password2}
				/>

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
    )
  }

}