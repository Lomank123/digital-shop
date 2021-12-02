import { blankAxiosInstance } from "./axios";
import { loggedinURL, tokenVerifyURL } from "./urls";
import history from "./history";

// Here will be different utils

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
