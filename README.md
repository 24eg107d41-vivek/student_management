# Student Management System

A full-stack **Student Management System** built with **Spring Boot** (Backend) and **HTML, CSS, JavaScript** (Frontend), backed by **MySQL** and **Spring Data JPA**.

---

## 🚀 Quick Start

The backend application is already built and running on port **8080**!

### Option 1: Access via Web Browser (Integrated)
Simply open your browser and go to:
👉 **[http://localhost:8080/](http://localhost:8080/)**

The complete HTML/CSS/JavaScript single-page application will load directly from the Spring Boot server.

### Option 2: Run Frontend as Standalone
The `frontend/` folder contains pure HTML, CSS, and JavaScript:
- `frontend/index.html`
- `frontend/style.css`
- `frontend/script.js`

You can open `frontend/index.html` directly in your browser or with VS Code **Live Server** (`http://127.0.0.1:5500`). It automatically detects and connects to the Spring Boot REST API at `http://localhost:8080/api/students`.

---

## 🛠️ Tech Stack

- **Backend**:
  - Java 17+ (JDK 26 compatible)
  - Spring Boot 4.x / 3.x
  - Spring Data JPA / Hibernate
  - MySQL Database Driver (`mysql-connector-j`)
  - Maven Wrapper (`mvnw`)
- **Frontend**:
  - HTML5 & CSS3
  - Vanilla JavaScript (ES6+ `async/await`, Fetch API)
  - Bootstrap 5.3 & Bootstrap Icons (Modern UI)
  - Responsive design for Mobile & Desktop

---

## 📁 Project Structure

```
student-management/
│
├── frontend/                                   # Standalone HTML/CSS/JS frontend
│   ├── index.html                              # Main Single-Page UI
│   ├── style.css                               # Custom stylesheet & animations
│   └── script.js                               # REST API client & UI logic
│
├── src/main/java/com/studentmanagement/
│   ├── StudentManagementApplication.java       # Spring Boot main entry point
│   ├── config/
│   │   └── DataInitializer.java               # Auto-seeds 5 sample students if DB is empty
│   ├── controller/
│   │   ├── StudentController.java              # REST API controller (/api/students)
│   │   └── StudentWebController.java           # Web controller & forwarder
│   ├── model/
│   │   └── Student.java                        # JPA Entity (id, name, email, phone, dept, year)
│   ├── repository/
│   │   └── StudentRepository.java              # Spring Data JPA Repository
│   └── service/
│       ├── StudentService.java                 # Service interface
│       └── impl/StudentServiceImpl.java        # Business logic & search
│
├── src/main/resources/
│   ├── application.properties                  # Database & server configuration
│   ├── static/                                 # Embedded static frontend assets
│   │   ├── index.html
│   │   ├── css/style.css
│   │   └── js/app.js
│   └── templates/                              # Thymeleaf templates (optional SSR)
│       ├── students.html
│       ├── add-student.html
│       └── edit-student.html
│
├── pom.xml                                     # Maven dependencies & build setup
└── README.md                                   # Documentation
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:8080/api/students`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/students` | Get all students (or filter by `?search=...`) | None |
| `GET` | `/api/students/{id}` | Get student by ID | None |
| `POST` | `/api/students` | Add / Enroll new student | `{"name":"...","email":"...","phone":"...","department":"...","year":1}` |
| `PUT` | `/api/students/{id}` | Update existing student | `{"name":"...","email":"...","phone":"...","department":"...","year":2}` |
| `DELETE` | `/api/students/{id}` | Delete student | None |
| `GET` | `/api/students/stats` | Get total count and department breakdown | None |

---

## 🗄️ Database Configuration

Configured in `src/main/resources/application.properties`:
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/student_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

---

## 💻 How to Run / Rebuild

To start the backend via terminal anytime:
```powershell
./mvnw spring-boot:run
```
Or run the packaged jar:
```powershell
java -jar target/student-management-0.0.1-SNAPSHOT.jar
```
