import React, { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';


export default function Home() {
  const userData = useSelector(state => state.user);
  const [user, setUser] = useState([]);
  const [entities, setEntities] = useState([]);

  async function getData() {
    // Getting user data
    if (userData !== null) {
      // Perhaps if we want to get user data we should use useSelector() instead of an additional api call
      //await blankAxiosInstance.get(userGetURL, { withCredentials: true }).then((res) => {
      //  setUser(res.data);
      //  console.log("User data done! Home page!");
      //});
      //await blankAxiosInstance.get(getEntities, { withCredentials: true }).then((res) => {
      //  setEntities(res.data);
      //  console.log("Entities data done! Home page!");
      //});
      console.log("Getting all data...");
    }
  }

  useLayoutEffect(() => {
    getData();
  }, [userData])

  return (
    <>
      <h3>Home page</h3>
      <p>Welcome to home page!</p>
    </>
  );
}