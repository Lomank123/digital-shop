import React, { useState, useLayoutEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { blankAxiosInstance } from '../axios';
import { userGetURL, userProductsGetURL } from '../urls';


export default function UserProfile() {
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);


  useLayoutEffect(() => {
    //getUser(true);

    blankAxiosInstance.get(userGetURL).then((res) => {
      setUser(res.data[0]);
      console.log("User data done!");
    }).catch((err) => {
      console.log(err);
      console.log("User data error");
      //console.log(err.response);
    });

    blankAxiosInstance.get(userProductsGetURL).then((res) => {
      setProducts(res.data);
      console.log("Products data done!");
    }).catch((err) => {
      console.log(err);
      console.log("Products data error");
      //console.log(err.response);
    });
  }, [])

  if (shallowEqual(user, [])) {
    return null;
  }

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
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <p>Photo: {user.photo}</p>
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
              <p><img src={product.image} /></p>
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