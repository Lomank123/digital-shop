import React, { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../axios";
import { userGetURL } from "../urls";


export default function LoginRequiredComponent(props) {
  const Component = props.component;
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    axiosInstance.get(userGetURL, {params: {redirect: true}}).then((res) => {
      //console.log(res);
      console.log("Login required done!");
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