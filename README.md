# Project Setup Guide

This guide provides instructions to set up and run the **React Vite** and **Laravel** projects. Please follow the steps below to ensure the applications run smoothly.

## Prerequisites

Make sure the following tools are installed on your system:

1. **Node.js** (version 16 or higher) - for the React Vite project
2. **Composer** - for the Laravel project
3. **PHP** (version 8.0 or higher) - for the Laravel project
4. **MySQL** or any other database system supported by Laravel
5. **Git** - to clone the repository
6. **npm** or **yarn** - for managing dependencies in the React Vite project

---

## Setting up the React Vite Project

### Steps:

1. **Clone the repository:**
   ```bash
   git clone [<repository-url>](https://github.com/omarmokhtar01/Todolist-task/tree/main)
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the project:**
   Open your browser and navigate to the URL provided in the terminal (e.g., `http://localhost:5173`).

---

## Setting up the Laravel Project

### Steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omarmokhtar01/Todolist-task/tree/main
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   composer install
   ```

3. **Set up the `.env` file:**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your database credentials:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=Todolist
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Generate the application key:**
   ```bash
   php artisan key:generate
   ```

5. **Run migrations:**
   ```bash
   php artisan migrate
   ```

6. **Start the development server:**
   ```bash
   php artisan serve
   ```

7. **Access the project:**
   Open your browser and navigate to `http://127.0.0.1:8000`.

---

## Notes

- Ensure your MySQL database is running and accessible before running the Laravel migrations.
- If you encounter any issues, check the logs or reach out to the project maintainer.

---

Thank you for using our projects!
