import { Box } from "@material-ui/core";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { blankAxiosInstance } from "../axios";
import { userCartItemGetURL, nonUserCartItemGetURL, cartItemURL } from "../urls";
import { DisplayCartItems } from "./display";
import '../../styles/components/cart.css';


export default function Cart() {
  const userCart = useSelector(state => state.cart);
  const [cartItems, setCartItems] = useState(null);
  const [secondCartItems, setSecondCartItems] = useState(null);
  const [quantityChanged, setQuantityChanged] = useState(false);

  const changeQuantity = (itemId, value) => {
    // Here we use PATCH method to partially update CartItem instance
    blankAxiosInstance.patch(cartItemURL + itemId + '/', { quantity: value }).then((res) => {
      setQuantityChanged(!quantityChanged);
    }).catch((err) => {
      console.log("Quantity change error.");
    })
  }

  // Cart items api call
  useLayoutEffect(() => {
    // User cart items
    blankAxiosInstance.get(userCartItemGetURL).then((res) => {
      setCartItems(res.data);
      console.log("Cart items get done!");
    }).catch((err) => {
      setCartItems({});
      //console.log("Cart items get error.");
    });
    // Non-user cart items
    blankAxiosInstance.get(nonUserCartItemGetURL).then((res) => {
      setSecondCartItems(res.data);
      console.log("Cart items non-user get done!");
    }).catch((err) => {
      setSecondCartItems({});
      //console.log("Cart items non-user get error.");
    });
  }, [quantityChanged])

  if (userCart === null || cartItems === null || secondCartItems === null) {
    return null;
  }

  return(
    <Box className="cart-block">
      {
        (cartItems.results.length > 0) 
        ? (
            <Box className="user-cart-block cart">
              {(cartItems.results.length > 0) ? (<h3 className="cart-label">User cart</h3>) : null}
              <DisplayCartItems cartItems={cartItems} changeQuantity={changeQuantity} />
            </Box>
          )
        : null
      }

      {
        (secondCartItems.results.length > 0) 
        ? (
            <Box className="non-user-cart-block cart">
              {(secondCartItems.results.length > 0) ? (<h3 className="cart-label">Non user cart</h3>) : null}
              <DisplayCartItems cartItems={secondCartItems} />
            </Box>
          )
        : null
      }

    </Box>
  )
}