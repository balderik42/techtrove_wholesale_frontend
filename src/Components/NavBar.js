import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './NavBar.css';


const URL =  process.env.REACT_APP_API_URL || 'http://localhost:8000'
const NavBar = ({ isUserAuthenticated, handleUserLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
 
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]); 
  const [searchResults, setSearchResults] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  
  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleSearch = (e) => {
    const query = e.target.value?.toLowerCase() || '';
    setSearchQuery(query);

    if (query) {
      const filteredProducts = products.filter((product) =>
        (product.name?.toLowerCase() || '').includes(query) ||
        (product.shortName?.toLowerCase() || '').includes(query)
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchQuery('');
    setSearchResults([]);
    setMenuOpen(false); 
  };
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar"  ref={menuRef} >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="navbar-logo">
            <img src="/LogoCart.png" alt="My Logo" className="logo-image" />
            <img src="/LogoName.png" alt="My LogoName" className="logo-name" />
          </div>
        </Link>

        <div className={`navbar-search ${menuOpen ? 'active' : ''}`}>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={isAdminPage ? 'Search Admin products...' : 'Search products...'}
            value={searchQuery}
            onChange={handleSearch}
          />
          <i className="fas fa-search search-icon"></i>
          </div>
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="search-result-item"
                  onClick={() => handleProductClick(product._id)}
                >
                  {product.shortName}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          &#9776;
        </div>

        <div className={`navbar-buttons ${menuOpen ? 'active' : ''}`}>
         
        <button onClick={() => { navigate('/all-products'); toggleMenu(); }}>All Products</button>
              {isUserAuthenticated ? (
                <div className="dropdown">
                  <button onClick={toggleDropdown}>
                    {user?.username || 'User'} &#x25BC;
                  </button>
                  {showDropdown && (
                    <div className="dropdown-content">
                      <button onClick={handleUserLogout}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => { navigate('/userlogin'); toggleMenu(); }}>Login</button>
              )}
              <button onClick={() => { navigate('/cart'); toggleMenu(); }}>Cart</button>
              <button onClick={() => { navigate('/allorders'); toggleMenu(); }}>All Orders</button>
            
         
        </div>
      </nav>

      
    </>
  );
};

export default NavBar;
