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
  const [products, setProducts] = useState(null);

  // Search params
  // page, category

  function get_products(url) {
    blankAxiosInstance.get(url).then((res) => {
      //console.log(res.data);
      setProducts(res.data);
      window.scrollTo(0, 0);  // After successful request scrolling to the top
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
      get_products(url);
    }).catch((err) => {
      console.log("Categories data error. Home page.");
    });
  }, [])

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    let url = productGetURL;
    if (category !== 'all') {
      url = productGetURL + 'category/' + category.verbose + '/';
      history.replace({ search: '?category=' + category.verbose, })
    } else {
      history.replace({ search: '' })
    }
    get_products(url);
  }

  const handlePaginationClick = (url) => {
    const newUrl = new URL(url);
    const params = new URLSearchParams(history.location.search);

    params.set('page', newUrl.searchParams.get('page')); 
    if (JSON.parse(params.get('page')) === null) {
      params.delete('page');
    }
    history.replace({ search: params.toString() })
    get_products(newUrl.href);
  }

  function getCategoryParam() {
    const params = new URLSearchParams(history.location.search);
    return params.get('category');
  }

  let paginationBlock = null;

  if (products !== null) {
    paginationBlock = (
      <Box className='pagination-block'>
        {
          (products.previous) ?
          (
            <Box className='previous-pages'>
              <Button onClick={(e) => {handlePaginationClick(products.first)}}>First</Button>
              <Button onClick={(e) => {handlePaginationClick(products.previous)}}>Previous</Button>
            </Box>
          ) :
          null
        }
        <span className='pages-info'>
          Page {products.number} of {products.num_pages}
        </span>
        {
          (products.next) ?
          (
            <Box className='next-pages'>
              <Button onClick={(e) => {handlePaginationClick(products.next)}}>Next</Button>
              <Button onClick={(e) => {handlePaginationClick(products.last)}}>Last</Button>
            </Box>
          ) :
          null
        }
      </Box>
    );
  }

  if (products === null) {
    return null;
  }

  return (
    <Box className='home-block'>

      {paginationBlock}

      <Box className='content-block'>
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
        
        {
          (products.count === 0)
          ? (
              <Box className='default-block products-block no-products-block'>
                <p>No products available.</p>
              </Box>
            )
          : <DisplayProducts products={products.results} />
        }
        <DisplayMenu />
      </Box>

      {paginationBlock}

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