import React from "react";
import LoginBox from "../components/loginBox";
import { useSelector } from "react-redux";
import { CheckLoginRedirect } from "../components/checkLogin";


export default function LoginRequiredComponent(props) {
  const Component = props.component;

  const userData = useSelector(state => state.user);
  // First render (checking tokens and redirecting to login page if there are none or refreshing access token)
  if (userData === null) {
    return (<CheckLoginRedirect />);
  }
  // Second render (used when user logs in just to prevent empty data blocks to be rendered)
  if (userData === 1) {
    return null;
  }

  return (
    <>
      <LoginBox />
      <Component />
    </>
  )
}