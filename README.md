# Event Management API

A comprehensive REST API for managing events and user registrations built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Event Management**: Create, view, and manage events with capacity limits
- **User Registration**: Register users for events with duplicate and capacity validation
- **Smart Filtering**: List upcoming events with custom sorting
- **Real-time Stats**: Get event statistics and capacity information
- **Robust Validation**: Manual input validation and error handling
- **MongoDB Integration**: Efficient data storage with proper indexing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation & Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd event-management-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:5002/event_management
NODE_ENV=development
```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:

```bash
# For macOS with Homebrew
brew services start mongodb/brew/mongodb-community

# For Ubuntu/Debian
sudo systemctl start mongod

# For Windows
net start MongoDB
```

5. **Initialize Database**

```bash
npm run setup
```

6. **Start the server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5002`

## 📚 API Documentation

### Base URL

```
http://localhost:5002/api
```

### Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

---

## 🎯 Events Endpoints

### 1. Create Event

**POST** `/events`

Creates a new event with the specified details.

**Request Body:**

```json
{
  "title": "Tech Conference 2024",
  "date_time": "2024-08-15T10:00:00.000Z",
  "location": "San Francisco",
  "capacity": 100
}
```

**Success Response (201):**

```json
{
  "message": "Event created successfully",
  "event_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "event": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Tech Conference 2024",
    "date_time": "2024-08-15T10:00:00.000Z",
    "location": "San Francisco",
    "capacity": 100,
    "registrations": []
  }
}
```

**Validation Rules:**

- `title`: Required, 1-255 characters
- `date_time`: Required, ISO 8601 format
- `location`: Required, 1-255 characters
- `capacity`: Required, integer between 1-1000

---

### 2. Get Event Details

**GET** `/events/{id}`

Retrieves detailed information about a specific event including registered users.

**Success Response (200):**

```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "title": "Tech Conference 2024",
  "date_time": "2024-08-15T10:00:00.000Z",
  "location": "San Francisco",
  "capacity": 100,
  "registrations": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "remaining_capacity": 99,
  "capacity_percentage": "1.00"
}
```

---

### 3. Register for Event

**POST** `/events/{id}/register`

Registers a user for a specific event.

**Request Body:**

```json
{
  "user_id": "60f7b3b3b3b3b3b3b3b3b3b4"
}
```

**Success Response (200):**

```json
{
  "message": "Registration successful",
  "event_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "user_id": "60f7b3b3b3b3b3b3b3b3b3b4",
  "remaining_capacity": 99
}
```

**Business Rules:**

- Cannot register for past events
- Cannot register if event is full
- Cannot register the same user twice
- User must exist in the database

---

### 4. Cancel Registration

**DELETE** `/events/{id}/register`

Cancels a user's registration for an event.

**Request Body:**

```json
{
  "user_id": "60f7b3b3b3b3b3b3b3b3b3b4"
}
```

**Success Response (200):**

```json
{
  "message": "Registration cancelled successfully",
  "event_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "user_id": "60f7b3b3b3b3b3b3b3b3b3b4",
  "remaining_capacity": 100
}
```

---

### 5. List Upcoming Events

**GET** `/events`

Returns all future events with custom sorting.

**Success Response (200):**

```json
{
  "count": 2,
  "events": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Tech Conference 2024",
      "date_time": "2024-08-15T10:00:00.000Z",
      "location": "San Francisco",
      "capacity": 100,
      "total_registrations": 1,
      "remaining_capacity": 99,
      "capacity_percentage": "1.00"
    }
  ]
}
```

**Sorting Logic:**

1. First by date (ascending)
2. Then by location (alphabetically)

---

### 6. Event Statistics

**GET** `/events/{id}/stats`

Returns statistical information about an event.

**Success Response (200):**

```json
{
  "event_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "title": "Tech Conference 2024",
  "total_registrations": 1,
  "remaining_capacity": 99,
  "capacity_percentage": 1.0
}
```

---

## 👥 Users Endpoints

### 1. Create User

**POST** `/users`

Creates a new user in the system.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Success Response (201):**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b4",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 2. Get User Details

**GET** `/users/{id}`

Retrieves information about a specific user.

**Success Response (200):**

```json
{
  "id": "60f7b3b3b3b3b3b3b3b3b3b4",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 3. List All Users

**GET** `/users`

Returns all users in the system.

**Success Response (200):**

```json
{
  "count": 1,
  "users": [
    {
      "id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

## 🔧 Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload
- `npm run setup` - Initialize database and create sample data

### Environment Variables

| Variable      | Description               | Default                                    |
| ------------- | ------------------------- | ------------------------------------------ |
| `PORT`        | Server port               | 5002                                       |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/event_management |
| `NODE_ENV`    | Environment mode          | development                                |

---

## 🚀 Features Implemented

✅ **Core Requirements:**

- Event CRUD operations
- User registration/cancellation
- Capacity management
- Past event validation
- Duplicate registration prevention

✅ **Advanced Features:**

- Custom sorting algorithm
- Real-time statistics
- Comprehensive error handling
- Input validation
- MongoDB indexing for performance

✅ **Business Logic:**

- Prevent double registrations
- Capacity enforcement
- Past event restrictions
- Proper HTTP status codes

---
