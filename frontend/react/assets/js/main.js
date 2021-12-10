import React from 'react';
import HomePage from './components/home';
import TestPage from './components/test';
import * as routes from './routeNames';
import { Route, Switch } from 'react-router';
import Header from './components/header';
import Footer from './components/footer';


export default function Main() {
  return (
    <>
      <Header />

      <Switch>
        <Route path="/home" component={HomePage} />
        <Route path={`/home/${routes.testRoute}`} component={TestPage} />
      </Switch>
      

      <Footer />
    </>
  );
}