import { Box, Button } from '@material-ui/core';
import React, { useState, useLayoutEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { blankAxiosInstance } from '../axios';
import { userGetURL, userProductsGetURL } from '../urls';
import { detailProductRoute } from '../routeNames';
import { Link } from 'react-router-dom';


export default function UserProfile() {
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);


  useLayoutEffect(() => {
    blankAxiosInstance.get(userGetURL).then((res) => {
      const joinedDate = new Date(res.data[0].date_joined);
      res.data[0].date_joined = joinedDate.toISOString().split('T')[0];

      setUser(res.data[0]);
      console.log("User data done!");
    }).catch((err) => {
      console.log(err);
      console.log("User data error");
      //console.log(err.response);
    });

    blankAxiosInstance.get(userProductsGetURL).then((res) => {
      setProducts(res.data);
      console.log("Products data done!");
    }).catch((err) => {
      console.log(err);
      console.log("Products data error");
      //console.log(err.response);
    });
  }, [])

  if (shallowEqual(user, [])) {
    return null;
  }

  return (
    <Box className='user-profile'>

      <UserInfo data={user} />
      <h3 className='your-label'>Your products</h3>
      <ProductsInfo data={products} />
    </Box>
  );
}


export function UserInfo(props) {
  const user = props.data;

  return (
    <Box className='default-box profile-box'>

      <Box className='profile-main-info-box'>

        <Box className='profile-img-box'>
          <img src={(user.photo !== null && user.photo !== "")
                  ? user.photo 
                  : 'http://127.0.0.1/react/images/no-image.jpg'} className='profile-img' alt='user photo' />
        </Box>

        <Box className='profile-main-credentials-box'>
          <span><b>Email:</b> {user.email}</span>
          <span><b>Username:</b> {user.username}</span>
          <span><b>Date joined:</b> {user.date_joined}</span>
        </Box>

        <Box className='profile-button-box'>
          <Link to={'/'}>Edit profile</Link>
        </Box>

      </Box>
    </Box>
  );
}

export function ProductsInfo(props) {
  const products = props.data;

  return (
    <Box className='products-box profile-products-box'>
    {
      Object.entries(products).map(([key, product]) => {
        return(
          <Box key={key} className='product-card'>
            <Box className='product-thumbnail-box profile-small'>
              <img
                src={(product.image !== null && product.image !== "")
                  ? product.image 
                  : 'http://127.0.0.1/react/images/no-image.jpg'}
                alt='no image'
                className='product-thumbnail profile-small' />
            </Box>
            <Link className='product-info-box profile-product-info' to={detailProductRoute + '/' + product.id + '/'}>
              <span className='product-title'>{product.title}</span>
              <span className='product-description'>
                {
                  (product.description.length <= 100)
                  ? product.description
                  : (product.description.substring(0, 100).trim() + '...')
                }
              </span>
            </Link>
            <Box className='product-price-box'>
              <span className='product-price'>{product.price}$</span>
            </Box>
          </Box>
        )
      })
    }
  </Box>
  )
}