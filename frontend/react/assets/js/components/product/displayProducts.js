import React from "react";
import { Box, IconButton } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { detailProductRoute } from "../../routes";


export default function DisplayProducts(props) {
  const products = props.products;

  return(
    <Box className='products-block'>
    {
      Object.entries(products).map(([key, product]) => {
        return(
          <Box key={key} className='default-block product-card'>
            <Box className='product-preview-block'>
              <img
                src={(product.image !== null && product.image !== "")
                  ? product.image 
                  : 'http://127.0.0.1/react/images/no-image.jpg'}
                alt='no image'
                className='product-preview' />
            </Box>

            <Link className='product-info-block' to={detailProductRoute + '/' + product.id + '/'}>
              <span className='product-title'>{product.title}</span>
              <span className='product-description'>
                {
                  (product.description.length <= 100)
                  ? product.description
                  : (product.description.substring(0, 100).trim() + '...')
                }
              </span>
            </Link>

            <Box className='product-price-block'>
              <span className='product-price'>{product.price}$</span>
              <IconButton className='purchase-btn'><ShoppingCart /></IconButton>
            </Box>

          </Box>
        )
      })
    }
  </Box>
  );


}