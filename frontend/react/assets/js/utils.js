import { axiosInstance, blankAxiosInstance } from "./axios";
import { cartGetURL, userGetURL, getCartProductIdsURL } from "./urls";
import { store } from './index';
import history from "./history";


// Adds 'next' param to url with a link to previous page which will be opened after e.g. logging in
// Case: Unauthorized user opens page which is available only for authorized ones.
// This user will be redirected to login page and after logging in, again, he will be redirected back to page he tried to open before
export function addNextParam(redirectUrl, nextUrl) {
  history.push({
    pathname: redirectUrl,
    search: "?" + new URLSearchParams({ next: nextUrl }).toString(),
  });
}

// Checks whether user data is available and dispatches the result
// if redirect = true and user not logged in then user will be redirected to login page
export async function getUser(redirect = false) {
  return axiosInstance.get(userGetURL, { params: { redirect: redirect } }).then((res) => {
    const rawData = res.data[0];
    const userData = {
      email: rawData.email,
      username: rawData.username,
      id: rawData.id,
      photo: rawData.photo,
      balance: rawData.balance,
      seller: rawData.is_seller,
    }
    store.dispatch({
      type: 'get_user',
      payload: userData,
    })
    // Here we need to return our data to use it in further .then()
    return userData;
  })
}

export async function getCart() {
  return blankAxiosInstance.get(cartGetURL).then((res) => {
    const rawData = res.data;
    const cartData = {
      id: rawData.id,
      user: rawData.user,
      is_deleted: rawData.is_deleted,
      creation_date: rawData.creation_date,
    }
    store.dispatch({
      type: 'get_cart',
      payload: cartData,
    })
    // Here we need to return our data to use it in further .then()
    return cartData;
  });
}

export async function getCartProductIds() {
  return blankAxiosInstance.get(getCartProductIdsURL).then((res) => {
    const productIds = res.data.data;
    store.dispatch({
      type: 'get_cart_product_ids',
      payload: productIds,
    })
    return productIds;
  });
}

// Resizes the image
export function resizeImage(image, filename, setter) {
  var canvas = document.createElement('canvas'),
      max_size = 500,   // TODO : pull max size from a site config
      width = image.width,
      height = image.height;
  if (width > height) {
      if (width > max_size) {
          height *= max_size / width;
          width = max_size;
      }
  } else {
      if (height > max_size) {
          width *= max_size / height;
          height = max_size;
      }
  }
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(image, 0, 0, width, height);
  // Converting to Blob and then to new file which then set to postImage
  canvas.toBlob((blob) => {
    const newFile = new File([blob], filename, { type: 'image/jpeg', lastModified: Date.now() });
    setter({
      image: [newFile],
    });
  }, 'image/jpeg', 1);
}

// This func gets timestamp for images (or other files)
export function getTimestamp(filename='') {
  const date = new Date();
  // Formatting date
  const dateString = date.toISOString()
    .replaceAll('T', '_')
    .replaceAll('Z', '')
    .replaceAll('.', '-')
    .replaceAll(':', '-');
  
  if (filename === '') {
    return dateString;
  }

  return `${dateString}_${filename}`;
}