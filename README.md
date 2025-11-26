# Camping Invite

RSVP website for Het Grote Vrienden Kampeerfeest.

## Development

### Prerequisites
- Node.js
- Java (required for Firebase Emulators)

### Setup
```bash
npm install
```

### Running Locally with Emulators (Recommended)
This will start the Vite dev server and force it to use the local Firebase emulators.

1. Start the emulators in one terminal:
   ```bash
   npm run emulators:start
   ```
   Emulator UI will be available at [http://localhost:4000](http://localhost:4000).

2. Start the dev server in another terminal:
   ```bash
   npm run dev
   ```
   The app will automatically detect the `.env.local` file and connect to the emulators.

### Running Locally with Production Firebase
To run against the live Firebase project (be careful!):
1. Rename or delete `.env.local`
2. Run `npm run dev`

## Deployment

Deploy to Firebase Hosting:
```bash
npm run deploy
```
This builds the project and deploys it to Firebase. The production build will automatically use the real Firebase services.

## Project Structure
- `src/` - Source code
- `firebase.json` - Firebase Hosting & Emulators config
- `firebase.emulators.json` - Emulator port configuration
- `.env.local` - Local environment overrides (forces emulator use)
