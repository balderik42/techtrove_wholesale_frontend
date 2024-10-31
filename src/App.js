import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";  
import Home from './Components/Home';

import NavBar from "./Components/NavBar"; 

import ProductListPage from "./Components/ProductListPage/ProductListPage";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import UserLogin from "./Components/UserLogin/UserLogin";
import Footer from './Components/Footer/Footer'
import CartPage from "./Components/Cart/Cart";
import OrderList from "./Components/Orderlist/OrderList";

import AllProducts from "./Components/AllProducts/AllProduct";

const App = () => {
  
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false); // User auth

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const storedUserAuth = localStorage.getItem('isUserAuthenticated');
    if (storedUserAuth === 'true') {
      setIsUserAuthenticated(true);
    }
  }, []);

  // Called after user successfully logs in
 

  const handleUserLogin = () => {
    setIsUserAuthenticated(true);
    localStorage.setItem('isUserAuthenticated', 'true'); // Store in localStorage
  };

  const handleUserLogout = () => {
    setIsUserAuthenticated(false); // Reset auth state
    localStorage.removeItem('isUserAuthenticated'); // Remove from localStorage
    localStorage.removeItem('user'); // Remove user data
  };

  return (
    <Router>
      {/* Pass authentication states and handlers to NavBar */}
      <NavBar 
        isUserAuthenticated={isUserAuthenticated}
        handleUserLogout={handleUserLogout}
      />
      
      <Routes>
        <Route
          path="/"
          element={ <Home />}
        />
         
        <Route
          path="/category/:categoryName"
          element={ <ProductListPage />}
        />
        <Route
          path="/product/:productId"
          element={ <ProductDetails />}
        />
        <Route
          path="/cart"
          element={isUserAuthenticated ? <CartPage/> : <Navigate to="/userlogin" />}
        />
        <Route
          path="/allorders"
          element={isUserAuthenticated ? <OrderList/> : <Navigate to="/userlogin" />}
        />
        <Route
          path="/all-products"
          element={ <AllProducts/>}
        />
        <Route path="/userlogin"
         element={isUserAuthenticated ? <Navigate to="/" />: <UserLogin onUserLogin={handleUserLogin} />} />
       
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
