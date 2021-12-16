import React from "react";
import { useSelector } from "react-redux";
import { CheckLogin } from "../components/checkLogin";


export default function PageComponent(props) {
  const Component = props.component;
  const redirect = props.redirect;

  const userData = useSelector(state => state.user);
  // First render
  if (userData === null) {
    return (<CheckLogin redirect={redirect} />);
  }

  return (
    <>
      <Component />
    </>
  )
}