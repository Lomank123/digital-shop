import React, { Component } from 'react';
import { axiosInstance } from '../../axios';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { tokenGetURL } from '../../urls';
import { accessToken, refreshToken } from '../../localStorageKeys';


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
			errors: {
				username: '',
				password: '',
				incorrect: '',
			}
    }
  }

  // Handles changes in text fields
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value.trim()});
  }

  handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance.post(
      tokenGetURL, {
        username: this.state.username,
        password: this.state.password,
      }).then((res) => {
        localStorage.setItem(accessToken, res.data.access);
        localStorage.setItem(refreshToken, res.data.refresh);
        axiosInstance.defaults.headers["Authorization"] = 'Bearer ' + localStorage.getItem(accessToken);
        window.location.href = '/';
      }).catch((err) => {
				this.setState({ errors: {
					username: err.response.data.username,
					password: err.response.data.password,
					incorrect: err.response.data.detail,
				}})
			})
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
					error={Boolean(this.state.errors.username) || Boolean(this.state.errors.incorrect)}
          helperText={this.state.errors.username || this.state.errors.incorrect}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password"
					onChange={this.handleChange}
					error={Boolean(this.state.errors.password) || Boolean(this.state.errors.incorrect)}
          helperText={this.state.errors.password || this.state.errors.incorrect}
				/>
				<FormControlLabel
					control={<Checkbox value="remember" color="primary" />}
					label="Remember me"
				/>

				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					onClick={this.handleSubmit}
				>
					Sign In
				</Button>

				<Box mt={2} textAlign={"right"}>
					<Link href="/forgot" variant="body2">
						Forgot password?
					</Link>
				</Box>
      </div>
    )
  }
}