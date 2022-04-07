import React, { useState } from 'react';
import { blankAxiosInstance } from '../../axios';
import TextField from '@material-ui/core/TextField';
import { Box, Button } from '@material-ui/core';
import { passwordResetConfirmURL } from '../../urls';
import history from '../../history';
import { resetRoute, confirmRoute } from '../../routes';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import '../../../styles/auth/auth.css';


export default function ResetPassword() {
	const {t, i18n} = useTranslation();
  const params = useParams();

	const initialFormData = {
    password1: '',
    password2: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	// Field error messages
	const errorsInitialState = {
    uid: '',
    token: '',
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
      passwordResetConfirmURL, {
        new_password1: formData.password1.trim(),
        new_password2: formData.password2.trim(),
        uid: params.uid,
        token: params.token,
      }).then((res) => {
        history.push(`/${resetRoute}/${confirmRoute}`);
        //console.log(res);
      }).catch((err) => {
        setErrors({
          password1: err.response.data.new_password1,
          password2: err.response.data.new_password2,
          // Maybe need to create separate error block for errors like this (invalid token or uid)
          uid: err.response.data.uid,
          token: err.response.data.token,
        })
        console.log(err.response);
      })
  }

  return (
    <Box className='default-block auth-block'>
      <h3 className='auth-h3'>{t("reset-password.label")}</h3>

			<Box className='auth-textfield-block'>
				<TextField
					variant="outlined"
					margin="normal"
					required
					name="password1"
					label={t("reset-password.password")}
					type="password"
					id="password1"
					autoComplete="current-password"
					error={Boolean(errors.password1) || Boolean(errors.uid) || Boolean(errors.token)}
					helperText={errors.password1 || errors.uid || errors.token}
					onChange={handleChange}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					name="password2"
					label={t("reset-password.confirm-password")}
					type="password"
					id="password2"
					autoComplete="confirm-password"
					onChange={handleChange}
					error={Boolean(errors.password2)}
					helperText={errors.password2}
				/>
			</Box>

			<Box className='auth-btns-block'>
				<Button
					className='auth-btn'
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					onClick={handleSubmit}
				>
					{t("reset-password.confirm-button")}
				</Button>
			</Box>
    </Box>
  );
}