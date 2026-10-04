import React from "react";
import { api } from "./api";
import { todayDateStr } from "./Constants";

export default function NoticePage({ importantNotice, setImportantNotice, notify }) {
  const today = todayDateStr();

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    if (
      importantNotice.startTime &&
      importantNotice.endTime &&
      importantNotice.endTime <= importantNotice.startTime
    ) {
      notify("danger", "End time must be after the start time");
      return;
    }
    try {
      await api.updateNotice(importantNotice);
      notify("success", "Notice updated successfully");
    } catch (err) {
      notify("danger", err.message || "Failed to update notice");
    }
  };

  return (
    <div>
      <h2 className="fw-bold text-trip-navy mb-3">Notice Banner</h2>
      <div className="card admin-card p-4">
        <form onSubmit={handleSaveNotice}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Message</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="Enter urgent banner announcement..."
                value={importantNotice.message}
                onChange={(e) => setImportantNotice({ ...importantNotice, message: e.target.value })}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                className="form-control"
                min={today}
                value={importantNotice.startDate}
                onChange={(e) => setImportantNotice({ ...importantNotice, startDate: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Start Time</label>
              <input
                type="time"
                className="form-control"
                value={importantNotice.startTime}
                onChange={(e) => setImportantNotice({ ...importantNotice, startTime: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">End Time</label>
              <input
                type="time"
                className="form-control"
                value={importantNotice.endTime}
                onChange={(e) => setImportantNotice({ ...importantNotice, endTime: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Duration Note <span className="text-muted fw-normal">(optional)</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 24 Hours, 3 Days"
                value={importantNotice.duration}
                onChange={(e) => setImportantNotice({ ...importantNotice, duration: e.target.value })}
              />
            </div>

            <div className="col-12">
              <div className="form-check form-switch mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="noticeActiveSwitch"
                  checked={importantNotice.isActive}
                  onChange={(e) => setImportantNotice({ ...importantNotice, isActive: e.target.checked })}
                />
                <label className="form-check-label fw-semibold" htmlFor="noticeActiveSwitch">
                  Display Notice Banner on Website
                </label>
              </div>
            </div>

            <div className="col-12 text-end mt-3">
              <button type="submit" className="btn btn-trip-gold px-4">
                Save Notice
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
