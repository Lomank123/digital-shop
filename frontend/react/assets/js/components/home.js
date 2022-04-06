import React, { useState, useLayoutEffect, useEffect } from "react";
import { categoryGetURL, productGetURL } from "../urls";
import { blankAxiosInstance } from "../axios";
import { Box, Button, TextField, FormControlLabel, Checkbox, InputAdornment, IconButton } from "@material-ui/core";
import history from "../history";
import { DisplayPagination, DisplayProducts, get_items } from "./display";
import { useDispatch, useSelector } from "react-redux";
import { Clear, Search } from "@material-ui/icons";
import { defaultState } from "..";

import "../../styles/main/home.css";


export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(null);

  // Getting (and setting) categories data
  useLayoutEffect(() => {
    // Getting categories
    blankAxiosInstance.get(categoryGetURL).then((res) => {
      setCategories(res.data);
      console.log("Categories data done! Home page!");
      // Maybe here should be filterProducts() instead of get_items
      let getUrl = getInitialUrl();
      // Getting products
      get_items(getUrl, setProducts);
    }).catch((err) => {
      console.log("Categories data error. Home page.");
    });
  }, [])

  function filterProducts(params) {
    let url = getInitialUrl();   
    setSearchParams(url, params);
    // 'page' param should be reset when other filters changing
    url.searchParams.delete('page');
    // Setting all search params to current url
    history.replace({ search: url.searchParams.toString() });
    get_items(url, setProducts);
  }

  if (products === null) {
    return null;
  }

  return (
    <Box className="home-block">
      <Box className="content-block">
        
        <DisplayCategories categories={categories} filterProducts={filterProducts} />

        {
          (products.count === 0)
          ? (
              <Box className="default-block products-block no-products-block">
                <p>No products available.</p>
              </Box>
            )
          : (
            <Box className="products-block">
              <DisplayPagination items={products} setter={setProducts} />
              <DisplayProducts products={products.results} />
              <DisplayPagination items={products} setter={setProducts} />
            </Box>
          )
        }

        <Box className="main-menu-block">
          <DisplaySearch filterProducts={filterProducts} />
          <DisplayMenu filterProducts={filterProducts} />  
        </Box>

      </Box>
    </Box>
  );
}

