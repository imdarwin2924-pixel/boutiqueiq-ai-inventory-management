import { getCurrentUserEmail } from "../../utils/auth";
import { useAuth } from "../../hooks/useAuth";

function Topbar() {
  const { logout } = useAuth();

  const userEmail = getCurrentUserEmail();

  return (
    <header className="topbar">
      <div>
        <h1>BoutiqueIQ</h1>

        <p>
          Clothing Inventory Management
        </p>
      </div>

      <div className="topbar-actions">
        <div className="user-info">
          <span className="user-avatar">
            {userEmail
              ? userEmail
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </span>

          <div className="user-details">
            <strong>
              {userEmail ?? "User"}
            </strong>

            <span>Administrator</span>
          </div>
        </div>

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;