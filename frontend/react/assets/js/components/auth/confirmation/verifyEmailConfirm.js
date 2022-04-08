import { Button, Box } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";
import { blankAxiosInstance } from "../../../axios";
import { signupVerifyEmailURL } from "../../../urls";
import history from "../../../history";
import { loginRoute } from "../../../routes";
import { useTranslation } from "react-i18next";
import '../../../../styles/auth/auth.css';


export default function VerifyEmailConfirm() {
  const {t, i18n} = useTranslation();
  const params = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      signupVerifyEmailURL,
      { key: params.key },
      { withCredentials: true, }
    ).then((res) => {
      history.push('/' + loginRoute);
    }).catch((err) => {
      console.log(err.response);
    });
  }

  return(
    <Box className="default-block auth-block">
      <h3 className="auth-h3">{t("verify-email-confirm.label")}</h3>
      <p>{t("verify-email-confirm.information")}</p>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn verify-confirm-btn"
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {t("verify-email-confirm.confirm-button")}
        </Button>
      </Box>

    </Box>
  );
}