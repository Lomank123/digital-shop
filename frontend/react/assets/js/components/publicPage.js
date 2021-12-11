import React from "react";
import AuthSection from "./authSection";
import { useSelector } from "react-redux";
import CheckLogin from "./checkLogin";


export default function PublicPage(props) {
  const Component = props.component;

  const userData = useSelector(state => state.user);
  // First render ()
  if (userData === null) {
    return (<CheckLogin />);
  }

  return (
    <>
      <AuthSection />
      <Component />
    </>
  )
}