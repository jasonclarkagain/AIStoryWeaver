# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of StoryWeave seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

1. **Do NOT** open a public GitHub issue for security vulnerabilities
2. Email security details to the maintainers (create a private issue or contact directly)
3. Include as much information as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Initial Assessment**: We'll provide an initial assessment within 5 business days
- **Updates**: We'll keep you informed of progress
- **Resolution**: We aim to resolve critical issues within 30 days

### Security Best Practices

When using StoryWeave:

#### API Keys
- Never commit API keys to version control
- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor API usage for unusual activity

#### Data Protection
- User stories are stored securely
- AI interactions are processed through OpenAI's secure API
- No sensitive personal information is required

#### Deployment Security
- Use HTTPS in production
- Keep dependencies updated
- Monitor for security vulnerabilities
- Implement proper CORS policies

### Known Security Considerations

1. **OpenAI API Usage**: All AI features require OpenAI API access
2. **User Content**: Stories are user-generated content
3. **Rate Limiting**: Implement rate limiting for AI endpoints
4. **Input Validation**: All user inputs are validated

### Responsible Disclosure

We follow responsible disclosure practices:
- We'll work with you to understand and resolve the issue
- We'll credit you for the discovery (if desired)
- We'll coordinate timing of public disclosure
- We'll provide updates on our security page

Thank you for helping keep StoryWeave secure!