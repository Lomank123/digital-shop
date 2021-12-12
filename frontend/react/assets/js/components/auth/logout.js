import React from 'react';
import { logoutURL } from '../../urls';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { getUser } from '../../utils';
import { useDispatch } from 'react-redux';
import history from '../../history';
import { blankAxiosInstance } from '../../axios';


export default function Logout() {
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
		e.preventDefault();

    // Logout request
    blankAxiosInstance.post(logoutURL, {}).then((res) => {
				// Dispatching with user logged out
				dispatch(getUser());
        // Redirecting after log out
				history.push('/');
				console.log(res);
      }).catch((err) => {
				console.log(err.response);
			});
	}



  return (
    <>
      <h3>Logout</h3>
      <p>Do you want to logout?</p>
      <Box>
        <Button
          variant="outlined"
          type="submit"
          color="primary"
          onClick={handleSubmit}
        >
          Logout
        </Button>
      </Box>
    </>
  );
}