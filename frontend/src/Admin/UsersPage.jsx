import React, { useState } from "react";
import { EMPTY_NEW_USER, EMPTY_PASSWORD_FORM } from "./Constants";
import { api } from "./api";

export default function UsersPage({ users, setUsers, currentUser, notify }) {
  const [newUserForm, setNewUserForm] = useState(EMPTY_NEW_USER);
  const [passwordForm, setPasswordForm] = useState({
    ...EMPTY_PASSWORD_FORM,
    targetUserId: currentUser?.id || "",
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUserForm.password.length < 8) {
      notify("danger", "Password must be at least 8 characters");
      return;
    }
    try {
      const created = await api.addUser(
        newUserForm.username,
        newUserForm.password,
        newUserForm.role
      );
      setUsers((prev) => [...prev, created]);
      setNewUserForm(EMPTY_NEW_USER);
      notify("success", `User "${created.username}" created successfully`);
    } catch (err) {
      notify("danger", err.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Remove this admin user?")) return;
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      notify("success", "User removed successfully");
    } catch (err) {
      notify("danger", err.message || "Failed to remove user");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify("danger", "New password and confirmation do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      notify("danger", "New password must be at least 8 characters");
      return;
    }
    try {
      await api.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({
        ...EMPTY_PASSWORD_FORM,
        targetUserId: currentUser?.id || "",
      });
      notify("success", "Password changed successfully");
    } catch (err) {
      notify("danger", err.message || "Failed to change password");
    }
  };

  return (
    <div>
      <h2 className="fw-bold text-trip-navy mb-3">Users & Security</h2>
      <div className="row g-4">
        {/* Add User Form */}
        <div className="col-lg-6">
          <div className="card admin-card p-4 h-100">
            <h5 className="fw-bold text-trip-navy mb-3">Create Admin User</h5>
            <form onSubmit={handleAddUser}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. manager1"
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Password (min 8 chars)</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Role</label>
                <select
                  className="form-select"
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-trip-gold">
                Create User
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="col-lg-6">
          <div className="card admin-card p-4 h-100">
            <h5 className="fw-bold text-trip-navy mb-3">
              Change Password ({currentUser?.username || "Account"})
            </h5>
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password (min 8 chars)"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-trip-gold">
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* User List Table */}
        <div className="col-12">
          <div className="card admin-card shadow-lg border-0">
            <div className="card-header bg-white py-3">
              <h5 className="fw-bold text-trip-navy mb-0">Active Admin Accounts</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="fw-bold">
                          {u.username}
                          {currentUser?.username === u.username && (
                            <span className="badge bg-success ms-2">You</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${u.role === "superadmin" ? "bg-danger" : "bg-secondary"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="small text-muted">{new Date(u.created_at || u.createdAt).toLocaleDateString()}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={currentUser?.username === u.username}
                            title="Delete User"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}