import React, { useEffect } from "react";


export default function PageComponent(props) {
  const Component = props.component;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <>
      <Component />
    </>
  )
}