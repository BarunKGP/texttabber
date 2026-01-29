# texttabber

A high-performance command palette for tab navigation in Google Chrome.

texttabber provides a keyboard-centric interface for users with high tab counts. By utilizing fuzzy search logic, users can switch between dozens of open tabs instantly without manual scrolling.

## Core Functionality

- **Fuzzy Search Engine**: Employs Fuse.js to handle approximate keyword matching across tab titles and URLs.
- **UI Isolation**: Utilizes Shadow DOM to prevent CSS leakage and ensure consistent styling across all host websites.
- **Optimized Focus Management**: Implements aggressive focus capturing to ensure the search input is immediately ready for user input upon activation.

## Technical Specifications

- **Frontend**: React 18
- **Build Tool**: Vite + CRXJS (Vite Plugin)
- **Styling**: Encapsulated CSS Modules
- **Communication**: Chrome Runtime Messaging API

## Installation for Developers

1. Clone the repository to your local environment.
1. Install dependencies: `npm install`
1. Generate the production build: `npm run build`
1. Navigate to `chrome://extensions` in Google Chrome.
1. Enable Developer Mode.
1. Select **Load unpacked** and choose the `dist` directory.

## Keyboard Shortcuts

- **Open Search**: `Ctrl + Shift + K` (Default)
- **Navigate Results**: `Up/Down Arrows`
- **Execute Switch**: `Enter`
- **Dismiss**: `Esc` or `Click Outside`

## License

This project is licensed under the MIT License.
