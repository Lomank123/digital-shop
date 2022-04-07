import React, { useLayoutEffect, useState } from "react";
import { Box, Button, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, TextField } from '@material-ui/core';
import { useSelector } from "react-redux";
import { getTotalPrice, handlePostPurchase, getAvailableAddresses } from "../utils";
import history from "../history";
import { useTranslation } from "react-i18next";
import '../../styles/components/purchase.css';


export default function Purchase() {
  const {t, i18n} = useTranslation();
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
              <h4>{t("purchase.confirm-label")}</h4>
              <p>
                {t("purchase.confirm-text")} <b>{totalPrice}$</b>.
                {t("purchase.confirm-text2")}
              </p>

              <Box className="choose-address-block">
                <h5>{t("purchase.choose-address-label")}</h5>
                <TextField
                  className="form-field"
                  select
                  variant="outlined"
                  id="address-select"
                  label={t("purchase.address")}
                  name="address"
                  required
                  fullWidth
                  value={chosenAddress || ""}
                  onChange={handleAddressChange}
                  error={Boolean(errors.address)}
                  helperText={Boolean(errors.address) ? t("purchase.field-is-required") : ''}
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
                <h5>{t("purchase.payment-method-label")}</h5>
                <FormControl>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel value={"cash"} control={ <Radio /> } label={t("purchase.cash")} />
                    <FormControlLabel value={"card"} control={ <Radio /> } label={t("purchase.card")} />
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
                    label={t("purchase.card-number")}
                    name="card-number"
                    fullWidth
                  />
                  <TextField
                    className="form-field"
                    variant="outlined"
                    margin="normal"
                    required
                    id="card-name"
                    label={t("purchase.card-name")}
                    name="card-name"
                    fullWidth
                  />
                  <TextField
                    className="form-field"
                    variant="outlined"
                    margin="normal"
                    required
                    id="valid-thru"
                    label={t("purchase.card-date")}
                    name="valid-thru"
                    fullWidth
                  />
                  <TextField
                    className="form-field"
                    variant="outlined"
                    margin="normal"
                    required
                    id="cvc"
                    label={t("purchase.card-cvc")}
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
        : (<h4>{t("purchase.empty-cart")}</h4>)
      }
    </Box>
  )
}