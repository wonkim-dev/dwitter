# Dwitter

Diwitter is a backend project that provides APIs for social media application. The project was motivated by Twitter and developed as a simple version of it. 

## Technology Stacks

* Node.js - JavaScript runtime environment 
* Express.js - Node.js framework for backend application
* MongoDB - NoSQL database for data storage
* Mongoose - ODM for MongoDB

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
    |      ├── csrf.js          # validates CSRF token for non-reading reguests
    |      ├── rate-limiter.js  # applies express-rate-limit
    |      └── validator.js     # checks the results of express-validator for user input
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

#### XSS attack prevention

To avoid cross-site scripting attack, JWT issued by server is not stored in local storage of browsers, but is set as cookie with http-only option instead. Cookie with http-only option enables the token accessible and controllable by browser only, and other JavaScript file cannot access this token.

#### CSRF attack prevention

#### Rate limiter

## APIs

### `POST auth/signup`
This will create a new user account.
#### Resquest
    {
        "username" : "username",
        "password" : "myPersonalPassword",
        "name" : "Mike",
        "email" : "mike@myemail.com",
        "url" : "https://images.pexels.com/photos/668435/pexels-photo-668435.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }
#### Response
    {
        id: myId
    }

### `POST auth/login/`
This will request user log-in.

### `POST auth/logout/`
This will request user log-out.

### `GET auth/csrf-token/`
This will request a CSRF token.

### `GET auth/me/`
This will request a user with JWT.

### `GET tweets/`
This will get the recent 20 tweets.

### `GET tweets/:id`
This will get a tweet by id.

### `POST tweets/`
This will create a new tweet.

### `PUT tweets/:id`
This will update a tweet by id.

### `DELETE tweets/:id`
This will delete a tweet by id.

### `POST tweets/:id/comments`
This will create a new comment in a selected tweet.

### `PUT tweets/:id/comments/:commentId`
This will update a commnet in a selected tweet.

### `DELETE tweets/:id/comments/:commentId`
This will delete a comment by comment id.
