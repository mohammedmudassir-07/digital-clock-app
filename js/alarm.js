// Array to store all active alarms
let alarms = [];
const MAX_ALARMS = 5;
const alarmStatus = document.getElementById('alarm-status');
const currentTimeDisplay = document.getElementById('current-time-display');
const alarmsList = document.getElementById('alarms-list');

// Load alarms from localStorage if available
function loadAlarms() {
    const savedAlarms = localStorage.getItem('alarms');
    if (savedAlarms) {
        alarms = JSON.parse(savedAlarms);
        // Filter out any past alarms
        const now = new Date().getTime();
        alarms = alarms.filter(alarm => alarm.time > now);
        saveAlarms();
        renderAlarmsList();
    }
}

// Save alarms to localStorage
function saveAlarms() {
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

// Display current time
function updateCurrentTime() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    // Check for 12-hour or 24-hour format preference if it exists
    const is24hr = localStorage.getItem('clock24hr') === 'true';
    let timeDisplay;
    
    if (is24hr) {
        timeDisplay = `${String(h).padStart(2, '0')}:${m}:${s}`;
    } else {
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        timeDisplay = `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
    }
    
    if (currentTimeDisplay) {
        currentTimeDisplay.textContent = timeDisplay;
    }
    
    // Check if any alarms should go off
    checkAlarms(now);
}

// Check if any alarms should trigger
function checkAlarms(now) {
    const currentTime = now.getTime();
    const triggeredAlarms = alarms.filter(alarm => 
        alarm.time <= currentTime && !alarm.triggered
    );
    
    if (triggeredAlarms.length > 0) {
        // Play alarm sound
        const audio = new Audio('assets/sounds/alarm.mp3');
        audio.play();
        
        // Mark alarms as triggered
        triggeredAlarms.forEach(alarm => {
            alarm.triggered = true;
        });
        
        // Update UI
        alarmStatus.textContent = '⏰ Alarm ringing!';
        renderAlarmsList();
        saveAlarms();
        
        // Remove triggered alarms after a delay
        setTimeout(() => {
            alarms = alarms.filter(alarm => !alarm.triggered);
            renderAlarmsList();
            saveAlarms();
            alarmStatus.textContent = '';
        }, 10000); // Clear after 10 seconds
    }
}

// Format time for display
function formatTimeDisplay(hour, minute) {
    const is24hr = localStorage.getItem('clock24hr') === 'true';
    if (is24hr) {
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    } else {
        const hours = hour % 12 || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        return `${String(hours).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
    }
}

// Format date for display
function formatDateDisplay(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });
}

// Render the list of active alarms
function renderAlarmsList() {
    if (!alarmsList) return;
    
    alarmsList.innerHTML = '';
    
    if (alarms.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.textContent = 'No alarms set';
        emptyItem.className = 'empty-alarms';
        alarmsList.appendChild(emptyItem);
        return;
    }
    
    // Sort alarms by time
    alarms.sort((a, b) => a.time - b.time);
    
    alarms.forEach((alarm, index) => {
        const alarmDate = new Date(alarm.time);
        const hour = alarmDate.getHours();
        const minute = alarmDate.getMinutes();
        
        const alarmItem = document.createElement('li');
        alarmItem.className = 'alarm-item';
        
        const timeDisplay = formatTimeDisplay(hour, minute);
        const dateDisplay = formatDateDisplay(alarmDate);
        
        alarmItem.innerHTML = `
            <div class="alarm-info">
                <span class="alarm-time">${timeDisplay}</span>
                <span class="alarm-date">${dateDisplay}</span>
            </div>
            <button class="delete-alarm" data-index="${index}">×</button>
        `;
        
        alarmsList.appendChild(alarmItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-alarm').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeAlarm(index);
        });
    });
}

// Remove an alarm
function removeAlarm(index) {
    alarms.splice(index, 1);
    saveAlarms();
    renderAlarmsList();
    alarmStatus.textContent = 'Alarm removed';
    setTimeout(() => {
        alarmStatus.textContent = '';
    }, 2000);
}

// Add a new alarm
document.getElementById('set-alarm').onclick = function() {
    const alarmInput = document.getElementById('alarm-time').value;
    if (!alarmInput) {
        alarmStatus.textContent = 'Please set a valid time.';
        return;
    }
    
    if (alarms.length >= MAX_ALARMS) {
        alarmStatus.textContent = `Maximum ${MAX_ALARMS} alarms allowed. Please remove an alarm first.`;
        return;
    }
    
    const [h, m] = alarmInput.split(':').map(Number);
    const now = new Date();
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    let diff = alarmTime - now;
    
    if (diff < 0) {
        // If the time has already passed today, set for tomorrow
        diff += 24 * 60 * 60 * 1000;
        alarmTime.setDate(alarmTime.getDate() + 1);
    }
    
    // Create new alarm object
    const newAlarm = {
        id: Date.now(), // Unique ID
        time: alarmTime.getTime(),
        triggered: false
    };
    
    // Add alarm to array
    alarms.push(newAlarm);
    saveAlarms();
    renderAlarmsList();
    
    // Show confirmation
    const timeDisplay = formatTimeDisplay(h, m);
    const dateDisplay = formatDateDisplay(alarmTime);
    alarmStatus.textContent = `New alarm set for ${timeDisplay} (${dateDisplay})`;
};

// Initialize
loadAlarms();
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); 