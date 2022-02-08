import React, { useState } from "react";
import { Delete, Edit, ShoppingCart } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { productRoute, editProductRoute, cartRoute } from '../routes';
import { noImageURL } from "../urls";
import { Box, Button, IconButton } from "@material-ui/core";
import { blankAxiosInstance } from "../axios";
import history from "../history";
import { DeleteDialog } from "./dialog";
import { useSelector } from "react-redux";
import { handleAddToCart, handleRemoveFromCart } from "../utils";

import '../../styles/components/display.css';


export function DisplayProducts(props) {
  const products = props.products;    // dict with products info
  const size = props.size;            // normal, small
  const isOwner = props.isOwner;      // For edit mode

  const cartData = useSelector(state => state.cart);
  const cartProductIds = useSelector(state => state.cartProductIds);
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // normal + default => for home page
  // small + edit + isOwner => profile page
  // - prop: products - dict with products info to display
	// - prop: size (small, normal) - sets the size of each product card (normal for home page, small for profile page)
	// - prop: mode (default, edit) - sets e.g. 'Edit' button for profile page instead of purchase button (which is set by default)

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = (id) => {
    setCurrentId(id);
    setOpen(true);
  }

  function handleRedirect(route) {
    history.push(`/${route}/`);
  }

  if (cartData === null || cartProductIds === null) {
    return null;
  }

  return(
    <Box className='products-block'>
      {
        Object.entries(products).map(([key, product]) => {
          const imageBox = (
            <Box className={'product-preview-block' + ((size === 'small') ? (' ' + 'profile-preview-block') : '')}>
              <img
                src={(product.image !== null && product.image !== "")
                  ? product.image 
                  : noImageURL}
                alt='product image'
                className={'product-preview' + ((size === 'small') ? (' ' + 'profile-preview') : '')} />
            </Box>
          );

          const infoBox = (
            <Link
              className={'product-info-block' + ((size === 'small') ? (' ' + 'profile-product-info-block') : '')}
              to={'/' + productRoute + '/' + product.id + '/'}
            >
              <span className='product-title'>{product.title}</span>
              <span className='product-description'>
                {
                  (product.description.length <= 100)
                  ? product.description
                  : (product.description.substring(0, 100).trim() + '...')
                }
              </span>
            </Link>
          );

          const priceBox = (
            <Box className='product-price-block'>
              <span className='product-price'>{product.price}$</span>
              {
                (isOwner)
                ? (
                    <Box display={'flex'} justifyContent={'flex-end'}>
                      <IconButton className="display-delete-btn" onClick={() => {handleOpen(product.id)}}><Delete /></IconButton>
                      <IconButton
                        className="display-edit-btn"
                        onClick={() => {handleRedirect(`${editProductRoute}/${product.id}`)}}
                      >
                        <Edit />
                      </IconButton>

                      <DeleteDialog
                        productId={currentId}
                        open={open}
                        handleClose={handleClose}
                        reload={true}
                      />
                    </Box>
                  )
                : (
                    (product.in_stock)
                    ? (
                        (cartProductIds.includes(product.id))
                        ? (
                            <Box className="in-cart-block">
                              <Button
                                className='go-to-cart-page-btn'
                                variant="outlined"
                                color="primary"
                                onClick={() => {handleRedirect(cartRoute)}}
                              >
                                In cart
                              </Button>
                              <Button
                                className='remove-cart-item-btn'
                                variant="contained"
                                color="primary"
                                onClick={() => {handleRemoveFromCart(product.id, cartData.id, cartProductIds)}}
                              >
                                Remove
                              </Button>
                            </Box>
                          )
                        : (
                            <Box className="display-cart-btn-block">
                              {
                                (!product.is_active)
                                ? (<span className="out-of-stock-label"><b>Not available</b></span>)
                                : (
                                    <IconButton
                                      className='cart-btn'
                                      onClick={() => {handleAddToCart(product.id, cartData.id, cartProductIds)}}
                                    >
                                      <ShoppingCart />
                                    </IconButton>
                                  )
                              }
                            </Box>
                          )
                      )
                    : (<span className="out-of-stock-label" ><b>{(product.is_active) ? "Not available" : "Out of stock"}</b></span>)
                  )
              }
            </Box>
          );

          return(
            <Box key={key} className={'default-block product-card' + ((!product.is_active && !isOwner) ? (' ' + 'disabled-block') : '')}>
              {imageBox}
              {infoBox}
              {priceBox}
            </Box>
          );
        })
      }
    </Box>
  );
}

