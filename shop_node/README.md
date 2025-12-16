# Shop Node Backend

This is a Node.js backend for a WeChat Mini Program Mall using Express and MySQL.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure environment variables:
    Copy `.env` file and update the database credentials.
    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=shop_db
    
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_PASSWORD=
    ```

3.  Run the server:
    - Development:
        ```bash
        npm run dev
        ```
    - Production:
        ```bash
        npm start
        ```

## Project Structure

-   `src/config`: Database configuration.
-   `src/controllers`: Request handlers.
-   `src/models`: Database models.
-   `src/routes`: API route definitions.
-   `src/app.js`: Express app setup.
-   `index.js`: Server entry point.

## API Endpoints

-   `GET /`: Welcome message.
-   `GET /api/test/db-check`: Check database connection.
-   `GET /api/test/redis-check`: Check Redis connection.
