# Dwitter

Diwitter is a backend project that provides APIs for social media application. The project was motivated by Twitter and developed as a simple version of it. 

## Technologies

* Node.js - JavaScript runtime environment 
* Express.js - Node.js framework for backend application
* MongoDB - NoSQL database for data storage
* Mongoose - ODM for MongoDB

## Folder Structure

    root
    ├── router
    |      ├── auth.js
    |      └── tweets.js
    |
    ├── controller
    |      ├── auth.js
    |      └── tweets.js
    |
    ├── data
    |      ├── auth.js
    |      └── tweets.js
    |
    ├── database
    |      └── database.js
    |
    ├── middleware  
    |      ├── auth.js
    |      ├── csrf.js
    |      ├── rate-limiter.js
    |      └── validator.js
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
