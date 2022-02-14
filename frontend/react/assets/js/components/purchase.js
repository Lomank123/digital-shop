import React, { useLayoutEffect, useState } from "react";
import { Box, Button } from '@material-ui/core';
import { useSelector } from "react-redux";
import { blankAxiosInstance } from "../axios";
import { getEitherCartItemsURL } from "../urls";
import { getTotalPrice, handlePostPurchase } from "../utils";
import history from "../history";
import '../../styles/components/purchase.css';


export default function Purchase() {
  const cart = useSelector(state => state.cart);
  const cartProductIds = useSelector(state => state.cartProductIds);
  const [totalPrice, setTotalPrice] = useState(null);
  const [items, setItems] = useState(null);

  const postPurchase = () => {
    handlePostPurchase(cart.id).then((res) => {
      history.push('/');
    }).catch((err) => {
      console.log(err);
      console.log("Purchase error.");
    });
  }

  useLayoutEffect(() => {
    if (cart !== null) {
      getTotalPrice(cart.id).then((res) => {
        setTotalPrice(res.data.total_price);
      }).catch((err) => {
        console.log(err);
        console.log("Get total price error.");
      });
    }
  }, [cart])

  if (cart === null || cartProductIds === null) {
    return null;
  }

  return(
    <Box className="purchase-main-block default-block">
      {
        (cartProductIds.length > 0)
        ? (
            <Box>
              <h4>Confirm your purchase</h4>
              <p>You are going to purchase these products by total cost of {totalPrice}$. To confirm please click the button below.</p>
              <Button variant="contained" color="primary" onClick={postPurchase}>Purchase</Button>
            </Box>
          )
        : (<h4>Cart is empty. Nothing to purchase.</h4>)
      }
    </Box>
  )
}