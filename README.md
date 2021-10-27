# Dwitter

Dwitter is a backend project that provides APIs for social media application. The project was motivated by Twitter and developed as a simple version of it.

## Technology Stacks

- Node.js - JavaScript runtime environment
- Express.js - Node.js framework for backend application
- MongoDB - NoSQL database for data storage
- Mongoose - ODM for MongoDB

## Folder Structure

    root
    ├── router                  # responsible for accepting incoming requests
    |      ├── auth.js          # handles authentication-related requests
    |      └── tweets.js        # handles tweet-related requests
    |
    ├── controller              # responsible for processing requests, validation and data storage
    |      ├── auth.js          # processes sign-in, log-in, log-out and user authentication
    |      └── tweets.js        # creates, deletes, updates, retrieves tweets and comments
    |
    ├── data                    # responsible for data query and manipulation
    |      ├── auth.js
    |      └── tweets.js
    |
    ├── database                # responsible for connecting to database
    |      └── database.js
    |
    ├── middleware              # contains middleware
    |      ├── auth.js          # authenticates users by JWT
    |      ├── csrf.js          # validates CSRF token for non-reading requests
    |      ├── rate-limiter.js  # applies express-rate-limit
    |      └── validator.js     # checks the results of express-validator for user input
    |
    ├── config.js               # manipulates and exports environment variables in order to enable auto-completion in the script
    |
    └── app.js                  # entry point to the backend application

## Features

#### MVC pattern

MVC pattern was adopted to build the backend application. `View` component is responsible for handling routers. The business logic of the service was defined in `Controller` component, and data storage and update are handled in `Model` component. First, `View` identifies incoming requests and connect them to corresponding functions in `Controller`. Data are newly created, updated or deleted in `Model` according to the request. After the request is completely processed, `View` sends response with data back to frontend application. In the project, `View`, `Controller` and `Model` components of the MVC architecture were implemented in `router`, `controller` and `data` folders respectively.

#### RestAPI

Web API of this project complies with REST architectural style.

#### JSON Web Token

JWT is used to authenticate users. The token is transferred between browsers and the server as http-only cookie. For non-browser clients, the server sends the token to the clients via response body, and the clients append it to Authorization field in request header.

#### bcrypt

Password is hashed with salt using bcrypt, so that passwords are not easily predictable and reversible using rainbow table.

#### XSS attack prevention

To avoid cross-site scripting attack, JWT issued by server is not stored in local storage of browsers, but is set as cookie with http-only option instead. Cookie with http-only option enables the token accessible and controllable by browser only, and other JavaScript file cannot have access to this token.

#### CSRF attack prevention

Cookie with http-only flag does not completely prevent CSRF attack, because attackers can still exploit already authenticated http-only cookie stored in the browser and execute undesirable requests via session-riding. In order to avoid this, CSRF token is created using bcrypt in server and stored in memory in client application. Initial CSRF request is made before login request, and CSRF token is verified when users attempt to login. After successful login, all requests are sent from the clients with CSRF token as well as http-only cookie which prevents attackers from executing both cross-site scripting and session-riding requests.

#### Rate limiter

To avoid repeated requests to the APIS, express-rate-limit middleware was used in the project.

## APIs

CSRF token must be set to "dwitter-csrf-token" field in header of all types of requests except for GET, OPTIONS and HEAD methods.

### `POST auth/signup`

This creates a new user account.

#### Request body

Username, password, name, email fields are required. URL for profile image is optional.

    {
        "username": "myUsername",
        "password": "myPassword",
        "name": "Won Kim",
        "email": "myemail@email.com",
        "url" : "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }

#### Response body

Newly created JWT is additionally set as http-only cookie for browser clients.

    {
        "token": "myJWTString",
        "username": "myUsername"
    }

### `POST auth/login/`

This requests user log-in.

#### Request body

    {
        "username": "myUsername",
        "password": "myPassword"
    }

#### Response body

Newly created JWT is additionally set as http-only cookie for browser clients.

    {
        "token": "myJWTString",
        "username": "myUsername"
    }

### `POST auth/logout/`

This requests user log-out.

#### Response

    {
        "message": "User has been logged out"
    }

### `GET auth/csrf-token/`

This creates a new CSRF token. This token is required for login and further requests.

#### Response

    {
        "csrfToken": "myCSRFTokenString"
    }

### `POST tweets/`

This creates a new tweet.

#### Request body

    {
        "text": "This is Won's first tweet!"
    }

#### Response

Newly created tweet-object is returned.

    {
        "_id": "uniqueIdString",
        "text": "This is Won's first tweet!",
        "userId": "uniqueUserIdString",
        "name": "Won Kim",
        "username": "myUsername",
        "url": "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        "comments": [],
        "createdAt": "2021-10-23T18:43:05.885Z",
        "updatedAt": "2021-10-23T18:43:05.885Z",
        "__v": 0,
        "id": "uniqueIdString"
    }

### `GET tweets/`

This gets the recent 20 tweet-objects in an array.

### `GET tweets/:id`

This will get a tweet by its id.

### `PUT tweets/:id`

This updates text in a tweet by its id.

#### Request body

    {
        "text": "This is updated text."
    }

#### Response

Updated tweet-object is returned.

    {
        "_id": "uniqueIdString",
        "text": "This is updated text.",
        "userId": "uniqueUserIdString",
        "name": "Won Kim",
        "username": "myUsername",
        "url": "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        "comments": [],
        "createdAt": "2021-10-23T18:43:05.885Z",
        "updatedAt": "2021-10-23T19:41:03.515Z",
        "__v": 0,
        "id": "uniqueIdString"
    }

### `DELETE tweets/:id`

This deletes a tweet by id.

### `POST tweets/:id/comments`

This creates a new comment in a selected tweet.

#### Request body

    {
        "text": "This is the first comment!"
    }

#### Response

Updated tweet-object with new comment is returned.

    {
    "_id": "uniqueIdString",
    "text": "This is Won's first tweet!!",
    "userId": "uniqueUserIdString",
    "name": "Won Kim",
    "username": "myUsername",
    "url": "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    "comments": [
        {
            "_id": "uniqueCommentIdString",
            "text": "This is the first comment!",
            "userId": "uniqueUserIdString",
            "username": "myUsername",
            "url": "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "createdAt": "2021-10-23T20:26:34.756Z"
        }
    ],
    "createdAt": "2021-10-23T18:43:05.885Z",
    "updatedAt": "2021-10-23T20:26:34.757Z",
    "__v": 0,
    "id": "uniqueIdString"

}

### `PUT tweets/:id/comments/:commentId`

This updates a comment in a selected tweet.

#### Request body

    {
        "text": "Updated comment's text"
    }

#### Response
 jest
Updated tweet-object with new comment is returned.

    {
    "_id": "uniqueIdString",
    "text": "This is Won's first tweet!!",
    "userId": "uniqueUserIdString",
    "name": "Won Kim",
    "username": "myUsername",
    "url": "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    "comments": [
        {
            "_id": "uniqueCommentIdString",
            "text": "Updated comment's text",
            "userId": "uniqueUserIdString",
            "username": "myUsername",
            "url": "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            "createdAt": "2021-10-23T20:26:34.756Z"
        }
    ],
    "createdAt": "2021-10-23T18:43:05.885Z",
    "updatedAt": "2021-10-23T20:35:59.179Z",
    "__v": 0,
    "id": "uniqueIdString"

}

### `DELETE tweets/:id/comments/:commentId`

This deletes a comment by comment id. Updated tweet-object is returned.

## Features to be done

- Testing with Jest (in progress)
- Conversion from JavaScript to TypeScript
