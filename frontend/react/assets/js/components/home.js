import React, { useState, useLayoutEffect } from 'react';
import { categoryGetURL, productGetURL } from '../urls';
import { blankAxiosInstance } from '../axios';
import { Box, Button } from '@material-ui/core';
import DisplayProducts from './product/displayProducts';

import '../../styles/main/home.css';


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
    <Box className='home-block'>

      <Box className='content-block'>

        <Box className='default-block categories-block'>
          
          <Button className='category-btn' onClick={(e) => { handleCategoryClick(e, 'all'); }}>
            All categories
          </Button>
          {
            Object.entries(categories).map(([key, category]) => {
              return(
                <Button key={key} className='category-btn' onClick={(e) => {
                  handleCategoryClick(e, category.verbose);}}
                >
                  {category.name}
                </Button>
              )
            })
          }
        </Box>

        <DisplayProducts products={products} />

        <Box className='default-block menu-block'>
          <span>Menu box</span>
        </Box>

      </Box>
    </Box>
  );
}