export function DisplayPagination(props) {
  const products = props.products;
  let paginationBlock = null;

  const handlePaginationClick = (url) => {
    const newUrl = new URL(url);
    const params = new URLSearchParams(history.location.search);

    params.set('page', newUrl.searchParams.get('page')); 
    if (JSON.parse(params.get('page')) === null) {
      params.delete('page');
    }
    history.replace({ search: params.toString() })
    get_products(newUrl.href, props.setter);
  }

  if (products !== null) {
    paginationBlock = (
      <Box className='pagination-block'>

        <Box className='previous-pages'>
          <Button 
            onClick={(e) => {handlePaginationClick(products.first)}}
            disabled={!Boolean(products.previous)}
          >
            First
          </Button>

          <Button
            onClick={(e) => {handlePaginationClick(products.previous)}}
            disabled={!Boolean(products.previous)}
          >
            Previous
          </Button>
        </Box>

        <span className='pages-info'>
          Page {products.number} of {products.num_pages}
        </span>

        <Box className='next-pages'>
          <Button
            onClick={(e) => {handlePaginationClick(products.next)}}
            disabled={!Boolean(products.next)}
          >
            Next
          </Button>

          <Button
            onClick={(e) => {handlePaginationClick(products.last)}}
            disabled={!Boolean(products.next)}
          >
            Last
          </Button>
        </Box>
        
      </Box>
    );
  }

  return (
    <Box>
      {paginationBlock}
    </Box>
  ); 
}

// Func for getting products using api call (setter is setProducts currently from profile and home pages)
export function get_products(url, setter) {
  blankAxiosInstance.get(url).then((res) => {
    setter(res.data);
    window.scrollTo(0, 0);  // After successful request scrolling to the top
  }).catch((err) => {
    console.log("get_products error.");
  });
}


export function DisplayCartItems(props) {

  const handleQuantityChange = (e, cartItem, value, productQuantity) => {
    e.preventDefault();

    if (value > productQuantity) {
      console.log(`Maximum quantity for this product is: ${productQuantity}`);
    } else {
      props.changeQuantity(cartItem, value);
    }
  }

  return (
    <Box className='display-cart-items'>
      {
        Object.entries(props.cartItems.results).map(([key, cartItem]) => {
          // Deleting cart item if it's quantity is equal or less than 0
          //if (cartItem.quantity <= 0) {
          //  return props.handleDelete(cartItem.product.id, cartItem.cart.id);
          //}

          const imageBox = (
            <Box className={'cart-item-image-block'}>
              <img
                src={(cartItem.product.image !== null && cartItem.product.image !== "")
                  ? cartItem.product.image 
                  : noImageURL}
                alt='cart item image'
                className={'cart-item-image'} />
            </Box>
          );

          const infoBox = (
            <Box className='cart-item-info-block'>
              <Link
                className={'cart-item-info-link'}
                to={'/' + productRoute + '/' + cartItem.product.id + '/'}
              >
                <span className='cart-item-title'>{cartItem.product.title}</span>
              </Link>

              <Button
                className='delete-cart-item-btn'
                onClick={() => props.handleDelete(cartItem)}
              >
                Delete
              </Button>
            </Box>
          );

          const priceBox = (
            <Box className='cart-item-purchase-block'>

              <Box className='quantity-block'>
                <Button
                  className='minus1-btn change-quantity-btn'
                  onClick={(e) => {handleQuantityChange(e, cartItem, cartItem.quantity - 1, cartItem.product.quantity)}}
                  variant="outlined"
                >
                  -
                </Button>
                <span className='cart-item-quantity'>{cartItem.quantity}</span>
                <Button
                  className='plus1-btn change-quantity-btn'
                  onClick={(e) => {handleQuantityChange(e, cartItem, cartItem.quantity + 1, cartItem.product.quantity)}}
                  variant="outlined"
                >
                  +
                </Button>
              </Box>

              <Box className="cart-item-price-block">
                <span className='cart-item-price'>{cartItem.total_price}$</span>
              </Box>
            </Box>
          );

          return(
            <Box key={key} className='default-block cart-items-block'>
              {imageBox}
              {infoBox}
              {priceBox}
            </Box>
          );
        })
      }
    </Box>
  );
}