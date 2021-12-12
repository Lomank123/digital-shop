import axios from 'axios';
import { tokenRefreshURL, apiURL, tokenVerifyURL, loginURL } from './urls';
import history from './history';
import { addNextParam } from './utils';


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
// And if refresh token will be expired it'll then make a request to create a new one

// In django settings we have lifetime setting for both accessToken and refreshToken
// By default they are 5 min for accessToken and 1 day for refreshToken
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;
		//console.log(error.response);

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
			originalRequest.url === tokenVerifyURL
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
			let isRefreshToken = false;

			// Check whether refresh token is available and not expired
			// Without "await" this request won't be made
			await axiosInstance.get(tokenVerifyURL, { withCredentials: true })
			.then((res) => {
				isRefreshToken = true;
				console.log("Refresh token is available and not expired.");
			}).catch((err) => {
				//console.log(err.response);
				console.log("Refresh token is expired or not available.");
			});

			// Then refreshing access token using refresh token
			if (isRefreshToken) {
				console.log("Access Token expired.");
				return axiosInstance.post(tokenRefreshURL, { withCredentials: true }).then((res) => {
					console.log("Access token has been refreshed.")
					return axiosInstance(originalRequest, { withCredentials: true });
					//window.location.reload();
				}).catch((err) => {
					console.log(err.response);
				})
			}
		}
		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);
