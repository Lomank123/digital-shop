import React, { useEffect, useState } from "react";
import { Box, IconButton } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { getTimestamp } from "../utils";
import { useTranslation } from 'react-i18next';
import '../../styles/components/imageUpload.css';


export function ImageUpload(props) {
  /*
    Props:
      - postImage - representing image from parent component
      - setPostImage - setter for postImage
      - url - needed if using to edit (to load existing image)
      - edit - indicates whether it's using to edit or to create
  */

  const {t, i18n} = useTranslation();
  // Rename most vars
  const [previewImage, setPreviewImage] = useState(null);     // For preview image
	const errorsInitialState = { image: '' };
	const [errors, setErrors] = useState(errorsInitialState);   // Fields error messages
  const [image, setImage] = useState(null);                   // image
  const [primaryImage, setPrimaryImage] = useState(null);     // primary image

  // fetching image if it's using to edit
  useEffect(() => {
    if (props.edit) {
      fetchImage(props.url);
    }
  }, [props.url])

  // Difference between edit and create:
  // After adding product (NOT editing) we need to reset image.
  // And if we're editing no actions required.
  useEffect(() => {
    if (props.postImage === null && !props.edit) {
      setImage(null);
    }
  }, [props.postImage])

  // Sets preview if image updates
  useEffect(() => {
    // If image is null then reseting preview
    if (!image) {
      setPreviewImage(null);
      return
    }
    // Creating object url and setting preview
    const objectUrl = URL.createObjectURL(image);
    setPreviewImage(objectUrl);
    // Comparing image with primary one to indicate whether image has changed
    if (image !== primaryImage) {
      console.log("Image no longer primary");
      props.setPostImage(image);
    }

    // free memory when ever this component is unmounted
    return () => { URL.revokeObjectURL(objectUrl) }
  }, [image])

  // Handles image delete (When 'X' was clicked)
  const handleDeleteImage = () => {
    setImage(null);
    // This indicates that image was deleted
    props.setPostImage('');
  }

  // Handles changes in input field
  const handleChange = (e) => {
    // Initial check to make sure file exists
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      return
    }
    // Checking file size
    const fileSize = e.target.files[0].size / 1024 / 1024; // in MB
    const sizeLimit = 1.5   // in MB
    if (fileSize > sizeLimit) {
      let errorMsg = "File size exceeds 1.5 MB. Cannot upload this image.";
      console.log(errorMsg);
      setImage(null);   // Reseting image
      setErrors({ ...errors, image: errorMsg, });
      return
    } else {
      setErrors({ ...errors, image: '', });
    }
    // If no errors occured we can finally load our image
    const blob = e.target.files[0];
    const newFile = new File([blob], getTimestamp(blob.name), { type: blob.type });
    setImage(newFile);
  }

  // fetches url to get existing image and load it
  function fetchImage(imageUrl) {
    if (imageUrl) {
      fetch(imageUrl).then(result => result.blob()).then((blob) => {
        let oldName = imageUrl.split('/').pop();
        let file = new File([blob], oldName, { type: blob.type, lastModified: Date.now() });
        // Order of these 2 lines is important, if image updates first then primary image won't update at all
        setPrimaryImage(file);
        setImage(file);
        console.log("Image get done!");
      }).catch((error) => {
        console.log("Image get err.");
      });
    }
  }

  return (
    <Box className="field-block image-upload-block">
      <p className="field-label">{t("image-upload.text")}</p>
      <Box className="upload-block">
        <input
          accept="image/*"
          className='image-input'
          label="image"
          name="image"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
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
                <span className="choose-image-text">
                  {t("image-upload.click-to-choose-text")}
                </span>
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
  );
}