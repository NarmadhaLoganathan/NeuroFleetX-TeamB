Project Overview

NeuroFleetX is a smart, AI-assisted fleet and traffic management system designed to monitor vehicles, traffic conditions, and risk zones in urban environments.
The system helps Admins, Managers, and Drivers view real-time information, receive alerts, and make better decisions related to traffic and fleet operations.

This project focuses on building a clear structure and a fully working system, with basic AI-assisted features and scope for future AI/ML enhancements.

Objectives

Monitor vehicles and fleet status in real time

Analyze traffic congestion and risk zones

Provide role-based dashboards for different users

Display traffic data visually using charts and maps

Reduce manual monitoring and improve traffic awareness

User Roles
Admin

Controls the entire system

Manages users, drivers, and vehicles

Monitors dashboards, alerts, and AI analytics

Manager

Monitors traffic conditions and risk zones

Updates traffic data

Tracks fleet operational status

Driver

Creates and views trips

Follows suggested routes

Shares location using check-in

Receives traffic and safety alerts

Technology Stack
Frontend

React

Tailwind CSS

Recharts

Leaflet & OpenStreetMap

Backend

Spring Boot

REST APIs

JWT Authentication

Database

MySQL

Project Structure
NeuroFleetX
│
├── frontend
│   ├── dashboards
│   ├── components
│   ├── services
│
├── backend
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── entities
│
└── README.md

How to Run the Project
Backend

Open the backend folder

Configure the MySQL database

Run the application using:

mvn spring-boot:run

Frontend

Open the frontend folder

Install dependencies:

npm install


Start the application:

npm run dev

Future Enhancements

Real-time traffic data integration

Advanced AI/ML models for prediction

Automatic accident detection

Mobile application support

Conclusion

NeuroFleetX provides a strong foundation for an intelligent fleet and traffic management system.
It improves traffic awareness, enhances safety, and prepares the system for future AI-driven improvements.
