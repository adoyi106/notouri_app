# Notouri App

Notouri App is a Node.js, Express, and MongoDB project that demonstrates a robust RESTful API for a tours and reviews platform. It features user authentication, authorization, data validation, security best practices, and a modular MVC architecture.

## Features

- RESTful API for managing tours, users, and reviews
- User authentication & authorization (JWT-based)
- Role-based access control for admin and guide users
- Data validation & sanitization to prevent NoSQL injection and XSS
- Rate limiting and HTTP security headers
- Custom error handling for development and production
- Pug template engine for server-side rendered views
- Modular code structure for scalability and maintainability

## Project Structure

```
.
├── app.js                # Main Express app setup
├── server.js             # App entry point
├── config.env            # Environment variables
├── controllers/          # Route controllers (business logic)
│   ├── authController.js
│   ├── errorController.js
│   ├── handlerFactory.js
│   ├── reviewController.js
│   ├── tourController.js
│   ├── userController.js
│   └── viewController.js
├── dev-data/             # Sample data and templates
├── models/               # Mongoose models
│   ├── reviewModel.js
│   ├── tourModel.js
│   └── userModel.js
├── public/               # Static assets (CSS, images, HTML)
├── routes/               # Express routers
│   ├── reviewRouter.js
│   ├── tourRouter.js
│   ├── userRouter.js
│   └── viewRouter.js
├── utils/                # Utility modules (error, email, etc.)
├── views/                # Pug templates
├── package.json
└── .env, .eslintrc.json, .prettierrc, etc.
```

## API Endpoints

- `/api/v1/tours` – CRUD operations for tours
- `/api/v1/users` – User management and authentication
- `/api/v1/reviews` – Reviews for tours (nested routes supported)
- `/` – Server-rendered views (Pug)

## Security

- **Helmet** for HTTP headers
- **express-mongo-sanitize** and **xss-clean** for input sanitization
- **Rate limiting** to prevent brute-force attacks
- **HPP** to prevent HTTP parameter pollution

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/notouri_app.git
   cd notouri_app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `config.env` and update with your MongoDB URI, JWT secret, etc.

4. **Run the app:**
   ```sh
   npm start
   ```
   - For production: `npm run start:prod`

5. **Visit:**  
   - API: `http://localhost:3000/api/v1/tours`
   - Views: `http://localhost:3000/`

## License

This project is for learning purposes.

---

**Author:**  
Adoyi Owoicho
