import React, { useState } from 'react';
import { blankAxiosInstance } from '../../axios';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { tokenGetURL } from '../../urls';
import history from '../../history';
import { getUser } from '../../utils';
import { useLocation } from 'react-router';
import { forgotRoute, signupRoute } from '../../routes';


export default function Login() {
	const search = useLocation().search;

	// Handles redirect on click
  const handleClickRedirect = (e, route) => {
    history.push('/' + route);
  }

	// Login form
	const initialFormData = {
		email: '',
		password: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	// Field error messages
	const errorsInitialState = {
		email: '',
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
        username: formData.email,
        password: formData.password,
      }, { withCredentials: true }).then(async (res) => {
				// Dispatching with user logged in.
				// We need it just to pass to "next" page the right state from redux store.
				// Without this dispatch when user logs in the state will be 1 in our case which means user not authenticated or no user.
				// We need to wait for this api call otherwise user will be thrown to loggedIn page instead of next param route.
				await getUser();

				// Redirecting to "next" route or to home page if "next" wasn't specified
				const urlParams = new URLSearchParams(search);
				let next = urlParams.get('next');
				if (next === null) {
					next = '/';
				}
				history.push(next);
				console.log('Login successful!');
      }).catch((err) => {
				console.log('Login error.');
				setErrors({
					email: err.response.data.email,
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
				id="email"
				label="Email"
				name="email"
				autoComplete="email"
				autoFocus
				onChange={handleChange}
				error={Boolean(errors.email) || Boolean(errors.incorrect)}
				helperText={errors.email || errors.incorrect}
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
					onClick={e => handleClickRedirect(e, signupRoute)}
					fullWidth
					color="primary"
				>
					Sign Up
				</Button>
			</Box>

			<Box mt={2} textAlign={"right"}>
				<Link to={'/' + forgotRoute}>
					Forgot password?
				</Link>
			</Box>
		</>
	)
}