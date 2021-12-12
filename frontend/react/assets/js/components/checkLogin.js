import { useLayoutEffect } from "react";
import { checkRefreshToken, getUser } from "../utils";
import { useDispatch } from "react-redux";


// This simply checks whether there is refresh token (no redirect)
export function CheckLogin() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
		dispatch(checkRefreshToken());
	}, []);
  
  return null;
}

// This will redirect to login page if no tokens provided
export function CheckLoginRedirect() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(getUser(true));
  }, [dispatch]);

  return null;
}