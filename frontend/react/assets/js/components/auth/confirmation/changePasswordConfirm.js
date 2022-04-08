import React, { Component } from "react";
import { useTranslation } from "react-i18next";


export default function ChangePasswordConfirm() {
  const {t, i18n} = useTranslation();
  return(
    <>
      <p>{t("change-password-confirm.information")}</p>
    </>
  );
}