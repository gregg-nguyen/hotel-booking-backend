# Hotel Booking Backend

## Overview

Hotel Booking Backend is a REST API for managing hotels, rooms, and bookings.

The project was built as part of a backend engineering transition journey using Node.js, TypeScript, Express, and PostgreSQL. The system allows users to view hotels and rooms, create bookings, update bookings, and prevent conflicting reservations through business-rule validation.

---

## Tech Stack

### Backend

* Node.js
* TypeScript
* Express

### Database

* PostgreSQL
* pg Pool

### Tools

* Thunder Client
* Git
* GitHub

---

## Features

### Hotel Management

* View all hotels
* View hotel details by ID
* Search hotels by city

### Room Management

* View all rooms
* View rooms belonging to a specific hotel

### Booking Management

* Create bookings
* Update bookings
* Delete bookings
* View all bookings
* View booking details

### Booking Validation

The API validates that:

* Required fields are provided
* The selected hotel exists
* The selected room exists
* The room belongs to the selected hotel
* Check-out date is after check-in date
* Booking dates do not overlap existing reservations

### Automatic Calculations

The system automatically calculates:

* Number of nights
* Total booking price

---

## Database Schema

### hotels

| Column | Type    |
| ------ | ------- |
| id     | integer |
| name   | text    |
| city   | text    |

### rooms

| Column   | Type    |
| -------- | ------- |
| id       | integer |
| hotel_id | integer |
| type     | text    |
| price    | numeric |

### bookings

| Column         | Type    |
| -------------- | ------- |
| id             | integer |
| hotel_id       | integer |
| room_id        | integer |
| guest_name     | text    |
| check_in_date  | date    |
| check_out_date | date    |
| nights         | integer |
| total_price    | numeric |

---

## API Endpoints

### Hotels

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | /                  |
| GET    | /hotels            |
| GET    | /hotels/:id        |
| GET    | /hotels/city/:city |
| GET    | /rooms             |
| GET    | /hotels/:id/rooms  |

### Bookings

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /bookings     |
| GET    | /bookings/:id |
| POST   | /bookings     |
| PATCH  | /bookings/:id |
| DELETE | /bookings/:id |

---

## Example Booking Request

POST /bookings

```json
{
  "hotelId": 1,
  "roomId": 2,
  "guestName": "Huy Nguyen",
  "checkInDate": "2026-06-10",
  "checkOutDate": "2026-06-13"
}
```

---

## Business Logic

### Prevent Overlapping Bookings

A room cannot be booked for dates that overlap with an existing reservation.

Example:

Existing booking:

* June 10 → June 15

Rejected bookings:

* June 12 → June 18
* June 08 → June 11
* June 10 → June 15

Accepted bookings:

* June 01 → June 09
* June 15 → June 20

---

### Automatic Price Calculation

The API calculates:

```text
nights = checkOutDate - checkInDate

totalPrice = roomPrice × nights
```

This prevents clients from sending incorrect pricing information.

---

## Project Structure

```text
src/
│
├── server.ts
│
├── db/
│   └── db.ts
│
├── routes/
│   ├── hotelRoutes.ts
│   └── bookingRoutes.ts
│
└── helpers/
```

---

## Running Locally

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
npx ts-node src/server.ts
```

Server runs on:

```text
http://localhost:3000
```

---

## Future Improvements

Planned enhancements:

* Centralized error handling middleware
* Request validation library
* Room availability endpoint
* Authentication and authorization
* Automated testing with Jest
* CI/CD using GitHub Actions
* Cloud deployment
* Service and controller layers

---

## Learning Goals

This project focuses on understanding backend engineering concepts rather than memorizing framework syntax.

Key areas practiced:

* REST API design
* Database relationships
* Business-rule validation
* CRUD operations
* Route organization
* PostgreSQL integration
* Git workflow
* Backend architecture fundamentals
