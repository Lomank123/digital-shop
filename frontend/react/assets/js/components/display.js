import React, { useState } from "react";
import { Delete, Edit, ShoppingCart, ExpandLess, ExpandMore } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { productRoute, editProductRoute, cartRoute, ordersDetailRoute } from '../routes';
import { noImageURL } from "../urls";
import { Box, Button, IconButton, List, ListItem, ListItemText, Collapse } from "@material-ui/core";
import { blankAxiosInstance } from "../axios";
import history from "../history";
import { DeleteDialog } from "./dialog";
import { useSelector } from "react-redux";
import { handleAddToCart, handleRemoveFromCart } from "../utils";
import { useTranslation } from "react-i18next";
import '../../styles/components/display.css';


export function DisplayProducts(props) {
  const {t, i18n} = useTranslation();
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
                                {t("display.in-cart-button")}
                              </Button>
                              <Button
                                className='remove-cart-item-btn'
                                variant="contained"
                                color="primary"
                                onClick={() => {handleRemoveFromCart(product.id, cartData.id)}}
                              >
                                {t("display.remove-button")}
                              </Button>
                            </Box>
                          )
                        : (
                            <Box className="display-cart-btn-block">
                              {
                                (product.created_by === userData.id)
                                ? <span className="out-of-stock-label"><b>{t("display.your-product")}</b></span>
                                : (
                                    (!product.is_active)
                                    ? (<span className="out-of-stock-label"><b>{t("display.not-available")}</b></span>)
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
                              ? t("display.your-product")
                              : ((!product.is_active) ? t("display.not-available") : t("display.out-of-stock"))
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
  const {t, i18n} = useTranslation();
  const items = props.items;
  let paginationBlock = null;

  const handlePaginationClick = (url) => {
    const newUrl = new URL(url);

    if (props.isPage === false) {
      get_items(url, props.setter, null, props.itemKey);
      return;
    }

    const params = new URLSearchParams(history.location.search);

    let paramName = 'page';
    if (props.pageParamName) {
      paramName = props.pageParamName;
    }

    params.set(paramName, newUrl.searchParams.get('page'));
    if (JSON.parse(params.get(paramName)) === null) {
      params.delete(paramName);
    }
    history.replace({ search: params.toString() });

    if (props.setNestedList) {
      console.log("Nested list reset");
      props.setOrderItems({});
      props.setNestedList({});
    }
    
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
            {t("display.first")}
          </Button>

          <Button
            onClick={(e) => {handlePaginationClick(items.previous)}}
            disabled={!Boolean(items.previous)}
          >
            {t("display.previous")}
          </Button>
        </Box>

        <span className='pages-info'>
        {t("display.page")} {items.number} {t("display.of")} {items.num_pages}
        </span>

        <Box className='next-pages'>
          <Button
            onClick={(e) => {handlePaginationClick(items.next)}}
            disabled={!Boolean(items.next)}
          >
            {t("display.next")}
          </Button>

          <Button
            onClick={(e) => {handlePaginationClick(items.last)}}
            disabled={!Boolean(items.next)}
          >
            {t("display.last")}
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

export function DisplayCartItems(props) {
  const {t, i18n} = useTranslation();
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
                {t("display.delete-button")}
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
                >-</Button>
                <span className='cart-item-quantity'>{cartItem.quantity}</span>
                <Button
                  className='plus1-btn change-quantity-btn'
                  onClick={(e) => {handleQuantityChange(e, cartItem, cartItem.quantity + 1, cartItem.product.quantity)}}
                  variant="outlined"
                >+</Button>
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

export function DisplayOrders(props) {
  const {t, i18n} = useTranslation();
  return(
    <Box className="display-orders">
      {
        Object.entries(props.items.results).map(([key, item]) => {
          const infoBox = (
            <Box className="order-info">
              <h4 className="order-id">{t("display.order-id")} {item.cart.id}</h4>
              <h5 className="order-price">{t("display.total-price")} {item.total_price}$</h5>
            </Box>
          );

          const addInfoBox = (
            <Box className="order-add-info-block">
              <span className="order-date">{t("display.date")} {setDate(item.creation_date)}</span>
            </Box>
          );

          const open = props.nestedList[key] || false;

          const listItemsBox = (
            <List component="nav">
              <ListItem button onClick={() => {props.setNestedList(key, item.cart.id)}}>
                <ListItemText primary={t("display.order-details-label")} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {
                    (props.orderItems[key])
                    ? (
                      <Box>
                        <DisplayPagination items={props.orderItems[key]} setter={props.setOrderItems} isPage={false} itemKey={key} />
                        <hr />
                        {
                          Object.entries(props.orderItems[key].results).map(([childKey, childItem]) => {
                            return (
                              <ListItem key={childKey}>
                                <Box className="order-item-block">
                                  <Box className="order-item-image-block">
                                    <img
                                      src={
                                        (childItem.product.image !== null && childItem.product.image !== "")
                                        ? childItem.product.image
                                        : noImageURL
                                      }
                                      alt='order item image'
                                      className="order-item-image"
                                    />
                                  </Box>
                                  <Box className="order-item-info-block">
                                    <Link
                                      className="cart-item-info-link"
                                      to={`/${productRoute}/${childItem.product.id}`}
                                    >
                                      <h5 className='order-item-title'>{childItem.product.title}</h5>
                                    </Link>
                                  </Box>
                                  <Box className='order-item-price-block'>
                                    <h6 className='order-item-quantity'>{t("display.quantity")} {childItem.quantity}</h6>
                                    <h6 className='order-item-price'>{t("display.total-price")} {childItem.total_price}$</h6>
                                  </Box>
                                </Box>
                              </ListItem>
                            );
                          })
                        }
                        <hr />
                      </Box>
                      )
                    : null
                  }
                </List>
              </Collapse>
            </List>
          );

          return (
            <Box key={key} className='default-block order-card'>
              <Box className="order-info-block">
                {infoBox}
                {addInfoBox}
              </Box>
              {listItemsBox}
            </Box>
          );
        })
      }
    </Box>
  );
}

// Func for getting items using api call (setter is setProducts currently from profile and home pages)
export async function get_items(url, setter, pageParamName=null, key=null) {
  return blankAxiosInstance.get(url).then((res) => {
    if (key !== null) {
      const newData = { [key]: res.data };
      setter(newData);
    } else {
      setter(res.data);
    }
    //window.scrollTo(0, 0);  // After successful request scrolling to the top
    return res.data;
  }).catch((err) => {
    console.log("get_items error.");
    //console.log(err.response);
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

export function setDate(date) {
  const newDate = new Date(date);
  return newDate.toISOString().split('T')[0];
}

export function handleRedirect(route) {
  history.push(`/${route}/`);
}