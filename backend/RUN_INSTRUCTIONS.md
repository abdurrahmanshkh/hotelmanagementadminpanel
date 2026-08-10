# SmartStay Backend — Setup, Execution & Testing Guide

This guide provides step-by-step instructions on how to install JDK 17, Maven, run the SmartStay Spring Boot backend, and verify production integration with both Angular frontends.

---

## 1. Prerequisites & Installation

### **Step 1: Install Java JDK 17**
1. Download JDK 17 (e.g., Eclipse Temurin 17 or Oracle JDK 17):
   - Website: https://adoptium.net/
2. Run installer and check **"Set JAVA_HOME variable"** and **"Add to PATH"**.
3. Verify installation in Terminal:
   ```cmd
   java -version
   ```

### **Step 2: Install Apache Maven**
1. Download Maven zip from: https://maven.apache.org/download.cgi
2. Extract to `C:\Program Files\Apache\maven` (or any directory).
3. Add `C:\Program Files\Apache\maven\bin` to your System `PATH`.
4. Verify in Terminal:
   ```cmd
   mvn -version
   ```

---

## 2. Building & Running the Backend

### **Step 1: Navigate to the Backend Folder**
```cmd
cd "c:\Users\abdur\Code Projects\hotelmanagementadminpanel\backend"
```

### **Step 2: Build the Application**
```cmd
mvn clean package -DskipTests
```

### **Step 3: Run the Application**
```cmd
mvn spring-boot:run
```
*The backend starts at `http://localhost:8080` with base path `/api/v1`.*

---

## 3. Test Credentials

The persistent H2 database is automatically seeded on first launch with these credentials:

| Role | Email | Password | Staff Code |
|------|-------|----------|------------|
| **Customer** | `guest@example.com` | `Guest@123` | N/A |
| **Customer** | `emily@example.com` | `Guest@123` | N/A |
| **Admin** | `admin@example.com` | `Admin@123` | `STAFF2026` |
| **Manager** | `manager@example.com` | `Manager@123` | `STAFF2027` |
| **Staff** | `staff@example.com` | `Staff@123` | `STAFF2028` |

---

## 4. Database Access

* **H2 Console URL:** `http://localhost:8080/h2-console`
* **JDBC URL:** `jdbc:h2:file:./data/smartstay_db`
* **Username:** `sa`
* **Password:** `password`

---

## 5. Running Frontends in Production Mode

### **Customer Frontend (`http://localhost:4200`)**
```cmd
cd "c:\Users\abdur\Code Projects\hotelmanagementadminpanel\customer_frontend"
npm start
```

### **Admin Frontend (`http://localhost:4201`)**
```cmd
cd "c:\Users\abdur\Code Projects\hotelmanagementadminpanel\admin_frontend"
ng serve --port 4201
```

Both frontends connect directly to `http://localhost:8080/api/v1`.

---

## 6. API Verification Commands (cURL / Postman)

### **Register Customer**
```cmd
curl -X POST http://localhost:8080/api/v1/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john.doe@example.com\",\"phone\":\"9876543210\",\"password\":\"Password@123\"}"
```

### **Customer Login**
```cmd
curl -X POST http://localhost:8080/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"guest@example.com\",\"password\":\"Guest@123\"}"
```

### **Admin Login**
```cmd
curl -X POST http://localhost:8080/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@example.com\",\"password\":\"Admin@123\",\"staffCode\":\"STAFF2026\"}"
```

### **Get Rooms**
```cmd
curl http://localhost:8080/api/v1/rooms
```
