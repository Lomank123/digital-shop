import React, { Component, useEffect, useState, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance, blankAxiosInstance } from '../axios';
import { getEntities, userGetURL } from '../urls';
import { getUser } from '../utils';


export default function HomePage() {
  const [user, setUser] = useState([]);
  const [entities, setEntities] = useState([]);

  useLayoutEffect(() => {
    // If user has no tokens, the 2nd axios request will break addNextParam and will cause it to redirect to login page again
    // As a solution, we can make only 1 axiosInstance request (e.g. to get user data) and all other requests will be made with blankAxiosInstance

    // Getting user data
    //axiosInstance.get(userGetURL, { withCredentials: true }).then((res) => {
    //  const userData = res.data
    //  this.setState({user: res.data});
    //  console.log(userData);
    //  console.log("User data done!");
    //});

    blankAxiosInstance.get(getEntities, { withCredentials: true }).then((res) => {
      setEntities(res.data);
      console.log("Entities data done!");
    });
  }, [])

  return (
    <div>
      <h3>Entities</h3>
      {
        Object.entries(entities).map(([key, entity]) => {
          return(
            <p key={key}>
              entity number {key} _ 
              {entity.description} 
            </p>
          )
        })
      }
      <h3>User data</h3>
      {
        Object.entries(user).map(([key, data]) => {
          return(
            <p key={key}>
              <span>{key} : {data}</span>
            </p>
          )
        })
      }
    </div>
  );
}