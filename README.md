# Daycare Management System

A comprehensive React web application for managing daycare operations, children, staff, and schedules.

## Features

- Dashboard overview with key metrics
- Children management
- Staff scheduling
- Activities planning
- Announcements
- Responsive design

## Technology Stack

- React 18
- TypeScript
- React Router for navigation
- Styled Components for styling
- React Query for data fetching
- React Hook Form for form handling
- Zod for form validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://your-repository-url/daycare-react.git
   cd daycare-react
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Page components
├── data/           # Mock data and services
├── lib/            # Utility functions and hooks
├── types/          # TypeScript type definitions
├── App.tsx         # Main app component with routing
└── index.tsx       # Entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.