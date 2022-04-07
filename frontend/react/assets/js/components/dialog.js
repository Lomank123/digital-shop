import React from "react";
import { axiosInstance } from "../axios";
import { cartItemDeleteInactiveURL, productGetURL } from "../urls";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import history from "../history";
import { useTranslation } from "react-i18next";


/* Delete dialog screen
  props:
    - open - indicates whether dialog is open
    - productId - id of a product to delete
    - handleClose - function that'll set open variable of a parent component to false which cause re-render
    - reload - false - go back, true - reload, 'home' - to home page
*/

export function DeleteDialog(props) {
  const {t, i18n} = useTranslation();
  const open = props.open;

  const handleDialogConfirm = () => {
    const id = props.productId;
    if (id !== null) {
      // Here we're using axiosInstance because this dialog will appear in detail page which is inside simple PageComponent without any checks
      axiosInstance.delete(`${productGetURL}${id}/`, { params: { redirect: true } }).then((res) => {
        console.log('Product deleted!');
        if (props.reload === 'home') {
          history.push('/');
          return;
        }
        if (props.reload) {
          window.location.reload();
        } else {
          history.goBack();
        }
      }).catch((err) => {
        console.log('Product delete error.');
      })
    } else {
      console.log("productId = null");
    }
  }

  return (
    <Dialog
      PaperProps={
        {style: {
          boxShadow: 'none',
        }}
      }
      BackdropProps={{ style: { backgroundColor: "rgba(20, 19, 19, 0.8)" } }}
      open={open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("dialog.del-dialog-text")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("dialog.del-dialog-extra")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} autoFocus>{t("dialog.cancel-button")}</Button>
        <Button onClick={handleDialogConfirm}>{t("dialog.delete-button")}</Button>
      </DialogActions>
    </Dialog>
  );
}


export function IsActiveDialog(props) {
  const {t, i18n} = useTranslation();
  const open = props.open;

  const handleDialogConfirm = () => {
    const id = props.productId;
    axiosInstance.post(cartItemDeleteInactiveURL, { product_id: id }, { params: { redirect: true } }).then((res) => {
      console.log('Cart items deleted!');
      props.handleSubmit();
    }).catch((err) => {
      console.log(err);
      console.log('Cart items delete error.');
    })
  }

  return (
    <Dialog
      PaperProps={
        {style: {
          boxShadow: 'none',
        }}
      }
      BackdropProps={{ style: { backgroundColor: "rgba(20, 19, 19, 0.8)" } }}
      open={open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("dialog.is-active-text")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("dialog.del-dialog-extra")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} autoFocus>{t("dialog.cancel-button")}</Button>
        <Button onClick={handleDialogConfirm}>{t("dialog.confirm-button")}</Button>
      </DialogActions>
    </Dialog>
  );
}