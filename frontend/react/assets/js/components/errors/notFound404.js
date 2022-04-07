import React from "react";
import { useTranslation } from "react-i18next";


export default function NotFound() {
  const {t, i18n} = useTranslation();
  return(
    <>
      <h1>{t("not-found-404.number")}</h1>
      <h1>{t("not-found-404.label")}</h1>
    </>
  )
}