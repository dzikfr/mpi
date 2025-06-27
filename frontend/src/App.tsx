import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/commons/Layout";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import CompanyPage from "./pages/CompanyPage";
import CustomerPage from "./pages/CustomerPage"
import InvoicePage from "./pages/InvoicePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />

            <Route path="product" element={<ProductPage />}/>
            <Route path="company" element={<CompanyPage />}/>
            <Route path="customer" element={<CustomerPage />}/>
            <Route path="invoice" element={<InvoicePage />}/>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
