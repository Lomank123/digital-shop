import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MenuItem, TextField, Box, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { axiosInstance, blankAxiosInstance } from "../../axios";
import { categoryGetURL, productGetURL } from "../../urls";
import { useParams } from "react-router";
import { DeleteDialog } from "../dialog";
import { ImageUpload } from "../imageUpload";
import history from "../../history";

import '../../../styles/product/add-edit.css';
import { productRoute } from "../../routes";


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
  const [postImage, setPostImage] = useState(null);   // For storing image
  const [imgUrl, setImgUrl] = useState(null);

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
      blankAxiosInstance.get(productGetURL + params.id + '/').then(async (res) => {
        setPostData({
          category: res.data.category,
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          in_stock: res.data.in_stock,
        });

        setImgUrl(res.data.image);

        console.log("Edit product get done!");
      }).catch((err) => {
        console.log("Edit product get error.");
      })
    }
  }, [])



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
    } else {
      // All other text fields
      setPostData({
        ...postData,
        [e.target.name]: e.target.value.trim()
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('created_by', userData.id);
    formData.append('category', postData.category);
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    
    if (postImage !== null) {
      if (postImage === '') {
        formData.append('image', '');
      } else {
        formData.append('image', postImage);
      }
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
        setPostImage(null);
        history.push('/' + productRoute + '/' + params.id + '/');
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
    <Box className="default-main-block">
      <h2 className="head-label">{(params.id) ? 'Edit product' : 'Create product'}</h2>

      <Box className="default-block form-block">

        <Box className="field-block">
          <p className="field-label">Choose category:</p>
          <TextField
            className="form-field"
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
            className="form-field"
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
            className="form-field"
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
            className="form-field"
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

        <ImageUpload
          postImage={postImage}
          setPostImage={setPostImage}
          url={imgUrl}
          edit={(params.id) ? true : false}
        />

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
          { (params.id) ? 'Save' : 'Add' }
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
                Delete
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