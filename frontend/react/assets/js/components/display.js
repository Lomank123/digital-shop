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

  const userData = useSelector(state => state.user);
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

  if (cartData === null || cartProductIds === null || userData === null) {
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
                                onClick={() => {handleRemoveFromCart(product.id, cartData.id)}}
                              >
                                Remove
                              </Button>
                            </Box>
                          )
                        : (
                            <Box className="display-cart-btn-block">
                              {
                                (product.created_by === userData.id)
                                ? <span className="out-of-stock-label"><b>It is your product</b></span>
                                : (
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
                                  )
                              }
                            </Box>
                          )
                      )
                    : (
                        <span className="out-of-stock-label">
                          <b>
                            {
                              (product.created_by === userData.id)
                              ? "It is your product"
                              : ((!product.is_active) ? "Not available" : "Out of stock")
                            }
                          </b>
                        </span>
                      )
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
  const items = props.items;
  let paginationBlock = null;

  const handlePaginationClick = (url) => {
    const newUrl = new URL(url);
    const params = new URLSearchParams(history.location.search);

    let paramName = 'page';
    if (props.pageParamName) {
      paramName = props.pageParamName;
    }

    params.set(paramName, newUrl.searchParams.get('page')); 
    if (JSON.parse(params.get(paramName)) === null) {
      params.delete(paramName);
    }
    history.replace({ search: params.toString() })
    get_items(newUrl.href, props.setter);
  }

  if (items !== null) {
    paginationBlock = (
      <Box className='pagination-block'>

        <Box className='previous-pages'>
          <Button 
            onClick={(e) => {handlePaginationClick(items.first)}}
            disabled={!Boolean(items.previous)}
          >
            First
          </Button>

          <Button
            onClick={(e) => {handlePaginationClick(items.previous)}}
            disabled={!Boolean(items.previous)}
          >
            Previous
          </Button>
        </Box>

        <span className='pages-info'>
          Page {items.number} of {items.num_pages}
        </span>

        <Box className='next-pages'>
          <Button
            onClick={(e) => {handlePaginationClick(items.next)}}
            disabled={!Boolean(items.next)}
          >
            Next
          </Button>

          <Button
            onClick={(e) => {handlePaginationClick(items.last)}}
            disabled={!Boolean(items.next)}
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

// Func for getting items using api call (setter is setProducts currently from profile and home pages)
export async function get_items(url, setter, pageParamName=null) {
  return blankAxiosInstance.get(url).then((res) => {
    setter(res.data);
    //window.scrollTo(0, 0);  // After successful request scrolling to the top
    return res.data;
  }).catch((err) => {
    console.log("get_items error.");

    if (err.response.data.detail === "Invalid page." && err.response.status === 404) {
      const newUrl = new URL(err.response.request.responseURL);
      if (parseInt(newUrl.searchParams.get("page")) - 1 <= 1) {
        newUrl.searchParams.delete("page");
      } else {
        newUrl.searchParams.set("page", newUrl.searchParams.get("page") - 1);
      }

      blankAxiosInstance.get(newUrl).then((res) => {
        setter(res.data);
        const params = new URLSearchParams(window.location.search);
        let paramName = "page";
        if (pageParamName) {
          paramName = pageParamName;
        }
        if (params.get(paramName)) {
          if (res.data.num_pages <= 1) {
            params.delete(paramName);
          } else if (parseInt(params.get(paramName)) > res.data.num_pages) {
            params.set(paramName, parseInt(params.get(paramName)) - 1);
          }
          history.replace({ search: params.toString() })
        }
        console.log("Again and done!");
      }).catch((err) => {
        console.log(err);
        console.log("Again and error!");
      });
    }
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
                variant="outlined"
                color="primary"
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