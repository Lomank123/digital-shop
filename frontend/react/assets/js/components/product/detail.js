import React, { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";
import { useParams } from "react-router";
import { blankAxiosInstance } from "../../axios";
import { noImageURL, productGetURL, userGetURL } from "../../urls";
import { Link } from "react-router-dom";
import history from "../../history";

import '../../../styles/product/detail.css';


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

  const handleClickRedirect = (e) => {
    e.preventDefault();

    history.push({
      pathname: '/',
      state: {
        category: product.category_name,
      }
    })
  }

  return(
    <Box className="detail">
      <Box className="small-text category-block">
        <span>Category: <Link to="" onClick={handleClickRedirect}>{product.category_name}</Link></span>
      </Box>

      <Box className="default-block product-block">

        <Box className="img-block">
          <img src={(product.image !== null && product.image !== "")
                  ? product.image 
                  : noImageURL} className="image" />
        </Box>

        <Box className="info-block">
          <span className="title">{product.title}</span>

          <Box>
            <span className="description"><b>Description</b></span>
            <p className="description">{product.description}</p>
          </Box>

          <Box className="date-block">
            <p><b>Publication date:</b> {product.published}</p>
            <p><b>Last update:</b> {product.updated}</p>
          </Box>

          <p className="description in-stock">
            {
              (product.in_stock) ?
              (<span className="in-stock-true"><b>In stock</b></span>) :
              (<span className="in-stock-false"><b>Out of stock</b></span>)
            }
          </p>

          <Box className="purchase-block">
            <Button
              className="purchase-btn"
              variant="contained"
              color="primary"
              disabled={!product.in_stock}
            >
              Purchase
            </Button>
            <span className="price">{product.price}$</span>
          </Box>
        </Box>
      </Box>

      <span className="author-info-label">Seller info</span>

      <Link className="default-block author-block" to={"/"}>

        <Box className="author-avatar-block">
          <img src={(author.photo !== null && author.photo !== "")
                  ? author.photo 
                  : noImageURL} alt="author photo" className="author-avatar" />
        </Box>

        <Box className="author-credentials">
          <span>{author.username}</span>
          <span>{author.email}</span>
        </Box>
        
      </Link>
    </Box>
  )
}