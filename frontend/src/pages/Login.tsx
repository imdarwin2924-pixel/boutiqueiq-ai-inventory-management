import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleLogin = async () => {
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await login(
        trimmedEmail,
        password
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      setError(
        "Invalid email or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>BoutiqueIQ</h1>

      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        disabled={isSubmitting}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        disabled={isSubmitting}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            void handleLogin();
          }
        }}
      />

      <br />
      <br />

      <button
        onClick={() => void handleLogin()}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Logging in..."
          : "Login"}
      </button>

      {error && (
        <p>
          {error}
        </p>
      )}
    </div>
  );
}

export default Login;