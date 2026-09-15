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
        asyncAwaitVersion.ts
        callbackVersion.ts
        config.ts
        display.ts
        promiseVersion.ts
        types.ts
    .gitignore
    package-lock.json
    package.json
    README.md
    tsconfig.json

```

### File Responsibilities


