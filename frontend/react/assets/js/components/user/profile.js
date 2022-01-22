import { Box } from '@material-ui/core';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { blankAxiosInstance } from '../../axios';
import { noImageURL, userGetURL, userProductsGetURL } from '../../urls';
import { Link } from 'react-router-dom';
import { detailProductRoute } from "../../routes";
import { useParams } from 'react-router';

import '../../../styles/user/profile.css';


export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const userData = useSelector(state => state.user);
  const [isThisUser, setIsThisUser] = useState(null);
  const params = useParams();

  useEffect(() => {
    if (userData !== null && user !== null) {
      if (userData.username === user.username && userData.email === user.email) {
        setIsThisUser(true);
      } else {
        setIsThisUser(false);
      }
    }
  }, [user, userData, params])

  useLayoutEffect(() => {
    blankAxiosInstance.get(userGetURL + params.id + '/').then((res) => {
      const joinedDate = new Date(res.data.date_joined);
      res.data.date_joined = joinedDate.toISOString().split('T')[0];

      setUser(res.data);
      console.log("User data done!");
    }).catch((err) => {
      console.log(err);
      console.log("User data error");
      //console.log(err.response);
    });

    blankAxiosInstance.get(userProductsGetURL + params.id).then((res) => {
      setProducts(res.data);
      console.log("Products data done!");
    }).catch((err) => {
      console.log(err);
      console.log("Products data error");
      //console.log(err.response);
    });
  }, [params])

  if (user === null) {
    return null;
  }

  return (
    <Box className='profile'>
      <h3 className='your-label'>User profile</h3>
      <UserInfo data={user} isUser={isThisUser} />
      <h3 className='your-label'>{(isThisUser) ? 'Your products' : user.username + "\'s products"}</h3>
      <ProductsInfo products={products} isUser={isThisUser} />
    </Box>
  );
}

export function UserInfo(props) {
  const user = props.data;
  const isUser = props.isUser;

  if (user === null) {
    return null;
  }

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
          {
            (isUser) ? <Link to={'/'}>Edit profile</Link> : null
          }
        </Box>

      </Box>
    </Box>
  );
}

export function ProductsInfo(props) {
  const products = props.products;
  const isUser = props.isUser;

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

            <Link className='product-info-block profile-product-info-block' to={'/' + detailProductRoute + '/' + product.id + '/'}>
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
              {
                (isUser) ? (<Link to={'/'} className="product-edit-link">Edit</Link>) : null
              }
              
            </Box>

          </Box>
        )
      })
    }
  </Box>
  );
}