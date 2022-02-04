import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { loginURL } from "../urls";
import history from "../history";


export default function LoginRequiredComponent(props) {
  const userData = useSelector(state => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  if (userData === 1) {
    return <Redirect to={loginURL + '?next=' + history.location.pathname} />
  }

  if (userData === null) {
    return null;
	}

  const Component = props.component;
  return (
    <>
      <Component />
    </>
  )
}