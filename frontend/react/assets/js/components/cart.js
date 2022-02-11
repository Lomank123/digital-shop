import { Box, Button } from "@material-ui/core";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { blankAxiosInstance } from "../axios";
import { userCartItemGetURL, nonUserCartItemGetURL, cartItemURL } from "../urls";
import { DisplayCartItems, DisplayPagination, get_items } from "./display";
import '../../styles/components/cart.css';
import { handleRemoveFromCart, handleRemoveAllFromCart, handleMoveToUserCart } from "../utils";
import history from "../history";


const pageParamName = "anon-cart-page";

export default function Cart() {
  const userData = useSelector(state => state.user);
  const [cartItems, setCartItems] = useState(null);
  const [secondCartItems, setSecondCartItems] = useState(null);
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
    get_items(url, setCartItems);

    // Setting non-user cart items
    url = new URL(nonUserCartItemGetURL);
    if (nonUserPage !== null) {
      url.searchParams.set('page', nonUserPage);
    }
    get_items(url, setSecondCartItems, pageParamName);

  }, [quantityChanged])

  if (userData === null || cartItems === null || secondCartItems === null) {
    return null;
  }

  return(
    <Box className="cart-block">
      {
        (cartItems.results.length === 0 && secondCartItems.results.length === 0) ? (<h3>Cart is empty.</h3>) : null
      }
      {
        (cartItems.results.length > 0) 
        ? (
            <Box className="user-cart-block cart">
              <Box className="non-user-cart-header">
                <Box>
                  <h3 className="cart-label">User cart</h3>
                </Box>
                <Button className="remove-all-from-cart-btn" onClick={() => {handleDeleteAll(cartItems.results[0])}}>Clean cart</Button>
              </Box>
              
              <DisplayPagination items={cartItems} setter={setCartItems} />
              <DisplayCartItems cartItems={cartItems} changeQuantity={changeQuantity} handleDelete={handleDelete} />
              <DisplayPagination items={cartItems} setter={setCartItems} />
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
                  <h3 className="cart-label">Non-user cart</h3>
                  <p className="cart-label">Non-user cart products will be kept for 30 days. After that they will be discarded.</p>
                </Box>
                <Button className="remove-all-from-cart-btn" onClick={() => {handleDeleteAll(secondCartItems.results[0])}}>Clean cart</Button>
                {
                  (userData !== 1)
                  ? (
                      <Button
                        className="remove-all-from-cart-btn"
                        onClick={handleMoveToCart}
                      >
                        Move to user cart
                      </Button>
                    )
                  : null
                }
              </Box>

              <DisplayPagination items={secondCartItems} setter={setSecondCartItems} pageParamName={pageParamName} />
              <DisplayCartItems cartItems={secondCartItems} changeQuantity={changeQuantity} handleDelete={handleDelete} />
              <DisplayPagination items={secondCartItems} setter={setSecondCartItems} pageParamName={pageParamName} />
            </Box>
          )
        : null
      }

    </Box>
  )
}