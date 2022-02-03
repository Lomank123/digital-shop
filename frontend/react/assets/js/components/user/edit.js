import React, { useState, useLayoutEffect } from "react";
import { Box, TextField, Button } from "@material-ui/core";
import '../../../styles/user/edit.css';
import { useParams } from "react-router";
import { ImageUpload } from "../imageUpload";
import { userGetURL } from "../../urls";
import { blankAxiosInstance, axiosInstance } from "../../axios";
import ChangePassword from "../auth/changePassword";


export default function EditProfile() {
  const params = useParams();
  const [postImage, setPostImage] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  
  const initialFormData = {
    username: "",
    email: "",
    is_staff: "",
    is_active: "",
    is_seller: "",
    is_superuser: "",
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
          is_staff: res.data.is_staff,
          is_active: res.data.is_active,
          is_seller: res.data.is_seller,
          is_superuser:  res.data.is_superuser,
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
      [e.target.name]: e.target.value.trim()
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('username', postData.username);
    formData.append('email', postData.email);
    formData.append('is_staff', postData.is_staff);
    formData.append('is_active', postData.is_active);
    formData.append('is_seller', postData.is_seller);
    formData.append('is_superuser', postData.is_superuser);

    if (postImage !== null) {
      if (postImage === '') {
        formData.append('photo', '');
      } else {
        formData.append('photo', postImage);
      }
    }

    let method = 'put';
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
      <h3 className="edit-label">Edit profile</h3>
      <Box className="default-block edit-profile-block">
        <Box className="username-field-block">
          <TextField
            className="form-field"
            variant="outlined"
            margin="normal"
            required
            id="username"
            label="Username"
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
            label="Email address"
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
            Save changes
          </Button>
        </Box>
      </Box>

      <ChangePassword />

    </Box>
  );
}