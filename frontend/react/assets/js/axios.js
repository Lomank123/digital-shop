import axios from 'axios';
import { tokenRefreshURL, apiURL, loginURL } from './urls';
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
			
			return instance.post(tokenRefreshURL, {}).then((res) => {
				console.log("Token refreshed");
				return axiosInstance(originalRequest);
			}).catch((err) => {
				//console.log(err);
				console.log("Token cannot be refreshed");
				store.dispatch({
					type: 'get_user',
					payload: 1,
				});
				// Redirecting if param was specified
				if (originalRequest.params.redirect) {
					addNextParam(loginURL, history.location.pathname);
				}
				return Promise.reject(err);
			});
		}
		// specific error handling done elsewhere
		console.log("Rejected");
		return Promise.reject(error);
	}
);
