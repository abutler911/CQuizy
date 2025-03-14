// Study Timer Functionality
document.addEventListener('DOMContentLoaded', function() {
    const timerDisplay = document.getElementById('timer-display');
    
    // Check for saved timer value
    let secondsElapsed = parseInt(localStorage.getItem('studyTimer') || '0');
    let timerInterval;
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Start timer
    startTimer();
    
    // Update timer every second
    function startTimer() {
      timerInterval = setInterval(function() {
        secondsElapsed++;
        updateTimerDisplay();
        localStorage.setItem('studyTimer', secondsElapsed.toString());
      }, 1000);
    }
    
    // Format and display time
    function updateTimerDisplay() {
      const hours = Math.floor(secondsElapsed / 3600);
      const minutes = Math.floor((secondsElapsed % 3600) / 60);
      const seconds = secondsElapsed % 60;
      
      if (hours > 0) {
        timerDisplay.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
      } else {
        timerDisplay.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
      }
    }
    
    // Add leading zero if needed
    function padZero(num) {
      return num.toString().padStart(2, '0');
    }
    
    // Pause timer when page is hidden
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'hidden') {
        clearInterval(timerInterval);
      } else {
        startTimer();
      }
    });
  });