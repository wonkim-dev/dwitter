# Dwitter

Diwitter is a backend project that provides APIs for social media application. The project was motivated by Twitter and developed as a simple version of it. 

## Technologies

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
    └── app.js

## APIs

### `POST auth/signup`
This will create a new user account.
### `POST auth/login/`

### `POST auth/logout/`

### `GET auth/csrf-token/`
This will request a CSRF token.
### `GET auth/me/`


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
