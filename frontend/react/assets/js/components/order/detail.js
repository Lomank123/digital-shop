import { Box } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router';
import '../../../styles/order/detail.css';


export default function OrderDetail(props) {
  const params = useParams();
  // Use DisplayCartItems here

  return(
    <Box className="order-detail-block">
      <p>Order #{params.id}</p>
    </Box>
  );
}