# Game Shelf Organizer

A webapp built in React + TypeScript to configure a wall of shelves
and organize a game collection.

Using Material UI for theme and NestJS for the back end.

## Setup

Create a file called `.env` in the server/ directory.

It needs to define this property:

```
JWT_SECRET=<value>
```

## Testing API With Postman

Use the `/users/login` route and copy the resulting access token value and paste it into
the Collection's 'Authorization' token input. This will be shared across all requests.
