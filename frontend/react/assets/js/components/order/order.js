import { Box } from "@material-ui/core";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrders } from "../../utils";
import { DisplayOrders, DisplayPagination } from "../display";
import '../../../styles/order/order.css';


export default function UserOrders(props) {
  const [orders, setOrders] = useState(null);

  useLayoutEffect(() => {
    getOrders().then((res) => {
      setOrders(res.data);
    }).catch((err) => {
      console.log(err);
      console.log("Get orders error.");
    });
  }, []);

  if (orders === null) {
    return null;
  }

  return (
    <Box className="default-main-block orders-main-block">
      <h3 className="orders-label">Your orders</h3>
      <Box className="orders-block">
        <hr />
        <DisplayPagination items={orders} setter={setOrders} />
        <hr />
        <DisplayOrders items={orders} />
        <hr />
        <DisplayPagination items={orders} setter={setOrders} />
        <hr />
      </Box>
    </Box>
  );
}