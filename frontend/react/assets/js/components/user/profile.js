import { Box } from '@material-ui/core';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { blankAxiosInstance } from '../../axios';
import { noImageURL, userGetURL, userProductsGetURL } from '../../urls';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { DisplayPagination, DisplayProducts, get_products } from '../display';
import history from '../../history';

import '../../../styles/user/profile.css';
import { editProfileRoute } from '../../routes';


export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(null);
  const userData = useSelector(state => state.user);
  const [isOwner, setIsOwner] = useState(null);
  const params = useParams();

  useEffect(() => {
    if (userData !== null && user !== null) {
      if (userData.username === user.username && userData.email === user.email) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    } else {
      setIsOwner(false);
    }
  }, [user, userData, params])

  useLayoutEffect(() => {
    // Getting user data
    blankAxiosInstance.get(userGetURL + params.id + '/').then((res) => {
      const joinedDate = new Date(res.data.date_joined);
      res.data.date_joined = joinedDate.toISOString().split('T')[0];
      setUser(res.data);
      console.log("User data done!");
    }).catch((err) => {
      console.log(err);
      console.log("User data error");
    });

    // Getting products data
    const searchParams = new URLSearchParams(history.location.search);
    const page = searchParams.get("page");
    let url = new URL(userProductsGetURL + params.id);
    if (page !== null) {
      url.searchParams.set('page', page);
    }
    get_products(url, setProducts);
  }, [params.id])

  if (user === null || products === null) {
    return null;
  }

  return (
    <Box className='default-main-block'>
      <h3 className='your-label'>User profile</h3>
      <UserInfo data={user} isUser={isOwner} />

      {
        (user.is_seller)
        ? (<h3 className='your-label'>{(isOwner) ? 'Your products' : user.username + "\'s products"}</h3>)
        : null
      }

      {
        (products.count === 0)
        ? ( 
            (user.is_seller)
            ? (
                <Box className='default-block products-block no-products-block'>
                  <p>No products available.</p>
                </Box>
              )
            : null
          )
        : (
            <Box>
              <DisplayPagination products={products} setter={setProducts} />
              <DisplayProducts
                products={products.results}
                size={'small'}
                mode={'edit'}
                isOwner={isOwner}
              />
              <DisplayPagination products={products} setter={setProducts} />
            </Box>
          )
      }
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
            (isUser) ? <Link to={`/${editProfileRoute}/${user.id}`}>Edit profile</Link> : null
          }
        </Box>

      </Box>
    </Box>
  );
}