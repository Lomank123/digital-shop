import React, { useState, useLayoutEffect } from 'react';
import { categoryGetURL, productGetURL } from '../urls';
import { blankAxiosInstance } from '../axios';
import { Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';


export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  function get_products(url) {
    blankAxiosInstance.get(url).then((res) => {
      setProducts(res.data);
    }).catch((err) => {
      console.log("Content data error. Home page.");
    });
  }

  // Getting (and setting) categories data
  useLayoutEffect(() => {
    blankAxiosInstance.get(categoryGetURL).then((res) => {
      setCategories(res.data);
      console.log("Categories data done! Home page!");
    }).catch((err) => {
      console.log("Categories data error. Home page.");
    });
    get_products(productGetURL);
  }, [])

  const handleCategoryClick = (e, name) => {
    e.preventDefault();
    let url = categoryGetURL + name + '/';
    if (name === 'all') {
      url = productGetURL;
    }
    get_products(url);
  }

  return (
    <>
      <h3>Home page</h3>
      <p>Welcome to home page!</p>

      <Box
        className='home-mainbox'
      >
        <Box className='categories-box'>

          <Button className='category-button' onClick={(e) => {
            handleCategoryClick(e, 'all');
          }}>
            All categories
          </Button>
          {
            Object.entries(categories).map(([key, category]) => {
              return(
                <Button key={key} className='category-button' onClick={(e) => {
                  handleCategoryClick(e, category.verbose);
                }}>
                  {category.name}
                </Button>
              )
            })
          }
        </Box>

        <Box className='products-box'>
          <p>Products box</p>
          {
            Object.entries(products).map(([key, product]) => {
              return(
                <Box key={key}>
                  <p className='product'>
                    {product.title}
                  </p>
                  <hr />
                </Box>
              )
            })
          }
        </Box>

        <Box className='menu-box'>
          <span>Menu box</span>
        </Box>

      </Box>
    </>
  );
}