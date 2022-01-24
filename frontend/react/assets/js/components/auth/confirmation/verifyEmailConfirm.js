import { Button, Box } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router";
import { blankAxiosInstance } from "../../../axios";
import { signupVerifyEmailURL } from "../../../urls";
import history from "../../../history";
import { loginRoute } from "../../../routes";

import '../../../../styles/auth/auth.css';


export default function VerifyEmailConfirm() {
  const params = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();

    blankAxiosInstance.post(
      signupVerifyEmailURL,
      { key: params.key },
      { withCredentials: true, }
    ).then((res) => {
      history.push('/' + loginRoute);
    }).catch((err) => {
      console.log(err.response);
    });
  }

  return(
    <Box className="default-block auth-block">
      <h3 className="auth-h3">Email confirmation</h3>
      <p>To confirm your email click the button below.</p>

      <Box className="auth-btns-block">
        <Button
          className="auth-btn verify-confirm-btn"
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Confirm
        </Button>
      </Box>

    </Box>
  );
}