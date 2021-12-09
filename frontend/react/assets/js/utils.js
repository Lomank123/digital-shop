import { blankAxiosInstance, axiosInstance } from "./axios";
import { loggedinURL, tokenVerifyURL, userGetURL } from "./urls";
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

// Check whether user logged in or not by checking refresh token
export async function checkRefreshToken() {
  // Here we're using blank instance to prevent eternal redirecting to login page
  await blankAxiosInstance.get(tokenVerifyURL, { withCredentials: true }).then((res) => {
    //console.log(res);
    console.log("Refresh token is available.");
    history.push(loggedinURL);
  }).catch((err) => {
    console.log("Refresh token is not available.");
    //console.log(err.response);
  });
}


// Use this instead of the above one
//export async function getUserData() {
//  await blankAxiosInstance.get(userGetURL, { withCredentials: true }).then((res) => {
//    //console.log(res.data);
//    console.log("User data done!");
//    //history.push('/' + loggedInRoute);
//    return res.data;
//  }).catch((err) => {
//    console.log("User not authenticated");
//    return null;
//  });
//}


// Use this instead of the above one
export function getUserData() {
  blankAxiosInstance.get(userGetURL, { withCredentials: true }).then((res) => {
    //console.log(res.data);
    console.log("User data done!");
    //history.push('/' + loggedInRoute);
    //console.log(res.data);
    sessionStorage.setItem('user', res.data.username);
  }).catch((err) => {
    console.log("User not authenticated");
    
  });
}

export const getUser = () => async dispatch => {
  axiosInstance.get(userGetURL, { withCredentials: true }).then((res) => {
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