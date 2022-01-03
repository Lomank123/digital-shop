import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { loggedinURL } from "../urls";
import { useSelector } from "react-redux";


export default function AuthComponent(props) {
  const userData = useSelector(state => state.user);
  const [data, setData] = useState(null);

  // Because naturally there'll be no way to get auth pages when both tokens expired but user data exist
  // we can use userData to indicate whether redirect to logged in page or not
  useEffect(() => {
    if (userData !== null) {
      setData(userData);
    }
  }, [userData])

  // First render
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