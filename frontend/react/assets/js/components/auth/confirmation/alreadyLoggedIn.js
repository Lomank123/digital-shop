import React from "react";
import { Box, Button } from "@material-ui/core";
import history from "../../../history";
import { useTranslation } from "react-i18next";

import '../../../../styles/auth/auth.css';


export default function AlreadyLoggedIn() {
  const {t, i18n} = useTranslation();

  const handleRedirect = (e) => {
    e.preventDefault();
    history.push('/');
  } 

  return (
    <Box className="default-block auth-block">
      <h3 className="auth-h3">{t("already-logged-in.label")}</h3>

      <Box textAlign={'center'}>
        <p>{t("already-logged-in.information")}</p>
      </Box>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn"
          type="button"
          variant="contained"
          color="primary"
          onClick={handleRedirect}
        >
          {t("already-logged-in.home-button")}
        </Button>
      </Box>

    </Box>
  );
}