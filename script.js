function createCalendar() {
    const calendar = document.getElementById('calendar');
    const year = 2026;
    
    // Add headers
    const dateHeader = document.createElement('div');
    dateHeader.className = 'header';
    dateHeader.textContent = 'Week';
    calendar.appendChild(dateHeader);

    // Add day headers
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach(day => {
        const header = document.createElement('div');
        header.className = 'header';
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Add total header
    const totalHeader = document.createElement('div');
    totalHeader.className = 'header';
    totalHeader.textContent = 'Total';
    calendar.appendChild(totalHeader);

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
    
    let currentMonth = -1;
    const currentDate = new Date(firstMonday);
    
    let hasAddedHalfYear = false;
    
    while (currentDate <= lastSunday) {
        if (currentDate.getDay() === 1) { // Start of week
            const weekRow = document.createElement('div');
            weekRow.className = 'week-row';
            
            // Add date label
            const dateLabel = document.createElement('div');
            dateLabel.className = 'date-label';
            dateLabel.textContent = currentDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
            });
            weekRow.appendChild(dateLabel);
            
            // Create 7 days
            for (let i = 0; i < 7; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'day';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `day-${currentDate.toISOString().split('T')[0]}`;
                
                checkbox.addEventListener('change', function() {
                    saveCheckboxState(this.id, this.checked);
                    updateTotals();
                });
                
                const checkboxVisual = document.createElement('span');
                checkboxVisual.className = 'checkbox-visual';
                
                dayElement.appendChild(checkbox);
                dayElement.appendChild(checkboxVisual);
                weekRow.appendChild(dayElement);
                
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            // Add total cell for the week
            const totalCell = document.createElement('div');
            totalCell.className = 'total-cell';
            weekRow.appendChild(totalCell);
            
            calendar.appendChild(weekRow);
            
            // Add half-year total after the last week that contains June 30th
            if (!hasAddedHalfYear && currentDate > new Date(2026, 5, 30)) {
                const halfYearDiv = document.createElement('div');
                halfYearDiv.className = 'half-year-total';
                halfYearDiv.textContent = 'First Half Year: Calculating...';
                calendar.appendChild(halfYearDiv);
                hasAddedHalfYear = true;
            }
        }
    }
    
    // Add year total at the end
    const yearTotal = document.createElement('div');
    yearTotal.className = 'year-total';
    calendar.appendChild(yearTotal);
    
    // After all checkboxes are created, load saved states
    const savedStates = getSavedStates();
    Object.entries(savedStates).forEach(([id, checked]) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = checked;
        }
    });
    
    // Update totals after loading saved states
    updateTotals();
}

function initFirebase() {
    const firebaseConfig = {
        // Your Firebase config here
    };
    firebase.initializeApp(firebaseConfig);
}

function saveCheckboxState(id, checked) {
    const savedStates = getSavedStates();
    savedStates[id] = checked;
    localStorage.setItem('drinkingDays2026', JSON.stringify(savedStates));
}

function getSavedStates() {
    const saved = localStorage.getItem('drinkingDays2026');
    return saved ? JSON.parse(saved) : {};
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

function updateTotals() {
    updateWeekTotals();
    updateMonthTotals();
    updateHalfYearTotals();
    updateYearTotal();
}

function updateWeekTotals() {
    const weekRows = document.querySelectorAll('.week-row');
    weekRows.forEach(row => {
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        const total = checkboxes.length;
        const percentage = (checked / total * 100).toFixed(1);
        
        const totalCell = row.querySelector('.total-cell');
        if (totalCell) {
            totalCell.textContent = `${checked}/${total} (${percentage}%)`;
        }
    });
}

function updateMonthTotals() {
    let currentMonth = -1;
    let monthCheckboxes = [];
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const date = new Date(checkbox.id.split('-')[1]);
        
        if (date.getMonth() !== currentMonth) {
            if (monthCheckboxes.length > 0) {
                // Display previous month's total
                const checked = monthCheckboxes.filter(cb => cb.checked).length;
                const total = monthCheckboxes.length;
                const percentage = (checked / total * 100).toFixed(1);
                
                const monthName = new Date(currentMonth + 1, 0).toLocaleString('default', { month: 'long' });
                const monthTotal = document.createElement('div');
                monthTotal.className = 'month-total';
                monthTotal.textContent = `${monthName}: ${checked}/${total} (${percentage}%)`;
                
                // Insert after the last day of the month
                const lastDayOfMonth = monthCheckboxes[monthCheckboxes.length - 1].closest('.week-row');
                lastDayOfMonth.after(monthTotal);
            }
            
            currentMonth = date.getMonth();
            monthCheckboxes = [];
        }
        
        monthCheckboxes.push(checkbox);
    });
}

function updateHalfYearTotals() {
    const halfYearTotal = document.querySelector('.half-year-total');
    if (!halfYearTotal) return;
    
    // Get all checkboxes that appear before the half-year total element
    const allCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    const firstHalf = allCheckboxes.filter(checkbox => {
        // Check if this checkbox appears before the half-year total in the DOM
        return checkbox.compareDocumentPosition(halfYearTotal) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    
    const checked = firstHalf.filter(cb => cb.checked).length;
    const total = firstHalf.length;
    const percentage = (checked / total * 100).toFixed(1);
    
    halfYearTotal.textContent = `First Half Year Total: ${checked}/${total} (${percentage}%)`;
}

function updateYearTotal() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const total = checkboxes.length;
    const percentage = (checked / total * 100).toFixed(1);
    
    const yearTotal = document.querySelector('.year-total');
    if (yearTotal) {
        yearTotal.textContent = `Year Total: ${checked}/${total} (${percentage}%)`;
    }
}

// Clear old localStorage data from previous years for fresh start
function clearOldData() {
    // Remove old 2025 data if it exists
    if (localStorage.getItem('drinkingDays2025')) {
        localStorage.removeItem('drinkingDays2025');
    }
    // You can add more years here as needed in the future
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', function() {
    clearOldData();
    createCalendar();
}); 