let timerInterval, timerRemaining = 0, timerRunning = false;
const timerDisplay = document.getElementById('timer');
function formatTimer(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
function updateTimer() {
    timerDisplay.textContent = formatTimer(timerRemaining);
    if (timerRemaining <= 0 && timerRunning) {
        timerRunning = false;
        clearInterval(timerInterval);
        timerDisplay.textContent = '00:00';
        // Play alarm sound if available
        const audio = new Audio('assets/sounds/alarm.mp3');
        audio.play();
    }
}
document.getElementById('timer-start').onclick = function() {
    if (!timerRunning) {
        const min = parseInt(document.getElementById('timer-minutes').value) || 0;
        const sec = parseInt(document.getElementById('timer-seconds').value) || 0;
        timerRemaining = (min * 60 + sec) * 1000;
        if (timerRemaining > 0) {
            timerRunning = true;
            timerInterval = setInterval(() => {
                timerRemaining -= 1000;
                updateTimer();
            }, 1000);
            updateTimer();
        }
    }
};
document.getElementById('timer-stop').onclick = function() {
    timerRunning = false;
    clearInterval(timerInterval);
};
document.getElementById('timer-reset').onclick = function() {
    timerRunning = false;
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:00';
    document.getElementById('timer-minutes').value = '';
    document.getElementById('timer-seconds').value = '';
};
timerDisplay.textContent = '00:00'; 