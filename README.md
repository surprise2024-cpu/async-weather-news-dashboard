# Async Weather & News Dashboard

## Project Overview

The **Async Weather & News Dashboard** is a Node.js and TypeScript application created to demonstrate different appraoches to asynchronous programming.

The application retrieves:

- Current weather information from the Open-Meteo API.
- News-style headlines from the DummyJSON Posts API.

The same functionality is implemented using three asynchronous programming techniques:

- Callbacks
- Promises
- Async/Await

The project also demonstrates:

- Nested callbacks
- Promise chaining
- `Promise.all()`
- `Promise.race()`
- Error handling
- The Node.js event loop
- Simultaneous asynchronous operations

The main purpose of the project is not simply retrieve weather and news data, but to demonstrate how asunchronous operations can be handled using different JavaScript techniques.

---

## Technologies Used

### Node.js

Node.js is used as the runtime environment for the project.

### TypeScript

Main programming language.

### Node HTTPS Module

Built-in Node.js HTTPS module used for HTTP requests.

Example: 

```ts
https.get(url, callback);
```

### Open-Meteo API

Used to retrieve current weather data.

The project retrieves:

- Temperature
- Apparent temperature
- Wind speed
- Weather code

### DummyJSON Posts API

Used to retrieve news data (post titles) that are displayed as headlines.

---

## Project Structure

```text

async-weather-news-dashboard/
    node_modules/
    src/
        assets/
        asyncAwaitVersion.ts
        callbackVersion.ts
        config.ts
        display.ts
        input.ts
        promiseVersion.ts
        types.ts
    .gitignore
    package-lock.json
    package.json
    README.md
    tsconfig.json

```

## File Responsibilities

- assets - Holds images used for demonstration.
- `callbackVersion.ts` - Callback-based weather and news implementation.
- `promiseVersion.ts` - Promise chaining, `Promise.all()`, and `Promise.race()`.
- `asyncAwaitVersion.ts` - Async/Await implementation using `try...catch`.
- `config.ts` - Stores API URLs.
- `display.ts` - Handles dashboard and error output.
- `input.ts` - Handles city input from the terminal.

---

## Installation

Install dependencies:

```bash
npm install
```

---

## Running the Project

### Callback Version

```bash
npm run callback
```

### Promise Version

```bash
npm run promise
```

### Async/Await Version

```bash
npm run async
```

### Type Check

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

---

## Error Handling

The project handles errors such as:

- Invalid city names
- Network failures
- HTTP errors
- API connection problems
- Invalid JSON responses

Example: 

```text
[ERROR] Weather request failed with status code: 503
```

---

## Event Loop

- Node.js does not block the program while waiting for API responses.
- Netword requests run asynchronously(at the same time) and their callbacks or Promise handlers execute when the responses become available.
- This allows multiple operations, such a weather and news requests to run efficiently.

---

## Sample Output

### Callback Version demonstration

![callback demo](/src/assets/callback-version.png)

### Promise Version demonstration

#### Promise Chaining

![promise chaining demo](/src/assets/promise-chaining.png)

#### Promise.all()

![promise all demo](/src/assets/promise-all-version2.0.png)

#### Promise.race()

![promise race demo](/src/assets/promise-race-version.png)

### Async/Await Version demonstration

![asyn & await demo](/src/assets/async-await-version.png)

---

## Conclusion

The project demonstrates three appraoches to asynchronous programmng in Node.js and TypeScript: callbacks, Promise and Async/Await.


