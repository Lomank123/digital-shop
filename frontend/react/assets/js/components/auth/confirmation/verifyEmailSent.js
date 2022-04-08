import { Box, Button } from "@material-ui/core";
import React from "react";
import { blankAxiosInstance } from "../../../axios";
import { signupEmailResendURL } from "../../../urls";
import history from "../../../history";
import { useTranslation } from "react-i18next";
import '../../../../styles/auth/auth.css';


export default function VerifyEmailSent() {
  const {t, i18n} = useTranslation();
  const email = history.location.state.email;

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      signupEmailResendURL,
      { email: email },
      { withCredentials: true }
    ).catch((err) => {
      console.log(err.response);
    });
  }

  return(
    <Box className="default-block auth-block">
      <h3 className="auth-h3">{t("verify-email-sent.label")}</h3>
      <Box textAlign={'center'}>
        <span>{t("verify-email-sent.information")}</span>
      </Box>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn resend-confirm-btn"
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {t("verify-email-sent.send-again-button")}
        </Button>
      </Box>

    </Box>
  );
}