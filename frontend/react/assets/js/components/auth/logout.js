import React from 'react';
import { logoutURL, userDeleteCartCookieURL } from '../../urls';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { useDispatch } from 'react-redux';
import history from '../../history';
import { axiosInstance, blankAxiosInstance } from '../../axios';
import { useTranslation } from 'react-i18next';
import '../../../styles/auth/auth.css';
import { getCart, getCartProductIds } from '../../utils';


export default function Logout() {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
		e.preventDefault();

    // Logout request
    axiosInstance.post(logoutURL, {}, { params: { redirect: false } }).then(async (res) => {
        // Deleting user cart id cookie
        await blankAxiosInstance.get(userDeleteCartCookieURL);
        // Creating new cart if previous one attaches to user
        await getCart();
        await getCartProductIds();
				// Dispatching with user logged out
        // Order is important, that's why dispatching data should be the last operation
				dispatch({
          type: 'get_user',
          payload: 1,
        });
        // Redirecting after log out
				history.push('/');
				console.log("Logout done!");
      }).catch((err) => {
        if (err.response.status === 401) {
          history.push('/');
        }
				console.log("Logout error");
			});
	}



  return (
    <Box className='default-block auth-block'>
      <h3 className='auth-h3'>{t("logout.label")}</h3>
      <p>{t("logout.information")}</p>

      <Button
        className='logout-btn'
        variant="contained"
        type="submit"
        color="primary"
        onClick={handleSubmit}
      >
        {t("logout.logout-button")}
      </Button>


    </Box>
  );
}