# Flappy Bird React Game

A modern implementation of the classic Flappy Bird game built with React and Phaser 3. Play it here: [Your Deployed Game URL]

![Flappy Bird Game Screenshot]

## Features

- Classic Flappy Bird gameplay mechanics
- Smooth animations and physics
- Sound effects with mute option
- Score tracking
- Responsive design
- Settings menu before game start
- Cloud and mountain background elements

## Technologies Used

- React
- Phaser 3 (Game Engine)
- Vite (Build Tool)
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [your-repository-url]
cd flappy-bird-game
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser

## Game Controls

- Click or press Spacebar to make the bird flap
- Avoid the pipes and try to get through as many as possible
- Access settings menu before starting the game
- Mute/unmute sound from the settings menu

## Deployment

This game is deployed using Vercel. To deploy your own version:

1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

2. Build the project
```bash
npm run build
```

3. Deploy to Vercel
```bash
vercel
```

4. To use a custom domain:
```bash
vercel domains add yourdomain.com
```

### Configuration for Vercel

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Development Command: `npm run dev`

## Project Structure

```
flappy-bird/
├── public/
│   └── assets/
│       ├── sounds/
│       └── images/
├── src/
│   ├── components/
│   │   └── FlappyBird.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Original Flappy Bird game by Dong Nguyen
- Phaser.js game framework
- React community

## Future Improvements

- Add different difficulty levels
- Implement high score system
- Add different bird characters
- Include background music
- Add particle effects

## Support

For support, please open an issue in the GitHub repository or contact [Your Contact Information]