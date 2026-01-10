NEUROFLEETX – AI-ASSISTED FLEET & TRAFFIC MANAGEMENT SYSTEM
==========================================================

PROJECT OVERVIEW
----------------
NeuroFleetX is a smart, AI-assisted fleet and traffic management system designed
to monitor vehicles, traffic conditions, and risk zones in urban environments.

The system helps Admins, Managers, and Drivers view real-time information,
receive alerts, and make better decisions related to traffic and fleet operations.

This project focuses on building a clear structure and a fully working system
with basic AI-assisted features and scope for future AI/ML enhancements.


OBJECTIVES
----------
- Monitor vehicles and fleet status in real time
- Analyze traffic congestion and risk zones
- Provide role-based dashboards for different users
- Display traffic data visually using charts and maps
- Reduce manual monitoring and improve traffic awareness


USER ROLES
----------
ADMIN
- Controls the entire system
- Manages users, drivers, and vehicles
- Monitors dashboards, alerts, and AI analytics

MANAGER
- Monitors traffic conditions and risk zones
- Updates traffic data
- Tracks fleet operational status

DRIVER
- Creates and views trips
- Follows suggested routes
- Shares location using check-in
- Receives traffic and safety alerts


TECHNOLOGY STACK
----------------
FRONTEND
- React
- Tailwind CSS
- Recharts
- Leaflet with OpenStreetMap

BACKEND
- Spring Boot
- REST APIs
- JWT Authentication

DATABASE
- MySQL


PROJECT STRUCTURE
-----------------
NeuroFleetX
|
|-- frontend
|   |-- dashboards
|   |-- components
|   |-- services
|
|-- backend
|   |-- controllers
|   |-- services
|   |-- repositories
|   |-- entities
|
|-- README.md


HOW TO RUN THE PROJECT
---------------------
BACKEND
1. Open the backend folder
2. Configure the MySQL database
3. Run the application using:
   mvn spring-boot:run

FRONTEND
1. Open the frontend folder
2. Install dependencies:
   npm install
3. Start the application:
   npm run dev


FUTURE ENHANCEMENTS
-------------------
- Real-time traffic data integration
- Advanced AI/ML models for prediction
- Automatic accident detection
- Mobile application support


CONCLUSION
----------
NeuroFleetX provides a strong foundation for an intelligent fleet and traffic
management system. It improves traffic awareness, enhances safety, and prepares
the system for future AI-driven improvements.
