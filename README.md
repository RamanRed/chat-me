# Web-Meet

A real-time video conferencing application built with Next.js, React, Socket.IO, and WebRTC. This project allows users to join video calls by entering their email and a room code, enabling peer-to-peer communication through WebRTC signaling facilitated by Socket.IO.

## Features

- **Real-time Communication**: Instant connection and signaling for video calls using Socket.IO.
- **WebRTC Integration**: Peer-to-peer video and audio streaming for high-quality calls.
- **Room-based Meetings**: Users can join specific rooms using unique room codes.
- **Responsive UI**: Built with Next.js and Tailwind CSS for a modern, responsive interface.
- **TypeScript Support**: Full TypeScript implementation for better code quality and developer experience.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Real-time Communication**: WebRTC, Socket.IO
- **Styling**: Tailwind CSS

## Project Structure

```
web-meet/
├── server/                 # Backend server
│   ├── index.ts           # Main server file
│   ├── package.json       # Server dependencies
│   ├── tsconfig.json      # TypeScript config
│   └── nodemon.json       # Nodemon config
├── study-with-me/         # Frontend application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utility libraries
│   └── package.json      # Client dependencies
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-meet
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../study-with-me
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:9000`

2. Start the client:
   ```bash
   cd study-with-me
   npm run dev
   ```
   The client will run on `http://localhost:3000`

3. Open your browser and navigate to `http://localhost:3000`

4. Enter your email and a room code to join or create a meeting

## Usage

1. On the home page, enter your email address and a room code
2. Click "Join" to enter the meeting room
3. Grant camera and microphone permissions when prompted
4. Start your video conference!

## Development

### Server Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server

### Client Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Real-time communication powered by [Socket.IO](https://socket.io/)
- Video streaming using [WebRTC](https://webrtc.org/)