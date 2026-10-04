import React, { useState } from "react";
import logo1 from "../assets/logo 3.png";
import { api, auth } from "./api";
import "./Login.css";

export default function LoginPage({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const { token, user } = await api.login(
        credentials.username,
        credentials.password
      );
      auth.setToken(token);
      onLoginSuccess(user);
    } catch (err) {
      setLoginError(err.message || "Invalid username or password");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="trip-login-wrapper">
      <div className="admin-card login-card">
        <div className="login-card-header text-center">
          <div className="login-logo-container mb-3">
            <img 
              src={logo1} 
              alt="Tripist Logo" 
              className="login-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<i class="bi bi-compass-fill fs-3" style="color: var(--trip-navy);"></i>';
              }}
            />
          </div>
          <h3 className="fw-bold mb-1" style={{ color: "var(--trip-gold)" }}>
            Tripist Admin
          </h3>
          <p className="small mb-0" style={{ color: "var(--trip-white)" }}>
            Secure Portal Access & Management
          </p>
        </div>

        <div className="card-body p-4 p-sm-5">
          {loginError && (
            <div className="alert d-flex align-items-center py-2 px-3 small rounded-3 mb-4 border-0" style={{ backgroundColor: 'var(--trip-danger)', color: 'var(--trip-white)' }}>
              <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
              <div>{loginError}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold small mb-1" style={{ color: "var(--trip-text)" }}>
                Username
              </label>
              <div className="input-group custom-input-group">
                <span className="input-group-text bg-white border-end-0" style={{ color: "var(--trip-navy)" }}>
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small mb-1" style={{ color: "var(--trip-text)" }}>
                Password
              </label>
              <div className="input-group custom-input-group">
                <span className="input-group-text bg-white border-end-0" style={{ color: "var(--trip-navy)" }}>
                  <i className="bi bi-lock "></i>
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-trip-gold w-100 py-2.5 fw-bold shadow-sm"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <i className="bi bi-arrow-right-short ms-1 fs-5 align-middle"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}