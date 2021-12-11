import React, { useState } from 'react';
import { blankAxiosInstance } from '../../axios';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { tokenGetURL } from '../../urls';
import history from '../../history';


export default function Login(props) {
	// Login form
	const initialFormData = Object.freeze({
		username: '',
		password: '',
	});
	const [formData, setFormData] = useState(initialFormData);
	// Field error messages
	const errorsInitialState = {
		username: '',
		password: '',
		incorrect: '',
	};
	const [errors, setErrors] = useState(errorsInitialState);
	
	// Handles changes in fields
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value.trim()
		});
	};

	// Handles submitting form
	const handleSubmit = (e) => {
		e.preventDefault();

    blankAxiosInstance.post(
      tokenGetURL, {
        username: formData.username,
        password: formData.password,
      }, { withCredentials: true }).then((res) => {
				//console.log(res);

				// Dispatching with user logged in
				//dispatch(getUser());

				const urlParams = new URLSearchParams(window.location.search);
				let next = urlParams.get('next');
				if (next === null) {
					next = '/';
				}
				history.push(next);
      }).catch((err) => {
				//console.log(err);
				setErrors({
					username: err.response.data.username,
					password: err.response.data.password,
					incorrect: err.response.data.non_field_errors,
				});
			});
	}

	return(
		<>
			<h3>Login</h3>
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
				error={Boolean(errors.username) || Boolean(errors.incorrect)}
				helperText={errors.username || errors.incorrect}
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
				onChange={handleChange}
				error={Boolean(errors.password) || Boolean(errors.incorrect)}
				helperText={errors.password || errors.incorrect}
			/>
			<FormControlLabel
				control={<Checkbox value="remember" color="primary" />}
				label="Remember me"
			/>

			<Box>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					onClick={handleSubmit}
				>
					Sign In
				</Button>
			</Box>

			<Box mt={2}>
				<Button
					variant="outlined"
					href="/signup"
					fullWidth
					color="primary"
				>
					Sign Up
				</Button>
			</Box>

			<Box mt={2} textAlign={"right"}>
				<Link href="/forgot" variant="body2">
					Forgot password?
				</Link>
			</Box>
		</>
	)
}