# Wall App backend

Rest apis for wall app frontend

## Project Setup

### Project stack:

- Node, Express
- MongoDB
- Mocha & Chai

### Prerequisites

```
node v8^
npm
yarn
```

### Install and Run in Local

Note: Use `yarn` rather than `npm`

Install dependencies

```
npm install
```

```
npm run dev
```

### Add `.env` file

Refer `.env.example` file for local environment

```
NODE_ENV=development
PORT=5000
JWT_SECRET=SECRET
JWT_EXPIRE_MINUTES=1440
MONGO_URI=mongodb://localhost:27017/wall_app
MONGO_URI_DEV=mongodb://localhost:27017/wall_app_dev
APP_NAME=Wall App
MAIL_SENDER=
MAIL_SENDER_PASS=
```

## Running unit tests

- Unit test with mocha/chai

```
npm run test
```

## Authors

## License

MIT
