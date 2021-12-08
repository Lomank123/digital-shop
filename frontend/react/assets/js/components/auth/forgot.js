import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { blankAxiosInstance } from '../../axios';
import { passwordResetURL } from '../../urls';
import history from '../../history';
import { emailSentRoute } from '../../routeNames';


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

    blankAxiosInstance.post(
      passwordResetURL, {
        email: this.state.email,
      }).then((res) => {
        history.push({
          pathname: history.location.pathname + emailSentRoute,
          state: {
            email: this.state.email,
          },
        });
        //console.log(res.data);
      }).catch((err) => {
        this.setState({ errors: {
          email: err.response.data.email,
        }})
        console.log(err.response);
      })
  }

  render() {
    return(
      <div>
        <h3>Forgot password</h3>
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