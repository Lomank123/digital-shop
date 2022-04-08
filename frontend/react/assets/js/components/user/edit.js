import React, { useState, useLayoutEffect } from "react";
import { Box, TextField, Button } from "@material-ui/core";
import '../../../styles/user/edit.css';
import { useParams } from "react-router";
import { ImageUpload } from "../imageUpload";
import { userGetURL } from "../../urls";
import { blankAxiosInstance, axiosInstance } from "../../axios";
import ChangePassword from "../auth/changePassword";
import { useTranslation } from "react-i18next";


export default function EditProfile() {
  const {t, i18n} = useTranslation();
  const params = useParams();
  const [postImage, setPostImage] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  
  const initialFormData = {
    username: "",
    email: "",
	};
  // Field error messages
	const errorsInitialState = {
    username: "",
    email: "",
		image: "",
	};
  const [errors, setErrors] = useState(errorsInitialState);
  const [postData, setPostData] = useState(initialFormData);

  useLayoutEffect(() => {
    // If id param exists then it's editing otherwise creating new
    if (params.id) {
      blankAxiosInstance.get(userGetURL + params.id + '/').then(async (res) => {
        setPostData({
          username: res.data.username,
          email: res.data.email,
        });

        setImgUrl(res.data.photo);
        console.log("Edit profile get done!");
      }).catch((err) => {
        console.log("Edit profile get error.");
      })
    }
  }, [])

  // Handles all changes in different fields
  const handleChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('username', postData.username.trim());
    formData.append('email', postData.email.trim());

    if (postImage !== null) {
      if (postImage === '') {
        formData.append('photo', '');
      } else {
        formData.append('photo', postImage);
      }
    }

    let method = 'patch';
    let url = userGetURL + params.id + '/';
    // Config for axiosInstance
    let config = {
      method: method,
      url: url,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { redirect: false },
    };

    axiosInstance(config).then((res) => {
      // Reseting errors
      setErrors(errorsInitialState);
      // Reseting default image
      setPostImage(null);
      console.log('Edit profile submit done!');
      window.location.reload();
    }).catch((err) => {
      console.log(err);
      console.log('Edit profile submit error.');
      // This check is needed to prevent memory leak (the problem wasn't useSelector despite the text in console)
      if (err.response.status !== 401) {
        setErrors({
          username: err.response.data.username,
          email: err.response.data.email,
          image: err.response.data.image,
        });
      }
    });
  }

  return(
    <Box className="default-main-block">
      <h3 className="edit-label">{t("user-edit.edit-label")}</h3>
      <Box className="default-block edit-profile-block">
        <Box className="username-field-block">
          <TextField
            className="form-field"
            variant="outlined"
            margin="normal"
            required
            id="username"
            label={t("user-edit.username")}
            name="username"
            fullWidth
            value={postData.username}
            onChange={handleChange}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
        </Box>

        <Box className="email-field-block">
          <TextField
            className="form-field"
            variant="outlined"
            margin="normal"
            required
            id="email"
            label={t("user-edit.email")}
            name="email"
            fullWidth
            value={postData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
        </Box>

        <hr />
        <Box className="photo-field-block">
          <ImageUpload
            postImage={postImage}
            setPostImage={setPostImage}
            url={imgUrl}
            edit={true}
          />
        </Box>
        <hr />

        <Box className="form-btns-block">
          <Button
            type="submit"
            className="form-submit-btn"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {t("user-edit.save-button")}
          </Button>
        </Box>
      </Box>

      <ChangePassword />

    </Box>
  );
}