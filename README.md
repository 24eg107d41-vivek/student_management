# Student Management System

A full-stack **Student Management System** built with **Spring Boot** (Backend REST API) and **React** (Modern Frontend SPA powered by Vite), backed by **Spring Data JPA** and **H2 / MySQL**.

---

## 🛠️ Tech Stack

- **Backend (Spring Boot)**:
  - Java 17+ (JDK 26 fully compatible)
  - Spring Boot 4.x / 3.x
  - Spring Data JPA & Hibernate
  - Embedded H2 (instant zero-config running) & MySQL support
  - Global CORS configuration & Centralized Exception Handling (`@RestControllerAdvice`)
  - Maven Wrapper (`mvnw`)
- **Frontend (React)**:
  - React 18 + Vite (Blazing fast HMR dev server & optimized production builds)
  - Lucide React icons
  - Modern Design System (Plus Jakarta Sans, responsive grid, dynamic gradient avatars)
  - Real-time client & server search, department filtering, multi-column sorting
  - Add / Edit student modal with client-side validation
  - Safe delete confirmation dialog
  - Toast notification system with auto-dismiss
  - Dynamic Dark / Light theme toggle with `localStorage` persistence
  - 1-click CSV roster export

---

## 📁 Project Structure

```
student-management/
│
├── frontend/                                   # Modern React + Vite SPA
│   ├── package.json                            # React dependencies & scripts
│   ├── vite.config.js                          # Vite configuration & /api proxy to Spring Boot
│   ├── index.html                              # Vite HTML template
│   └── src/
│       ├── main.jsx                            # React root mount
│       ├── App.jsx                             # Main App component & state management
│       ├── index.css                           # Modern CSS design system & dark/light tokens
│       ├── components/                         # React UI components
│       ├── services/                           # REST API client for Spring Boot backend
│       └── utils/                              # Helpers & CSV export
│
├── backend/                                    # Spring Boot REST API
│   ├── pom.xml                                 # Maven dependencies & build setup
│   ├── mvnw / mvnw.cmd                         # Maven wrappers
│   ├── src/main/java/com/studentmanagement/
│   │   ├── StudentManagementApplication.java   # Spring Boot main entry point
│   │   ├── config/                             # DataInitializer & CORS WebConfig
│   │   ├── controller/                         # StudentController (/api/students) & StudentWebController
│   │   ├── exception/                          # GlobalExceptionHandler & ResourceNotFoundException
│   │   ├── model/                              # Student JPA Entity
│   │   ├── repository/                         # StudentRepository
│   │   └── service/                            # StudentService & StudentServiceImpl
│   └── src/main/resources/
│       ├── application.properties              # Database & server configuration
│       └── static/                             # Compiled React production bundle
│
├── Dockerfile                                  # Multi-stage Docker build (React + Spring Boot)
├── render.yaml                                 # Render 1-click cloud blueprint
└── README.md                                   # Documentation
```

---

## 🚀 How to Run the Application

### Option 1: Integrated Spring Boot + React (Single Port 8080)

The React production bundle is built directly into Spring Boot's static resources (`backend/src/main/resources/static/`). You can run everything from the `backend/` folder:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Once started, open your browser and navigate to:
👉 **[http://localhost:8080/](http://localhost:8080/)**

---

### Option 2: Development Mode (Vite React HMR + Spring Boot API)

For frontend development with instant Hot Module Replacement (HMR):

1. **Start the Spring Boot Backend** (Terminal 1):
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
   *The backend starts at `http://localhost:8080` and exposes the REST API.*

2. **Start the React Frontend** (Terminal 2):
   ```powershell
   cd frontend
   npm.cmd run dev
   ```
2. **Start the React Frontend** (Terminal 2):
   ```powershell
   cd frontend
   npm.cmd run dev
   ```
   *Vite starts at `http://localhost:5173` with proxy routing `/api` requests to Spring Boot.*

---

## 🔨 How to Rebuild the React Frontend

Whenever you make changes to the React code in `frontend/`, rebuild the production bundle:

```powershell
cd frontend
npm.cmd run build
```

This compiles optimized assets directly into `src/main/resources/static/`, ready for packaging into the Spring Boot JAR:

```powershell
.\mvnw.cmd clean package
java -jar target/student-management-0.0.1-SNAPSHOT.jar
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:8080/api/students`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/students` | Get all students (or filter with `?search=...`) | None |
| `GET` | `/api/students/{id}` | Get student by ID | None |
| `POST` | `/api/students` | Enroll new student | `{"name":"...","email":"...","phone":"...","department":"...","year":1}` |
| `PUT` | `/api/students/{id}` | Update existing student | `{"name":"...","email":"...","phone":"...","department":"...","year":2}` |
| `DELETE` | `/api/students/{id}` | Delete student | None |
| `GET` | `/api/students/stats` | Total student count & department breakdown | None |

---

## 🗄️ Database Configuration

By default, an in-memory **H2** database is used for zero-configuration, instant execution. Sample student records are automatically initialized on first run via `DataInitializer.java`.

To switch to **MySQL**, update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
```
