import { Box } from '@material-ui/core';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { blankAxiosInstance } from '../../axios';
import { noImageURL, productGetURL, userGetURL } from '../../urls';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { DisplayPagination, DisplayProducts, get_items } from '../display';
import history from '../../history';
import '../../../styles/user/profile.css';
import { editProfileRoute } from '../../routes';
import { useTranslation } from 'react-i18next';


export default function UserProfile() {
  const {t, i18n} = useTranslation();
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
    let url = new URL(productGetURL);
    url.searchParams.set('created_by__id', params.id);

    const searchParams = new URLSearchParams(history.location.search);
    const page = searchParams.get("page");
    if (page !== null) {
      url.searchParams.set('page', page);
    }
    get_items(url, setProducts);
  }, [params.id])

  if (user === null || products === null) {
    return null;
  }

  return (
    <Box className='default-main-block'>
      <h3 className='your-label'>{t("user-profile.label")}</h3>
      <UserInfo data={user} isUser={isOwner} />

      {
        (user.is_seller)
        ? (
            <h3 className='your-label'>
              {
                (isOwner)
                ? t("user-profile.your-products")
                : t("user-profile.other-user-products") + user.username
              }
            </h3>
          )
        : null
      }

      {
        (products.count === 0)
        ? ( 
            (user.is_seller)
            ? (
                <Box className='default-block products-block no-products-block'>
                  <p>{t("user-profile.no-products")}</p>
                </Box>
              )
            : null
          )
        : (
            <Box>
              <DisplayPagination items={products} setter={setProducts} />
              <DisplayProducts
                products={products.results}
                size={'small'}
                isOwner={isOwner}
              />
              <DisplayPagination items={products} setter={setProducts} />
            </Box>
          )
      }
    </Box>
  );
}

export function UserInfo(props) {
  const {t, i18n} = useTranslation();
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
          <span><b>{t("user-profile.email")}</b> {user.email}</span>
          <span><b>{t("user-profile.username")}</b> {user.username}</span>
          <span><b>{t("user-profile.date-joined")}</b> {user.date_joined}</span>
        </Box>

        <Box className='edit-btn-block'>
          {
            (isUser)
            ? (
                <Link to={`/${editProfileRoute}/${user.id}`}>
                  {t("user-profile.edit-button")}
                </Link>
              )
            : null
          }
        </Box>

      </Box>
    </Box>
  );
}