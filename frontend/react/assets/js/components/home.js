import React, { useState, useLayoutEffect } from 'react';
import { categoryGetURL } from '../urls';
import { blankAxiosInstance } from '../axios';


export default function Home() {
  const [categories, setCategories] = useState([]);

  async function getData() {
    await blankAxiosInstance.get(categoryGetURL).then((res) => {
      setCategories(res.data);
      console.log("Categories data done! Home page!");
    });
  }
  useLayoutEffect(() => {
    getData();
  }, [])

  return (
    <>
      <h3>Home page</h3>
      <p>Welcome to home page!</p>
      <h3>Categories</h3>
      {
        Object.entries(categories).map(([key, category]) => {
          return(
            <p key={key}>
              category: {category.name} 
            </p>
          )
        })
      }
    </>
  );
}