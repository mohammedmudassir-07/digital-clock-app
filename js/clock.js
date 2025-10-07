function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    // Get day and date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[now.getDay()];
    const date = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const is24hr = localStorage.getItem('clock24hr') === 'true';
    let timeDisplay;
    if (is24hr) {
        timeDisplay = `${String(h).padStart(2, '0')}:${m}:${s}`;
    } else {
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        timeDisplay = `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
    }
    
    document.getElementById('digital-clock').textContent = timeDisplay;
    document.getElementById('date-display').textContent = date;
    document.getElementById('day-display').textContent = day;
    
    // Update analog clock
    updateAnalogClock(now);
}

function updateAnalogClock(now) {
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourHand = document.getElementById('hour-hand');
    const minuteHand = document.getElementById('minute-hand');
    const secondHand = document.getElementById('second-hand');
    
    if (hourHand && minuteHand && secondHand) {
        const hourDeg = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + slight adjustment for minutes
        const minuteDeg = (minutes * 6); // 6 degrees per minute
        const secondDeg = (seconds * 6); // 6 degrees per second
        
        hourHand.style.transform = `rotate(${hourDeg}deg)`;
        minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        secondHand.style.transform = `rotate(${secondDeg}deg)`;
    }
}

function createAnalogClock() {
    const analogClock = document.getElementById('analog-clock');
    if (!analogClock) return;
    
    // Create clock face with hour marks
    for (let i = 1; i <= 12; i++) {
        const mark = document.createElement('div');
        mark.className = 'clock-mark';
        mark.innerText = i;
        const angle = i * 30; // 30 degrees per hour mark
        const radians = (angle - 90) * Math.PI / 180;
        const markRadius = 80; // Distance from center
        
        mark.style.left = `${Math.cos(radians) * markRadius + 100}px`;
        mark.style.top = `${Math.sin(radians) * markRadius + 100}px`;
        analogClock.appendChild(mark);
    }
    
    // Create clock hands
    const hands = ['hour', 'minute', 'second'];
    hands.forEach(hand => {
        const element = document.createElement('div');
        element.id = `${hand}-hand`;
        element.className = `clock-hand ${hand}-hand`;
        analogClock.appendChild(element);
    });
    
    // Create center dot
    const centerDot = document.createElement('div');
    centerDot.className = 'clock-center';
    analogClock.appendChild(centerDot);
}

// Initialize clocks
setInterval(updateClock, 1000);
document.addEventListener('DOMContentLoaded', function() {
    createAnalogClock();
    updateClock();
});

// Settings modal logic
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const toggle24hr = document.getElementById('toggle-24hr');

settingsBtn.onclick = () => {
    settingsModal.style.display = 'block';
    toggle24hr.checked = localStorage.getItem('clock24hr') === 'true';
};
closeSettings.onclick = () => {
    settingsModal.style.display = 'none';
};
window.onclick = (e) => {
    if (e.target === settingsModal) settingsModal.style.display = 'none';
};
toggle24hr.onchange = () => {
    localStorage.setItem('clock24hr', toggle24hr.checked);
    updateClock();
}; 