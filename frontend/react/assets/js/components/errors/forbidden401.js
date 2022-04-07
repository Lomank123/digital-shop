import React from "react";
import { useTranslation } from "react-i18next";


export default function Forbidden() {
  const {t, i18n} = useTranslation();
  return(
    <>
      <h1>{t("forbidden-401.number")}</h1>
      <h1>{t("forbidden-401.label")}</h1>
    </>
  )
}