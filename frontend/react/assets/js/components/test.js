import React, { Component, useLayoutEffect, useState } from 'react';
import { blankAxiosInstance, axiosInstance } from '../axios';
import { getEntities } from '../urls';


export default function TestPage() {
  const [entities, setEntities] = useState([]);

  useLayoutEffect(() => {
    blankAxiosInstance.get('/testdata').then((res) => {
      setEntities(res.data);
      console.log("Done! Test page!");
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
    </div>
  );
}