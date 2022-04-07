import { Box, Button } from "@material-ui/core";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { blankAxiosInstance } from "../axios";
import { userCartItemGetURL, nonUserCartItemGetURL, cartItemURL } from "../urls";
import { DisplayCartItems, DisplayPagination, get_items } from "./display";
import '../../styles/components/cart.css';
import { handleRemoveFromCart, handleRemoveAllFromCart, handleMoveToUserCart, getTotalPrice } from "../utils";
import history from "../history";
import { purchaseRoute } from "../routes";
import { useTranslation } from "react-i18next";


const pageParamName = "anon-cart-page";

export default function Cart() {
  const {t, i18n} = useTranslation();
  const userData = useSelector(state => state.user);
  const [cartItems, setCartItems] = useState(null);
  const [userTotal, setUserTotal] = useState(null);
  const [secondCartItems, setSecondCartItems] = useState(null);
  const [nonUserTotal, setNonUserTotal] = useState(null);
  const [quantityChanged, setQuantityChanged] = useState(false);

  const changeQuantity = (cartItem, value) => {
    if (value <= 0) {
      handleDelete(cartItem);
      return;
    }
    // Here we use PATCH method to partially update CartItem instance
    blankAxiosInstance.patch(cartItemURL + cartItem.id + '/', { quantity: value }).then((res) => {
      setQuantityChanged(!quantityChanged);
    }).catch((err) => {
      console.log("Quantity change error.");
    });
  }

  const handleMoveToCart = () => {
    handleMoveToUserCart().then((res) => {
      setQuantityChanged(!quantityChanged);
      console.log("Successfully moved!");
    }).catch((err) => {
      console.log(err);
      console.log("Move error.");
    });
  }

  const handleDeleteAll = (cartItem) => {
    handleRemoveAllFromCart(cartItem.cart.id).then((res) => {
      history.replace({ search: '', });
      setQuantityChanged(!quantityChanged);
    }).catch((err) => {
      console.log(err);
      console.log("Cart clean error.");
    });
  }
  
  const handleDelete = (cartItem) => {
    handleRemoveFromCart(cartItem.product.id, cartItem.cart.id).then((res) => {
      setQuantityChanged(!quantityChanged);
    }).catch((err) => {
      console.log(err);
      console.log("Procuct remove from cart error.");
    });
  }

  const handleRedirect = (route) => {
    history.push(`/${route}/`);
  }

  // Cart items api call
  useLayoutEffect(() => {
    // User cart items
    const searchParams = new URLSearchParams(history.location.search);
    const page = searchParams.get("page");
    const nonUserPage = searchParams.get(pageParamName);

    // Setting user cart items
    let url = new URL(userCartItemGetURL);
    if (page !== null) {
      url.searchParams.set('page', page);
    }
    get_items(url, setCartItems)
    
    // Setting non-user cart items
    url = new URL(nonUserCartItemGetURL);
    if (nonUserPage !== null) {
      url.searchParams.set('page', nonUserPage);
    }
    get_items(url, setSecondCartItems, pageParamName);
  }, [quantityChanged])

  useEffect(() => {
    if (cartItems !== null) {
      if (cartItems.results.length > 0) {
        getTotalPrice(cartItems.results[0].cart.id).then((result) => {
          setUserTotal(result.data.total_price);
        }).catch((err) => {
          console.log(err);
          console.log("Total price error.");
        });
      }
    }
  }, [cartItems]);

  useEffect(() => {
    if (secondCartItems !== null) {
      if (secondCartItems.results.length > 0) {
        getTotalPrice(secondCartItems.results[0].cart.id).then((result) => {
          setNonUserTotal(result.data.total_price);
        }).catch((err) => {
          console.log(err);
          console.log("Total price error.");
        });
      }
    }
  }, [secondCartItems]);

  if (userData === null || cartItems === null || secondCartItems === null) {
    return null;
  }

  return(
    <Box className="cart-block">
      {
        (cartItems.results.length === 0 && secondCartItems.results.length === 0)
        ? (<h3>{t("cart.cart-empty")}</h3>)
        : null
      }

      {
          (cartItems.results.length > 0) 
          ? (
              <Box className="user-cart-block cart">
                <Box className="non-user-cart-header">
                  <Box>
                    <h3 className="cart-label">{t("cart.user-cart-label")}</h3>
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="remove-all-from-cart-btn"
                    onClick={() => {handleDeleteAll(cartItems.results[0])}}
                  >
                    {t("cart.clean-cart-button")}
                  </Button>
                </Box>
                <hr />
                <DisplayPagination items={cartItems} setter={setCartItems} />
                <hr />
                <DisplayCartItems cartItems={cartItems} changeQuantity={changeQuantity} handleDelete={handleDelete} />
                <hr />
                <DisplayPagination items={cartItems} setter={setCartItems} />
                <hr />
              </Box>
            )
          : null
        }

        {
          (cartItems.results.length > 0)
          ? (
              <Box>
                <Box className="default-block cart-purchase-block">
                  <h4 className="purchase-block-label">{t("cart.user-cart-label")}</h4>
                  <h4 className="total-price-label">{t("cart.total-price")} {userTotal}$</h4>
                  <Button
                    variant="contained"
                    color="primary"
                    className="cart-purchase-btn"
                    onClick={() => {handleRedirect(purchaseRoute)}}
                  >
                    {t("cart.purchase-button")}
                  </Button>
                </Box>
              </Box>
            )
          : null
        }

        {
          (secondCartItems.results.length > 0)
          ? (
              <Box className="non-user-cart-block cart">
                <Box className="non-user-cart-header">
                  <Box>
                    <h3 className="cart-label">{t("cart.non-user-label")}</h3>
                    <p className="cart-label">{t("cart.non-user-information")}</p>
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="remove-all-from-cart-btn"
                    onClick={() => {handleDeleteAll(secondCartItems.results[0])}}
                  >
                    {t("cart.clean-cart-button")}
                  </Button>
                </Box>
                <hr />
                <DisplayPagination items={secondCartItems} setter={setSecondCartItems} pageParamName={pageParamName} />
                <hr />
                <DisplayCartItems cartItems={secondCartItems} changeQuantity={changeQuantity} handleDelete={handleDelete} />
                <hr />
                <DisplayPagination items={secondCartItems} setter={setSecondCartItems} pageParamName={pageParamName} />
                <hr />
              </Box>
            )
          : null
        }

        {
          (secondCartItems.results.length > 0)
          ? (
              <Box>
                <Box className="default-block cart-purchase-block">
                  <h4 className="purchase-block-label">{t("cart.non-user-label")}</h4>
                  <h4 className="total-price-label">{t("cart.total-price")} {nonUserTotal}$</h4>
                  {
                    (userData !== 1)
                    ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleMoveToCart}
                        >
                          {t("cart.move-to-user-cart-button")}
                        </Button>
                      )
                    : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {handleRedirect(purchaseRoute)}}
                        >
                          {t("cart.purchase-button")}
                        </Button>
                      )
                  }
                  
                </Box>
              </Box>
            )
          : null
        }
    </Box>
  )
}