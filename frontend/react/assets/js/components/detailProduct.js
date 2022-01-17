import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";
import { useParams } from "react-router";
import { blankAxiosInstance } from "../axios";
import { productGetURL, userGetURL } from "../urls";
import { Link } from "react-router-dom";


export default function DetailProduct() {
  const params = useParams();
  const [author, setAuthor] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    blankAxiosInstance.get(productGetURL + params.id + '/').then((res) => {
      // Setting date
      const publishedDate = new Date(res.data.published);
      const updatedDate = new Date(res.data.updated);
      res.data.published = publishedDate.toISOString().split('T')[0];
      res.data.updated = updatedDate.toISOString().split('T')[0];
      // Setting product data
      setProduct(res.data);
      console.log('Product get done!');
    }).catch((err) => {
      console.log(err);
      console.log('Product get error.');
    })
  }, [])

  useEffect(() => {
    if (product !== null) {
      blankAxiosInstance.get(userGetURL + product.created_by + '/').then((res) => {
        setAuthor(res.data);
        console.log('Detail user done!');
      }).catch((err) => {
        console.log(err);
        console.log('Detail user error.');
      })
    }
  }, [product])

  if (product === null || author === null) {
    return null;
  }

  return(
    <Box className="detail-box">
      <Box className="small-text detail-category-box">
        <span>Category: <Link to="/">{product.category_name}</Link></span>
      </Box>

      <Box className="default-box detail-product-box">

        <Box className="detail-img-box">
          <img src={(product.image !== null && product.image !== "")
                  ? product.image 
                  : 'http://127.0.0.1/react/images/no-image.jpg'} className="detail-img" />
        </Box>

        <Box className="detail-info-box">
          <span className="detail-title">{product.title}</span>

          <Box>
            <span className="detail-description"><b>Description</b></span>
            <p className="detail-description">{product.description}</p>
          </Box>

          <Box className="detail-date-box">
            <p><b>Publication date:</b> {product.published}</p>
            <p><b>Last update:</b> {product.updated}</p>
          </Box>

          <p className="detail-description detail-in-stock">
            {
              (product.in_stock) ?
              (<span className="in-stock-true"><b>In stock</b></span>) :
              (<span className="in-stock-false"><b>Out of stock</b></span>)
            }
          </p>

          <Box className="detail-purchase-box">
            <Button
              className="detail-purchase-button"
              variant="contained"
              color="primary"
              disabled={!product.in_stock}
            >
              Purchase
            </Button>
            <span className="detail-price">{product.price}$</span>
          </Box>
        </Box>
      </Box>

      <span className="author-info-label">Seller info</span>

      <Link className="default-box detail-author-box" to={"/"}>

        <Box className="author-avatar-box">
          <img src={(author.photo !== null && author.photo !== "")
                  ? author.photo 
                  : 'http://127.0.0.1/react/images/no-image.jpg'} alt="author photo" className="author-avatar" />
        </Box>

        <Box className="author-credentials">
          <span>{author.username}</span>
          <span>{author.email}</span>
        </Box>
        
      </Link>
    </Box>
  )
}