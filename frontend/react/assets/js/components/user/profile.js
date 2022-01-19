import { Box } from '@material-ui/core';
import React, { useState, useLayoutEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { blankAxiosInstance } from '../../axios';
import { noImageURL, userGetURL, userProductsGetURL } from '../../urls';
import { Link } from 'react-router-dom';
import { detailProductRoute } from "../../routes";

import '../../../styles/user/profile.css';


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
    <Box className='profile'>
      <UserInfo data={user} />
      <h3 className='your-label'>Your products</h3>
      <ProductsInfo products={products} />
    </Box>
  );
}

export function UserInfo(props) {
  const user = props.data;

  return (
    <Box className='default-block user-block'>

      <Box className='main-info-block'>

        <Box className='img-block'>
          <img src={(user.photo !== null && user.photo !== "")
                  ? user.photo 
                  : noImageURL} className='profile-avatar' alt='user photo' />
        </Box>

        <Box className='credentials-block'>
          <span><b>Email:</b> {user.email}</span>
          <span><b>Username:</b> {user.username}</span>
          <span><b>Date joined:</b> {user.date_joined}</span>
        </Box>

        <Box className='edit-btn-block'>
          <Link to={'/'}>Edit profile</Link>
        </Box>

      </Box>
    </Box>
  );
}

export function ProductsInfo(props) {
  const products = props.products;

  return(
    <Box className='products-block'>
    {
      Object.entries(products).map(([key, product]) => {
        return(
          <Box key={key} className='default-block product-card'>
            <Box className='product-preview-block profile-preview-block'>
              <img
                src={(product.image !== null && product.image !== "")
                  ? product.image 
                  : noImageURL}
                alt='no image'
                className='product-preview profile-preview' />
            </Box>

            <Link className='product-info-block profile-product-info-block' to={detailProductRoute + '/' + product.id + '/'}>
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
              <Link to={'/'} className="product-edit-link">Edit</Link>
            </Box>

          </Box>
        )
      })
    }
  </Box>
  );
}