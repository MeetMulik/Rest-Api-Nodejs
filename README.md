# REST-Api

A simple RESTful API built using Node.js, MongoDB, Express, and JWT for user authentication and post management(CRUD).

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Introduction

A simple RESTful API built using Node.js, MongoDB, Express, and JWT for user authentication and post management(CRUD).

## Features

- User registration (signup)
- User authentication (login)
- User logout
- Password reset functionality
- View & Update user profile
- Create Posts - (Create, Read, Update, Delete) Posts
- Add comments on posts
- Delete comments

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed
- MongoDB server running
- npm or yarn installed

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MeetMulik/Rest-Api-Meet.git
```

2. Install dependencies:

```bash
cd Rest-Api-Meet
npm install
```

3. Set up environment variables:
   Create a .env file in the root of your project and add the following:

```bash
PORT=
MONGO_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Usage

1.To start the server, run the following command:

```bash
npm run dev
```

## API Endpoints

### Swagger Docs

To view the Swagger documentation for the API, navigate to [http://localhost:5000/api-docs/](http://localhost:5000/api-docs/) after starting the application.

All post-related routes are prefixed with `/api/users`.

### 1. Signup

- **Method:** POST
- **Endpoint:** `/signup`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "name": "",
    "username": "",
    "email": "",
    "password": ""
  }
  ```
- **Response:**
  ```json
  {
    "_id": "",
    "name": "",
    "username": "",
    "email": ""
  }
  ```

### 2. Login

- **Method:** POST
- **Endpoint:** `/login`
- **Description:** Logs in an existing user.
- **Request Body:**

```json
{
  "username": "",
  "password": ""
}
```

- **Response:**
  {
  "\_id": "",
  "name": "",
  "username": "",
  "email": ""
  }

### 3. Logout

- **Method:** POST
- **Endpoint:** `/logout`
- **Description:** Logs the user out.

### 4. Forget Password

- **Method:** POST
- **Endpoint:** `/forget-password`
- **Description:** Initiates the password reset process.
- **Request Body:**
  ```json
  {
    "email": ""
  }
  ```
- **Response:**
  (No specific response body; initiates the password reset process and sends an email with instructions)

### 5. Reset Password

- **Method:** POST
- **Endpoint:** `/reset-password`
- **Description:** Resets the user's password.
- **Request Body:**
  ```json
  {
    "password": ""
  }
  ```
- **Response:** (No specific response body; successful password reset)

### 6. Get Profile By Username

- **Method:** GET
- **Endpoint:** `/profile/:username`
- **Description:** Retrieves the profile information of a user by username.

### 6. Update Profile By ID

- **Method:** PATCH
- **Endpoint:** `/profile/:id`
- **Description:** Updates the profile information of a user by ID.
- **Middleware:** `protectRoute`
- **Request Body:**
  ```json
  {
    "username": ""
  }
  //Or any property to changed
  ```

### Post Routes

All post-related routes are prefixed with `/api/posts`.

### 1. Get All Posts

- **Method:** GET
- **Endpoint:** `/`
- **Description:** Retrieves all posts.

### 2. Get Post by ID

- **Method:** GET
- **Endpoint:** `/:postId`
- **Description:** Retrieves a specific post by its ID.

### 3. Get Post by UserID

- **Method:** GET
- **Endpoint:** `/user/:userId`
- **Description:** Retrieves a specific post by its ID.

### 4. Create Post

- **Method:** POST
- **Endpoint:** `/create`
- **Description:** Creates a new post.
- **Middleware:** `protectRoute`
- **Request Body:**

  ```json
  {
    "text": "",
    "postImg": ""
  }
  ```

### 5. Update Post

- **Method:** PATCH
- **Endpoint:** `/update/:postId`
- **Description:** Updates an existing post.
- **Middleware:** `protectRoute`
- **Request Body:**

  ```json
  {
    "title": "",
    "content": ""
  }
  ```

### 6. Delete Post

- **Method:** DELETE
- **Endpoint:** `/:postId`
- **Description:** Deletes a specific post.
- **Middleware:** `protectRoute`

### 7. Add Comment

- **Method:** POST
- **Endpoint:** `/comment/:postId`
- **Description:** Adds a comment to a specific post.
- **Middleware:** `protectRoute`
- **Request Body:**

  ```json
  {
    "comment": ""
  }
  ```

### 7. Delete Comment

- **Method:** DELETE
- **Endpoint:** `/:postId/comment/:commentId`
- **Description:** Deletes a comment associated with a post.
- **Middleware:** `protectRoute`
