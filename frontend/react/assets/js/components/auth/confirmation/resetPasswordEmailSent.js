import React from "react";
import { passwordResetURL } from "../../../urls";
import { blankAxiosInstance } from "../../../axios";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import history from "../../../history";
import { useTranslation } from "react-i18next";
import '../../../../styles/auth/auth.css';


export default function ResetPasswordEmailSent() {
  const {t, i18n} = useTranslation();
  const email = history.location.state.email;

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      passwordResetURL, { email: email }).then((res) => {
      }).catch((err) => {
        console.log(err.response);
      });
  }

  return(
    <Box className="default-block auth-block">
      <h3 className="auth-h3">{t("reset-password-email-sent.label")}</h3>

      <Box textAlign={'center'}>
        <span>
          {t("reset-password-email-sent.information")}
        </span>
      </Box>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn reset-resend-btn"
          type="button"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {t("reset-password-email-sent.send-again-button")}
        </Button>
      </Box>

    </Box>
  );
}