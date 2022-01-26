import React, { useLayoutEffect, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MenuItem, TextField, Box, Button, Checkbox, FormControlLabel, IconButton } from "@material-ui/core";
import { axiosInstance, blankAxiosInstance } from "../../axios";
import { categoryGetURL, productGetURL } from "../../urls";
import { Clear } from '@material-ui/icons'
import { resizeImage, getTimestamp } from "../../utils";
import { useParams } from "react-router";
import { DeleteDialog } from "../dialog";

import '../../../styles/product/add.css';


export default function AddEditProduct() {
  const userData = useSelector(state => state.user);
  const [categoriesData, setCategoriesData] = useState([]);
  const params = useParams();   // Here we expect to get id of a product (edit product)
  const [open, setOpen] = useState(false);

  const initialFormData = {
    category: "",
    title: "",
    description: "",
    price: '',
    in_stock: true,
	};

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
  const [postData, setPostData] = useState(initialFormData);
  const [postImage, setPostImage] = useState(null);                     // For storing image
  const [previewImage, setPreviewImage] = useState(null);               // For preview image
  const [primaryImage, setPrimaryImage] = useState({ image: null });    // For primary loaded image (needed for comparison before sending request)

  // params.id is the indicator that we're trying to edit product
  // Categories get
  useLayoutEffect(() => {
    blankAxiosInstance.get(categoryGetURL).then((res) => {
      setCategoriesData(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  // Edit
  useLayoutEffect(() => {
    // If id param exists then it's editing otherwise creating new
    if (params.id) {
      console.log('Edit product mode.');
      // Here we want to receive product info using it's id
      // And then set it to postData form
      blankAxiosInstance.get(productGetURL + params.id + '/').then(async (res) => {
        setPostData({
          category: res.data.category,
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          in_stock: res.data.in_stock,
        });
        
        // Setting image
        await fetch(res.data.image).then(result => result.blob()).then((blob) => {
          let oldName = res.data.image.split('/').pop();
          let file = new File([blob], oldName, { type: 'image/jpeg', lastModified: Date.now() });
          setPostImage({
            image: file,
          });
          setPrimaryImage({
            image: file,
          });
          console.log("Image get done!");
        }).catch((error) => {
          console.log("Image get err.");
        });

        console.log("Edit product get done!");
      }).catch((err) => {
        console.log("Edit product get error.");
      })
      // Before making request there should be the 'if' checking params.id
      // We can either check it to display different button with 'PUT' request (e.g. 'Edit' button)

      // After editing don't forget to update postData form with new values (not with empty strings)
    } else {
      console.log('Create product mode.');
    }
  }, [])

  // Setting preview image
  useEffect(() => {
    if (!postImage) {
        setPreviewImage(null);
        return
    }
    const objectUrl = URL.createObjectURL(postImage.image);
    setPreviewImage(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [postImage])

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

      const blob = e.target.files[0];
      const newFile = new File([blob], getTimestamp(blob.name), { type: blob.type });

      setPostImage({
        image: newFile,
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

    let formData = new FormData();
    formData.append('created_by', userData.id);
    formData.append('category', postData.category);
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    if (postImage !== null) {
      if (postImage.image !== primaryImage.image) {
        formData.append('image', postImage.image);
      }
    } else {
      formData.append('image', '');
    }
    formData.append('price', postData.price);
    formData.append('in_stock', postData.in_stock);
    formData.append('is_active', true);

    let method = 'post';
    let url = productGetURL;
    // For editing
    if (params.id) {
      method = 'put';
      // From DRF: PUT method needs id in the end of url
      url += params.id + '/';
    }
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

      // If it was editing then no need to reset fields
      if (params.id) {
        console.log('Product edited!');
        return;
      }

      // Reseting fields values to add another product
      setPostData({
        ...initialFormData,
        category: postData.category,
      });
      setPostImage(null);

      console.log('Product created!');
    }).catch((err) => {
      console.log('Product creation error.');
      // This check is needed to prevent memory leak (the problem wasn't useSelector despite the text in console)
      if (err.response.status !== 401) {
        setErrors({
          category: err.response.data.category,
          title: err.response.data.title,
          description: err.response.data.description,
          image: err.response.data.image,
          price: err.response.data.price,
          in_stock: err.response.data.in_stock,
        });
      }
    });
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Box className="add-product">
      <h2 className="head-label">{(params.id) ? 'Edit product' : 'Create product'}</h2>

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
            value={postData.category}
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

      <Box className="add-buttons-block">
        <Button
          type="submit"
          className="create-product-btn"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          { (params.id) ? 'Edit product' : 'Add product' }
        </Button>
        {
          (params.id) ? (
            <Box>
              <Button
                className="delete-product-btn"
                variant="contained"
                color="primary"
                onClick={handleOpen}
              >
                Delete product
              </Button>
              <DeleteDialog
                productId={params.id}
                open={open}
                handleClose={handleClose}
                reload={'home'}
              />
            </Box>
          ) : null
        }
      </Box>

    </Box>
  );
}