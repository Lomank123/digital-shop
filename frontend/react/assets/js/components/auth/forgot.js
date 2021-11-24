import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { axiosInstance } from '../../axios';
import { passwordResetURL } from '../../urls';


export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: {
        email: '',
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
      passwordResetURL, {
        email: this.state.email,
      }).then((res) => {
        // Perhaps you should redirect to email sent confirmed page
        //window.location.href = '/';
        console.log(res.data);
      }).catch((err) => {
        this.setState({ errors: {
          email: err.response.data.email,
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
					id="email"
					label="Email Address"
					name="email"
					autoComplete="email"
					autoFocus
					onChange={this.handleChange}
          error={Boolean(this.state.errors.email)}
          helperText={this.state.errors.email}
				/>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					onClick={this.handleSubmit}
				>
					Send
				</Button>

      </div>
    )
  }

}