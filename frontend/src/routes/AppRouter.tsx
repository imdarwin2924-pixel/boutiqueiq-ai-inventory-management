import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import Products from "../pages/Products";
import Inventory from "../pages/Inventory";
import Categories from "../pages/Categories";
import Suppliers from "../pages/Suppliers";
import Customers from "../pages/Customers";
import Sales from "../pages/Sales";
import Purchases from "../pages/Purchases";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Products */}
            <Route
              path="/products"
              element={<Products />}
            />

            {/* Inventory */}
            <Route
              path="/inventory"
              element={<Inventory />}
            />

            {/* Categories */}
            <Route
              path="/categories"
              element={<Categories />}
            />

            {/* Suppliers */}
            <Route
              path="/suppliers"
              element={<Suppliers />}
            />

            {/* Customers */}
            <Route
              path="/customers"
              element={<Customers />}
            />

            {/* Sales */}
            <Route
              path="/sales"
              element={
                <Sales />
              }
            />

            {/* Purchases */}
            <Route
              path="/purchases"
              element={
                <Purchases />
              }
            />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;