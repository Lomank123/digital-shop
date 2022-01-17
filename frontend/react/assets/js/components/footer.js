import React from 'react';
import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';

import '../../styles/main/footer.css';


export default function Footer() {

  const links = (
    <Box className='links-block'>
      <Link className='link' to="/">Home</Link>
      <Link className='link' to="/">About</Link>
      <Link className='link' to="/">News</Link>
      <Link className='link' to="/">Shop</Link>
    </Box>
  )

  return (
    <Box className='footer-block'>
      <span className='credentials'>
        <a
          href="https://github.com/Lomank123"
          target="_blank"
          rel="noopener noreferrer"
        >
          Robert "Lomank" Khakimov
        </a>
      </span>
    </Box>
  );
}