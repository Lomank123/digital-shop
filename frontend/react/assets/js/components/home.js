import React, { useState, useLayoutEffect } from 'react';
import { categoryGetURL, noImageURL, productGetURL } from '../urls';
import { blankAxiosInstance } from '../axios';
import { Box, Button, IconButton } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { detailProductRoute } from '../routes';
import history from '../history';

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
    // Getting categories
    blankAxiosInstance.get(categoryGetURL).then((res) => {
      setCategories(res.data);
      console.log("Categories data done! Home page!");

      let url = productGetURL;
      // Checking whether a state param was provided (to make the right api call).
      // If we provided category then we should make related api call.
      // After login redirect or after clicking on "Home" link there'll be no state
      // because there we haven't provided any state inside Link component
      try {
        const category = history.location.state.category;
        res.data.forEach(element => {
          if (element.name === category) {
            url = categoryGetURL + element.verbose + '/';
            return;
          }
        });
      } catch (error) {
        //console.log(error);
      }
      // Getting products
      get_products(url);
    }).catch((err) => {
      console.log("Categories data error. Home page.");
    });
  }, [])

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    let url = categoryGetURL + category.verbose + '/';
    if (category === 'all') {
      url = productGetURL;
      history.replace({ state: {} })
    } else {
      history.replace({ state: {
        category: category.name,
      }})
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
                  handleCategoryClick(e, category);}}
                >
                  {category.name}
                </Button>
              )
            })
          }
        </Box>

        <DisplayProducts products={products} />
        <DisplayMenu />

      </Box>
    </Box>
  );
}

function DisplayProducts(props) {
  const products = props.products;

  return(
    <Box className='products-block'>
      {
        Object.entries(products).map(([key, product]) => {
          return(
            <Box key={key} className='default-block product-card'>
              <Box className='product-preview-block'>
                <img
                  src={(product.image !== null && product.image !== "")
                    ? product.image 
                    : noImageURL}
                  alt='product image'
                  className='product-preview' />
              </Box>

              <Link className='product-info-block' to={detailProductRoute + '/' + product.id + '/'}>
                <span className='product-title'>{product.title}</span>
                <span className='product-description'>
                  {
                    (product.description.length <= 100)
                    ? product.description
                    : (product.description.substring(0, 100).trim() + '...')
                  }
                </span>
              </Link>

              <Box className='product-price-block'>
                <span className='product-price'>{product.price}$</span>
                <IconButton className='cart-btn'>
                  <ShoppingCart />
                </IconButton>
              </Box>

            </Box>
          )
        })
      }
    </Box>
  );
}

function DisplayMenu(props) {

  return(
    <Box className='default-block menu-block'>
      <span>Menu box</span>
    </Box>
  );
}