import axios from 'axios';
import { tokenRefreshURL, apiURL, loginURL, userGetURL } from './urls';
import history from './history';
import { addNextParam } from './utils';
import { store } from './index';



// Added these because of some cases that throw 403 (Forbidden)
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

// Blank instance without any interceptors
// needed in certain cases (e.g. when we don't need to check whether user logged in or not OR we don't need tokens at all)
export const blankAxiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  }
})

// Axios instance with token verification interceptor
export const axiosInstance = axios.create({
  baseURL: apiURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
	withCredentials: true,
})

// This code is going to handle response data before 'then' or 'catch' methods
// So if access token expires it'll then check refresh token
// If no refresh token provided then redirect to login page or return "reject" in promise

// In django settings we have lifetime setting for both accessToken and refreshToken
// By default they are 5 min for accessToken and 1 day for refreshToken
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
				'Looks like CORS might be the problem. ' +
				'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}

    // Case: When user will open your website in order to (e.g.) check his profile
    // And his refreshToken will be expired at that moment, he will be redirected to login page
    // by this part of code
    // This is because only authorized users (with active refresh token) can request to refresh token 
		if (
			error.response.status === 401 &&
			originalRequest.url === tokenRefreshURL
		) {
			addNextParam(loginURL, history.location.pathname);
			return Promise.reject(error);
		}
		// If user either doesn't have accessToken or it has expired
		if (
			(error.response.data.detail ||
			error.response.data.code === 'token_not_valid') &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			let instance = blankAxiosInstance;
			if (originalRequest.params.redirect) {
				instance = axiosInstance;
			}
			//TODO:
			// If we'll return this instance then it'll indicate as a "resolve" in promises,
			// so a wrong data (empty actually) will be dispatched instead of code 1 (no user data)
			// If we won't return instance then an error occurs when logging in with next param (e.g. profile page)
			// Here's the problem now!!!
			return instance.post(tokenRefreshURL, {params: {redirect: originalRequest.params.redirect}}).then((res) => {
				console.log("Token refreshed");
				return axiosInstance(originalRequest);
			}).catch((err) => {
				//console.log(err);
				console.log("Token cannot be refreshed");
				store.dispatch({
					type: 'get_user',
					payload: 1,
				});
			});
		}
		// specific error handling done elsewhere
		console.log("Rejected");
		return Promise.reject(error);
	}
);
