import React, { useState, useEffect } from 'react';
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

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const toggleDropdown = () => setShowDropdown(!showDropdown);

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
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="navbar-logo">
            <img src="/LogoCart.png" alt="My Logo" className="logo-image" />
            <img src="/LogoName.png" alt="My LogoName" className="logo-name" />
          </div>
        </Link>

        <div className={`navbar-search ${menuOpen ? 'active' : ''}`}>
          <input
            type="text"
            placeholder={isAdminPage ? 'Search Admin products...' : 'Search products...'}
            value={searchQuery}
            onChange={handleSearch}
          />
          <i className="fas fa-search search-icon"></i>

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
         
              <button onClick={() => navigate('/all-products')}>All Products</button>
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
                <button onClick={() => navigate('/userlogin')}>Login</button>
              )}
              <button onClick={() => navigate('/cart')}>Cart</button>
              <button onClick={() => navigate('/allorders')}>All Orders</button>
            
         
        </div>
      </nav>

      
    </>
  );
};

export default NavBar;
