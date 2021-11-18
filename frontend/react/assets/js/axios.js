import axios from 'axios';


const baseURL = 'http://127.0.0.1:8000/api/v1/';

// Authorization request with token
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem('access_token')
    ? 'Bearer ' + localStorage.getItem('access_token')
    : null,
    'Content-Type': 'application/json',
    accept: 'application/json',
  }
})

// This code is going to handle response data before 'then' or 'catch' methods
// So if accessToken expires it'll then check refreshToken
// And if refreshToken will be expired it'll then make a request to create a new refreshToken

// In django settings we have lifetime setting for both accessToken and refreshToken
// By default they are 5 min for accessToken and 1 day for refreshToken
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;
		console.log("code: " + error.response.data.code);

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
			originalRequest.url === baseURL + 'token/refresh/'
		) {
			window.location.href = '/login/';
			return Promise.reject(error);
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			const refreshToken = localStorage.getItem('refresh_token');

			if (refreshToken) {
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1])); // atob() is deprecated

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log("Token expiration time: " + tokenParts.exp);

        // So if user has expired accessToken but refreshToken is active
        // it'll just make a request to refresh accessToken 
				if (tokenParts.exp > now) {
					try {
						const response = await axiosInstance
							.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: refreshToken });
						localStorage.setItem('access_token', response.data.access);
						// Do not uncomment this because then 'refresh_token' value will be undefined
						// This happens because /token/refresh/ will return ONLY access_token
						//localStorage.setItem('refresh_token', response.data.refresh);

						axiosInstance.defaults.headers['Authorization'] =
							'Bearer ' + response.data.access;
						originalRequest.headers['Authorization'] =
							'Bearer ' + response.data.access;
						return await axiosInstance(originalRequest);
					} catch (err) {
						console.log(err);
					}
        // When user's refresh token has expired
				} else {
					console.log('Refresh token is expired', tokenParts.exp, now);
					window.location.href = '/login/';
				}
      // When user doesn't have refresh token
			} else {
				console.log('Refresh token not available.');
				window.location.href = '/login/';
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;