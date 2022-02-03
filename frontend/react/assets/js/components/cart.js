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
      setCartItems(res.data);
      //console.log(res);
      console.log("Cart items get done!");
    }).catch((err) => {
      setCartItems({});
      console.log(err);
      console.log("Cart items get error.");
    })

    blankAxiosInstance.get(nonUserCartItemGetURL).then((res) => {
      setSecondCartItems(res.data);
      //console.log(res);
      console.log("Cart items non-user get done!");
    }).catch((err) => {
      setSecondCartItems({});
      console.log(err);
      console.log("Cart items non-user get error.");
    })
  }, [])

  if (userCart === null || cartItems === null || secondCartItems === null) {
    return null;
  }

  return(
    <Box>
      <p>Cart page!</p>
      <p>{userCart.id}</p>
      <p>{userCart.user}</p>
      <p>{userCart.creation_date}</p>
      <p>{userCart.is_deleted}</p>

      <Box>
        <hr />
        <h3>User cart</h3>
        {
          Object.entries(cartItems.results).map(([key, cartItem]) => {
            return(
              <Box key={key}>
                <p>{cartItem.product.title}</p>
                <p>{cartItem.product.price}$</p>
              </Box>
            );
          })
        }
      </Box>

      <Box>
        <hr />
        <h3>Non User cart</h3>
        {
          Object.entries(secondCartItems.results).map(([key, cartItem]) => {
            return(
              <Box key={key}>
                <p>{cartItem.product.title}</p>
                <p>{cartItem.product.price}$</p>
              </Box>
            );
          })
        }
      </Box>


    </Box>
  )
}