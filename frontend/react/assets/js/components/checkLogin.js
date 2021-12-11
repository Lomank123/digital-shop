import { useLayoutEffect } from "react";
import { checkRefreshToken } from "../utils";
import { useDispatch } from "react-redux";


export default function CheckLogin() {

  const dispatch = useDispatch();

  useLayoutEffect(() => {
		dispatch(checkRefreshToken());
	}, []);
  
  return null;
}