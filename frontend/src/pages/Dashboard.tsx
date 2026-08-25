import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>BoutiqueIQ Dashboard</h1>

      <p>Welcome to the BoutiqueIQ management system.</p>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;