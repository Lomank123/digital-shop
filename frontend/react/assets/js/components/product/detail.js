import React, { useEffect, useState } from "react";
import { Box, Button, IconButton } from "@material-ui/core";
import { useParams } from "react-router";
import { blankAxiosInstance } from "../../axios";
import { categoryGetURL, noImageURL, productGetURL, userGetURL, cartItemAddURL } from "../../urls";
import { Link } from "react-router-dom";
import history from "../../history";
import { cartRoute, editProductRoute, profileRoute } from "../../routes";
import { useSelector } from "react-redux";
import { Delete, Edit } from '@material-ui/icons';
import { DeleteDialog } from "../dialog";
import { handleAddToCart } from "../../utils";

import '../../../styles/product/detail.css';
import '../../../styles/user/profile.css';


export default function DetailProduct() {
  const params = useParams();
  const cartData = useSelector(state => state.cart);
  const userData = useSelector(state => state.user);
  const cartProductIds = useSelector(state => state.cartProductIds);
  const [author, setAuthor] = useState(null);
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleEdit = (id) => {
    history.push(`/${editProductRoute}/${id}/`);
  }

  const handleAddToCartOrRedirect = (product_id, cart_id, cartProductIds) => {
    if (cartProductIds.includes(product_id)) {
      console.log("Already in the cart! Redirecting...");
      history.push(`/${cartRoute}`);
      return;
    }
    handleAddToCart(product_id, cart_id, cartProductIds);
  }

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
      // Setting author info
      blankAxiosInstance.get(userGetURL + product.created_by + '/').then((res) => {
        setAuthor(res.data);
        console.log('Detail user done!');
      }).catch((err) => {
        console.log(err);
        console.log('Detail user error.');
      })
      // Setting category info
      blankAxiosInstance.get(categoryGetURL + product.category + '/').then((res) => {
        setCategory(res.data);
        console.log('Category get done!');
      }).catch((err) => {
        console.log(err);
        console.log('Category get error.');
      })
    }
  }, [product])

  if (product === null || author === null || userData === null) {
    return null;
  }

  const handleClickRedirect = (e) => {
    e.preventDefault();

    history.push({
      pathname: '/',
      search: '?category=' + category.verbose,
    })
  }

  return(
    <Box className="default-main-block product-detail">
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
              onClick={() => {handleAddToCartOrRedirect(product.id, cartData.id, cartProductIds)}}
              disabled={!product.in_stock || !product.is_active || product.created_by == userData.id}
            >
              {
                (cartProductIds.includes(product.id)) ? ('In cart') : ('Add to cart')
              }
            </Button>
            <span className="price">{product.price}$</span>
          </Box>
        </Box>

        {
          (userData.id === author.id)
          ? (
              <Box className="detail-links-block">
                <IconButton className="display-delete-btn" onClick={handleOpen}><Delete /></IconButton>
                <IconButton className="display-edit-btn" onClick={() => {handleEdit(product.id)}}><Edit /></IconButton>
                <DeleteDialog
                  productId={product.id}
                  open={open}
                  handleClose={handleClose}
                  reload={'home'}
                />
              </Box>
            )
          : null
        }


      </Box>

      <span className="author-info-label">Seller info</span>

      <Link className="default-block author-block" to={'/' + profileRoute + '/' + author.id + '/'}>

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