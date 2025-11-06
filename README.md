# StoryWeave - AI-Powered Interactive Storytelling Platform

StoryWeave is a modern web application that enables users to create, share, and experience interactive stories with AI assistance. The platform combines creative writing with artificial intelligence to help authors craft engaging narratives and provides readers with dynamic, choice-driven story experiences.

## Features

### 🤖 AI-Powered Writing Assistant
- Real-time story content generation
- Writing improvement suggestions
- Sentiment analysis and mood tracking
- Interactive choice generation

### 📚 Interactive Story Creation
- Rich text editor with AI collaboration
- Chapter-based story structure
- Choice builder for reader decisions
- Scene visualization capabilities

### 🌟 Social Story Platform
- Story discovery and browsing
- Community engagement features
- Author profiles and libraries
- Story rating and sharing

### 📊 Analytics Dashboard
- Reader engagement metrics
- Story performance tracking
- Progress visualization
- Community insights

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for server state management

### Backend
- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** database (with in-memory storage for development)

### AI Integration
- **OpenAI GPT-4o** for content generation
- **Sentiment analysis** for mood tracking
- **Writing assistance** and improvement suggestions
- **Interactive choice generation**

## Getting Started

### Prerequisites
- Node.js 20 or higher
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/storyweave.git
cd storyweave
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env file and add your OpenAI API key
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

### Creating Stories
1. Click "Start New Story" from the home page
2. Fill in story details (title, genre, description)
3. Use the AI Writing Assistant for content suggestions
4. Add interactive choices for readers
5. Preview and publish your story

### AI Features
- **Content Generation**: Get AI suggestions for continuing your story
- **Writing Improvement**: Enhance your text with AI recommendations
- **Mood Analysis**: Automatic sentiment tracking
- **Choice Generation**: AI-powered reader decision options

### Reading Stories
1. Browse stories in the Discover section
2. Filter by genre, popularity, or recency
3. Read stories with interactive choices
4. Like and share your favorite stories

## API Endpoints

### Stories
- `GET /api/stories` - Get published stories
- `GET /api/stories/trending` - Get trending stories
- `GET /api/stories/my` - Get user's stories
- `POST /api/stories` - Create new story
- `GET /api/stories/:id` - Get story by ID

### AI Features
- `POST /api/ai/generate` - Generate story content
- `POST /api/ai/sentiment` - Analyze text sentiment
- `POST /api/ai/prompt` - Generate story prompts
- `POST /api/ai/improve` - Improve writing

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions
├── server/               # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage layer
│   └── openai.ts         # AI integration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── components.json       # shadcn/ui configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key for AI features
- `NODE_ENV` - Application environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string (for production)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the GPT-4o API
- The React and Node.js communities
- shadcn/ui for beautiful UI components
- All contributors and users of StoryWeave

## Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

Built with ❤️ using modern web technologies and AI