import React, { useState, useEffect } from 'react';
import './style/Ads.css';

const Ads = () => {

  const ads = [
    {
      id: 1,
      title: 'Modren Furniture',
      description: 'Crazy discounts dont miss it',
      link: 'https://www.ikea.com',
      category: 'furniture'
    },
    {
      id: 2,
      title: 'electronics',
      description: 'Modren electronics devices',
      link: 'https://www.amazon.com',
      category: 'electronics'
    },
    {
      id: 3,
      title: 'Dicoration',
      description: 'elegent and beautiful in acheap price',
      link: 'https://www.wayfair.com',
      category: 'furniture'
    },
    {
      id: 4,
      title: 'wattar',
      description: 'shopping now with wattar electronics',
      link: 'https://www.bestbuy.com',
      category: 'electronics'
    }
  ];

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

   
    const interval = setInterval(() => {
    
      setIsAnimating(true);
      setIsVisible(false);

     
      setTimeout(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        setIsAnimating(false);
        
    
        setTimeout(() => {
          setIsVisible(true);
        }, 500);
      }, 500);
    }, 8000); 

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [ads.length]);

  const currentAd = ads[currentAdIndex];

  if (!currentAd) return null;

  return (
    <div 
      className={`ads-container ${isVisible ? 'visible' : ''} ${isAnimating ? 'animating' : ''}`}
      onClick={() => window.open(currentAd.link, '_blank', 'noopener,noreferrer')}
    >
      <div className="ads-content">
        <div className="ads-icon">
          {currentAd.category === 'furniture' ? '🪑' : '⚡'}
        </div>
        <div className="ads-text">
          <div className="ads-title">{currentAd.title}</div>
          <div className="ads-description">{currentAd.description}</div>
        </div>
        <div className="ads-close-icon" onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}>×</div>
      </div>
    </div>
  );
};

export default Ads;

