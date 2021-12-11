import React, { useLayoutEffect, useState } from "react";
import AuthSection from "./authSection";
import { getUserStrict } from "../utils";
import { useDispatch, useSelector } from "react-redux";


function CheckLoginRedirect() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(getUserStrict());
  }, [dispatch]);

  return null;
}

export default function LoginRequiredPage(props) {
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
      <AuthSection />
      <Component />
    </>
  )
}