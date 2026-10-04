import React, { useState, useEffect, useCallback } from "react";
import "./Admin.css";
import './adminseperate.css'
import { api, auth } from "./api";

import Sidebar from "./Sidebar";
import LoginPage from "./LoginPage";
import PackagesPage from "./PackagesPage";
import DestinationsPage from "./DestinationsPage";
import ContactPage from "./ContactPage";
import NoticePage from "./NoticePage";
import UsersPage from "./UsersPage";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.getToken());
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("destinations");
  const [loadingSection, setLoadingSection] = useState(false);

  const [toast, setToast] = useState(null);
  const notify = useCallback((type, message) => {
    setToast({ type, message });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 4000);
  }, []);

  const [packages, setPackages] = useState([]);
  const [contact, setContact] = useState({
    phone: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
  });
  const [importantNotice, setImportantNotice] = useState({
    message: "",
    startDate: "",
    startTime: "",
    endTime: "",
    duration: "",
    isActive: true,
  });
  const [users, setUsers] = useState([]);

  const loadAll = useCallback(async () => {
    setLoadingSection(true);
    try {
      const [packagesData, contactData, noticeData, usersData, me] =
        await Promise.all([
          api.listPackages(),
          api.getContact(),
          api.getNotice(),
          api.listUsers(),
          api.me(),
        ]);
      setPackages(packagesData);
      setContact((prev) => ({ ...prev, ...contactData }));
      setImportantNotice((prev) => ({
        ...prev,
        message: noticeData.message || "",
        startDate: noticeData.start_date ? noticeData.start_date.slice(0, 10) : "",
        startTime: noticeData.start_time ? noticeData.start_time.slice(0, 5) : "",
        endTime: noticeData.end_time ? noticeData.end_time.slice(0, 5) : "",
        duration: noticeData.duration || "",
        isActive: noticeData.is_active ?? true,
      }));
      setUsers(usersData);
      setCurrentUser(me);
    } catch (err) {
      notify("danger", err.message || "Failed to load admin data");
      if (String(err.message).toLowerCase().includes("token")) {
        auth.clearToken();
        setIsLoggedIn(false);
      }
    } finally {
      setLoadingSection(false);
    }
  }, [notify]);

  useEffect(() => {
    if (isLoggedIn) loadAll();
  }, [isLoggedIn, loadAll]);

  const handleLogout = () => {
    auth.clearToken();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="dashboard-wrapper">
      {toast && (
        <div
          className={`app-toast alert alert-${toast.type === "success" ? "success" : "danger"}`}
          role="alert"
        >
          <i
            className={`bi ${
              toast.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"
            } me-2`}
          ></i>
          {toast.message}
        </div>
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {loadingSection && (
          <div className="text-center py-2 mb-3">
            <span className="spinner-border spinner-border-sm text-secondary me-2" />
            <span className="text-muted small">Loading data...</span>
          </div>
        )}

        {activeTab === "package" && (
          <PackagesPage
            packages={packages}
            setPackages={setPackages}
            notify={notify}
          />
        )}

        {activeTab === "destinations" && (
          <DestinationsPage notify={notify} />
        )}

        {activeTab === "contact" && (
          <ContactPage
            contact={contact}
            setContact={setContact}
            notify={notify}
          />
        )}

        {activeTab === "notice" && (
          <NoticePage
            importantNotice={importantNotice}
            setImportantNotice={setImportantNotice}
            notify={notify}
          />
        )}

        {activeTab === "users" && (
          <UsersPage
            users={users}
            setUsers={setUsers}
            currentUser={currentUser}
            notify={notify}
          />
        )}
      </main>
    </div>
  );
}