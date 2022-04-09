import { Box, Button } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import '../../styles/components/purchase.css';
import history from "../history";


export default function PurchaseSuccess() {
  const {t, i18n} = useTranslation();
  const orderId = history.location.state.orderId;

  return (
    <Box className="purchase-success-main-block default-block">
      <h4 className="purchase-success-label">{t("purchase-success.label")}</h4>
      <Box className="purchase-success-block">
        <p className="purchase-success-info">{t("purchase-success.info")}</p>
        <p><b>{orderId}</b></p>
        <p className="purchase-success-info">{t("purchase-success.info2")}</p>
      </Box>
      <Button
        className="purchase-success-button"
        onClick={() => {history.push('/');}}
        variant="contained"
        color="primary"
      >
        {t("purchase-success.home-button")}
      </Button>
    </Box>
  );
}