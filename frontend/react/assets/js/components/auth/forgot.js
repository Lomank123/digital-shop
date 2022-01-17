import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { blankAxiosInstance } from '../../axios';
import { passwordResetURL } from '../../urls';
import history from '../../history';
import { emailSentRoute } from '../../routes';


export default function Forgot() {
	const initialFormData = {
    email: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	// Field error messages
	const errorsInitialState = {
    email: '',
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
      passwordResetURL, {
        email: formData.email,
      }).then((res) => {
        history.push({
          pathname: history.location.pathname + '/' + emailSentRoute,
          state: {
            email: formData.email,
          },
        });
        //console.log(res.data);
      }).catch((err) => {
        setErrors({
          email: err.response.data.email,
        });
        console.log(err.response);
      })
  }

  return (
    <>
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
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Send
      </Button>
    </>
  );
}