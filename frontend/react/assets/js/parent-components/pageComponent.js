import React from "react";


export default function PageComponent(props) {
  const Component = props.component;

  return (
    <>
      <Component />
    </>
  )
}