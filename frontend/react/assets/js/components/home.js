import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance, blankAxiosInstance } from '../axios';
import { getEntities, userGetURL } from '../urls';


export default function HomePage(props) {
  const userData = useSelector(state => state.user);
  const [user, setUser] = useState([]);
  const [entities, setEntities] = useState([]);

  async function getData() {
    // Getting user data
    if (userData !== null) {
      // Perhaps if we want to get user data we should use useSelector() instead of an additional api call
      await blankAxiosInstance.get(userGetURL, { withCredentials: true }).then((res) => {
        setUser(res.data);
        console.log("User data done! Home page!");
      });

      await blankAxiosInstance.get(getEntities, { withCredentials: true }).then((res) => {
        setEntities(res.data);
        console.log("Entities data done! Home page!");
      });
    }
  }

  useLayoutEffect(() => {
    getData();
  }, [userData])

  return (
    <>
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