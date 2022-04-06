import React, { useLayoutEffect, useState } from "react";
import { Box, Button, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, TextField } from '@material-ui/core';
import { useSelector } from "react-redux";
import { getTotalPrice, handlePostPurchase, getAvailableAddresses } from "../utils";
import history from "../history";
import '../../styles/components/purchase.css';


export default function Purchase() {
  const cart = useSelector(state => state.cart);
  const cartProductIds = useSelector(state => state.cartProductIds);
  const [totalPrice, setTotalPrice] = useState(null);
  const [addresses, setAddresses] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [chosenAddress, setChosenAddress] = useState('');

	const errorsInitialState = {
		address: '',
	};
  const [errors, setErrors] = useState(errorsInitialState);

  const postPurchase = () => {
    // Add address and payment method
    if (chosenAddress === '' || chosenAddress === null) {
      setErrors({
        address: 'This field is required',
      })
      return;
    }
    handlePostPurchase(cart.id, totalPrice, chosenAddress, paymentMethod).then((res) => {
      history.push('/');
    }).catch((err) => {
      console.log(err);
      console.log("Purchase error.");
    });
  }

  useLayoutEffect(() => {
    if (cart !== null) {
      getTotalPrice(cart.id).then((res) => {
        setTotalPrice(res.data.total_price);
      }).catch((err) => {
        console.log(err);
        console.log("Get total price error.");
      });
    }
  }, [cart])

  useLayoutEffect(() => {
    getAvailableAddresses().then((res) => {
      setAddresses(res.data);
    }).catch((err) => {
      console.log(err);
      console.log("Get addresses error.");
    })
  }, [])

  const handleRadioChange = (e) => {
    setPaymentMethod(e.target.value);
  }
  const handleAddressChange = (e) => {
    setChosenAddress(e.target.value);
    setErrors(errorsInitialState);
  }

  if (cart === null || cartProductIds === null) {
    return null;
  }

  return(
    <Box className="purchase-main-block default-block">
      {
        (cartProductIds.length > 0)
        ? (
            <Box className="form-order-block">
              <h4>Confirm your purchase</h4>
              <p>
                You are going to purchase these products by total cost of <b>{totalPrice}$</b>.
                To confirm you need to choose available address and payment method. Finally click purchase button.
              </p>

              <Box className="choose-address-block">
                <h5>Choose available address:</h5>
                <TextField
                  className="form-field"
                  select
                  variant="outlined"
                  id="address-select"
                  label="Address"
                  name="address"
                  required
                  fullWidth
                  value={chosenAddress || ""}
                  onChange={handleAddressChange}
                  error={Boolean(errors.address)}
                  helperText={Boolean(errors.address) ? 'This field is required.' : ''}
                >
                  {
                    Object.entries(addresses).map(([key, address]) => {
                      return (
                        <MenuItem key={key} value={address.id}>{address.name}</MenuItem>
                      )
                    })
                  }
                </TextField>
              </Box>

              <Box className="choose-payment-block">
                <h5>Choose payment method:</h5>
                <FormControl>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel value={"cash"} control={ <Radio /> } label="Cash" />
                    <FormControlLabel value={"card"} control={ <Radio /> } label="Credit card" />
                  </RadioGroup>
                </FormControl>
              </Box>

            {
              (paymentMethod === "card")
              ? (
                <Box className="card-credentials-block">
                  <TextField
                    className="form-field"
                    variant="outlined"
                    margin="normal"
                    required
                    id="card-number"
                    label="Card number"
                    name="card-number"
                    fullWidth
                  />
                  <TextField
                    className="form-field"
                    variant="outlined"
                    margin="normal"
                    required
                    id="card-name"
                    label="Name"
                    name="card-name"
                    fullWidth
                  />
                  <TextField
                    className="form-field"
                    variant="outlined"
                    margin="normal"
                    required
                    id="valid-thru"
                    label="Valid Thru"
                    name="valid-thru"
                    fullWidth
                  />
                  <TextField
                    className="form-field"
                    variant="outlined"
                    margin="normal"
                    required
                    id="cvc"
                    label="CVC"
                    name="cvc"
                    fullWidth
                  />
                </Box>
              )
              : null
            }

              <Button variant="contained" color="primary" onClick={postPurchase}>Purchase</Button>
            </Box>
          )
        : (<h4>Cart is empty. Nothing to purchase.</h4>)
      }
    </Box>
  )
}