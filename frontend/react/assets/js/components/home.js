import React, { useState, useLayoutEffect } from 'react';
import { categoryGetURL, productGetURL } from '../urls';
import { blankAxiosInstance } from '../axios';
import { Box, Button, IconButton } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
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
    <Box className='home-box'>
      <Box className='content-box'>
        <Box className='categories-box'>
          <Button className='category-button' onClick={(e) => { handleCategoryClick(e, 'all'); }}>
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
          {
            Object.entries(products).map(([key, product]) => {
              return(
                <Box key={key} className='product-card'>
                  <Box className='product-thumbnail-box'>
                    <img
                      src={(product.image !== null && product.image !== "")
                        ? product.image 
                        : 'http://127.0.0.1/react/images/no-image.jpg'}
                      alt='no image'
                      className='product-thumbnail' />
                  </Box>
                  <a className='product-info-box' href='/'>
                    <span className='product-title'>{product.title}</span>
                    <span className='product-description'>
                      {
                        (product.description.length <= 100)
                        ? product.description
                        : (product.description.substring(0, 100).trim() + '...')  
                      }
                    </span>
                  </a>
                  <Box className='product-price-box'>
                    <span className='product-price'>{product.price}$</span>
                    <IconButton className='purchase-button'><ShoppingCart /></IconButton>
                  </Box>
                </Box>
              )
            })
          }
        </Box>

        <Box className='menu-box'>
          <span>Menu box</span>
        </Box>

      </Box>
    </Box>
  );
}