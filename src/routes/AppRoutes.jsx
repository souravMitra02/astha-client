import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ServiceDetails from "../ServiceDetails/ServiceDetails";
import Services from "../pages/Services/Services";
import Providers from "../pages/Providers/Providers";
import ProviderDetails from "../pages/ProviderDetails/ProviderDetails";
import NotFound from "../pages/NotFound/NotFound";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/providers" element={<Providers />} />
      <Route path="/providers/:id" element={<ProviderDetails />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;