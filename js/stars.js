/**
 * stars.js - Subtle background effect for professional interface
 * A minimal implementation that creates a subtle starry background without animations
 */
document.addEventListener("DOMContentLoaded", function() {
  // Configuration
  const config = {
    starCount: getStarCount(),
    minStarSize: 1,
    maxStarSize: 2,
    starfieldSelector: '.starfield'
  };
  
  // Get optimal number of stars based on screen size
  function getStarCount() {
    const width = window.innerWidth;
    if (width < 768) return 40; // Mobile
    if (width < 1200) return 60; // Tablet
    return 100; // Desktop
  }
  
  // Create starfield
  const starfield = document.querySelector(config.starfieldSelector);
  if (!starfield) return;
  
  // Clear any existing stars first
  starfield.innerHTML = '';
  
  // Create static stars
  createStars();
  
  // Create the static stars
  function createStars() {
    for (let i = 0; i < config.starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random size between min and max
      const size = Math.random() * (config.maxStarSize - config.minStarSize) + config.minStarSize;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random position within viewport
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random opacity for subtle effect
      star.style.opacity = Math.random() * 0.5 + 0.1;
      
      starfield.appendChild(star);
    }
  }
  
  // Handle window resize - recreate stars for optimal count
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newStarCount = getStarCount();
      if (newStarCount !== config.starCount) {
        config.starCount = newStarCount;
        starfield.innerHTML = '';
        createStars();
      }
    }, 300);
  });
});