import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { categoryGetURL } from '../urls';
import { blankAxiosInstance } from '../axios';


export default function Home() {
  const userData = useSelector(state => state.user);
  const [categories, setCategories] = useState([]);

  async function getData() {
    // Getting user data
    if (userData !== null) {
      await blankAxiosInstance.get(categoryGetURL).then((res) => {
        setCategories(res.data);
        console.log("Entities data done! Home page!");
      });
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
      <h3>Categories</h3>
      {
        Object.entries(categories).map(([key, category]) => {
          return(
            <p key={key}>
              category number {key} _ 
              {category.name} 
            </p>
          )
        })
      }
    </>
  );
}