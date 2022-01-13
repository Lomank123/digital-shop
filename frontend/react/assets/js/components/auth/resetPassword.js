import React, { useState } from 'react';
import { blankAxiosInstance } from '../../axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { passwordResetConfirmURL } from '../../urls';
import history from '../../history';
import { resetRoute, confirmRoute } from '../../routeNames';
import { useParams } from 'react-router';


export default function ResetPassword() {

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
			[e.target.name]: e.target.value.trim()
		});
	};

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      passwordResetConfirmURL, {
        new_password1: formData.password1,
        new_password2: formData.password2,
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
    <>
      <h3>Reset password</h3>
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
        error={Boolean(errors.password1) || Boolean(errors.uid) || Boolean(errors.token)}
        helperText={errors.password1 || errors.uid || errors.token}
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
        error={Boolean(errors.password2)}
        helperText={errors.password2}
			/>
			<Button
				type="submit"
				fullWidth
				variant="contained"
				color="primary"
				onClick={handleSubmit}
			>
				Confirm
			</Button>
    </>
  );
}