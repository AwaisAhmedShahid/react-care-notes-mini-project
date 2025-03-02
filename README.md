
# Care Notes Application

A responsive web application for healthcare professionals to record and manage care notes for residents. The application works both online and offline, with automatic synchronization when connectivity is restored.

## Features

- **Create and View Care Notes**: Record detailed care notes for residents with author information and timestamps
- **Offline Support**: Full functionality even without internet connection
- **Automatic Synchronization**: Changes made offline are automatically synced when connection is restored
- **Filtering**: Filter notes by resident name
- **Pagination**: Navigate through large sets of care notes with ease
- **Responsive Design**: Works on desktop and mobile devices

## Future Considerations

* Use UUID instead of numbers
* Edit and Delete Notes
* Add categories or tags for notes
* Add attachments (photos, documents) to notes
* Add Feature to Add Authers and then use Select auther in create Note and/or Implement user login/logout Role-based access control (admin, nurse, doctor)
* Add manual sync button for users to trigger sync when needed
* Implement pagination for large datasets
* Reports

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI (based on Radix UI)
- **State Management**: Redux Toolkit
- **Offline Storage**: IndexedDB (via idb library)
- **Styling**: Tailwind CSS
- **Backend**: Express.js server with in-memory database

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

1. Start both the frontend and backend servers:

   ```
   npm run dev:all
   ```

   This will start:

   - Frontend development server at http://localhost:5173
   - Backend API server at http://localhost:3001

### Development

- **Frontend only**:

  ```
  npm run dev
  ```
- **Backend only**:

  ```
  npm run server
  ```

## Project Structure

```
/
├── server/                # Backend server code
│   └── index.ts           # Express server setup
│   ├── routes/  	   # API routes 
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and services
│   │   ├── api.ts         # API service for server communication
│   │   └── db.ts          # IndexedDB database operations
│   ├── store/             # Redux store configuration
│   │   ├── index.ts       # Store setup
│   │   └── careNotesSlice.ts # Care notes state management
│   └── types/             # TypeScript type definitions
└── public/                # Static assets
```

## Offline Functionality

The application uses IndexedDB to store data locally, allowing full functionality even when offline:

1. **Creating Notes Offline**: Notes created while offline are stored locally
2. **Automatic Sync**: When connection is restored, local changes are automatically synced


## Created By

* [Awais Ahmed Shahid](https://github.com/awaisahmedshahid)
* [REPO](https://github.com/AwaisAhmedShahid/react-care-notes-mini-project)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
