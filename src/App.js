import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";  
import Home from './Components/Home';
import AdminHome from "./Components/AdminHome";
import NavBar from "./Components/NavBar"; 
import AdminLoginPage from "./Components/AdminLoginPage";
import Admincatagories from "./Components/AdminCatagories";
import ProductListPage from "./Components/ProductListPage/ProductListPage";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import UserLogin from "./Components/UserLogin/UserLogin";
import Footer from './Components/Footer/Footer'
import CartPage from "./Components/Cart/Cart";
import OrderList from "./Components/Orderlist/OrderList";
import AdminOrderListPage from "./Components/Orderlist/AdminOrderList";
import AllProducts from "./Components/AllProducts/AllProduct";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Admin auth
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false); // User auth

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const storedUserAuth = localStorage.getItem('isUserAuthenticated');
    if (storedUserAuth === 'true') {
      setIsUserAuthenticated(true);
    }
  }, []);

  // Called after user successfully logs in
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

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
          element={isUserAuthenticated ? <Home /> : <Navigate to="/userlogin" />}
        />
        <Route
          path="/category/:categoryName"
          element={isUserAuthenticated ? <ProductListPage /> : <Navigate to="/userlogin" />}
        />
        <Route
          path="/product/:productId"
          element={isUserAuthenticated ? <ProductDetails /> : <Navigate to="/userlogin" />}
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
          element={isUserAuthenticated ? <AllProducts/> : <Navigate to="/userlogin" />}
        />
        <Route path="/userlogin"
         element={isUserAuthenticated ? <Navigate to="/" />: <UserLogin onUserLogin={handleUserLogin} />} />
        <Route path="/adminlogin" element={<AdminLoginPage onLogin={handleLogin} />} />
        <Route
          path="/admincategories"
          element={
            isAuthenticated ? (
              <Admincatagories />
            ) : (
              <Navigate to="/adminlogin" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <AdminHome />
            ) : (
              <Navigate to="/adminlogin" replace />
            )
          }
        />
         <Route
          path="/adminorders"
          element={
            isAuthenticated ? (
              <AdminOrderListPage />
            ) : (
              <Navigate to="/adminlogin" replace />
            )
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
