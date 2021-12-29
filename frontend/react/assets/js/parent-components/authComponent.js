import React, { useLayoutEffect, useState } from "react";
import { Redirect } from "react-router";
import { loggedinURL } from "../urls";
import { axiosInstance } from "../axios";
import { userGetURL } from "../urls";
import { useDispatch } from "react-redux";


export default function AuthComponent(props) {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    axiosInstance.get(userGetURL, {params: {redirect: false}}).then((res) => {
      console.log("Auth page done!");
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
      console.log("Auth page error");
      setData(1);
    })
  }, [])
  // First render (checking refresh token and dispatching data)
	if (data === null) {
    return null;
	}
  // Second render (redirecting if data exists)
	if (data !== 1 && data !== null) {
		return (<Redirect to={loggedinURL} />);
	}

  const Component = props.component;
  return (
    <>
      <Component />
    </>
  );
}