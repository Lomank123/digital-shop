import { Box } from "@material-ui/core";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { blankAxiosInstance } from "../axios";
import { userCartItemGetURL, nonUserCartItemGetURL } from "../urls";


export default function Cart() {
  const userCart = useSelector(state => state.cart);
  const [cartItems, setCartItems] = useState(null);
  const [secondCartItems, setSecondCartItems] = useState(null);

  // Here we will get all cart related items
  // An api call will be here to get items by using userCart.id
  // And don't forget about displaying anonymous cart items

  useLayoutEffect(() => {
    blankAxiosInstance.get(userCartItemGetURL).then((res) => {
      setCartItems(res);
      console.log("Cart items get done!");
    }).catch((err) => {
      console.log(err);
      console.log("Cart items get error.");
    })

    blankAxiosInstance.get(nonUserCartItemGetURL).then((res) => {
      setSecondCartItems(res);
      console.log("Cart items get done!");
    }).catch((err) => {
      console.log(err);
      console.log("Cart items get error.");
    })
  }, [])

  console.log(cartItems);
  console.log(secondCartItems);

  if (userCart === null || cartItems === null) {
    return null;
  }

  return(
    <Box>
      <p>Cart page!</p>
      <p>{userCart.id}</p>
      <p>{userCart.user}</p>
      <p>{userCart.creation_date}</p>
      <p>{userCart.is_deleted}</p>
    </Box>
  )
}