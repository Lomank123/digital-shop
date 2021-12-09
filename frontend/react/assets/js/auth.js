import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, Switch } from 'react-router-dom';
import history from './history';
import Header from './components/header';
import Footer from './components/footer';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Signup from './components/auth/signup';
import Forgot from './components/auth/forgot';
import ResetPassword from './components/auth/resetPassword';
import AlreadyLoggedIn from './components/auth/confirmation/alreadyLoggedIn';
import ResetPasswordEmailSent from './components/auth/confirmation/resetPasswordEmailSent';
import VerifyEmailSent from './components/auth/confirmation/verifyEmailSent';
import ResetPasswordConfirm from './components/auth/confirmation/resetPasswordConfirm';
import VerifyEmailConfirm from './components/auth/confirmation/verifyEmailConfirm';
import * as routes from './routeNames';
import { Provider } from 'react-redux';



// It's something like a main page where there are header and footer along with all components
const routing = (
  <Router history={history}>
    <React.StrictMode>

      <Switch>
        <Route path={`/${routes.loginRoute}`} component={Login} />
        <Route path={`/${routes.logoutRoute}`} component={Logout} />
        <Route path={`/${routes.loggedInRoute}`} component={AlreadyLoggedIn} />
        <Route path={`/${routes.signupRoute}`} render={ ({ match: { path } }) => (
            <>
              <Route exact path={`${path}/`} component={Signup} />
              <Route path={`${path}/${routes.emailSentRoute}`} component={VerifyEmailSent} />
              <Route path={`${path}/${routes.confirmRoute}/${routes.signupConfirmValues}`} component={VerifyEmailConfirm} />
            </>
          )} 
        />
        <Route path={`/${routes.forgotRoute}`} render={ ({ match: { path } }) => (
            <>
              <Route exact path={`${path}/`} component={Forgot} />
              <Route path={`${path}/${routes.emailSentRoute}`} component={ResetPasswordEmailSent} /> 
            </>
          )} 
        />
        <Route path={`/${routes.resetRoute}`} render={ ({ match: { path } }) => (
            <>
              <Route exact path={`${path}/${routes.resetValues}`} component={ResetPassword} />
              <Route path={`${path}/${routes.confirmRoute}`} component={ResetPasswordConfirm} /> 
            </>
          )}
        />
      </Switch>
        
    </React.StrictMode>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root-auth'));