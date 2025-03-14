// Theme Switching Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default
    if (savedTheme === 'light') {
      enableLightMode();
    } else {
      enableDarkMode(); // Default is dark mode
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
      if (body.classList.contains('light-mode')) {
        enableDarkMode();
      } else {
        enableLightMode();
      }
    });
    
    function enableLightMode() {
      body.classList.add('light-mode');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
    
    function enableDarkMode() {
      body.classList.remove('light-mode');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    }
  });