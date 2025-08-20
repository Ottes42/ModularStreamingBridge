# Contributing to Modular Streaming Bridge

Thank you for your interest in contributing to the Modular Streaming Bridge! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## 🚀 Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/ModularStreamingBridge.git
   cd ModularStreamingBridge
   ```
3. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

1. Install Node.js 24+ (LTS recommended)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp env.example .env
   # Edit .env with your development settings
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## 📝 Code Style

This project follows JavaScript best practices and conventions:

### General Guidelines

- Use **named functions** and avoid long anonymous closures
- Add **JSDoc comments** for functions and classes
- Prefer **readability over cleverness**
- Use **consistent formatting** (consider using Prettier)
- Follow the existing project structure

### File Organization

```
src/
├── controllers/     # Express route handlers
├── services/        # Business logic and external integrations  
├── clients/         # External API clients
├── utils/           # Utility functions and helpers
└── config.js        # Configuration management
```

### Naming Conventions

- **Files**: camelCase (e.g., `obsService.js`)
- **Functions**: camelCase (e.g., `handleQueuedRequest`)
- **Classes**: PascalCase (e.g., `ObsService`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)

### Error Handling

- Use try-catch blocks for async operations
- Use custom error classes with meaningful messages
- Log errors using the logger utility
- Return appropriate HTTP status codes

### Example Function Structure

```javascript
/**
 * Handles OBS camera zoom functionality
 * @param {Object} params - Zoom parameters
 * @param {string} params.scene - Scene name
 * @param {string} params.source - Source name
 * @param {number} params.x - X coordinate (0-1)
 * @param {number} params.y - Y coordinate (0-1) 
 * @param {number} params.zoom - Zoom factor
 * @returns {Promise<Object>} Zoom operation result
 */
async function handleCameraZoom({ scene, source, x, y, zoom = 2 }) {
  try {
    // Implementation
  } catch (error) {
    errorLog('Camera zoom failed:', error.message);
    throw error;
  }
}
```

## 🔧 Testing

While the project doesn't currently have a comprehensive test suite, consider adding tests for:

- New API endpoints
- Service integrations
- Utility functions
- Error handling scenarios

## 📤 Submitting Changes

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Test your changes locally
4. Commit your changes with descriptive messages:
   ```bash
   git commit -m "feat: add camera auto-focus feature"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request on GitHub

### Pull Request Guidelines

- **Title**: Use a descriptive title that summarizes the change
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Breaking Changes**: Highlight any breaking changes
- **Documentation**: Update README.md if your changes affect usage

### Commit Message Format

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `chore:` for maintenance tasks

## 🐛 Reporting Issues

Before creating an issue:

1. **Search existing issues** to avoid duplicates
2. **Use the latest version** of the software
3. **Include detailed information**:
   - Node.js version
   - Operating system
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/logs
   - Configuration details (sanitized)

### Issue Template

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Configure environment with...
2. Start service with...
3. Send request to...
4. Observe error...

**Expected Behavior**
What you expected to happen.

**Environment**
- Node.js version: 
- OS: 
- Docker: (if applicable)

**Additional Context**
Any other relevant information.
```

## 💡 Feature Requests

We welcome feature suggestions! Please:

1. **Check existing issues** for similar requests
2. **Explain the use case** and benefits
3. **Provide examples** of how it would be used
4. **Consider implementation complexity**

### Feature Request Template

```markdown
**Feature Description**
A clear description of the proposed feature.

**Use Case**
Why would this feature be useful?

**Proposed Implementation**
How do you envision this working?

**Examples**
Provide examples of usage.

**Additional Context**
Any other relevant information.
```

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **Testing**: Unit and integration tests
- **Documentation**: API documentation, tutorials
- **Streaming Platforms**: Support for additional platforms
- **Error Handling**: Improved error messages and recovery
- **Performance**: Optimization and monitoring
- **Security**: Security improvements and best practices

## 📞 Getting Help

- **Documentation**: Check README.md and inline code comments
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Create an issue for bugs or feature requests

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the ISC License.

Thank you for contributing! 🚀