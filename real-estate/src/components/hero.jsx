
import React, { useState, useEffect, useRef } from 'react';
import './style/Hero.css';
import PropertyFilters from "./Property/PropertyFilters";

function Hero({ filters, onFilterChange, onApplyFilters, onClearFilters }) {
 
  const videos = [
    '/video1.mp4',
    '/video2.mp4',
    '/vedio3.mp4',
   
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  

  const fullText = "Not just Pro. Not just a Pal. It's ProPal";
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (videos.length === 0) return;

    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      
      setFadeOpacity(0);
      
      
      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
        setFadeOpacity(1);
      }, 800); 
    };

    video.addEventListener('ended', handleVideoEnd);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentVideoIndex, videos.length]);

  
  useEffect(() => {
    if (videos.length === 0) return;

    const video = videoRef.current;
    if (!video) return;

    setIsVideoLoaded(false);
    setFadeOpacity(0);
    video.load();
    
    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      
      setTimeout(() => {
        setFadeOpacity(1);
      }, 100);
      video.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    };

    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentVideoIndex, videos.length]);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 150); 

    return () => clearInterval(typingInterval);
  }, []); 

  const hasVideos = videos.length > 0;

  return (

    <div className="hero-section">
      <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      {hasVideos ? (
        <>
          <video
            ref={videoRef}
            className="hero-video"
            style={{ opacity: fadeOpacity }}
            autoPlay
            muted
            loop={false}
            playsInline
            preload="auto"
          >
            <source src={videos[currentVideoIndex]} type="video/mp4" />
            THIER IS A PROBLEM
          </video>
          {!isVideoLoaded && <div className="video-loading"><div className="spinner-border"></div></div>}
        </>
      ) : (
        <div className="hero-background-image"></div>
      )}
      <div className="hero-overlay"></div>
      
      {/* Typing Animation Text */}
      <div className="typing-text-container">
        <h1 className="typing-text">
          {displayedText}
          {isTyping && <span className="typing-cursor">|</span>}
        </h1>
      </div>
      
      <div className="search-container">
        {filters && onFilterChange && onApplyFilters && onClearFilters && (
          <PropertyFilters 
            filters={filters} 
            onFilterChange={onFilterChange} 
            onApplyFilters={onApplyFilters} 
            onClearFilters={onClearFilters} 
          />
        )}
      </div>
      
      

      {/* مؤشرات الفيديوهات (نقاط) */}
      {/* {hasVideos && videos.length > 1 && (
        <div className="video-indicators">
          {videos.map((_, index) => (
            <button
              key={index}
              className={`video-indicator ${index === currentVideoIndex ? 'active' : ''}`}
              onClick={() => {
                if (index !== currentVideoIndex) {
                  setCurrentVideoIndex(index);
                }
              }}
              aria-label={`انتقل إلى الفيديو ${index + 1}`}
            />
          ))}
        </div>
      )} */}
      {/* <div className="filter-bar">
        <button className="filter-dropdown">
          <span>Any price</span>
          <span className="dropdown-arrow">⌄</span>
        </button>
        <button className="filter-dropdown">
          <span>All Beds</span>
          <span className="dropdown-arrow">⌄</span>
        </button>
        <button className="filter-dropdown">
          <span>House-Type</span>
          <span className="dropdown-arrow">⌄</span>
        </button>
        <button className="filter-dropdown">
          <span>More</span>
          <span className="dropdown-arrow">⌄</span>
        </button>
      </div> */}
    </div>
  );
}

export default Hero;