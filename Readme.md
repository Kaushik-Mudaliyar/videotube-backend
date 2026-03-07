# 🎬 Video Platform Backend API - videotube

A scalable backend API for a video sharing platform similar to YouTube.
This project provides features such as authentication, video uploads, comments, likes,tweets, subscriptions, playlists, and channel dashboards.This project is part of my backend development learning journey.

The backend is built with **Node.js, Express, and MongoDB** and follows a modular architecture for maintainability and scalability.

---

# 🚀 Features

## 🔐 Authentication

- Register User
- Login / Logout
- JWT based authentication
- Refresh tokens
- Get current user profile
- Get user channel profile

---

## 📹 Video Management

- Upload video
- Update video details
- Delete video
- Get video by ID
- Get all videos with pagination
- Track video views
- Publish / unpublish videos

---

## 💬 Comments

- Add comment on video
- Update comment
- Delete comment
- Get video comments with pagination

---

## 👍 Likes

- Toggle like on videos
- Toggle like on comments
- Toggle like on tweets
- Get liked videos of a user

---

## 📺 Subscriptions

- Subscribe to a channel
- Unsubscribe from a channel
- Get channel subscribers
- Get subscribed channels

---

## 📂 Playlist

- Create playlist
- Update playlist
- Delete playlist
- Add video to playlist
- Remove video from playlist
- Get user playlists
- Get playlist by Id

---

## 🐦 Tweets

- Create tweet
- Update tweet
- Delete tweet
- Get user tweets

## 📊 Dashboard

- Get channel statistics
- Get all videos uploaded by channel

Statistics include:

- Total videos
- Total video views
- Total subscribers
- Total likes

---

## ⚙️ Utilities

- Health check endpoint
- Global error handler
- API response handler
- Pagination
- MongoDB aggregation pipelines
- cloudinary

---

# 🛠 Tech Stack

Backend technologies used in this project:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (File uploads)
- Cloudinary (Media storage)

---

# 📂 Project Structure

```
src
│
├── controllers
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   └── dashboard.controller.js
│   └── tweet.controller.js
│   └── healthcheck.controller.js
│
├── models
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   └── tweet.model.js
│
├── routes
|
│
├── middlewares
│   └── auth.middleware.js
│   └── multer.middleware.js
│
├── utils
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── asyncHandler.js
│   └── cloudinary.js
│
├── db
│
└── constants
```

---

# 📊 Database Schema

The following diagram represents the relationships between the main models such as users, videos, comments, likes, tweets, playlists, and subscriptions.

🔗 **View Full Database Diagram**

```
https://app.eraser.io/workspace/OT9Z8A56moLIWipHK6sw
```

---

# ⚙️ Installation

Clone the repository

```
git clone https://github.com/Kaushik-Mudaliyar/videotube-backend.git
```

Navigate to the project folder

```
cd videobackend
```

Install dependencies

```
npm install
```

Create a `.env` file in the root directory.

Start the development server

```
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file and add the following variables.

```
PORT=

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| POST   | /users/register           | Register user            |
| POST   | /users/login              | Login user               |
| POST   | /users/logout             | Logout user              |
| POST   | /users/refresh-token      | Refresh Access Token     |
| POST   | /users/change-password    | Change Password          |
| PATCH  | /users/update-account     | Update Account Details   |
| PATCH  | /users/update-avatar      | Update User Avatar       |
| PATCH  | /users/update-cover-image | Update User Cover Image  |
| GET    | /users/current-user       | Get current user         |
| GET    | /users/c/:username        | Get User Channel Profile |
| GET    | /users/history            | Get Watch History        |

---

## Videos

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| POST   | /videos                         | Upload video          |
| GET    | /videos                         | Get all videos        |
| GET    | /videos/:videoId                | Get video by id       |
| PATCH  | /videos/:videoId                | Update video          |
| PATCH  | /videos/toggle/publish/:videoId | Toggle publish status |
| DELETE | /videos/:videoId                | Delete video          |

---

## Comments

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| POST   | /comments/:videoId     | Add comment        |
| GET    | /comments/:videoId     | Get video comments |
| PATCH  | /comments/c/:commentId | Update comment     |
| DELETE | /comments/c/:commentId | Delete comment     |

---

## Tweet

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| POST   | /tweet              | Create tweet    |
| GET    | /tweet/user/:userId | Get User Tweets |
| PATCH  | /tweet/:tweetId     | Update tweet    |
| DELETE | /tweet/:tweetId     | Delete tweet    |

---

## Likes

| Method | Endpoint                         | Description         |
| ------ | -------------------------------- | ------------------- |
| POST   | /likes/toggle/video/:videoId     | Toggle video like   |
| POST   | /likes/toggle/comment/:commentId | Toggle comment like |
| POST   | /likes/toggle/tweet/:tweetId     | Toggle tweet like   |
| GET    | /likes/videos                    | Get liked videos    |

---

## Playlists

| Method | Endpoint                              | Description                |
| ------ | ------------------------------------- | -------------------------- |
| POST   | /playlist                             | Create playlist            |
| GET    | /playlist/user/:userId                | Get user playlists         |
| GET    | /playlist/:playlistId                 | Get playlist by id         |
| GET    | /playlist/user/:userId                | Get User playlist          |
| PATCH  | /playlist/:playlistId                 | Update playlist            |
| PATCH  | /playlist/add/:videoId/:playlistId    | Add video to playlist      |
| PATCH  | /playlist/remove/:videoId/:playlistId | Remove video from playlist |
| DELETE | /playlist/:playlistId                 | Delete playlist            |

---

## Subscriptions

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| POST   | /subscriptions/c/:channelId    | Toggle subscription     |
| GET    | /subscriptions/c/:channelId    | Get channel subscribers |
| GET    | /subscriptions/u/:subscriberId | Get subscribed channels |

---

## Dashboard

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| GET    | /dashboard/stats  | Get channel statistics |
| GET    | /dashboard/videos | Get channel videos     |

---

# 🧪 API Testing

All API endpoints were tested using Postman.

---

## Acknowledgements

This project was developed while learning Backend Development through the youtube channel **Chai aur Code**.  
The implementation and assignments were completed independently as part of my practice and learning.

---

# 👨‍💻 Author

**Kaushik Mudaliyar**

Backend Developer | MERN Stack

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
