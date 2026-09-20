import { NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

const mainNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "⌂",
  },
  {
    label: "Products",
    path: "/products",
    icon: "▣",
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: "▤",
  },
  {
    label: "Stock History",
    path: "/stock-history",
    icon: "↕",
  },
];

const managementNavigation: NavigationItem[] = [
  {
    label: "Categories",
    path: "/categories",
    icon: "◈",
  },
  {
    label: "Suppliers",
    path: "/suppliers",
    icon: "◆",
  },
  {
    label: "Customers",
    path: "/customers",
    icon: "♙",
  },
  {
    label: "Sales",
    path: "/sales",
    icon: "₹",
  },
  {
    label: "Purchases",
    path: "/purchases",
    icon: "▱",
  },
];

function Sidebar() {
  const {
    isAdmin,
    isManager,
    isStaff,
  } = useAuth();

  const renderNavigation = (
    items: NavigationItem[]
  ) => {
    return items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          isActive
            ? "nav-link active"
            : "nav-link"
        }
      >
        <span className="nav-icon">
          {item.icon}
        </span>

        <span>{item.label}</span>
      </NavLink>
    ));
  };

  /*
   * Staff:
   * - Dashboard
   * - Products
   * - Inventory
   * - Stock History
   *
   * Admin / Manager:
   * - All navigation items
   */
  const visibleMainNavigation =
    mainNavigation;

  const visibleManagementNavigation =
    isAdmin || isManager
      ? managementNavigation
      : managementNavigation.filter(
          (item) =>
            item.label === "Customers" ||
            item.label === "Sales"
        );

  /*
   * Keep the role variables intentionally
   * available for future role-specific
   * navigation rules.
   */
  void isStaff;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>BoutiqueIQ</h2>
        <span>Management System</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section">
          MAIN
        </p>

        {renderNavigation(
          visibleMainNavigation
        )}

        <p className="nav-section">
          MANAGEMENT
        </p>

        {renderNavigation(
          visibleManagementNavigation
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;