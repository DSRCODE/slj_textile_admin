import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import CMSPrivacyEditor from "./components/Editor/Editor";

import ProductForm from "./pages/products/ProductForm";
import ProductList from "./pages/products/ProductList";
import CategoryList from "./pages/categories/CategoryList";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* ✅ Default Page */}
          <Route index element={<CategoryList />} />

          {/* Other Pages */}
          <Route path="product_list" element={<ProductList />} />
          <Route path="create_product" element={<ProductForm />} />
          <Route path="cms" element={<CMSPrivacyEditor />} />

          {/* Fallback */}
          <Route path="*" element={<CategoryList />} />
        </Route>
      </Routes>
    </Router>
  );
}
