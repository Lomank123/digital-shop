import React, { useState } from "react";
import { Box, TextField, Button } from "@material-ui/core";
import { axiosInstance } from "../../axios";
import { passwordChangeURL } from "../../urls";
import { useTranslation } from "react-i18next";


export default function ChangePassword() {
  const {t, i18n} = useTranslation();
  const initialFormData = {
    old_password: "",
    new_password1: "",
    new_password2: "",
	};
  // Field error messages
	const errorsInitialState = {
    old_password: "",
    new_password1: "",
    new_password2: "",
	};
  const [errors, setErrors] = useState(errorsInitialState);
  const [postData, setPostData] = useState(initialFormData);

  // Change these functions to serve password change
  const handlePasswordChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value.trim()
    });
  }
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('old_password', postData.old_password);
    formData.append('new_password1', postData.new_password1);
    formData.append('new_password2', postData.new_password2);

    axiosInstance.post(passwordChangeURL, formData).then((res) => {
      setErrors(errorsInitialState);
      setPostData(initialFormData);
      console.log("Password change done!");
    }).catch((err) => {
      console.log("Password change error.");
      if (err.response.status !== 401) {
        setErrors({
          old_password: err.response.data.old_password,
          new_password1: err.response.data.new_password1,
          new_password2: err.response.data.new_password2,
        });
      }
    })
  }

  return(
    <Box>
      <h3 className="edit-password-label">{t("change-password.label")}</h3>
      <Box className="default-block edit-profile-block">
        <TextField
          className="form-field"
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="old_password"
					label={t("change-password.old-password")}
					type="password"
					id="old_password"
					autoComplete="old_password"
          value={postData.old_password}
					onChange={handlePasswordChange}
          error={Boolean(errors.old_password)}
					helperText={errors.old_password}
				/>

				<TextField
          className="form-field"
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="new_password1"
					label={t("change-password.new-password")}
					type="password"
					id="new_password1"
					autoComplete="new_password1"
          value={postData.new_password1}
					onChange={handlePasswordChange}
          error={Boolean(errors.new_password1)}
					helperText={errors.new_password1}
				/>

				<TextField
          className="form-field"
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="new_password2"
					label={t("change-password.confirm-new-password")}
					type="password"
					id="new_password2"
					autoComplete="new_password2"
          value={postData.new_password2}
					onChange={handlePasswordChange}
          error={Boolean(errors.new_password2)}
					helperText={errors.new_password2}
				/>

        <hr />

        <Box className="form-btns-block">
          <Button
            type="submit"
            className="form-submit-btn"
            variant="contained"
            color="primary"
            onClick={handlePasswordSubmit}
          >
            {t("change-password.change-button")}
          </Button>
        </Box>
      </Box>

    </Box>
  );
}