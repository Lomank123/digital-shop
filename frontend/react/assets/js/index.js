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


// It's something like a main page where there are header and footer along with all components
const routing = (
  <Router history={history}>
    <React.StrictMode>

      <Header />

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/forgot" component={Forgot} />
        <Route path="/reset/:uid([0-9A-Za-z_\-]+)/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})" component={ResetPassword} />
        
        <Route path="/loggedin" component={AlreadyLoggedIn} />

        <Route path="/test" component={TestPage} />
      </Switch>

      <Footer />

    </React.StrictMode>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'));