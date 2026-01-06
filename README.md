# PrimeSpace - Real Estate Property Management System

[Working prototype](https://primespace.netlify.app/)

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for managing real estate property listings. Built for efficient property management with complete CRUD operations and user authentication.

---

## 📋 Project Overview

**PrimeSpace** is designed to streamline real estate operations by providing:
- **Public Users**: Browse available properties with filtering options
- **Agents/Admins**: Manage property listings through a secure dashboard

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React.js 18 | User Interface & SPA routing |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL database |
| **Authentication** | JWT (JSON Web Token) | Secure user sessions |
| **Styling** | CSS3 (Custom) | Professional premium theme |

---

## 📁 Project Structure

```
PrimeSpace/
├── client/                    # React Frontend
│   ├── public/
│   │   └── index.html         # HTML template with Google Fonts
│   ├── src/
│   │   ├── App.js             # Main component with all pages
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles (premium theme)
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection logic
│   ├── middleware/
│   │   └── auth.js            # JWT verification & role check
│   ├── models/
│   │   ├── User.js            # User schema (username, email, password, role)
│   │   └── Property.js        # Property schema (title, price, location, etc.)
│   ├── routes/
│   │   ├── auth.js            # Login & Register endpoints
│   │   └── properties.js      # CRUD endpoints for properties
│   ├── server.js              # Express app entry point
│   ├── seed.js                # Database seeder with sample data
│   ├── .env                   # Environment variables (MongoDB URI)
│   └── package.json
│
└── README.md                  # This documentation file
```

---

## ✨ Features

### User Authentication
- **Register**: Create new user accounts
- **Login**: JWT-based authentication
- **Role-based Access**: Only admins can access the dashboard

### Property Management (CRUD)
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| **Create** | `POST /api/properties` | Add new property listing |
| **Read** | `GET /api/properties` | Fetch all properties |
| **Read One** | `GET /api/properties/:id` | Fetch single property details |
| **Update** | `PUT /api/properties/:id` | Modify property details |
| **Delete** | `DELETE /api/properties/:id` | Remove property listing |

### Filtering
- Filter by type: **Sale** or **Rent**
- Filter by status: **Available**, **Sold**, **Rented**

---

## 🗃️ Database Schema

### User Collection
```javascript
{
  username: String,      // Unique identifier
  email: String,         // Login credential
  password: String,      // Hashed with bcrypt
  role: String,          // 'admin' or 'user'
  createdAt: Date
}
```

### Property Collection
```javascript
{
  title: String,         // "Luxury Villa in Tilakwadi"
  location: String,      // "Tilakwadi, Belgaum"
  price: Number,         // 5000000 (in rupees)
  description: String,   // Detailed property info
  type: String,          // "Sale" or "Rent"
  status: String,        // "Available", "Sold", "Rented"
  bedrooms: Number,
  bathrooms: Number,
  area: Number,          // Square feet
  image: String,         // URL to property image
  createdBy: ObjectId,   // Reference to User
  createdAt: Date
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas account (already configured)

### Step 1: Clone/Download the Project
```bash
cd PrimeSpace
```

### Step 2: Backend Setup
```bash
cd server
npm install
node seed.js          # Seeds database with sample properties
npm start             # Starts server on port 5000
```

### Step 3: Frontend Setup (New Terminal)
```bash
cd client
npm install
npm start             # Starts React on port 3000
```

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@primespace.com | admin123 |

---

## 🔄 How Data Flows (For Viva)

### When a User Views Properties:
```
React (useEffect) → axios.get('/api/properties') → Express Router → Mongoose.find() → MongoDB → Response → React State → UI Render
```

### When Admin Adds a Property:
```
Form Submit → axios.post('/api/properties', data, token) → Express validates JWT → Mongoose.create() → MongoDB saves document → 201 Response → React updates state
```

---

## 📡 API Endpoints Reference

### Authentication
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{username, email, password}` | Register user |
| POST | `/api/auth/login` | `{email, password}` | Login, returns JWT |
| GET | `/api/auth/me` | - | Get current user (protected) |

### Properties
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/properties` | Public | Get all properties |
| GET | `/api/properties/:id` | Public | Get single property |
| POST | `/api/properties` | Admin | Create property |
| PUT | `/api/properties/:id` | Admin | Update property |
| DELETE | `/api/properties/:id` | Admin | Delete property |

---

## 🎨 Design Decisions

### Color Palette
- **Primary**: `#1a2530` (Dark Slate) - Navbar, Footer
- **Secondary**: `#c5a059` (Gold) - Buttons, Accents
- **Background**: `#f8f9fa` (Off-white) - Easy on eyes
- **Text**: `#333333` (Charcoal) - Better than pure black

### Fonts
- **Headers**: Playfair Display (Serif) - Premium look
- **Body**: Lato (Sans-serif) - Clean and readable

---

## ❓ Viva Questions & Answers

### Q1: How does your application connect to MongoDB?
**Answer**: We use the `mongoose` library in our Node.js backend. The connection string is stored in a `.env` file for security. When the server starts, `mongoose.connect()` establishes a connection to MongoDB Atlas.

### Q2: Explain the data flow when adding a new property.
**Answer**: When the admin submits the form, React sends a POST request via `axios` to our Express server. The server validates the JWT token in the `Authorization` header, then uses Mongoose to create a new document in the `properties` collection. A 201 status is returned on success.

### Q3: What is the purpose of JWT?
**Answer**: JWT (JSON Web Token) is used for stateless authentication. After login, the server generates a token containing the user's ID. This token is sent with every protected request to verify the user's identity without querying the database.

### Q4: Why MongoDB over SQL?
**Answer**: Real estate listings can have varying attributes (some properties have gardens, others have parking). MongoDB's document model allows flexible schemas, making it ideal for this use case.

### Q5: How do you protect admin routes?
**Answer**: We use middleware (`auth.js`). The `protect` middleware verifies the JWT token. The `adminOnly` middleware checks if `req.user.role === 'admin'`. Only then is access granted.

### Q6: What React hooks are used?
**Answer**: 
- `useState` - Managing component state (form data, properties list)
- `useEffect` - Fetching data on component mount
- `useContext` - Sharing authentication state across components
- `useNavigate` - Programmatic navigation
- `useParams` - Reading URL parameters

### Q7: How are passwords stored?
**Answer**: Passwords are hashed using `bcryptjs` before saving to the database. During login, `bcrypt.compare()` verifies the entered password against the stored hash.

---

## 👥 Team Members

- Reesha Koli
- Sushil C
- Ankit Raj
- Shreyas Savant
- Sejal Halgekar
- Shruti Jadhav
- Akshata Kulkarni

---

## 📝 License

This project was developed for academic purposes as part of a Web Development course.

---

**PrimeSpace** © 2024 | Real Estate Made Simple
