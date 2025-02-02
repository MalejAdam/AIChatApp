# AI Chat Application

A React Native mobile application featuring authentication, AI chat integration, file sharing, and profile management.

## Features

- 🔐 Authentication
   - Email/Password login
   - Protected routes
   - Session management

- 💬 Chat Interface
   - Real-time AI responses
   - Message streaming
   - File attachments (images, documents)
   - File preview & validation

- 👤 Profile Management
   - User information editing
   - Profile picture upload
   - Local data persistence

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation (Expo Router)
- React Native Paper
- TanStack Query
- OpenAI API Integration
- AsyncStorage for data persistence

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MalejAdam/AIChatApp
cd AIChatApp
```

2. Install dependencies:
```bash
npm install
```

3. Environment setup:
   Create a `.env` file in the root directory:
```
EXPO_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

4. Start the application:
```bash
npx expo start
```

## Testing

To test the application:

1. Login credentials:
   - Email: test@example.com
   - Password: password123

2. Test chat features:
   - Send text messages
   - Upload files (supported formats: images, PDF, documents)
   - Check message streaming
   - Verify file size limitations

3. Test profile features:
   - Upload profile picture
   - Edit user information
   - Verify data persistence after app restart

## Project Structure

```
/AIChatAppV1
├── app/                  # Expo Router screens
│   ├── (auth)/          # Authentication routes
│   └── (app)/           # Main app routes
├── src/
│   ├── contexts/        # React contexts
│   └── services/        # API and utility services
└── assets/              # Images and static files
```


## Screenshots

[![Demo](https://github.com/MalejAdam/AIChatApp/blob/master/thumbnail.jpg)](https://github.com/MalejAdam/AIChatApp/blob/master/AIChatDemo.mp4)
