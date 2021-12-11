import React, { useState } from "react";
import Auth from "./authSection";


export default function DefaultPage(props) {
  const Component = props.component;

  return (
    <>
    <Auth />

    <Component />

    </>
  )
}