import React from "react";
import { api } from "./api";
import './Admin.css'

export default function ContactPage({ contact, setContact, notify }) {
  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateContact(contact);
      setContact((prev) => ({ ...prev, ...updated }));
      notify("success", "Contact details updated successfully");
    } catch (err) {
      notify("danger", err.message || "Failed to update contact info");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-trip-navy mb-1">Contact Setup</h3>
          <p className="text-muted small">Manage business address and social links with grouped icons.</p>
        </div>
      </div>

      <div className="card admin-card border-0 shadow-sm p-4" style={{ backgroundColor: "#fdfdfd" }}>
        <form onSubmit={handleSaveContact}>
          <div className="row g-3">
            {/* Phone */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">Phone</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <i className="bi bi-telephone"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="+91 98765 43210"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="support@company.com"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                />
              </div>
            </div>

            {/* Address */}
            <div className="col-12">
              <label className="form-label small fw-semibold text-secondary">Business Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0 align-items-start pt-2">
                  <i className="bi bi-geo-alt"></i>
                </span>
                <textarea
                  rows="3"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="Enter full office address..."
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                />
              </div>
            </div>

            {/* Instagram URL */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">Instagram URL</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-danger border-end-0">
                  <i className="bi bi-instagram"></i>
                </span>
                <input
                  type="url"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="https://instagram.com/yourhandle"
                  value={contact.instagram}
                  onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                />
              </div>
            </div>

            {/* Facebook URL */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">Facebook URL</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-primary border-end-0">
                  <i className="bi bi-facebook"></i>
                </span>
                <input
                  type="url"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="https://facebook.com/yourpage"
                  value={contact.facebook}
                  onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                />
              </div>
            </div>

            {/* YouTube URL */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">YouTube URL</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-danger border-end-0">
                  <i className="bi bi-youtube"></i>
                </span>
                <input
                  type="url"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="https://youtube.com/@yourchannel"
                  value={contact.youtube}
                  onChange={(e) => setContact({ ...contact, youtube: e.target.value })}
                />
              </div>
            </div>

            {/* LinkedIn URL */}
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-secondary">LinkedIn URL</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-info border-end-0">
                  <i className="bi bi-linkedin"></i>
                </span>
                <input
                  type="url"
                  className="form-control border-start-0 ps-0 shadow-none"
                  placeholder="https://linkedin.com/company/yourcompany"
                  value={contact.linkedin}
                  onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="col-12 text-end mt-4">
              <button type="submit" className="btn btn-trip-gold px-4 py-2 fw-semibold shadow-sm">
                <i className="bi bi-check2-circle me-1"></i> Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}