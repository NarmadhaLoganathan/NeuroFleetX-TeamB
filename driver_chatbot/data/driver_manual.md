# Driver Panel User Manual

## 1. Dashboard Overview
The **Driver Dashboard** is your central hub.
- **Stats Cards**: View "Total Trips", "Active Alerts", and "Vehicle Status" at a glance.
- **Quick Actions**:
    - **Start Trip**: Navigate to the trip creation screen.
    - **Traffic Analysis**: Open the Route Optimizer tool.
    - **Vehicle Status**: Check health and maintenance details.
    - **Check-In**: (Feature available via quick action).
    - **Trip History**: View a list of your recent trips.
- **Recent Trips**: Shows your last 3 trips with status (ONGOING, COMPLETED) and "Resume" button for active trips.

## 2. Managing Trips
### Creating a New Trip
1. Go to **"Start Trip"** (or `/driver/create-trip`).
2. **Pickup Location**: Type an address or click the **Navigation Icon** to use your current GPS location.
3. **Destination**: Enter where you are going.
4. Click **"Calculate Route"**. The system will show:
    - Distance (km)
    - Estimated Duration (min)
5. Click **"Start Trip"**. This will create the trip and redirect you to the GPS tracking screen.

### Trip History
- View past trips in the "Recent Trips" section of the Dashboard.
- Statuses:
    - **ONGOING**: Trip is currently active. Click "Resume" to continue tracking.
    - **COMPLETED**: Trip finished.

## 3. Traffic & Navigation
### Traffic Analyzer (Route Optimizer)
1. Go to **"Traffic Analysis"**.
2. Enter **Source** and **Destination**.
3. Click **"Find Best Route"**.
4. The system analyzes traffic signals and distance to provide:
    - **Recommended Route** (Fastest, Blue line on map).
    - **Alternative Routes** (Gray lines).
5. Click **"Start Navigation"** on the best route to begin voice-guided turn-by-turn navigation.

## 4. Vehicle & Alerts
### Vehicle Status
- Monitor your vehicle's health at `/driver/vehicle`.
- **Maintenance Forecast**: AI-powered predictions showing:
    - **Next Service**: Kilometers remaining.
    - **Urgency**: Low, Medium, or High (color-coded).
    - **Recommendation**: Specific advice (e.g., "Check brake pads").
- **Live Location**: Shows the vehicle's last reported address and timestamp.

### Driver Alerts
- Check `/driver/alerts` for system notifications.
- Alerts are categorized by **Severity**:
    - **HIGH** (Red): Critical issues requiring immediate attention.
    - **MEDIUM** (Orange): Important warnings.
    - **LOW** (Yellow): General notices.
- You can **"View Details"** or **"Resolve"** alerts directly from the list.

## 5. Troubleshooting
- **No Vehicle Assigned**: If you see a "No Vehicle Assigned" screen, please contact your Fleet Manager immediately.
- **Location Issues**: Ensure your browser has permission to access your location for GPS features to work.
