import React, { useState } from 'react';
import { blankAxiosInstance } from '../../axios';
import { signupURL } from '../../urls';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import history from '../../history';
import { emailSentRoute } from '../../routes';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import '../../../styles/auth/auth.css';


export default function Signup() {
	const {t, i18n} = useTranslation();
	// Signup form
	const initialFormData = {
    email: '',
    username: '',
    password1: '',
    password2: '',
	};
	const [formData, setFormData] = useState(initialFormData);

	// Field error messages
	const errorsInitialState = {
		email: '',
		username: '',
		mismatch_pw: '',
		password1: '',
		password2: '',
	};
	const [errors, setErrors] = useState(errorsInitialState);

		// Handles changes in fields
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};
	
	const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      signupURL, {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password1: formData.password1.trim(),
        password2: formData.password2.trim(),
        errors: '',
      }).then((res) => {
				console.log('Signup successful!');
				history.push({
          pathname: history.location.pathname + '/' + emailSentRoute,
          state: {
            email: formData.email,
          },
				});
      }).catch((err) => {
				console.log('Signup error.');
        setErrors({
          email: err.response.data.email,
          username: err.response.data.username,
          mismatch_pw: err.response.data.non_field_errors,
          password1: err.response.data.password1,
          password2: err.response.data.password2,
        });
      });
  }

	return(
		<Box className='default-block auth-block'>
			<h3 className='auth-h3'>{t("signup.label")}</h3>

			<Box className='auth-textfield-block'>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="username"
					label={t("signup.username")}
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
					label={t("signup.email")}
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
					label={t("signup.password")}
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
					label={t("signup.confirm-password")}
					type="password"
					id="password2"
					autoComplete="confirm-password"
					onChange={handleChange}
					error={Boolean(errors.password2) || Boolean(errors.mismatch_pw)}
					helperText={errors.password2 || errors.mismatch_pw}
				/>
			</Box>

			<Box className='auth-btns-block'>
				<Button
					className='auth-btn'
					type="submit"
					variant="contained"
					color="primary"
					onClick={handleSubmit}
				>
					{t("signup.signup-button")}
				</Button>
			</Box>

		</Box>
	);
}