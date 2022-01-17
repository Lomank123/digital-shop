import { Box } from '@material-ui/core';
import React, { useState, useLayoutEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { blankAxiosInstance } from '../../axios';
import { userGetURL, userProductsGetURL } from '../../urls';
import { Link } from 'react-router-dom';
import DisplayProducts from '../product/displayProducts';

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
      <DisplayProducts products={products} />
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
                  : 'http://127.0.0.1/react/images/no-image.jpg'} className='profile-avatar' alt='user photo' />
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