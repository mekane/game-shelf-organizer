## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Authorization

Uses bearer token auth (postman collection has this - inherit from parent)

## Database

Using a local SqlLite flat file DB.

### Update DB from Entities:

The schema is automatically updated whenever the server starts.

### Manually Browse Data

Use the "DB Browser" for SQL Lite tool and "Open Database" on the .sqlite file in this directory.

