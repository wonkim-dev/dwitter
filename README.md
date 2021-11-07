# Dwitter

Dwitter is a backend project that provides APIs for social media application. The project was motivated by Twitter and developed as a simple version of it.

## Technology Stacks

- Node.js - JavaScript runtime environment
- Express.js - Node.js framework for backend application
- MongoDB - NoSQL database for data storage
- Mongoose - ODM for MongoDB
- Jest - Testing framework for Node.js

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
    ├── tests                   # contains test files
    |      ├── fixtures
    |      |       └── db.js    # fixture that is called before each test to setup the db at same status
    |      ├── tweets.test.js   # tests tweets router
    |      └── auth.test.js     # tests auth router
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

#### Automated API testing

Jest framework was used to automate API testing. All end points were tested against HTTP status code and corresponding response payload in positive and negative cases.

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

This gets a tweet by its id.

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

## Overview of API Testing

### auth.test.js

    PASS  tests/auth.test.js (14.878 s)
    GET /auth/csrf-token
        √ Should get CSRF Token (967 ms)
    GET /auth/me
        Request with valid credentials
        √ Should get me successfully (browser clients) (494 ms)
        √ Should get me successfully (non-browser clients) (453 ms)
        Request with invalid credentials
        √ Should fail to get me with invalid JWT token (browser clients) (405 ms)
        √ Should fail to get me with invalid JWT token (non-browser clients) (427 ms)
        √ Should fail to get me with missing token field in request header (401 ms)
    POST /auth/signup
        Request with valid credentials
        √ Should create a user successfully (856 ms)
        Request with invalid info
        √ Should fail to create a user with empty username (414 ms)
        √ Should fail to create a user with empty password (415 ms)
        √ Should fail to create a user with empty name (423 ms)
        √ Should fail to create a user with empty email (422 ms)
        √ Should fail to create a user with existing username (456 ms)
    POST /auth/login
        Request with valid credentials
        √ Should log in successfully (785 ms)
        Request with invalid info
        √ Should fail to login with non-existing username (462 ms)
        √ Should fail to login with wrong password (760 ms)
        √ Should fail to login without dwitter-csrf-token field in request header (558 ms)
        √ Should fail to login with invalid CSRF token (444 ms)
    POST /auth/logout
        √ should logout successfully (420 ms)
        √ should fail to logout without dwitter-csrf-token field in request header (434 ms)
        √ should fail to logout with invalid CSRF token (416 ms)

    Test Suites: 1 passed, 1 total
    Tests: 20 passed, 20 total
    Snapshots: 0 total
    Time: 15.177 s, estimated 17 s

### tweets.test.js

    PASS  tests/tweet.test.js (51.491 s)
    GET /tweets
        Request with valid credentials
        √ Should get the recent 20 tweets successfully (browser clients) (1702 ms)
        √ Should get the recent 20 tweets successfully (non-browser clients) (1137 ms)
        Request with invalid info
        √ Should fail to get the recent 20 tweets with invalid JWT token (browser clients) (1062 ms)
        √ Should fail to get the recent 20 tweets with invalid JWT token (non-browser clients) (1003 ms)  POST /tweets
        Request with valid credentials
        √ Should create a new tweet successfully (browser clients) (1206 ms)
        √ Should create a new tweet successfully (non-browser clients) (1117 ms)
        Request with invalid info
        √ Should fail to create a new tweet with invalid JWT token (browser clients) (1018 ms)
        √ Should fail to create a new tweet with invalid JWT token (non-browser clients) (1003 ms)
        √ Should fail to create a new tweet with invalid CSRF token (browser clients) (1074 ms)
        √ Should fail to create a new tweet with invalid CSRF token (non-browser clients) (1027 ms)
        √ Should fail to create a new tweet with empty text (browser clients) (1040 ms)
    GET /tweets/:id
        Request with valid credentials
        √ Should get a tweet by tweet id (browser clients) (1048 ms)
        √ Should get a tweet by tweet id (non-browser clients) (1077 ms)
        Request with invalid info
        √ Should fail to get a tweet with invalid tweet id (browser clients) (1032 ms)
        √ Should fail to get a tweet with invalid tweet id (non-browser clients) (1008 ms)
    PUT /tweets/:id
        Request with valid credentials
        √ Should update a tweet by tweet id (browser clients) (1187 ms)
        √ Should update a tweet by tweet id (non-browser clients) (1151 ms)
        Request with invalid info
        √ Should fail to update a tweet with JWT token of other users (browser clients) (1057 ms)
        √ Should fail to update a tweet with JWT token of other users (non-browser clients) (1066 ms)
        √ Should fail to update a tweet with invalid tweet id (browser clients) (1064 ms)
    DELETE /tweets/:id
        Request with valid credentials
        √ Should delete a tweet by tweet id (browser clients) (1095 ms)
        √ Should delete a tweet by tweet id (non-browser clients) (1115 ms)
        Request with invalid info
        √ Should fail to delete a tweet with JWT token of other users (browser clients) (1103 ms)
        √ Should fail to delete a tweet with JWT token of other users (non-browser clients) (1087 ms)
        √ Should fail to delete a tweet with invalid tweet id (browser clients) (1054 ms)
    POST tweets/:id/comments
        Request with valid credentials
        √ Should create a new comment (browser clients) (1145 ms)
        √ Should create a new comment (non-browser clients) (1148 ms)
        Request with invalid info
        √ Should fail to create a new comment with invalid JWT token (1013 ms)
        √ Should fail to create a new comment with invalid tweet id (1056 ms)
        √ Should fail to create a new comment with empty comment text (1032 ms)
    PUT tweets/:id/comments/:commentId
        Request with valid credentials
        √ Should update an existing comment (browser clients) (1098 ms)
        Request with invalid info
        √ Should fail to update an existing comment with invalid JWT token (1021 ms)
        √ Should fail to update an existing comment with invalid tweet id (1023 ms)
        √ Should fail to update an existing comment with invalid comment id (1051 ms)
        √ Should fail to update an existing comment with JWT token of other users (1075 ms)
    DELETE tweets/:id/comments/:commentId
        Request with valid credentials
        √ Should delete a comment (browser clients) (1133 ms)
        √ Should delete a comment (non-browser clients) (1085 ms)
        Request with invalid info
        √ Should fail to delete an existing comment with invalid JWT token (987 ms)
        √ Should fail to delete an existing comment with invalid tweet id (1034 ms)
        √ Should fail to delete an existing comment with invalid comment id (1071 ms)
        √ Should fail to delete an existing comment with JWT token of other users (1041 ms)

    Test Suites: 1 passed, 1 total
    Tests:       41 passed, 41 total
    Snapshots:   0 total
    Time:        51.922 s

## Features to be done

- Add endpoint to delete user account
- Query optimization using Redis
- Uploading profile image instead of using url
- Conversion from JavaScript to TypeScript
