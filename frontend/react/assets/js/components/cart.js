import { Box } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";


export default function Cart() {
  const userCart = useSelector(state => state.cart);

  // Here we will get all cart related items
  // An api call will be here to get items by using userCart.id
  // And don't forget about displaying anonymous cart items

  if (userCart === null) {
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