import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { blankAxiosInstance } from '../axios';
import { productGetURL, userProductsGetURL } from '../urls';


export default function UserProfile() {
  const userData = useSelector(state => state.user);
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);

  async function getData() {
    // Getting user data
    if (userData !== null) {
      // Loading user data
      setUser(userData);
      // Loading other useful data to profile
      await blankAxiosInstance.get(userProductsGetURL, { withCredentials: true }).then((res) => {
        setProducts(res.data);
        console.log("Products data done!");
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
      <ProductsInfo data={products} />
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
            <div key={key}>
              <p>Email: {data.email}</p>
              <p>Username: {data.username}</p>
              <p>Date joined: {data.date_joined}</p>
              <p>Photo: {data.photo}</p>
              <p>First name: {data.first_name}</p>
              <p>Last name: {data.last_name}</p>
            </div>
          )
        })
      }
    </>
  );
}

export function ProductsInfo(props) {
  const products = props.data;

  return (
    <>
      <h3>Products</h3>
      {
        Object.entries(products).map(([key, product]) => {
          return(
            <div key={key}>
              <p>Product info:</p>
              <p>Title: {product.title}</p>
              <p>Description: {product.description}</p>
              <p>Price: {product.price}</p>
              <p>Image: {product.image}</p>
              <p>Category: {product.category_name}</p>
              <p>Created by: {product.creator_name}</p>
              <p>Published: {product.published}</p>
              <p>Updated: {product.updated}</p>
              <p>In stock: {product.in_stock}</p>
            </div>
          )
        })
      }
    
    </>
  )
}