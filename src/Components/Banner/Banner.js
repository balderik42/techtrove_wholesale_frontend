import React, { useState, useEffect } from 'react';
import '../Banner/Banner.css'; // Create a CSS file for styling

const Banner = () => {
  const images = [
    '/banner1.png', // Replace with the actual image URLs or import paths
    '/banner1.png',
    '/banner1.png'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // This effect will run every 3 seconds to change the image
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="banner-container">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Banner ${index + 1}`}
          className={index === currentIndex ? 'active' : ''}
        />
      ))}
    </div>
  );
};

export default Banner;
