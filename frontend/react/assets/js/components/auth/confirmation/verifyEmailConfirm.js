import { Button } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";
import { blankAxiosInstance } from "../../../axios";
import { signupVerifyEmailURL } from "../../../urls";
import history from "../../../history";
import { loginRoute } from "../../../routes";


export default function VerifyEmailConfirm() {
  const params = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      signupVerifyEmailURL,
      { key: params.key },
      { withCredentials: true, }
    ).then((res) => {
      //console.log(res.data);
      history.push('/' + loginRoute);
    }).catch((err) => {
      console.log(err.response);
    });
  }

  return(
    <>
      <h3>Email confirmation</h3>
      <p>To confirm your email click the button below.</p>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Confirm
      </Button>
    </>
  );
}