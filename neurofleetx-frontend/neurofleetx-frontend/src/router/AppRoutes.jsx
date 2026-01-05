import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicOnlyRoute from "../auth/PublicOnlyRoute";
import Login from "../pages/Login";
import Register from "../admin/Register";
import AdminDashboard from "../admin/AdminDashboard";
import FleetCommandCenter from "../admin/FleetCommandCenter";
import ManageDrivers from "../admin/ManageDrivers";
import ManageTrips from "../admin/ManageTrips";
import ManageVehicles from "../admin/ManageVehicles";
import AlertsPage from "../admin/AlertsPage";
import AIToolsPage from "../admin/AIToolsPage";
import AIAnalytics from "../admin/AIAnalytics";

import ManagerDashboard from "../manager/ManagerDashboard";
import TrafficMonitor from "../manager/TrafficMonitor";
import FleetOverview from "../manager/FleetOverview";
import RiskZonesMap from "../manager/RiskZones";

import DriverDashboard from "../driver/DriverDashboard";
import VehicleStatus from "../driver/VehicleStatus";
import GPSLogger from "../driver/GPSLogger";
import DriverLocationUpdate from "../driver/DriverLocationUpdate"; // <- ADDED

import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import RoleBasedRoute from "../auth/RoleBasedRoute";
import TrafficManagement from "../manager/TrafficManagement";
import DriverRegister from "../driver/driverRegister";
import ManageUsers from "../admin/ManageUsers";
import RouteExplorer from "../manager/RouteExplorer";
import RouteSafety from "../manager/RouteSafety";
import CreateTrip from "../driver/CreateTrip";
import TripPlanner from "../driver/TripPlanner";
import TripSummary from "../driver/TripSummary";
import DriverAlerts from "../driver/DriverAlerts";
import TrafficAnalyzer from "../driver/TrafficAnalyzer";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<DriverRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Admin */}
        <Route element={<RoleBasedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/live-map" element={<FleetCommandCenter />} />
          <Route path="/admin/drivers" element={<ManageDrivers />} />
          <Route path="/admin/trips" element={<ManageTrips />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/vehicles" element={<ManageVehicles />} />
          <Route path="/admin/alerts" element={<AlertsPage />} />
          <Route path="/admin/ai" element={<AIToolsPage />} />
          <Route path="/admin/ai-analytics" element={<AIAnalytics />} />
          <Route path="/admin/create-user" element={<Register />} />
        </Route>

        {/* Manager */}
        <Route element={<RoleBasedRoute allowedRoles={["MANAGER"]} />}>
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/traffic" element={<TrafficMonitor />} />
          <Route path="/manager/fleet" element={<FleetOverview />} />
          <Route path="/manager/traffic-data" element={<TrafficManagement />} /> {/* UPDATED */}

          <Route path="/manager/risk-zones" element={<RiskZonesMap />} />
          <Route path="/manager/routes" element={<RouteExplorer />} />
          <Route path="/manager/safety" element={<RouteSafety />} />

        </Route>

        {/* Driver */}
        <Route element={<RoleBasedRoute allowedRoles={["DRIVER"]} />}>
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/vehicle" element={<VehicleStatus />} />
          <Route path="/driver/alerts" element={<DriverAlerts />} />
          <Route path="/driver/gps" element={<GPSLogger />} />
          <Route path="/driver/check-in" element={<DriverLocationUpdate />} />
          <Route path="/driver/create-trip" element={<CreateTrip />} />
          <Route path="/driver/trip-planner" element={<TripPlanner />} />
          <Route path="/driver/trip-summary" element={<TripSummary />} />
          <Route path="/driver/traffic-analysis" element={<TrafficAnalyzer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;