import React, { useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { blankAxiosInstance } from '../axios';
import { getEntities, userGetURL } from '../urls';


export default function UserProfile() {
  const userData = useSelector(state => state.user);
  const [user, setUser] = useState([]);
  const [entities, setEntities] = useState([]);

  async function getData() {
    // Getting user data
    if (userData !== null) {
      // Loading user data
      setUser(userData);
      // Loading other useful data to profile
      await blankAxiosInstance.get(getEntities, { withCredentials: true }).then((res) => {
        setEntities(res.data);
        console.log("Entities data done!");
      });
    }
  }

  useLayoutEffect(() => {
    getData();
  }, [userData])

  return (
    <>
      <h3>User profile</h3>
      <UserInfo data={user} />
      <EntitiesInfo data={entities} />
    </>
  );
}


export function UserInfo(props) {
  const user = props.data;

  return (
    <>
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
    </>
  );
}

export function EntitiesInfo(props) {
  const entities = props.data;

  return (
    <>
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
    
    </>
  )
}