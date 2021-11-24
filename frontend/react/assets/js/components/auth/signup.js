import React, { Component } from 'react';
import { axiosInstance } from '../../axios';
import { signupURL } from '../../urls';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password1: '',
      password2: '',
      errors: {
        username: '',
        email: '',
        mismatch_pw: '',
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

    axiosInstance.post(
      signupURL, {
        email: this.state.email,
        username: this.state.username,
        password1: this.state.password1,
        password2: this.state.password2,
        errors: '',
      }).then((res) => {
        // If all user data was correct maybe we should automatically login user
        // Or if a verification message was sent then redirect to related page
        //window.location.href = loginURL;
        console.log(res);
      }).catch((err) => {
        this.setState({ errors: {
          email: err.response.data.email,
          username: err.response.data.username,
          mismatch_pw: err.response.data.non_field_errors,
          password1: err.response.data.password1,
          password2: err.response.data.password2,
        }})
      });
  }

  render() {
    return(
      <div>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="username"
					label="Username"
					name="username"
					autoComplete="username"
					autoFocus
					onChange={this.handleChange}
          error={Boolean(this.state.errors.username)}
          helperText={this.state.errors.username}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="email"
					label="Email Address"
					name="email"
					autoComplete="example@gmail.com"
					autoFocus
          error={Boolean(this.state.errors.email)}
          helperText={this.state.errors.email}
					onChange={this.handleChange}
				/>
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
          error={Boolean(this.state.errors.password1) || Boolean(this.state.errors.mismatch_pw)}
          helperText={this.state.errors.password1 || this.state.errors.mismatch_pw}
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
          error={Boolean(this.state.errors.password2) || Boolean(this.state.errors.mismatch_pw)}
          helperText={this.state.errors.password2 || this.state.errors.mismatch_pw}
				/>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					onClick={this.handleSubmit}
				>
					Sign Up
				</Button>
      </div>
    );
  }
}