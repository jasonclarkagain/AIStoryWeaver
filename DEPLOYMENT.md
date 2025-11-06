# Deployment Guide

This guide covers different ways to deploy StoryWeave to production.

## Quick Deploy Options

### 1. Replit Deployment (Recommended)
- Click the "Deploy" button in your Replit project
- Configure your OpenAI API key in the secrets
- Your app will be available at `your-project.replit.app`

### 2. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OPENAI_API_KEY
```

### 3. Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## Environment Variables

Set these environment variables in your deployment platform:

- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV` - Set to "production"
- `DATABASE_URL` - PostgreSQL connection string (if using database)

## Production Considerations

### Database Setup
- For production, set up PostgreSQL database
- Update connection strings in environment variables
- Run database migrations if needed

### Performance
- The app uses in-memory storage by default
- For production, migrate to PostgreSQL for persistence
- Consider Redis for caching
- Enable compression and caching headers

### Security
- Ensure HTTPS is enabled
- Rotate API keys regularly
- Implement rate limiting for AI endpoints
- Add proper CORS configuration

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor API usage and costs
- Track performance metrics
- Set up uptime monitoring

## Build Process

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

## Scaling

- The application is stateless and can be horizontally scaled
- Database connections should use pooling
- Consider CDN for static assets
- Monitor OpenAI API rate limits and costs

## Troubleshooting

### Common Issues
- OpenAI API key not working: Verify key is correct and has sufficient credits
- Database connection errors: Check connection string and network access
- Build failures: Clear cache and reinstall dependencies

### Support
- Check the GitHub issues page
- Review logs for error details
- Verify all environment variables are set correctly