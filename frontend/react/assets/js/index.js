import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import HomePage from './components/home';
import Header from './components/header';
import Footer from './components/footer';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Signup from './components/auth/signup';
import Forgot from './components/auth/forgot';
import ResetPassword from './components/auth/resetPassword';


// It's something like a main page where there are header and footer along with all components
const routing = (
  <BrowserRouter>
    <React.StrictMode>

      <Header />

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/forgot" component={Forgot} />
        <Route path="/reset/:uid([0-9A-Za-z_\-]+)/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})" component={ResetPassword} />
      </Switch>

      <Footer />

    </React.StrictMode>
  </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'));