import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';


export default function Footer() {

  const links = (
    <Box className='links-box'>
      <Link className='footer-link' to="/">Home</Link>
      <Link className='footer-link' to="/">About</Link>
      <Link className='footer-link' to="/">News</Link>
      <Link className='footer-link' to="/">Shop</Link>
    </Box>
  )

  return (
    <Box className='footer-main'>
      <Box className='footer-block'>
        {links}
      </Box>
    </Box>
  );
}