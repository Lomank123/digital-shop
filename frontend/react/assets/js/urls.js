// main urls
//const portNum = 8000;
//const hostURL = 'http://127.0.0.1' + ':' + portNum + '/';
const hostURL = 'http://127.0.0.1' + '/';

// media urls
export const reactURL = hostURL + 'react/';
export const imagesURL = reactURL + 'images/';
export const noImageURL = imagesURL + 'no-image.jpg';

// Api urls
export const apiURL = hostURL + 'api/';

export const apiRestAuthURL = apiURL + 'dj-rest-auth/';
export const userGetURL = apiURL + 'user-info/';
export const productGetURL = apiURL + 'product/';
export const userProductsGetURL = userGetURL + 'get_user_products/';
export const categoryGetURL = apiURL + 'category/';

// Signup
export const signupURL = apiRestAuthURL + 'registration/';
export const signupVerifyEmailURL = signupURL + 'verify-email/';
export const signupEmailResendURL = signupURL + 'resend-email/';

// Token urls
export const tokenGetURL = apiRestAuthURL + 'login/';
export const logoutURL = apiRestAuthURL + 'logout/';
export const tokenRefreshURL = apiRestAuthURL + 'token/' + 'refresh/';

// Password reset
export const passwordResetURL = apiRestAuthURL + 'password/' + 'reset/';
export const passwordResetConfirmURL = passwordResetURL + 'confirm/';

// Auth urls
export const loginURL = '/login/';
export const loggedinURL = '/loggedin/';
