import { useLayoutEffect } from "react";
import { getUser } from "../utils";
import { useDispatch } from "react-redux";


// This simply checks whether there is refresh token (no redirect)
export function CheckLogin(props) {
  const dispatch = useDispatch();
  let redirect = props.redirect;

  useLayoutEffect(() => {
		dispatch(getUser(redirect));
	}, [dispatch]);
  
  return null;
}