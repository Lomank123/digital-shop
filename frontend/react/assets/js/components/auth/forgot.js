import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { blankAxiosInstance } from '../../axios';
import { passwordResetURL } from '../../urls';
import history from '../../history';
import { emailSentRoute } from '../../routes';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import '../../../styles/auth/auth.css';


export default function Forgot() {
  const {t, i18n} = useTranslation();
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
    <Box className='default-block auth-block'>
      <h3 className='auth-h3'>{t("forgot.label")}</h3>

      <Box className='auth-textfield-block'>
        <TextField
          className='forgot-textfield'
          variant="outlined"
          margin="normal"
          required
          id="email"
          label={t("forgot.email")}
          name="email"
          autoComplete="email"
          autoFocus
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
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
          {t("forgot.send-button")}
        </Button>
      </Box>
    </Box>
  );
}