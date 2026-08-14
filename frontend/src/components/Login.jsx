import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Check empty fields
    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login status:", response.status);
      console.log("Login response:", data);

      // Login failed
      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Make sure token exists
      if (!data.token) {
        setError("Login failed. Token was not received.");
        return;
      }

      // Save login token
      localStorage.setItem("token", data.token);

      // Save user information
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // Login successful
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Cannot connect to the server. Make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>Task Manager</h1>

        <p>Login to manage your tasks</p>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />


          {/* PASSWORD */}

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />


          {/* ERROR MESSAGE */}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        {/* CREATE ACCOUNT */}

        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;