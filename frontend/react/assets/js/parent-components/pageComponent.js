import React, { useLayoutEffect, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { axiosInstance } from "../axios";
import { userGetURL } from "../urls";


export function LoginRequiredComponent(props) {
  const Component = props.component;
  const redirect = props.redirect;
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    axiosInstance.get(userGetURL, {params: {redirect: true}}).then((res) => {
      console.log("Login required done!");
      //console.log(res);
      
      const rawData = res.data[0];
      const userData = {
        email: rawData.email,
        username: rawData.username,
        id: rawData.id,
        photo: rawData.photo,
      }
      dispatch({
        type: 'get_user',
        payload: userData,
      })

      setData(res);
    }).catch((err) => {
      //console.log(err);
      console.log("Login required error");
      setData(null);
    })
  }, [])
  // KNOWN ISSUE: Because of navigating to profile page from any other we already have user data thus it will flicker when both tokens are deleted
  // If we implement another version of getUser() it will render nothing because it'll trigger only once

  if (data === null) {
    return null;
	}

  return (
    <>
      {
        (data !== null) ? (<Component />) : null
      }
    </>
  )
}


export function PageComponent(props) {
  const Component = props.component;

  return (
    <>
      <Component />
    </>
  )
}