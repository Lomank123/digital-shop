// main urls
const hostURL = 'http://127.0.0.1' + '/';

// media urls
export const reactURL = hostURL + 'react/';
export const imagesURL = reactURL + 'images/';
export const noImageURL = imagesURL + 'no-image.jpg';

// Api urls
export const apiURL = hostURL + 'api/';
export const apiRestAuthURL = apiURL + 'dj-rest-auth/';

// User
export const userGetURL = apiURL + 'user-info/';
export const getAuthenticatedUserURL = userGetURL + 'get_authenticated_user/';

// Product
export const productGetURL = apiURL + 'product/';

// Category
export const categoryGetURL = apiURL + 'category/';

// Cart
export const cartURL = apiURL + 'cart/';
export const cartGetURL = cartURL + 'get_cart/';
export const userGetCartURL = cartURL + 'get_user_cart/';
export const userDeleteCartCookieURL = cartURL + 'delete_user_cart_id_cookie/';

// CartItem
export const cartItemURL = apiURL + 'cart-item/';
export const userCartItemGetURL = cartItemURL + 'get_user_cart_items/';
export const nonUserCartItemGetURL = cartItemURL + 'get_non_user_cart_items/';
export const getCartProductIdsURL = cartItemURL + 'get_cart_product_ids/';
export const cartItemAddURL = cartItemURL + 'add_item_to_cart/';
export const cartItemRemoveURL = cartItemURL + 'remove_item_from_cart/';
export const cartItemDeleteInactiveURL = cartItemURL + 'delete_inactive/';
export const removeAllFromCartURL = cartItemURL + 'remove_all_from_cart/';
export const moveToUseCartURL = cartItemURL + 'move_to_user_cart/';
export const getTotalPriceURL = cartItemURL + 'get_total_price/';
export const getEitherCartItemsURL = cartItemURL + 'get_either_cart_items/';
export const postPurchaseURL = cartItemURL + 'post_purchase/';

// Order
export const ordersURL = apiURL + 'order/';

// Address
export const addressURL = apiURL + 'address/';

// Signup
export const signupURL = apiRestAuthURL + 'registration/';
export const signupVerifyEmailURL = signupURL + 'verify-email/';
export const signupEmailResendURL = signupURL + 'resend-email/';

// Token urls
export const tokenGetURL = apiRestAuthURL + 'login/';
export const logoutURL = apiRestAuthURL + 'logout/';
export const tokenRefreshURL = apiRestAuthURL + 'token/' + 'refresh/';

// Password reset
export const passwordURL = apiRestAuthURL + 'password/';
export const passwordResetURL = passwordURL + 'reset/';
export const passwordResetConfirmURL = passwordResetURL + 'confirm/';
export const passwordChangeURL = passwordURL + 'change/';

// Auth urls
export const loginURL = '/login/';
export const loggedinURL = '/loggedin/';

// EmailAdress
export const emailAddressURL = 'email-address/';
export const getIsVerifiedAddressURL = emailAddressURL + 'get_email_verified/';