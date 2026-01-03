# 2026 Drinking Tracker

A sleek, interactive calendar application designed to track drinking days throughout 2026. The app features an elegant, user-friendly interface with real-time statistics and persistent data storage.

## Features

- **Visual Calendar Layout**
  - Full year view organized by weeks
  - Checkboxes for each day that turn green when checked
  - Elegant color scheme with subtle gradients and shadows
  - Responsive design that works on both desktop and mobile devices

- **Comprehensive Statistics**
  - Weekly totals showing drinks/week and percentage
  - Monthly summaries at the end of each month
  - Half-year total after June
  - Full year statistics at the bottom
  - All statistics update in real-time

- **Data Persistence**
  - Automatically saves your selections using local storage
  - Data persists across browser sessions and refreshes
  - No account required

## How to Use

1. **Marking Non-Drinking Days**
   - Click any box to mark a day where you DIDN'T have a drink
   - Click again to unmark
   - Green boxes indicate non-drinking days
   - Empty boxes indicate drinking days

2. **Reading Statistics**
   - Each row shows the week's total of drinking days on the right (e.g., "3/7 (42.9%)")
   - Monthly totals show drinking days per month
   - Half-year summary shows total drinking days for January-June
   - Year-end total shows all drinking days for the year

3. **Data Storage**
   - All selections are automatically saved
   - Data remains when you close the browser
   - Works offline
   - Data is stored locally on your device

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses CSS Grid for layout
- Implements localStorage for data persistence
- Responsive design with mobile support
- Color scheme uses elegant gradients and shadows

## Browser Support

Works in all modern browsers that support:
- CSS Grid
- Local Storage
- ES6 JavaScript
- CSS Custom Properties

## Installation

1. Clone this repository:
```bash
git clone https://github.com/your-username/2026-drinking-tracker.git
```
2. Open `index.html` in your web browser

No build process or dependencies required.

## Future Improvements Planned

- Cloud storage integration (Firebase)
- Export/import functionality
- Multiple year support
- Custom notes for each day
- Different drink type tracking
- Monthly and yearly charts/graphs

## License

MIT License - feel free to use this code for any purpose.

## Privacy

All data is stored locally on your device. No data is sent to any server.
