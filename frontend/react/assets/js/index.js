import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import AuthComponent from './parent-components/authComponent';
import PageComponent from './parent-components/pageComponent';
import LoginRequiredComponent from './parent-components/loginRequiredComponent';
import Home from './components/home';
import Header from './components/header';
import Footer from './components/footer';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Signup from './components/auth/signup';
import Forgot from './components/auth/forgot';
import ResetPassword from './components/auth/resetPassword';
import TestPage from './components/test';
import AlreadyLoggedIn from './components/auth/confirmation/alreadyLoggedIn';
import ResetPasswordEmailSent from './components/auth/confirmation/resetPasswordEmailSent';
import VerifyEmailSent from './components/auth/confirmation/verifyEmailSent';
import ResetPasswordConfirm from './components/auth/confirmation/resetPasswordConfirm';
import VerifyEmailConfirm from './components/auth/confirmation/verifyEmailConfirm';
import * as routes from './routes';
import { createStore } from "redux";
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import UserProfile from './components/user/profile';
import { Box } from '@material-ui/core';
import NotFound from './components/errors/notFound404';
import AddEditProduct from './components/product/add-edit';
import SellerComponent from './parent-components/sellerComponent';
import DetailProduct from './components/product/detail';
import EditProfile from './components/user/edit';
import Purchase from './components/purchase';
import Cart from './components/cart';
import '../styles/main/main.css';
import UserOrders from './components/order/order';
import './i18n';


export const defaultState = {
  user: null,
  cart: null,
  cartProductIds: null,
  emailAddress: null,
};

// E.g.:
// action = {type: "type1", payload: "123"}
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'get_user':
      return {...state, user: action.payload};
    case 'get_cart':
      return {...state, cart: action.payload};
    case 'get_cart_product_ids':
      return {...state, cartProductIds: action.payload};
    case 'get_is_verified_email':
      return {...state, emailAddress: action.payload};
    default:
      return state;
  }

}
const middleware = [thunk];
export const store = createStore(reducer, applyMiddleware(...middleware));

// It's something like a main page where there are header and footer along with all components
const routing = (
  <Suspense fallback={<div>Loading...</div>}>
    <Provider store={store}>
      <Router history={history}>
          <Header key={'header'} />
  
          <Box className='container'>
            <Switch>
              <Route exact path="/" component={() => <PageComponent component={Home} />} />
              <Route path={`/${routes.addProductRoute}`} component={() => <SellerComponent component={AddEditProduct} />} />
              <Route path={`/${routes.productRoute}/${routes.idValues}`} component={() => <PageComponent component={DetailProduct} />} />
              <Route path={`/${routes.editProductRoute}/${routes.idValues}`} component={() => <SellerComponent component={AddEditProduct} />} />
  
              <Route path={`/${routes.ordersRoute}`} component={() => <LoginRequiredComponent component={UserOrders} />} />
  
              <Route path={`/${routes.profileRoute}/${routes.idValues}`} component={() => <PageComponent component={UserProfile}/>} />
              <Route path={`/${routes.editProfileRoute}/${routes.idValues}`} component={() => <LoginRequiredComponent component={EditProfile} />} />
  
              <Route path={`/${routes.cartRoute}`} component={() => <PageComponent component={Cart} />} />
              <Route path={`/${routes.purchaseRoute}`} component={() => <PageComponent component={Purchase} />} />
  
              <Route path={`/${routes.testRoute}`} component={() => <PageComponent component={TestPage} />} />
  
              <Route path={`/${routes.loginRoute}`} component={() => <AuthComponent component={Login} />} />
              <Route path={`/${routes.logoutRoute}`} component={() => <LoginRequiredComponent component={Logout} />} />
              <Route path={`/${routes.loggedInRoute}`} component={() => <LoginRequiredComponent component={AlreadyLoggedIn} />} />
              <Route path={`/${routes.signupRoute}`} render={ ({ match: { path } }) => (
                  <>
                    <Route exact path={`${path}/`} component={() => <AuthComponent component={Signup} />} />
                    <Route path={`${path}/${routes.emailSentRoute}`} component={() => <AuthComponent component={VerifyEmailSent} />} />
                    <Route 
                      path={`${path}/${routes.confirmRoute}/${routes.signupConfirmValues}`}
                      component={() => <PageComponent component={VerifyEmailConfirm} />} 
                    />
                  </>
                )}
              />
              <Route path={`/${routes.forgotRoute}`} render={ ({ match: { path } }) => (
                  <>
                    <Route exact path={`${path}/`} component={() => <AuthComponent component={Forgot} />} />
                    <Route path={`${path}/${routes.emailSentRoute}`} component={() => <AuthComponent component={ResetPasswordEmailSent} />} /> 
                  </>
                )} 
              />
              <Route path={`/${routes.resetRoute}`} render={ ({ match: { path } }) => (
                  <>
                    <Route exact path={`${path}/${routes.resetValues}`} component={() => <AuthComponent component={ResetPassword} />} />
                    <Route path={`${path}/${routes.confirmRoute}`} component={() => <AuthComponent component={ResetPasswordConfirm} />} /> 
                  </>
                )}
              />
              <Route component={NotFound} />
            </Switch>
          </Box>
              
          <Footer key={'footer'} />
              
      </Router>
    </Provider>
  </Suspense>
)

ReactDOM.render(routing, document.getElementById('root'));