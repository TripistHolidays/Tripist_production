import React from "react";
import logo from "../assets/tripist.png";

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }) {
  return (
    <aside className="sidebar-container">
      <div>
        <div className="sidebar-logo">
          <img src={logo} alt="Tripist" />
          <div className="admin-badge">Admin Panel</div>
        </div>

        {currentUser && (
          <div className="sidebar-user text-white">
            <div className="fw-semibold sidebar-text">{currentUser.username}</div>
          </div>
        )}

        <nav className="mt-3">

        <button
            className={`nav-link-custom ${activeTab === "destinations" ? "active" : ""}`}
            onClick={() => setActiveTab("destinations")}
            title="Destinations"
          >
            <i className="bi bi-geo-alt"></i>
            <span className="sidebar-text">Destinations</span>
          </button>
          
          <button
            className={`nav-link-custom ${activeTab === "package" ? "active" : ""}`}
            onClick={() => setActiveTab("package")}
            title="Packages"
          >
            <i className="bi bi-suitcase"></i>
            <span className="sidebar-text">Packages</span>
          </button>

          

          <button
            className={`nav-link-custom ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
            title="Contact Info"
          >
            <i className="bi bi-telephone"></i>
            <span className="sidebar-text">Contact</span>
          </button>

          <button
            className={`nav-link-custom ${activeTab === "notice" ? "active" : ""}`}
            onClick={() => setActiveTab("notice")}
            title="Notice"
          >
            <i className="bi bi-megaphone"></i>
            <span className="sidebar-text">Notice</span>
          </button>

          <button
            className={`nav-link-custom ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
            title="Users & Security"
          >
            <i className="bi bi-shield-lock"></i>
            <span className="sidebar-text">Users & Security</span>
          </button>
        </nav>
      </div>

      <button className="btn-logout-sidebar" onClick={onLogout} title="Logout">
        <i className="bi bi-box-arrow-right"></i>
        <span className="sidebar-text">Logout</span>
      </button>
    </aside>
  );
}