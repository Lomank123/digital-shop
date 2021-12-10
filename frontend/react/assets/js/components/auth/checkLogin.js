import React, { useLayoutEffect } from 'react';
import { checkRefreshToken } from '../../utils';


export default function CheckLogin() {

	useLayoutEffect(() => {
		checkRefreshToken();
	}, [])

	return(null);
}