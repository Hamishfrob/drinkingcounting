function createCalendar() {
    const calendar = document.getElementById('calendar');
    const year = 2025;
    
    // Add empty corner cell
    const cornerCell = document.createElement('div');
    cornerCell.className = 'header';
    calendar.appendChild(cornerCell);
    
    // Add day headers
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(day => {
        const header = document.createElement('div');
        header.className = 'header';
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Get the first day of the year
    const firstDay = new Date(year, 0, 1);
    // Get the last day of the year
    const lastDay = new Date(year, 11, 31);
    
    // Get Monday of the first week (might be in previous year)
    const firstMonday = new Date(firstDay);
    while (firstMonday.getDay() !== 1) {
        firstMonday.setDate(firstMonday.getDate() - 1);
    }
    
    // Get Sunday of the last week (might be in next year)
    const lastSunday = new Date(lastDay);
    while (lastSunday.getDay() !== 0) {
        lastSunday.setDate(lastSunday.getDate() + 1);
    }
    
    // Create calendar days
    const currentDate = new Date(firstMonday);
    while (currentDate <= lastSunday) {
        // Add date label at the start of each week
        if (currentDate.getDay() === 1) {
            const dateLabel = document.createElement('div');
            dateLabel.className = 'date-label';
            dateLabel.textContent = currentDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
            });
            calendar.appendChild(dateLabel);
        }
        
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `day-${currentDate.toISOString().split('T')[0]}`;
        
        // Add change event listener to save state
        checkbox.addEventListener('change', function() {
            saveCheckboxState(this.id, this.checked);
        });
        
        const checkboxVisual = document.createElement('span');
        checkboxVisual.className = 'checkbox-visual';
        
        // Gray out days not in 2025
        if (currentDate.getFullYear() !== year) {
            dayElement.classList.add('empty');
        }
        
        dayElement.appendChild(checkbox);
        dayElement.appendChild(checkboxVisual);
        calendar.appendChild(dayElement);
        
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Load saved states
    loadSavedStates();
}

function initFirebase() {
    const firebaseConfig = {
        // Your Firebase config here
    };
    firebase.initializeApp(firebaseConfig);
}

async function saveCheckboxState(id, checked) {
    try {
        await fetch('your-api-endpoint/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, checked })
        });
    } catch (error) {
        console.error('Failed to save:', error);
    }
}

async function loadSavedStates() {
    try {
        const response = await fetch('your-api-endpoint/load');
        const savedStates = await response.json();
        Object.entries(savedStates).forEach(([id, checked]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = checked;
            }
        });
    } catch (error) {
        console.error('Failed to load:', error);
    }
}

async function saveToGist(data) {
    const gistId = 'your-gist-id';
    const token = 'your-github-token';
    
    try {
        await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files: {
                    'drinking-days.json': {
                        content: JSON.stringify(data)
                    }
                }
            })
        });
    } catch (error) {
        console.error('Failed to save to Gist:', error);
    }
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', createCalendar); 