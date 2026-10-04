# SmartPark

## Smart Parking Management System

SmartPark is a web-based Smart Parking Management System designed to simplify parking slot management, vehicle entry and exit, parking fee calculation, and payment processing.

The system provides a real-time parking layout with 50 parking slots and uses a React frontend, Java Spring Boot backend, and MySQL database.

---

## 🚀 Technology Stack

### Frontend
- React
- JavaScript
- CSS
- Vite
- Axios

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven

### Database
- MySQL 8.0

### Development
- Git & GitHub
- REST APIs

---

## 📌 Current Features

- 50 parking slots
- Parking slot availability management
- Reserved, Available, and Occupied slot status
- Vehicle number entry
- Automatic parking token generation
- Parking entry time tracking
- Parking exit calculation
- Automatic duration calculation
- Parking fee calculation
- ₹30/hour parking rate
- Demo payment system
- UPI, Card, and Cash payment options
- Parking history
- Admin slot management
- Real-time frontend and backend API integration
- MySQL database persistence
- Backend validation and error handling
- Protection against double booking
- Restart-safe parking data

---

## 🅿️ Parking Configuration

The system contains **50 parking slots**.

| Slot Range | Initial Status |
|------------|----------------|
| P01 – P23 | Reserved |
| P24 – P50 | Available |

Reserved slots can be managed by the administrator.

---

## 🔄 System Workflow

### Vehicle Entry

1. User opens the Parking Layout.
2. Available parking slots are displayed.
3. User selects an available slot.
4. User enters the vehicle number.
5. Backend validates the slot.
6. A unique parking token is generated.
7. Parking record is stored in MySQL.
8. Selected slot becomes **OCCUPIED**.

### Vehicle Exit

1. User enters the parking token.
2. Backend verifies the token.
3. Parking duration is calculated.
4. Duration is rounded up to the nearest complete hour.
5. Parking fee is calculated at **₹30/hour**.
6. User proceeds to demo payment.
7. After successful payment:
   - Payment is recorded.
   - Parking record becomes **COMPLETED**.
   - Parking slot becomes **AVAILABLE**.

---

## 🔌 Backend API

### Parking APIs

```text
GET    /api/parking/slots
GET    /api/parking/slots/{id}
POST   /api/parking/book
POST   /api/parking/exit
GET    /api/parking/history
PUT    /api/parking/slots/{id}/free