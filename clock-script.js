// Comprehensive list of time zones
const timezones = [
    { name: 'London', offset: 'Europe/London' },
    { name: 'Paris', offset: 'Europe/Paris' },
    { name: 'Dubai', offset: 'Asia/Dubai' },
    { name: 'Mumbai', offset: 'Asia/Kolkata' },
    { name: 'Bangkok', offset: 'Asia/Bangkok' },
    { name: 'Hong Kong', offset: 'Asia/Hong_Kong' },
    { name: 'Tokyo', offset: 'Asia/Tokyo' },
    { name: 'Sydney', offset: 'Australia/Sydney' },
    { name: 'Auckland', offset: 'Pacific/Auckland' },
    { name: 'New York', offset: 'America/New_York' },
    { name: 'Chicago', offset: 'America/Chicago' },
    { name: 'Denver', offset: 'America/Denver' },
    { name: 'Los Angeles', offset: 'America/Los_Angeles' },
    { name: 'Honolulu', offset: 'Pacific/Honolulu' },
    { name: 'Toronto', offset: 'America/Toronto' },
    { name: 'Mexico City', offset: 'America/Mexico_City' },
    { name: 'São Paulo', offset: 'America/Sao_Paulo' },
    { name: 'Buenos Aires', offset: 'America/Argentina/Buenos_Aires' },
    { name: 'Moscow', offset: 'Europe/Moscow' },
    { name: 'Istanbul', offset: 'Europe/Istanbul' },
    { name: 'Cairo', offset: 'Africa/Cairo' },
    { name: 'Lagos', offset: 'Africa/Lagos' },
    { name: 'Johannesburg', offset: 'Africa/Johannesburg' },
    { name: 'Singapore', offset: 'Asia/Singapore' },
    { name: 'Seoul', offset: 'Asia/Seoul' },
    { name: 'Shanghai', offset: 'Asia/Shanghai' },
    { name: 'Jakarta', offset: 'Asia/Jakarta' },
    { name: 'Manila', offset: 'Asia/Manila' },
];

let activeClocks = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    populateTimezoneSelect();
    updateLocalTime();
    setInterval(updateLocalTime, 1000);
    setInterval(updateAllClocks, 1000);
    
    // Add button event listener
    document.getElementById('addBtn').addEventListener('click', addClock);
    
    // Enter key support
    document.getElementById('tzSelect').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addClock();
    });
});

// Populate timezone select dropdown
function populateTimezoneSelect() {
    const select = document.getElementById('tzSelect');
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.offset;
        option.textContent = tz.name;
        select.appendChild(option);
    });
}

// Update local time and analog clock
function updateLocalTime() {
    const now = new Date();
    
    // Update digital time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('localTime').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('localDate').textContent = now.toLocaleDateString('en-US', options);
    
    // Update analog clock
    updateAnalogClock();
}

// Update analog clock hands
function updateAnalogClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    
    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;
    
    document.querySelector('.second-hand').style.transform = `rotate(${secondDegrees}deg)`;
    document.querySelector('.minute-hand').style.transform = `rotate(${minuteDegrees}deg)`;
    document.querySelector('.hour-hand').style.transform = `rotate(${hourDegrees}deg)`;
}

// Add new clock
function addClock() {
    const select = document.getElementById('tzSelect');
    const value = select.value;
    
    if (!value) {
        showNotification('Please select a timezone', 'warning');
        return;
    }
    
    // Check if already added
    if (activeClocks.find(c => c.offset === value)) {
        showNotification('This timezone is already added', 'info');
        return;
    }
    
    // Find timezone name
    const tzName = timezones.find(tz => tz.offset === value).name;
    
    // Add to active clocks
    const id = Date.now();
    activeClocks.push({
        id: id,
        name: tzName,
        offset: value
    });
    
    // Render clocks
    renderClocks();
    
    // Reset select
    select.value = '';
    showNotification(`Added ${tzName}!`, 'success');
}

// Remove clock
function removeClock(id) {
    activeClocks = activeClocks.filter(c => c.id !== id);
    renderClocks();
    showNotification('Clock removed', 'success');
}

// Render all clocks
function renderClocks() {
    const container = document.getElementById('clocksContainer');
    container.innerHTML = '';
    
    if (activeClocks.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-clock"></i>
                <p>No timezones added yet. Select a timezone to get started!</p>
            </div>
        `;
        return;
    }
    
    activeClocks.forEach(clock => {
        const card = createClockCard(clock);
        container.appendChild(card);
    });
}

// Create clock card
function createClockCard(clock) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.id = `clock-${clock.id}`;
    
    const now = new Date().toLocaleString('en-US', { timeZone: clock.offset });
    const clockDate = new Date(now);
    
    const hours = String(clockDate.getHours()).padStart(2, '0');
    const minutes = String(clockDate.getMinutes()).padStart(2, '0');
    const seconds = String(clockDate.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateString = clockDate.toLocaleDateString('en-US', options);
    
    // Get offset
    const offsetMinutes = new Date().getTimezoneOffset() - (clockDate.getTimezoneOffset() || 0);
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes > 0 ? '+' : '-';
    const offsetStr = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;
    
    card.innerHTML = `
        <div class="timezone-name">
            <span>${clock.name}</span>
            <span class="timezone-offset">UTC${offsetStr}</span>
        </div>
        <div class="digital-date">${dateString}</div>
        <div class="digital-time" data-time="${timeString}">${timeString}</div>
        <div class="small-clock" data-clock="${clock.id}">
            <div class="small-center-dot"></div>
            <div class="small-hand small-hour-hand" data-hour="${clock.id}"></div>
            <div class="small-hand small-minute-hand" data-minute="${clock.id}"></div>
            <div class="small-hand small-second-hand" data-second="${clock.id}"></div>
        </div>
        <button class="remove-btn" onclick="removeClock(${clock.id})">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;
    
    return card;
}

// Update all clocks
function updateAllClocks() {
    activeClocks.forEach(clock => {
        const card = document.getElementById(`clock-${clock.id}`);
        if (!card) return;
        
        const now = new Date().toLocaleString('en-US', { timeZone: clock.offset });
        const clockDate = new Date(now);
        
        const hours = String(clockDate.getHours()).padStart(2, '0');
        const minutes = String(clockDate.getMinutes()).padStart(2, '0');
        const seconds = String(clockDate.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        // Update digital time
        const timeEl = card.querySelector('.digital-time');
        timeEl.textContent = timeString;
        
        // Update analog clock
        const hourHand = card.querySelector(`[data-hour="${clock.id}"]`);
        const minuteHand = card.querySelector(`[data-minute="${clock.id}"]`);
        const secondHand = card.querySelector(`[data-second="${clock.id}"]`);
        
        const hour = clockDate.getHours();
        const minute = clockDate.getMinutes();
        const second = clockDate.getSeconds();
        
        const secondDegrees = (second / 60) * 360;
        const minuteDegrees = (minute / 60) * 360 + (second / 60) * 6;
        const hourDegrees = (hour / 12) * 360 + (minute / 60) * 30;
        
        if (secondHand) secondHand.style.transform = `rotate(${secondDegrees}deg)`;
        if (minuteHand) minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        if (hourHand) hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});
