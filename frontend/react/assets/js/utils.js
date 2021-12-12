import { blankAxiosInstance, axiosInstance } from "./axios";
import { tokenVerifyURL, userGetURL } from "./urls";
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

// Old way to add 'next param'
//export function addNextParam(redirectUrl, nextUrl) {
  //const newUrl = new URL(redirectUrl);
  //newUrl.searchParams.set('next', nextUrl);
  //window.location.href = newUrl;
//}

// Checks whether user data is available and dispatches the result
// if strict = true and user not logged in then user will be redirected to login page
export const getUser = (strict = false) => async dispatch => {

  let instance = blankAxiosInstance;
  if (strict) {
    instance = axiosInstance;
  }

  instance.get(userGetURL, { withCredentials: true }).then((res) => {
    console.log("User data done!");
    //console.log(res.data);
    dispatch({
      type: 'get_user',
      payload: res.data,
    })
  }).catch((err) => {
    console.log("User not authenticated");
    dispatch({
      type: 'get_user',
      payload: 1,
    });
  });
}

// Check whether user logged in or not by checking refresh token
// Suitable for auth pages because we want to check refresh token only
export const checkRefreshToken = () => async dispatch => {
  blankAxiosInstance.get(tokenVerifyURL, { withCredentials: true }).then((res) => {
    console.log("Refresh token is available.");
    dispatch({
      type: 'get_user',
      payload: 'ok',
    })
  }).catch((err) => {
    console.log("Refresh token is not available.");
    dispatch({
      type: 'get_user',
      payload: 1,
    });
  });
}