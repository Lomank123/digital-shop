import React, { useState, useLayoutEffect } from 'react';
import { categoryGetURL, productGetURL } from '../urls';
import { blankAxiosInstance } from '../axios';
import { Box, Button } from '@material-ui/core';
import history from '../history';
import { DisplayPagination, DisplayProducts, get_products } from './product/display';

import '../../styles/main/home.css';


export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(null);

  // Search params
  // page, category

  // Getting (and setting) categories data
  useLayoutEffect(() => {
    // Getting categories
    blankAxiosInstance.get(categoryGetURL).then((res) => {
      setCategories(res.data);
      console.log("Categories data done! Home page!");
      // Checking search params
      const searchParams = new URLSearchParams(history.location.search);
      let url = new URL(productGetURL);
      const category = searchParams.get("category");
      const page = searchParams.get("page");
      // Checking search params
      if (category !== null) {
        url.href = productGetURL + 'category/' + category;
      }
      if (page !== null) {
        url.searchParams.set('page', page);
      }
      // Getting products
      get_products(url, setProducts);
    }).catch((err) => {
      console.log("Categories data error. Home page.");
    });
  }, [])

  if (products === null) {
    return null;
  }

  return (
    <Box className='home-block'>
      <Box className='content-block'>
        
        <DisplayCategories categories={categories} setter={setProducts} />

        {
          (products.count === 0)
          ? (
              <Box className='default-block products-block no-products-block'>
                <p>No products available.</p>
              </Box>
            )
          : (
            <Box className='products-block'>
              <DisplayPagination products={products} setter={setProducts} />
              <DisplayProducts products={products.results} />
              <DisplayPagination products={products} setter={setProducts} />
            </Box>
          )
        }

        <DisplayMenu />

      </Box>
    </Box>
  );
}

function DisplayCategories(props) {
  const categories = props.categories;

  function getCategoryParam() {
    const params = new URLSearchParams(history.location.search);
    return params.get('category');
  }

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    let url = productGetURL;
    if (category !== 'all') {
      url = productGetURL + 'category/' + category.verbose + '/';
      history.replace({ search: '?category=' + category.verbose, })
    } else {
      history.replace({ search: '' })
    }
    get_products(url, props.setter);
  }

  return (
    <Box className='default-block categories-block'>
      <Button
        className={'category-btn' +
          ((getCategoryParam() === null) ?
          (' ' + 'category-selected') :
          ''
        )}
        onClick={(e) => { handleCategoryClick(e, 'all'); }}
      >
        All categories
      </Button>
      {
        Object.entries(categories).map(([key, category]) => {
          return(
            <Button
              key={key}
              className={'category-btn' +
                ((category.verbose === getCategoryParam()) ?
                (' ' + 'category-selected') :
                ''
              )}
              onClick={(e) => {
                handleCategoryClick(e, category);
              }}
            >
              {category.name}
            </Button>
          )
        })
      }
    </Box>
  );

}


function DisplayMenu(props) {

  return(
    <Box className='default-block menu-block'>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
      <Button>Button</Button>
    </Box>
  );
}