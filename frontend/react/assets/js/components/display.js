import React, { useState } from "react";
import { Delete, Edit, ShoppingCart } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { productRoute, editProductRoute } from '../routes';
import { cartItemAddURL, noImageURL } from "../urls";
import { Box, Button, IconButton } from "@material-ui/core";
import { blankAxiosInstance } from "../axios";
import history from "../history";
import { DeleteDialog } from "./dialog";
import { useSelector } from "react-redux";

import '../../styles/components/display.css';


export function DisplayProducts(props) {
  const products = props.products;    // dict with products info
  const size = props.size;            // normal, small
  const mode = props.mode;            // default, edit
  const isOwner = props.isOwner;      // For edit mode

  const cartData = useSelector(state => state.cart);
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

  const handleEdit = (id) => {
    history.push(`/${editProductRoute}/${id}/`);
  }

  const handleAddToCart = (product_id) => {
    blankAxiosInstance.post(cartItemAddURL,
      { 
        product_id: product_id,
        cart_id: cartData.id,
      }
    ).then((res) => {
      console.log(res);
      console.log("Product has been added to cart!");
    }).catch((err) => {
      console.log(err);
      console.log("Procuct add to cart error.")
    })
  }

  if (cartData === null) {
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
                (mode === 'edit')
                ? (
                    (isOwner)
                    ? (
                        <Box display={'flex'} justifyContent={'flex-end'}>
                          <IconButton className="display-delete-btn" onClick={() => {handleOpen(product.id)}}><Delete /></IconButton>
                          <IconButton className="display-edit-btn" onClick={() => {handleEdit(product.id)}}><Edit /></IconButton>
                          <DeleteDialog
                            productId={currentId}
                            open={open}
                            handleClose={handleClose}
                            reload={true}
                          />
                        </Box>
                      )
                    : null
                  )
                : (
                    (product.in_stock)
                    ? (<IconButton className='cart-btn' onClick={() => {handleAddToCart(product.id)}}><ShoppingCart /></IconButton>)
                    : (<span className="out-of-stock-label" >Out of stock</span>)
                  )
              }
            </Box>
          );

          return(
            <Box key={key} className='default-block product-card'>
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

        <Box className='previous-pages' visibility={(products.previous) ? 'visible' : 'hidden'}>
          <Button onClick={(e) => {handlePaginationClick(products.first)}}>First</Button>
          <Button onClick={(e) => {handlePaginationClick(products.previous)}}>Previous</Button>
        </Box>

        <span className='pages-info'>
          Page {products.number} of {products.num_pages}
        </span>

        <Box className='next-pages' visibility={(products.next) ? 'visible' : 'hidden'}>
              <Button onClick={(e) => {handlePaginationClick(products.next)}}>Next</Button>
              <Button onClick={(e) => {handlePaginationClick(products.last)}}>Last</Button>
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
    //console.log(res.data);
    setter(res.data);
    //console.log("get_products done!");
    window.scrollTo(0, 0);  // After successful request scrolling to the top
  }).catch((err) => {
    console.log("get_products error.");
  });
}


export function DisplayCartItems(props) {
  const cartItems = props.cartItems;

  const handleQuantityChange = (e, itemId, value, productQuantity) => {
    e.preventDefault();
    if (value < 1) {
      console.log('Minimum quantity for this product is: 1');
    } else if (value > productQuantity) {
      console.log(`Maximum quantity for this product is: ${productQuantity}`);
    } else {
      props.changeQuantity(itemId, value);
    }
  }

  return (
    <Box className='display-cart-items'>
      {
        Object.entries(cartItems.results).map(([key, cartItem]) => {
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

              <Button className='delete-cart-item-btn'>Delete</Button>
            </Box>
          );

          const priceBox = (
            <Box className='cart-item-purchase-block'>

              <Box className='quantity-block'>
                <Button
                  className='minus1-btn change-quantity-btn'
                  onClick={(e) => {handleQuantityChange(e, cartItem.id, cartItem.quantity - 1, cartItem.product.quantity)}}
                  variant="outlined"
                >
                  -
                </Button>
                <span className='cart-item-quantity'>{cartItem.quantity}</span>
                <Button
                  className='plus1-btn change-quantity-btn'
                  onClick={(e) => {handleQuantityChange(e, cartItem.id, cartItem.quantity + 1, cartItem.product.quantity)}}
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