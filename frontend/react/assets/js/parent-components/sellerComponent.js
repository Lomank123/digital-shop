import React, { useLayoutEffect, useState } from "react";
import { Redirect } from "react-router";
import { getUser } from "../utils";


export default function SellerComponent(props) {
  const [data, setData] = useState(null);

  // Getting (and setting) user data
  useLayoutEffect(() => {
    getUser(true).then((res) => {
      setData(res);
      console.log("Seller required done!")
    }).catch((err) => {
      console.log("Seller Required error.");
    })
  }, [])

  if (data === null) {
    return null;
	}

  const Component = props.component;
  return (
    <>
      {
        (data !== null) ? 
          ((data.seller === true) ? (<Component />) : (<Redirect to={'/'} />))
          : null
      }
    </>
  )
}