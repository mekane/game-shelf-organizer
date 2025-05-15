# Game Shelf Organizer

A webapp built in React + TypeScript to configure a wall of shelves
and organize a game collection.

Using Material UI for theme and NestJS for the back end.

## Setup

### Install Sqlite

Also recommend the "DB Browser for Sqlite" tool.

### Environment Variables
Create a file called `.env` in the server/ directory.

It needs to define this property:

```
JWT_SECRET=<value>
```

## Run the Application

In the server/ directory run `npm start`

## Testing API With Postman

Use the `/users/login` route and copy the resulting access token value and paste it into
the Collection's 'Authorization' token input. This will be shared across all requests.
