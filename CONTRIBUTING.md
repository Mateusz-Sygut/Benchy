# Contributing to Benchy

Thank you for your interest in contributing to Benchy! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Before You Start

1. **Check existing issues** - Look for existing issues or discussions that might be related to your contribution
2. **Discuss changes** - For major changes, please open an issue first to discuss what you would like to change
3. **Fork the repository** - Create your own fork of the project

### Development Setup

1. **Fork and clone**
   ```bash
   git clone https://github.com/your-username/benchy-app.git
   cd benchy-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   - Copy `app.json.example` to `app.json`
   - Add your API keys and tokens
   - Follow the setup instructions in README.md

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Avoid `any` type - use proper typing
- Use type guards when necessary

### React Native
- Follow React Native best practices
- Use functional components with hooks
- Implement proper error boundaries
- Optimize for performance

### Styling
- Use NativeWind (Tailwind CSS) for styling
- Follow the established design system
- Ensure accessibility compliance
- Test on different screen sizes

### Code Style
- Use ESLint and Prettier
- Follow the existing code formatting
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

## 🧪 Testing

### Unit Tests
- Write tests for all new components
- Test utility functions thoroughly
- Maintain good test coverage
- Use descriptive test names

### Integration Tests
- Test component interactions
- Test API integrations
- Test navigation flows
- Test error handling

### Manual Testing
- Test on both iOS and Android
- Test on different device sizes
- Test offline functionality
- Test accessibility features

## 📋 Pull Request Process

### Before Submitting
1. **Self-review** - Review your own code
2. **Test thoroughly** - Ensure all tests pass
3. **Update documentation** - Update README if needed
4. **Check formatting** - Run linting and formatting

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-platform testing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Bug Reports

### Before Reporting
1. **Search existing issues** - Check if the bug has already been reported
2. **Reproduce the issue** - Ensure you can consistently reproduce the problem
3. **Check environment** - Verify your setup matches the requirements

### Bug Report Template
```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. iOS 16.0, Android 13]
- Device: [e.g. iPhone 14, Samsung Galaxy S23]
- App Version: [e.g. 1.0.0]
- Expo SDK: [e.g. 49.0.0]

## Additional Context
Screenshots, logs, or any other relevant information
```

## 💡 Feature Requests

### Before Requesting
1. **Check existing features** - Ensure the feature doesn't already exist
2. **Consider impact** - Think about how it affects the overall user experience
3. **Provide context** - Explain why this feature would be valuable

### Feature Request Template
```markdown
## Feature Description
Clear description of the requested feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternative Solutions
Any alternative approaches considered?

## Additional Context
Screenshots, mockups, or examples
```

## 🚀 Release Process

### Version Bumping
- **Patch** (1.0.1) - Bug fixes
- **Minor** (1.1.0) - New features, backward compatible
- **Major** (2.0.0) - Breaking changes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Release notes written
- [ ] Assets prepared (icons, screenshots)

## 📞 Getting Help

### Communication Channels
- **GitHub Issues** - For bug reports and feature requests
- **GitHub Discussions** - For general questions and discussions
- **Email** - For sensitive or private matters

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's values

## 🙏 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame
- Special mentions for significant contributions

Thank you for contributing to Benchy! 🪑
