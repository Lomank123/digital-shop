import React, { useState } from 'react';
import { blankAxiosInstance } from '../../axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { hostURL, tokenGetURL, userGetCartURL } from '../../urls';
import history from '../../history';
import { getCart, getCartProductIds, getUser } from '../../utils';
import { useLocation } from 'react-router';
import { callbackRoute, forgotRoute, googleRoute, loginRoute, signupRoute } from '../../routes';
import { useTranslation } from 'react-i18next';
import '../../../styles/auth/login.css';
import '../../../styles/auth/auth.css';


export default function Login() {
	const {t, i18n} = useTranslation();
	const search = useLocation().search;

	const googleCallbackURL = `${hostURL}${loginRoute}/${googleRoute}/${callbackRoute}/`;
	const googleClientId = `${process.env.GOOGLE_KEY}`;
	const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${googleCallbackURL}&prompt=consent&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile&access_type=offline`;

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
			[e.target.name]: e.target.value
		});
	};
	
	// Handles submitting form
	const handleSubmit = (e) => {
		e.preventDefault();

    blankAxiosInstance.post(
      tokenGetURL, {
        username: formData.email.trim(),
        password: formData.password.trim(),
      }, { withCredentials: true }).then(async (res) => {
				// To avoid flickering this api call should go first
				// Setting user cart id to cookie
				await blankAxiosInstance.get(userGetCartURL);
				// Dispatching with user logged in.
				// We need it just to pass to "next" page the right state from redux store.
				// Without this dispatch when user logs in the state will be 1 in our case which means user not authenticated or no user.
				// We need to wait for this api call otherwise user will be thrown to loggedIn page instead of next param route.
				await getCart();
				await getCartProductIds();
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

	// Unused for now
	const googleButton = (
		<Button
			href={googleAuthURL}
			className='forgot-link'
		>
			{t("login.sign-in-with-google")}
		</Button>
	);

	return(
		<Box className='default-block auth-block'>
			<h3 className='auth-h3'>{t("login.label")}</h3>

			<Box className='auth-textfield-block'>
				<TextField
					className='login-field'
					variant="outlined"
					margin="normal"
					required
					id="email"
					label={t("login.email")}
					name="email"
					autoComplete="email"
					autoFocus
					onChange={handleChange}
					error={Boolean(errors.email) || Boolean(errors.incorrect)}
					helperText={errors.email || errors.incorrect}
				/>
				<TextField
					className='login-password-field'
					variant="outlined"
					margin="normal"
					required
					name="password"
					label={t("login.password")}
					type="password"
					id="password"
					autoComplete="current-password"
					onChange={handleChange}
					error={Boolean(errors.password) || Boolean(errors.incorrect)}
					helperText={errors.password || errors.incorrect}
				/>
			</Box>

			<Box className='auth-btns-block'>
				<Button
					className='login-btn'
					type="submit"
					variant="contained"
					color="primary"
					onClick={handleSubmit}
				>
					{t("login.login-button")}
				</Button>
			
				<Button
					className='login-signup-btn'
					variant="outlined"
					onClick={e => handleClickRedirect(e, signupRoute)}
					color="primary"
				>
					{t("login.signup-button")}
				</Button>

			</Box>

			<Box className='login-forgot-block'>
				<Link to={'/' + forgotRoute} className='forgot-link'>
					{t("login.forgot-link")}
				</Link>
			</Box>
		</Box>
	)
}