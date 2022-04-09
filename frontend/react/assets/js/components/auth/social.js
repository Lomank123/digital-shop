import { Box } from "@material-ui/core";
import React, { useLayoutEffect } from "react";
import { blankAxiosInstance } from "../../axios";
import history from "../../history";
import { googleLoginURL } from "../../urls";


export default function SocialLoginCallback() {
  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(history.location.search);
    const code = urlParams.get('code');
    blankAxiosInstance.post(googleLoginURL, {'code': code}).then((res) => {
      console.log(res.data);
      console.log("Google auth complete!");
      window.location.href = '/';
    }).catch((err) => {
      console.log(err);
      console.log("Google auth error.");
    })
  }, [])

  return (
    <>
    </>
  );
}