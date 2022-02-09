import React from "react";
import { axiosInstance } from "../axios";
import { cartItemDeleteInactiveURL, productGetURL } from "../urls";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import history from "../history";



/* Delete dialog screen
  props:
    - open - indicates whether dialog is open
    - productId - id of a product to delete
    - handleClose - function that'll set open variable of a parent component to false which cause re-render
    - reload - false - go back, true - reload, 'home' - to home page
*/

export function DeleteDialog(props) {
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
        {"Are you sure you want to delete this product?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You can't undo this action.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} autoFocus>Cancel</Button>
        <Button onClick={handleDialogConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}


export function IsActiveDialog(props) {
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
        {"Do you want to set this to inactive? This will delete product from all active carts."}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You can't undo this action.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} autoFocus>Cancel</Button>
        <Button onClick={handleDialogConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}