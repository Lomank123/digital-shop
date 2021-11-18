import React, { Component } from 'react';
import axiosInstance from '../axios';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        username: '',
        password: '',
      },
      username: '',
      password: '',
    }
  }

  // Handles changes in text fields
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value.trim()});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.username);

    axiosInstance.post(
      'http://127.0.0.1:8000/api/token/', {
        username: this.state.username,
        password: this.state.password,
      }).then((res) => {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        axiosInstance.defaults.headers["Authorization"] = 'Bearer ' + localStorage.getItem('access_token');
        // this.props.history.push('/');
        // this.props.location.push('/');
        window.location.href = '/';
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
					label="Email Address"
					name="username"
					autoComplete="username"
					autoFocus
					onChange={this.handleChange}
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
      </div>
    )
  }

}