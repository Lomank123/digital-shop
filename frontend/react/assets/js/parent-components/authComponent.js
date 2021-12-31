import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { loggedinURL } from "../urls";
import { useSelector } from "react-redux";


export default function AuthComponent(props) {
  const userData = useSelector(state => state.user);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (userData !== null) {
      setData(userData);
    }
    //console.log(userData);
  }, [userData])

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