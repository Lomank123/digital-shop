import React, { useLayoutEffect, useState } from 'react';
import { blankAxiosInstance } from '../axios';
import { categoryGetURL } from '../urls';


export default function TestPage() {
  const [categories, setCategories] = useState([]);

  useLayoutEffect(() => {
    blankAxiosInstance.get(categoryGetURL).then((res) => {
      setCategories(res.data);
      console.log("Done! Test page!");
    });
  }, [])

  return (
    <>
      <h3>Categories</h3>
      {
        Object.entries(categories).map(([key, category]) => {
          return(
            <p key={key}>
              entity number {key} _ 
              {category.name} 
            </p>
          )
        })
      }
    </>
  );
}