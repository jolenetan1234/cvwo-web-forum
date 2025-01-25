# About
This file contains basic instructions to set up a PostgreSQL database in order for CVWO-web-forum to run.

## Database set up
1. **Install PostgreSQL**:
  - Download and install PostgreSQL from [postgresql.org](http://postgresql.org), or [run the official Docker Postgres image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/).
  - Start the PostgreSQL service.
2. **Create the database**:
  - Open your terminal and connect to PostgreSQL using the `psql` command-line tool:
    ```sh
    psql -U postgres
    ```
  - Create a new database:
    ```sql
    CREATE DATABASE cvwo_web_forum;
    ```
3. **Configure environment variables**:
  - Set up the database connection in your `.env` file (or another configuration file).
    ```.env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=cvwo-web-forum
    ```