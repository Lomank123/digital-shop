import React, { useState } from 'react';
import { blankAxiosInstance } from '../../axios';
import { signupURL } from '../../urls';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import history from '../../history';


export default function Signup() {
	// Signup form
	const initialFormData = Object.freeze({
    email: '',
    username: '',
    password1: '',
    password2: '',
	});
	const [formData, setFormData] = useState(initialFormData);

	// Field error messages
	const errorsInitialState = {
		username: '',
		email: '',
		mismatch_pw: '',
		password1: '',
		password2: '',
	};
	const [errors, setErrors] = useState(errorsInitialState);

		// Handles changes in fields
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value.trim()
		});
	};

	const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      signupURL, {
        email: formData.email,
        username: formData.username,
        password1: formData.password1,
        password2: formData.password2,
        errors: '',
      }).then((res) => {
				//console.log(res.data);
				history.push({
          pathname: history.location.pathname + 'email-sent',
          state: {
            email: formData.email,
          },
				});
      }).catch((err) => {
        setErrors({
          email: err.response.data.email,
          username: err.response.data.username,
          mismatch_pw: err.response.data.non_field_errors,
          password1: err.response.data.password1,
          password2: err.response.data.password2,
        });
				console.log(err.response);
      });
  }

	return(
		<>
			<h3>Signup</h3>
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
				onChange={handleChange}
				error={Boolean(errors.username)}
				helperText={errors.username}
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
				error={Boolean(errors.email)}
				helperText={errors.email}
				onChange={handleChange}
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
				error={Boolean(errors.password1) || Boolean(errors.mismatch_pw)}
				helperText={errors.password1 || errors.mismatch_pw}
				onChange={handleChange}
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
				onChange={handleChange}
				error={Boolean(errors.password2) || Boolean(errors.mismatch_pw)}
				helperText={errors.password2 || errors.mismatch_pw}
			/>
			<Button
				type="submit"
				fullWidth
				variant="contained"
				color="primary"
				onClick={handleSubmit}
			>
				Sign Up
			</Button>
		</>
	);
}