function getInitialUrl() {
  const searchParams = new URLSearchParams(history.location.search);
  let url = new URL(productGetURL);

  // We want to get only active products
  url.searchParams.set('is_active', true);

  // Setting all search params to get related items
  for (const [key, value] of searchParams) {
    if (value !== null) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

function setSearchParams(url, dict) {
  for (const [key, value] of Object.entries(dict)) {
    if (value !== null && value !== "") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  }
  return url;
}

function DisplayCategories(props) {
  const categories = props.categories;

  function getCategoryParam() {
    const params = new URLSearchParams(history.location.search);
    return params.get("category__slug");
  }

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    let searchParams = { "category__slug": null };
    if (category !== null) {
      searchParams["category__slug"] = category.slug;
    }
    props.filterProducts(searchParams);
  }

  return (
    <Box className="default-block categories-block">
      <h4 className="filters-label">Categories</h4>
      <Button
        className={"category-btn" +
          ((getCategoryParam() === null) ?
          (" " + "category-selected") :
          ""
        )}
        onClick={(e) => { handleCategoryClick(e, null) }}
      >
        All categories
      </Button>
      {
        Object.entries(categories).map(([key, category]) => {
          return(
            <Button
              key={key}
              className={"category-btn" +
                ((category.slug === getCategoryParam()) ?
                (" " + "category-selected") :
                ""
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

function DisplaySearch(props) {
  const initialState = {
    search: "",
  }
  const [searchData, setSearchData] = useState(initialState);

  // Upon page reloading (not to lose field string)
  useEffect(() => {
    let params = new URLSearchParams(history.location.search);
    let newSearchData = {
      search: params.get("search"),
    }
    setSearchData(newSearchData);
  }, [])

  const handleTextChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSearch = (e) => {
    e.preventDefault();
    props.filterProducts(searchData);
  }

  const handleClearSearch = (e) => {
    e.preventDefault();
    setSearchData(initialState);
    props.filterProducts(initialState);
  }

  const searchBlock = (
    <Box className="search-block">
      <TextField
        className="price-from-field"
        type='text'
        variant="outlined"
        margin="normal"
        id="search"
        label="Search"
        name="search"
        fullWidth
        value={searchData.search || ''}
        onChange={handleTextChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={handleClearSearch} className="clear-search-btn">
                <Clear />
              </IconButton>
              <IconButton onClick={handleSearch} className="search-btn-icon">
                <Search />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );

  return (
    <Box className="search default-block menu-block">
      <h4 className="filters-label">Search</h4>
      {searchBlock}
    </Box>
  );
}

function DisplayMenu(props) {
  const userData = useSelector(state => state.user);
  const initialFiltersState = {
    price_from: '',
    price_to: '',
    published_date_after: '',
    published_date_before: '',
    in_stock: 1,
    is_active: true,
    seller_products_only: null,
  }
  const [filtersState, setFiltersState] = useState(initialFiltersState);

  // Upon page reloading (not to lose field strings)
  useEffect(() => {
    let params = new URLSearchParams(history.location.search);
    let newFiltersData = {};
    for (const [key, value] of Object.entries(initialFiltersState)) {
      let param = params.get(key);
      if (param !== null) {
        // try...catch is needed for date fields
        try {
          newFiltersData[key] = JSON.parse(param.toLowerCase());
        } catch (error) {
          newFiltersData[key] = param;
        }
      } else {
        newFiltersData[key] = value;
      }
    }
    setFiltersState(newFiltersData);
  }, [])

  const handleChange = (e) => {
    setFiltersState({
      ...filtersState,
      [e.target.name]: e.target.value,
    });
  }

  const handleCheckboxChange = (e) => {
    let val;
    if (!e.target.checked) {
      val = 0
    } else {
      val = 1
    }
    setFiltersState({
      ...filtersState,
      [e.target.name]: val,
    });
  }

  const handleUserProductsCheckboxChange = (e) => {
    let val;
    if (e.target.checked) {
      val = userData.id;
    } else {
      val = null;
    }
    setFiltersState({
      ...filtersState,
      [e.target.name]: val,
    });
  }

  const handleIsActiveChange = (e) => {
    setFiltersState({
      ...filtersState,
      [e.target.name]: e.target.checked,
    });
  }

  const handleSubmitFilters = (e) => {
    e.preventDefault();
    props.filterProducts(filtersState);
    console.log("Filtered.");
  }
  
  const handleDiscardFilters = (e) => {
    e.preventDefault();
    setFiltersState(initialFiltersState);
    props.filterProducts(initialFiltersState);
    console.log("All filters have been discarded.");
  }

  if (userData === null) {
    return null;
  }

  const filters = (
    <Box className="filters-block">
      <h5 className="filter-name">Price:</h5>
      <Box className="price-filter-block">
        <TextField
          className="filter-field price-from-field"
          type='number'
          variant="outlined"
          margin="normal"
          id="price-from"
          label="From"
          name="price_from"
          value={filtersState.price_from || ''}
          onChange={handleChange}
        />
        <TextField
          className="filter-field"
          type='number'
          variant="outlined"
          margin="normal"
          id="price-to"
          label="To"
          name="price_to"
          value={filtersState.price_to || ''}
          onChange={handleChange}
        />
      </Box>

      <p></p>
      <h5 className="filter-name">Published:</h5>
      <Box className="published-filter-block">
        <TextField
          className="filter-field price-from-field"
          type='date'
          variant="outlined"
          margin="normal"
          id="published-after"
          name="published_date_after"
          value={filtersState.published_date_after || ''}
          onChange={handleChange}
        />
        <TextField
          className="filter-field"
          type='date'
          variant="outlined"
          margin="normal"
          id="published-before"
          name="published_date_before"
          value={filtersState.published_date_before || ''}
          onChange={handleChange}
        />
      </Box>

      <p></p>
      <h5 className="filter-name">Is active:</h5>
      <Box className="is-active-filter-block">
        <FormControlLabel
          label='Is active'
          control={
            <Checkbox
              checked={filtersState.is_active}
              id="filter-is-active"
              color="primary"
              label="Is active"
              name="is_active"
              onChange={handleIsActiveChange}
            />
          }
        />
      </Box>

      <h5 className="filter-name">Quantity:</h5>
      <Box className="quantity-filter-block">
        <FormControlLabel
          label='In stock'
          control={
            <Checkbox
              checked={Boolean(filtersState.in_stock)}
              id="filter-in-stock"
              color="primary"
              label="In stock"
              name="in_stock"
              onChange={handleCheckboxChange}
            />
          }
        />
      </Box>

      {
        (userData.seller)
        ? (
          <Box>
            <h5 className="filter-name">Seller filters:</h5>
            <Box className="quantity-filter-block">
              <FormControlLabel
                label='Only your products'
                control={
                  <Checkbox
                    checked={Boolean(filtersState.seller_products_only)}
                    id="filter-seller-products-only"
                    color="primary"
                    label="Only seller products"
                    name="seller_products_only"
                    onChange={handleUserProductsCheckboxChange}
                  />
                }
              />
            </Box>
          </Box>
        )
        : null
      }
    </Box>
  )

  const buttons = (
    <Box className="filters-btns-block">
      <Button
        className="filters-btn filters-apply-btn"
        variant="contained"
        color="primary"
        onClick={handleSubmitFilters}
      >
        Apply
      </Button>
      <Button
        className="filters-btn"
        variant="contained"
        color="primary"
        onClick={handleDiscardFilters}
      >
        Discard
      </Button>
    </Box>
  )

  return(
    <Box className="default-block menu-block">
      <h4 className="filters-label">Filters</h4>
      {filters}
      {buttons}
    </Box>
  );
}