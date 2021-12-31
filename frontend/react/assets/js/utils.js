import { axiosInstance } from "./axios";
import { userGetURL } from "./urls";
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

// Old way to add 'next param'
//export function addNextParam(redirectUrl, nextUrl) {
  //const newUrl = new URL(redirectUrl);
  //newUrl.searchParams.set('next', nextUrl);
  //window.location.href = newUrl;
//}

// Checks whether user data is available and dispatches the result
// if redirect = true and user not logged in then user will be redirected to login page
export function getUser(redirect = false) {
  axiosInstance.get(userGetURL, { withCredentials: true, params: { redirect: redirect } }).then((res) => {
    //console.log(res);
    if (typeof res !== undefined) {
      const rawData = res.data[0];
      const userData = {
        email: rawData.email,
        username: rawData.username,
        id: rawData.id,
        photo: rawData.photo,
      }
      store.dispatch({
        type: 'get_user',
        payload: userData,
      })
    }
    //console.log("User data done!");
  }).catch((err) => {
    //console.log(err.response);
    console.log("getUser error");
    store.dispatch({
      type: 'get_user',
      payload: 1,
    })
  });
}