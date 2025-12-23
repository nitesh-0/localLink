# LocalLink

LocalLink is a full-stack marketplace and real-time communication platform that connects users with local businesses.  
It allows users to discover shops based on category and location, interact with products, and communicate with businesses through a secure, real-time chat system with notifications — similar to modern messaging apps.

---

##  Key Features

###  Authentication & Authorization
- User and Business registration
- Email verification during signup (OTP / verification code sent via email)
- Secure login using JWT authentication
- Role-based access (USER / BUSINESS)
- Protected routes on both frontend and backend

---

###  User Features
- Browse products from local businesses
- Search businesses by:
  - Category (e.g., restaurant, electronics, etc.)
  - Location
- View business profiles and product listings
- Initiate chat with businesses
- Upload and update profile picture
- Real-time messaging with unread message notifications

---

###  Business Features
- Business account registration with verification
- Create, update, and manage product listings
- Upload product images
- Receive messages from users in real time
- View active conversations with users
- Unread message notifications per conversation

---

###  Image Upload & Storage
- User profile images and product images supported
- Images are uploaded via backend to **Cloudinary**
- Only secure image URLs are stored in the database
- No direct client-side upload to Cloudinary (security ensured)

---

###  Real-Time Chat System
- One-to-one chat between user and business
- Conversations automatically created and reused
- Messages stored persistently in the database
- Real-time delivery using **Socket.IO**
- Conversation-based rooms for efficient message broadcasting
- Authenticated socket connections using JWT
- Real-time unread message count
- Global notification badge on chat icon (like WhatsApp)
- Per-conversation unread badge in chat list

---

##  Security Highlights
- JWT-based authentication for REST APIs and sockets
- Socket.IO middleware authentication
- Secure image uploads via backend only
- Role-based access control
- Environment variable protection

---

###  State Management
- Global state handled using **Recoil**
- Notification counts synced across pages
- Clean separation of UI state and server state

---

##  Tech Stack

### Frontend
- React (with TypeScript)
- React Router DOM
- Recoil (global state management)
- Tailwind CSS
- Axios
- Socket.IO Client

---

### Backend
- Node.js
- Express.js
- TypeScript
- Socket.IO
- Prisma ORM
- PostgreSQL
- JWT (JSON Web Tokens)
- Cloudinary (image hosting)
- Nodemailer (email verification)

---