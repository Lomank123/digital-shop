import { Box } from "@material-ui/core";
import React, { useLayoutEffect, useState } from "react";
import { DisplayOrders, DisplayPagination } from "../display";
import '../../../styles/order/order.css';
import { cartItemURL, ordersURL } from "../../urls";
import { blankAxiosInstance } from "../../axios";
import { get_items } from "../display";
import history from "../../history";
import { useSelector } from "react-redux";


export default function UserOrders() {
  const userData = useSelector(state => state.user);
  const [orders, setOrders] = useState(null);
  const [isOpen, setIsOpen] = useState({});
  const [orderItems, setOrderItems] = useState({});

  function getOrderItems(key, cartId) {
    let url = new URL(cartItemURL);
    url.searchParams.set("cart__id", cartId);
    // Here if we want to get order items data it shouldn't be paginated
    // Or if paginated then no search params should be specified
    blankAxiosInstance.get(url).then((res) => {
      setOrderItems({
        ...orderItems,
        [key]: res.data,
      });
      console.log("Get order items done!");
    }).catch((err) => {
      console.log(err);
      console.log("Get order items error.");
    })
  }

  const handleOpen = (key, cartId) => {
    setIsOpen({
      ...isOpen,
      [key]: !isOpen[key],
    });
    if (!orderItems[key]) {
      getOrderItems(key, cartId);
    }
  }

  useLayoutEffect(() => {
    // Getting products data
    let url = new URL(ordersURL);
    const searchParams = new URLSearchParams(history.location.search);
    const page = searchParams.get("page");
    if (page !== null) {
      url.searchParams.set('page', page);
    }
    url.searchParams.set('cart__user__id', userData.id);
    url.searchParams.set('cart__is_archived', true);

    get_items(url, setOrders);
  }, []);

  if (orders === null || userData === null) {
    return null;
  }

  return (
    <Box className="default-main-block orders-main-block">
      <h3 className="orders-label">{(orders.results.length > 0) ? "Your orders" : "No orders found"}</h3>
      {
        (orders.results.length > 0) 
        ? (
          <Box className="orders-block">
            <hr />
            <DisplayPagination setOrderItems={setOrderItems} setNestedList={setIsOpen} items={orders} setter={setOrders} />
            <hr />
            <DisplayOrders orderItems={orderItems} setOrderItems={setOrderItems} nestedList={isOpen} setNestedList={handleOpen} items={orders} />
            <hr />
            <DisplayPagination setOrderItems={setOrderItems} setNestedList={setIsOpen} items={orders} setter={setOrders} />
            <hr />
          </Box>
        )
        : null
      }
    </Box>
  );
}