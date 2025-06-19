# QR Check-In App

A modern, responsive mobile web app for QR-based event check-in. Built with React and Tailwind CSS.

## Features

- **Landing Page**: Choose between Single Check-In and Group Check-In.
- **Single Check-In**: Scan and verify a single ticket via QR code.
- **Group Check-In**: Scan a group QR code, see all group members, and check in individuals or all at once.
- **Google Sheets Integration**: (Planned) Validate tickets and group info by connecting to a Google Sheet via Google Apps Script endpoint.
- **Mobile-First Design**: Fully responsive and touch-friendly, works great on phones and tablets.

## Tech Stack
- React (Create React App)
- Tailwind CSS
- html5-qrcode for QR scanning
- React Router for navigation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```

## Google Sheets Integration (Planned)
- You will need to create a Google Apps Script web endpoint that exposes your event's ticket data as an API.
- The app will call this endpoint to validate and check in tickets.
- See [Google Apps Script documentation](https://developers.google.com/apps-script/guides/web) for best practices.

## Customization
- Update the UI and logic in `src/SingleCheckIn.js` and `src/GroupCheckIn.js` as needed.
- Tailwind CSS is used for all styling.

## License
MIT
