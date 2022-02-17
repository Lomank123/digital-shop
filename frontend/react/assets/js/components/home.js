import React, { useState, useLayoutEffect } from "react";
import { categoryGetURL, productGetURL } from "../urls";
import { blankAxiosInstance } from "../axios";
import { Box, Button, TextField, FormControlLabel, Checkbox } from "@material-ui/core";
import history from "../history";
import { DisplayPagination, DisplayProducts, get_items } from "./display";
import { useDispatch, useSelector } from "react-redux";

import "../../styles/main/home.css";


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
      let getUrl = getInitialUrl();
      // Getting products
      get_items(getUrl, setProducts);
    }).catch((err) => {
      console.log("Categories data error. Home page.");
    });
  }, [])

  if (products === null) {
    return null;
  }

  return (
    <Box className="home-block">
      <Box className="content-block">
        
        <DisplayCategories categories={categories} setter={setProducts} />

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

        <DisplayMenu setter={setProducts} />

      </Box>
    </Box>
  );
}

function DisplayCategories(props) {
  const categories = props.categories;

  function getCategoryParam() {
    const params = new URLSearchParams(history.location.search);
    return params.get("category");
  }

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    let url = new URL(productGetURL);
    url.searchParams.set("is_active", true);

    if (category !== "all") {
      url.searchParams.set("category__verbose", category.verbose);
      history.replace({ search: "?category=" + category.verbose, });
    } else {
      history.replace({ search: "" });
    }
    get_items(url, props.setter);
  }

  return (
    <Box className="default-block categories-block">
      <Button
        className={"category-btn" +
          ((getCategoryParam() === null) ?
          (" " + "category-selected") :
          ""
        )}
        onClick={(e) => { handleCategoryClick(e, "all"); }}
      >
        All categories
      </Button>
      {
        Object.entries(categories).map(([key, category]) => {
          return(
            <Button
              key={key}
              className={"category-btn" +
                ((category.verbose === getCategoryParam()) ?
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

function getInitialUrl() {
  // Checking search params
  const searchParams = new URLSearchParams(history.location.search);
  let url = new URL(productGetURL);
  // We want to get only active products
  url.searchParams.set('is_active', true)

  const category = searchParams.get("category");
  const page = searchParams.get("page");
  // Checking search params
  if (category !== null) {
    url.searchParams.set("category__verbose", category);
  }
  if (page !== null) {
    url.searchParams.set("page", page);
  }
  return url;
}

function DisplayMenu(props) {
  const filterData = useSelector(state => state.filters);
  const dispatch = useDispatch();

  const filtersInitialState = {
    price_from: '',
    price_to: '',
    published_date_after: '',
    published_date_before: '',
    in_stock: 1,
    is_active: true,
  };
  const [filtersState, setFiltersState] = useState(filterData);

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

  const handleIsActiveChange = (e) => {
    setFiltersState({
      ...filtersState,
      [e.target.name]: e.target.checked,
    });
  }


  const handleSubmitFilters = (e) => {
    e.preventDefault();
    let getUrl = getInitialUrl();
    setSearchParams(getUrl, filtersState);
    console.log(getUrl.searchParams.toString());
    dispatch({
      type: 'get_filters',
      payload: filtersState,
    });
    get_items(getUrl, props.setter);
    console.log("Filtered.");
  }
  
  const handleDiscardFilters = (e) => {
    e.preventDefault();
    dispatch({
      type: 'get_filters',
      payload: filtersInitialState,
    });
    setFiltersState(filtersInitialState);

    let getUrl = getInitialUrl();
    get_items(getUrl, props.setter);
    console.log("Discarded.");
  }

  const setSearchParams = (url, dict) => {
    for (const [key, value] of Object.entries(dict)) {
      if (value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    }
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

      <p></p>
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