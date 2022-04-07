import React from 'react';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import '../../styles/main/footer.css';


export default function Footer() {
  const {t, i18n} = useTranslation();
  return (
    <Box className='footer-block'>
      <span className='credentials'>
        <a
          href="https://github.com/Lomank123"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("footer.author")}
        </a>
      </span>
    </Box>
  );
}