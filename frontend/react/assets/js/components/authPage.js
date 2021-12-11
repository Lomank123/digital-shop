import React from "react";
import CheckLogin from "./checkLogin";
import { Redirect } from "react-router";
import { useSelector } from "react-redux";
import { loggedinURL } from "../urls";


export default function AuthPage(props) {

  const userData = useSelector(state => state.user);
  // First render (checking refresh token and dispatching data)
	if (userData === null) {
		return (<CheckLogin />);
	}
  // Second render (redirecting if data exists)
	if (userData !== 1) {
		return (<Redirect to={loggedinURL} />);
	}

  const Component = props.component;
  return (
    <>
      <Component />
    </>
  );
}