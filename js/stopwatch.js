let swInterval, swStartTime, swElapsed = 0, swRunning = false;
const swDisplay = document.getElementById('stopwatch');
const swLaps = document.getElementById('sw-laps');
function formatSW(ms) {
    const cs = Math.floor((ms % 1000) / 10);
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / 60000) % 60);
    const h = Math.floor(ms / 3600000);
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}.${cs.toString().padStart(2,'0')}`;
}
function updateSW() {
    const now = Date.now();
    swDisplay.textContent = formatSW(swElapsed + (swRunning ? now - swStartTime : 0));
}
document.getElementById('sw-start').onclick = function() {
    if (!swRunning) {
        swRunning = true;
        swStartTime = Date.now();
        swInterval = setInterval(updateSW, 10);
    }
};
document.getElementById('sw-stop').onclick = function() {
    if (swRunning) {
        swElapsed += Date.now() - swStartTime;
        swRunning = false;
        clearInterval(swInterval);
    }
};
document.getElementById('sw-reset').onclick = function() {
    swElapsed = 0;
    swRunning = false;
    clearInterval(swInterval);
    updateSW();
    swLaps.innerHTML = '';
};
document.getElementById('sw-lap').onclick = function() {
    if (swRunning) {
        const li = document.createElement('li');
        li.textContent = swDisplay.textContent;
        swLaps.appendChild(li);
    }
};
updateSW(); 