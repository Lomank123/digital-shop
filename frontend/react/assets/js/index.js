import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import HomePage from './components/home';
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
import * as routes from './routeNames';
import { createStore } from "redux";
import { Provider } from 'react-redux';
import { userGetURL } from './urls';
import { blankAxiosInstance } from './axios';
import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';



const defaultState = {
  user: null,
};

// E.g.:
// action = {type: "type1", payload: "123"}
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'get_user':
      return {...state, user: action.payload};
    default:
      return state;
  }

}

const middleware = [thunk];

const store = createStore(reducer, applyMiddleware(...middleware));

// It's something like a main page where there are header and footer along with all components
const routing = (
  <Provider store={store}>
    <Router history={history}>
      <React.StrictMode>
  
        <Header />
  
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path={`/${routes.loginRoute}`} component={Login} />
          <Route path={`/${routes.logoutRoute}`} component={Logout} />
          <Route path={`/${routes.loggedInRoute}`} component={AlreadyLoggedIn} />
          <Route path={`/${routes.signupRoute}`} render={ ({ match: { path } }) => (
              <div>
                <Route exact path={`${path}/`} component={Signup} />
                <Route path={`${path}/${routes.emailSentRoute}`} component={VerifyEmailSent} />
                <Route path={`${path}/${routes.confirmRoute}/${routes.signupConfirmValues}`} component={VerifyEmailConfirm} />
              </div>
            )} 
          />
          <Route path={`/${routes.forgotRoute}`} render={ ({ match: { path } }) => (
              <div>
                <Route exact path={`${path}/`} component={Forgot} />
                <Route path={`${path}/${routes.emailSentRoute}`} component={ResetPasswordEmailSent} /> 
              </div>
            )} 
          />
          <Route path={`/${routes.resetRoute}`} render={ ({ match: { path } }) => (
              <div>
                <Route exact path={`${path}/${routes.resetValues}`} component={ResetPassword} />
                <Route path={`${path}/${routes.confirmRoute}`} component={ResetPasswordConfirm} /> 
              </div>
            )}
          />
          <Route path={`/${routes.testRoute}`} component={TestPage} />
        </Switch>
          
        <Footer />
          
      </React.StrictMode>
    </Router>
  </Provider>
)

ReactDOM.render(routing, document.getElementById('root'));