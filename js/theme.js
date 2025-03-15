/**
 * theme.js - Handles theme switching functionality
 * Switches between light and dark mode
 */
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle?.querySelector('i');
    const htmlRoot = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default
    if (savedTheme === 'light') {
      enableLightMode();
    } else {
      enableDarkMode(); // Default is dark mode
    }
    
    // Toggle theme when button is clicked
    themeToggle?.addEventListener('click', function() {
      if (htmlRoot.classList.contains('light-mode')) {
        enableDarkMode();
      } else {
        enableLightMode();
      }
    });
    
    function enableLightMode() {
      htmlRoot.classList.add('light-mode');
      if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
      localStorage.setItem('theme', 'light');
    }
    
    function enableDarkMode() {
      htmlRoot.classList.remove('light-mode');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
      localStorage.setItem('theme', 'dark');
    }
    
    // Match system preference if no saved preference
    if (!savedTheme) {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
        enableDarkMode();
      } else {
        enableLightMode();
      }
    }
  });