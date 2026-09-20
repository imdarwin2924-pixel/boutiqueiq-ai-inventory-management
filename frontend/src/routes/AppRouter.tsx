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
import StockHistory from "../pages/StockHistory";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            DEFAULT ROUTE
        ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* =====================================================
            LOGIN
        ===================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =====================================================
            PROTECTED ROUTES
        ===================================================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            {/* =================================================
                ALL AUTHENTICATED USERS
            ================================================= */}

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

            {/* Stock History */}
            <Route
              path="/stock-history"
              element={<StockHistory />}
            />

            {/* Customers */}
            <Route
              path="/customers"
              element={<Customers />}
            />

            {/* Sales */}
            <Route
              path="/sales"
              element={<Sales />}
            />

            {/* =================================================
                ADMIN + MANAGER ONLY
            ================================================= */}

            {/* Categories */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={[
                    "Admin",
                    "Manager",
                  ]}
                />
              }
            >
              <Route
                path="/categories"
                element={<Categories />}
              />

              {/* Suppliers */}
              <Route
                path="/suppliers"
                element={<Suppliers />}
              />

              {/* Purchases */}
              <Route
                path="/purchases"
                element={<Purchases />}
              />
            </Route>

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;