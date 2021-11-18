import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import HomePage from './home';
import Header from './components/header';
import Footer from './components/footer';
import Login from './components/login';
import Logout from './components/logout';
import Signup from './components/signup';


// It's something like a main page where there are header and footer along with all components
const routing = (
  <BrowserRouter>
    <React.StrictMode>

      <Header />

        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>

      <Footer />

    </React.StrictMode>
  </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById('root'));