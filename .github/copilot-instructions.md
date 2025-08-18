# GitHub Copilot Instructions

These instructions define how GitHub Copilot should assist with this project. The goal is to ensure consistent, high-quality code generation aligned with our conventions, stack, and best practices.

## 🧠 Context

- **Project Type**: REST API / Frontend UI / Bridge between APIs and incoming hooks
- **Language**: JavaScript
- **Framework / Libraries**: Express / Node.js / Axios
- **Architecture**: MVC / Modular / Clean Architecture

## 🔧 General Guidelines

- Use JavaScript-idiomatic patterns.
- Always prefer named functions and avoid long anonymous closures.
- Add JSDoc comments and inline type hints (or use TypeScript if strict types are needed).
- Use consistent formatting with Prettier.
- Prefer readability over cleverness.

## 📁 File Structure

Use this structure as a guide when creating or updating files:

```text
src/
  controllers/
  services/
  repositories/
  types/
  utils/
```

## 🧶 Patterns

### ✅ Patterns to Follow

- Use Dependency Injection and Repository Pattern where applicable.
- For APIs, include:
- Error handling using custom error classes / status codes / try-catch blocks
- Logging via console or debug-mode
- For UI:
- Components should be pure and reusable
- Avoid inline styling; use Tailwind / CSS Modules / styled-components

### 🚫 Patterns to Avoid

- Don’t generate code without tests.
- Don’t hardcode values; use config/env files.
- Avoid global state unless absolutely necessary.
- Don’t expose secrets or keys.

## 🧩 Example Prompts

- `Copilot, create a REST endpoint using Express that retrieves all books from the books table.`
- `Copilot, implement a React hook to debounce a search input.`


## 🔁 Iteration & Review

- Copilot output should be reviewed and modified before committing.
- If code isn’t following these instructions, regenerate with more context or split the task.
- Use comments to clarify intent before invoking Copilot.

## 📚 References

- [JavaScript Style Guide (Airbnb)](https://github.com/airbnb/javascript)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
- [Node.js Documentation](https://nodejs.org/en/docs)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Joi Schema Validation](https://joi.dev/api/)
- [Prettier Code Formatter](https://prettier.io/docs/en/index.html)
- [ESLint Rules and Configuration](https://eslint.org/docs/latest/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)