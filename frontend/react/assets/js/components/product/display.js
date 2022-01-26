import React, { useState } from "react";
import { Delete, Edit, ShoppingCart } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { detailProductRoute, editProductRoute } from '../../routes';
import { noImageURL } from "../../urls";
import { Box, Button, IconButton } from "@material-ui/core";
import { blankAxiosInstance } from "../../axios";
import history from "../../history";
import { DeleteDialog } from "../dialog";


export function DisplayProducts(props) {
  const products = props.products;    // dict with products info
  const size = props.size;            // normal, small
  const mode = props.mode;            // default, edit
  const isOwner = props.isOwner;      // For edit mode

  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // normal + default => for home page
  // small + edit + isOwner => profile page
  // - prop: products - dict with products info to display
	// - prop: size (small, normal) - sets the size of each product card (normal for home page, small for profile page)
	// - prop: mode (default, edit) - sets e.g. 'Edit' button for profile page instead of purchase button (which is set by default)

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = (id) => {
    setCurrentId(id);
    setOpen(true);
  }

  const handleEdit = (id) => {
    history.push(`/${editProductRoute}/${id}/`);
  }

  return(
    <Box className='products-block'>
      {
        Object.entries(products).map(([key, product]) => {
          const imageBox = (
            <Box className={'product-preview-block' + ((size === 'small') ? (' ' + 'profile-preview-block') : '')}>
              <img
                src={(product.image !== null && product.image !== "")
                  ? product.image 
                  : noImageURL}
                alt='product image'
                className={'product-preview' + ((size === 'small') ? (' ' + 'profile-preview') : '')} />
            </Box>
          );

          const infoBox = (
            <Link
              className={'product-info-block' + ((size === 'small') ? (' ' + 'profile-product-info-block') : '')}
              to={'/' + detailProductRoute + '/' + product.id + '/'}
            >
              <span className='product-title'>{product.title}</span>
              <span className='product-description'>
                {
                  (product.description.length <= 100)
                  ? product.description
                  : (product.description.substring(0, 100).trim() + '...')
                }
              </span>
            </Link>
          );

          const priceBox = (
            <Box className='product-price-block'>
              <span className='product-price'>{product.price}$</span>
              {
                (mode === 'edit')
                ? (
                    (isOwner)
                    ? (
                        <Box display={'flex'} justifyContent={'flex-end'}>
                          <IconButton className="display-delete-btn" onClick={() => {handleOpen(product.id)}}><Delete /></IconButton>
                          <IconButton className="display-edit-btn" onClick={() => {handleEdit(product.id)}}><Edit /></IconButton>
                          <DeleteDialog
                            productId={currentId}
                            open={open}
                            handleClose={handleClose}
                            reload={true}
                          />
                        </Box>
                      )
                    : null
                  )
                : (
                    (product.in_stock) ? (<IconButton className='cart-btn'><ShoppingCart /></IconButton>) : (
                      <span className="out-of-stock-label" >Out of stock</span>
                    )
                  )
              }
            </Box>
          );

          return(
            <Box key={key} className='default-block product-card'>
              {imageBox}
              {infoBox}
              {priceBox}
            </Box>
          );
        })
      }
    </Box>
  );
}

export function DisplayPagination(props) {
  const products = props.products;
  let paginationBlock = null;

  const handlePaginationClick = (url) => {
    const newUrl = new URL(url);
    const params = new URLSearchParams(history.location.search);

    params.set('page', newUrl.searchParams.get('page')); 
    if (JSON.parse(params.get('page')) === null) {
      params.delete('page');
    }
    history.replace({ search: params.toString() })
    get_products(newUrl.href, props.setter);
  }

  if (products !== null) {
    paginationBlock = (
      <Box className='pagination-block'>

        <Box className='previous-pages' visibility={(products.previous) ? 'visible' : 'hidden'}>
          <Button onClick={(e) => {handlePaginationClick(products.first)}}>First</Button>
          <Button onClick={(e) => {handlePaginationClick(products.previous)}}>Previous</Button>
        </Box>

        <span className='pages-info'>
          Page {products.number} of {products.num_pages}
        </span>

        <Box className='next-pages' visibility={(products.next) ? 'visible' : 'hidden'}>
              <Button onClick={(e) => {handlePaginationClick(products.next)}}>Next</Button>
              <Button onClick={(e) => {handlePaginationClick(products.last)}}>Last</Button>
        </Box>
        
      </Box>
    );
  }

  return (
    <Box>
      {paginationBlock}
    </Box>
  ); 
}

// Func for getting products using api call (setter is setProducts currently from profile and home pages)
export function get_products(url, setter) {
  blankAxiosInstance.get(url).then((res) => {
    //console.log(res.data);
    setter(res.data);
    //console.log("get_products done!");
    window.scrollTo(0, 0);  // After successful request scrolling to the top
  }).catch((err) => {
    console.log("get_products error.");
  });
}