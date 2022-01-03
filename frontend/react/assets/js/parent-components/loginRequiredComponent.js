import React, { useLayoutEffect, useState } from "react";
import { getUser } from "../utils";


export default function LoginRequiredComponent(props) {
  // Here we're using useState because we don't want flickering while loading content
  // With useSelector an issue occurs - flickering if token expired 
  const [data, setData] = useState(null);

  // Getting (and setting) user data
  useLayoutEffect(() => {
    getUser(true).then((res) => {
      setData(res);
      console.log("Login required done!")
    }).catch((err) => {
      console.log("Login Required error.");
    })
  }, [])

  if (data === null) {
    return null;
	}

  const Component = props.component;
  return (
    <>
      {
        (data !== null) ? (<Component />) : null
      }
    </>
  )
}