import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/commons/Layout";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import EventPage from "./pages/EventPage";
import AssetPage from "./pages/AssetPage";
import VolunteerPage from "./pages/VolunteerPage";
import MonitoringPage from "./pages/MonitoringPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="event" element={<EventPage />} />
            <Route path="asset" element={<AssetPage />} />
            <Route path="volunteer" element={<VolunteerPage />} />
            <Route path="monitoring" element={<MonitoringPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
