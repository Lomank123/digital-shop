import React from "react";
import { Box, Button } from "@material-ui/core";
import { loginURL } from "../../../urls";
import history from "../../../history";
import { useTranslation } from "react-i18next";
import '../../../../styles/auth/auth.css';


export default function ResetPasswordConfirm() {
  const {t, i18n} = useTranslation();

  const handleRedirect = (e) => {
    e.preventDefault();
    history.push(loginURL);
  } 

  return(
    <Box className="default-block auth-block">
      <h3 className="auth-h3">{t("reset-password-confirm.label")}</h3>

      <Box textAlign={'center'}>
        <p>{t("reset-password-confirm.information")}</p>
      </Box>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn"
          type="button"
          variant="contained"
          color="primary"
          onClick={handleRedirect}
        >
          {t("reset-password-confirm.login-button")}
        </Button>
      </Box>

    </Box>
  );
}