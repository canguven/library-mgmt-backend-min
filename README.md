# library-mgmt-backend-min
Library Management System API: A RESTful API for managing library books, users, and borrowing operations. This application is built with Node.js, Express, and PostgreSQL using the Sequelize ORM.

## Project Scope and Constraints

Within the constraints of 48 hours for this exercise, the back-end design is kept monolithic, horizontal scaling (possibility of extending the app to support multiple libraries across the country for example), is not considered.
This also would reflect on the database schema design, which is kept very simple for this exercise.
Additionally, some deprecated libraries with vulnerabilities need to be addressed, suitable versions of considered libraries or alternative libraries can be selected to remedy this issue.

Tried to accommodate best practices as much as possible within reason. Some include:
- Proper middleware ordering
- Health check endpoint
- Security and rate limiting middleware to prevent abuse of the API
- Undefined route 404 handling
- Process-level error handling
- Configuration and environment best practices
- Basic graceful shutdown handling

Logging is kept localized, however elastic cluster logging is easily possible:
https://www.elastic.co/guide/en/ecs-logging/nodejs/current/morgan.html
just not integrated to this project.

All in all, more can be done, but these are the first glance design choices I have taken to implement the library management app, given the technical requirements and time constraints.

## Features

- User management (creation, listing, details)
- Book management (creation, listing, details with ratings)
- Book borrowing and returning functionality
- Rating system for books
- Environment-specific configuration
- Security headers and rate limiting
- Comprehensive error handling
- Structured logging
- Webpack bundling for development and production
- Lazy loading for better performance

Note: Update and Delete operations for entities not included due to stated functional requirements


## Architecture

This application follows a modern Node.js backend architecture with:

- **MVC pattern**: Models, Controllers, and Routes separation
- **Middleware-based processing**: Request logging, validation, error handling, security, rate limiting
- **ORM for database interactions**: Sequelize for PostgreSQL
- **Configuration Management**: Environment-specific settings with dotenv
- **Structured Logging**: Using Winston for comprehensive logging
- **Error Handling**: Custom error classes and middleware
- **Security**: Helmet for HTTP headers, XSS protection, and rate limiting
- **Webpack-based bundling**: Both development and production configurations
- **Lazy loading**: Support for code splitting and dynamic imports

## Key Assumptions for Test Cases

- Book with ID 2 ("I, Robot") returns an average user score of 5.33, which means multiple users have given scores.
- To accommodate this and still keep test cases succeeding, there is a borrow history of book 2 for users 1 and 3, who have returned book 2 with scores of 5 and 6 respectively. This is reflected in the database schema.
- The database seeding is done through the `dbschema.sql` file which contains the DDL script.

## Technologies Used

- **Node.js & Express**: Backend API framework
- **PostgreSQL**: Database
- **Sequelize**: ORM for database operations
- **Joi**: Request validation
- **Webpack**: Module bundling, code splitting, and optimization
- **Winston**: Logging
- **Lodash**: Utility functions
- **Helmet**: Security headers
- **Express Rate Limit**: API rate limiting
- **Babel**: JavaScript transpilation
- **ESLint**: Code quality and style consistency

## Installation Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher, tested with v17)
- npm (v6 or higher)

### Setup Steps

The repo is on GitHub but is private, as I thought it would respect Invent.ai's privacy of coding test case.

With that being said, I will give access to any GitHub user from Invent if requested. Alternatively, the uploaded zip file contains everything necessary.

1. **Clone the repository**
   ```bash
   git clone git@github.com:canguven/library-mgmt-backend-min.git

   cd library-mgmt-backend-min
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   The project uses environment-specific configurations. You can set up:
   - `.env` - Default fallback
   - `.env.development` - Development environment settings
   - `.env.production` - Production environment settings

   Example environment variables:
   ```
   # Server
   NODE_ENV=development
   PORT=3000

   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=library_db
   DB_USER=postgres
   DB_PASSWORD=postgres

   # Logging
   LOG_LEVEL=debug

   # CORS
   CORS_ORIGINS=http://localhost:3000,http://localhost:8080

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=500
   ```

4. **Create the PostgreSQL database**
   ```sql
   CREATE DATABASE library_db;
   ```

5. **Initialize the database with schema and seed data**
   ```bash
   psql -U postgres -d library_db -f dbschema.sql
   ```

6. **Run the application**

  - **Development Mode**
    ```bash
    # Build the app for development
    npm run build:dev

    # Start the app with the development build
    npm start or npm run dev
       
    # Or, For development build and run
    npm run start:dev
    ```

  - **Production Mode**
    ```bash
    # Build the app for production
    npm run build:prod

    # Start the app with the production build
    npm start

    # Or, For production build and run:
    npm run start:prod
    ```

## API Endpoints

- **Users**
  - `GET /users` - List all users
  - `GET /users/:id` - Get user details with borrow history
  - `POST /users` - Create a new user

- **Books**
  - `GET /books` - List all books
  - `GET /books/:id` - Get book details with average rating
  - `POST /books` - Create a new book

- **Borrowing**
  - `POST /users/:userId/borrow/:bookId` - Borrow a book
  - `POST /users/:userId/return/:bookId` - Return a book with rating

- **System**
  - `GET /health` - API health check

## Testing Instructions

### Running the Automated Tests

1. **Install Newman globally**
   ```bash
   npm install -g newman
   ```

2. **Run the Postman collection tests**
   ```bash
   newman run "Library Case API Collection.postman_collection.json"
   ```

### Manual Testing

You can also import the `Library Case API Collection.postman_collection.json` file into Postman and run the tests manually.

## Project Structure

```
/library-api
  /config
    database.js    - Database connection configuration
    dbInit.js      - Database initialization and sequence reset
    env.js         - Environment configuration
  /controllers
    bookController.js - Book-related request handlers
    userController.js - User-related request handlers
  /middleware
    errorMiddleware.js    - Error handling middleware
    loggerMiddleware.js   - Request logging
    rateLimiterMiddleware.js - API rate limiting
    securityMiddleware.js - Security headers and protection
    validationMiddleware.js - Request validation
  /models
    Book.js   - Book model
    Borrow.js - Borrow model
    User.js   - User model
    index.js  - Model associations
  /routes
    bookRoutes.js - Book routes
    userRoutes.js - User routes
  /utils
    errorClasses.js - Custom error classes
    logger.js       - Logging utility
    routeLoader.js  - Lazy loading for routes
  /validators
    bookValidator.js - Book-related validation schemas
    userValidator.js - User-related validation schemas
  /logs             - Application logs
  /dist             - Webpack build output
  app.js            - Express application setup
  server.js         - Entry point
  .env              - Default environment variables
  .env.development  - Development environment variables
  .env.production   - Production environment variables
  dbschema.sql      - Database schema and seed data
  webpack.common.js - Shared webpack configuration
  webpack.dev.js    - Development webpack configuration
  webpack.prod.js   - Production webpack configuration
```

## Development

### Code Quality

- **Linting**: Run `npm run lint` to check for code quality issues
- **Fixing lint issues**: Run `npm run lint:fix` to automatically fix issues

## Future Possible Improvements

- Authentication and authorization
- Pagination for listing endpoints
- Advanced filtering and search features
- Comprehensive test suite
- API documentation with Swagger/OpenAPI

## Suggested Microservices Evolution Improvements

- Containerization
- Horizontal scaling support
- Distributed logging with ELK stack
- Message queue for asynchronous operations
- Caching layer for frequently accessed data

## License

This project is licensed under the Apache License 2.0.