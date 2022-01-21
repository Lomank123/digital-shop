import React, { useLayoutEffect, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MenuItem, TextField, Box, Button, Checkbox, FormControlLabel, IconButton } from "@material-ui/core";
import { axiosInstance, blankAxiosInstance } from "../../axios";
import { categoryGetURL, productGetURL } from "../../urls";
import { Clear } from '@material-ui/icons'
import { resizeImage } from "../../utils";

import '../../../styles/product/add.css';


export default function AddProduct() {
  const userData = useSelector(state => state.user);
  const [categoriesData, setCategoriesData] = useState([]);

  useLayoutEffect(() => {
    blankAxiosInstance.get(categoryGetURL).then((res) => {
      setCategoriesData(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

	const initialFormData = {
    category: "",
    title: "",
    description: "",
    price: '',
    in_stock: true,
	};
  const [postData, setPostData] = useState(initialFormData);
  const [postImage, setPostImage] = useState(null);   // For storing image(s)
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!postImage) {
        setPreviewImage(null);
        return
    }
    const objectUrl = URL.createObjectURL(postImage.image[0])
    setPreviewImage(objectUrl)
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [postImage])

  // Field error messages
	const errorsInitialState = {
		category: '',
		title: '',
		description: '',
		image: '',
		price: '',
    in_stock: '',
	};
	const [errors, setErrors] = useState(errorsInitialState);

  // Handles all changes in different fields
  const handleChange = (e) => {
    if (e.target.name === 'category') {
      setPostData({
        ...postData,
        [e.target.name]: e.target.value
      });
    } else if (e.target.name === 'in_stock') {
      setPostData({
        ...postData,
        [e.target.name]: e.target.checked
      });
    } else if (e.target.name === 'image') {
      if (!e.target.files || e.target.files.length === 0) {
        setPostImage(null);
        return
      }
      const fileSize = e.target.files[0].size / 1024 / 1024; // in MB
      // Checking file size
      if (fileSize > 1.5) {
        console.log("File size exceeds 1.5 MB. Cannot load this image.");
        setPostImage(null);
        setErrors({
          ...errors,
          image: 'File size exceeds 1.5 MB. Cannot load this image.',
        })
        return
      } else {
        setErrors({
          ...errors,
          image: '',
        })
      }
      setPostImage({
        image: e.target.files,
      })
    } else {
      // All other text fields
      setPostData({
        ...postData,
        [e.target.name]: e.target.value.trim()
      });
    }
  }

  // This function may be used instead of handleChange in input tag with id "raised-button-file"
  // It will force to resize the image if it's bigger than needed (default resolution: 500x500)
  const handleImageUpload = (e) => {
    // Checking file availability
    if (!e.target.files || e.target.files.length === 0) {
      setPostImage(null);
      //setErrors({
      //  ...errors,
      //  image: 'No files detected. Try again.',
      //})
      return
    }

    var file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // in MB
    // Checking file size
    if (fileSize > 1.5) {
      console.log("File size exceeds 1.5 MB. Cannot load this image.");
      setPostImage(null);
      setErrors({
        ...errors,
        image: 'File size exceeds 1.5 MB. Cannot load this image.',
      })
      return
    }

    if (file.type.match(/image.*/)) {
      console.log('An image has been loaded');
      var reader = new FileReader();

      reader.onload = function (readerEvent) {
        var image = new Image();
        image.onload = function (imageEvent) {
          resizeImage(image, file.name, setPostImage);
        }
        image.src = readerEvent.target.result;
      }
      reader.readAsDataURL(file);
    }
  }

  const handleDeleteImage = (e) => {
    e.preventDefault();
    setPostImage(null);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const config = { headers: { 'Content-Type': 'multipart/form-data' }, params: { redirect: true } };
    let formData = new FormData();
    formData.append('created_by', userData.id);
    formData.append('category', postData.category);
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    if (postImage !== null) {
      formData.append('image', postImage.image[0]);
    } else {
      formData.append('image', '');
    }
    formData.append('price', postData.price);
    formData.append('in_stock', postData.in_stock);
    formData.append('is_active', true);

    axiosInstance.post(productGetURL, formData, config).then((res) => {
      console.log('Product created!');
      // Reseting form data to add another product
      setPostData({
        ...initialFormData,
        category: postData.category,
      });
      setErrors(errorsInitialState);
      setPostImage(null);
    }).catch((err) => {
      //console.log(err);
      console.log('Product creation error.');
      //console.log(err.response);
      setErrors({
        category: err.response.data.category,
        title: err.response.data.title,
        description: err.response.data.description,
        image: err.response.data.image,
        price: err.response.data.price,
        in_stock: err.response.data.in_stock,
      });
    });
  }
  
  return (
    <Box className="add-product">
      <h2 className="head-label">Create product</h2>

      <Box className="default-block form-block">

        <Box className="field-block">
          <p className="field-label">Choose category:</p>
          <TextField
            className="field"
            select
            variant="outlined"
            id="category-select"
            label="Category"
            name="category"
            fullWidth
            required
            defaultValue={""}
            onChange={handleChange}
            error={Boolean(errors.category)}
            helperText={Boolean(errors.category) ? 'This field is required.' : ''}
          >
            {
              Object.entries(categoriesData).map(([key, category]) => {
                return (
                  <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                )
              })
            }
          </TextField>
        </Box>
        
        <Box className="field-block">
          <p className="field-label">Write a title:</p>
          <TextField
            className="field"
            variant="outlined"
            margin="normal"
            required
            id="title"
            label="Title"
            name="title"
            fullWidth
            value={postData.title}
            onChange={handleChange}
            error={Boolean(errors.title)}
            helperText={errors.title}
          />
        </Box>
        
        <Box className="field-block">
          <p className="field-label">Enter price:</p>
          <TextField
            className="field"
            type='number'
            variant="outlined"
            margin="normal"
            required
            id="price"
            label="Price"
            name="price"
            fullWidth
            value={postData.price}
            error={Boolean(errors.price)}
            helperText={errors.price}
            onChange={handleChange}
          />
        </Box>

        <Box className="field-block">
          <p className="field-label">Describe your product:</p>
          <TextField
            className="field"
            variant="outlined"
            margin="normal"
            id="description"
            label="Description"
            name="description"
            autoComplete="Some description..."
            fullWidth
            value={postData.description}
            error={Boolean(errors.description)}
            helperText={errors.description}
            onChange={handleChange}
          />
        </Box>

        <Box className="field-block image-upload-block">
          <p className="field-label">Upload image:</p>
          <Box className="upload-block">
            <input
              accept="image/*"
              className='image-input'
              label="image"
              name="image"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              value={postData.image}
              onChange={handleChange}
            />
            { previewImage ?
              (
                <Box className="img-block">
                  <a target={'_blank'} href={previewImage} className="img-link" >
                    <img className="product-image" src={previewImage} alt="Image" />
                  </a>
                  <Box className="clear-btn-layout">
                    <IconButton
                      className="clear-btn"
                      onClick={handleDeleteImage}
                    >
                      <Clear className="clear-icon" />
                    </IconButton>
                  </Box>
                </Box>
              )
              : (
                <label className="btn-label-upload" htmlFor="raised-button-file">
                  <Box className="choose-image-block" component="span">
                    <span className="choose-image-text">Click here to choose image</span>
                  </Box>
                </label>
              )
            }
          </Box>
          {
            (errors.image !== null && errors.image !== '') ? (
              <Box className="product-image-error-block">
                <span className="product-image-error-text">{errors.image}</span>
              </Box>
            ) : null
          }
        </Box>

        <Box className="field-block">
          <p className="field-label">Product availability:</p>
          <FormControlLabel
            label='In stock'
            control={
              <Checkbox
                checked={postData.in_stock}
                id="instock"
                color="primary"
                label="In stock"
                name="in_stock"
                onChange={handleChange}
              />
            }
          />
        </Box>
      </Box>

      <Button
				type="submit"
        className="create-product-btn"
				variant="contained"
				color="primary"
				onClick={handleSubmit}
			>
				Add product
			</Button>
    </Box>
  );
}