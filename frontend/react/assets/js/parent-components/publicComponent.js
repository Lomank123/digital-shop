import React from "react";
import { useSelector } from "react-redux";
import LoginBox from "../components/loginBox";
import { CheckLogin } from "../components/checkLogin";


export default function PublicComponent(props) {
  const Component = props.component;

  const userData = useSelector(state => state.user);
  // First render
  if (userData === null) {
    return (<CheckLogin />);
  }

  return (
    <>
      <LoginBox />
      <Component />
    </>
  )
}