import React, { useEffect } from "react";
import { api } from "./api";
import { todayDateStr } from "./Constants";

export default function NoticePage({ importantNotice, setImportantNotice, notify }) {
  const today = todayDateStr();

  // =========================================================
  // AUTO-DISABLE WHEN EXPIRED
  // =========================================================
  useEffect(() => {
    const checkExpired = async () => {
      // Skip if no end date OR already inactive
      if (!importantNotice.endDate || !importantNotice.isActive) return;

      const now = new Date();

      // Build the end datetime (endDate + endTime, fallback to 23:59)
      const endDateTime = new Date(
        `${importantNotice.endDate}T${importantNotice.endTime || "23:59"}:00`
      );

      // If end time has passed → auto-disable
      if (now > endDateTime) {
        const updated = { ...importantNotice, isActive: false };
        setImportantNotice(updated);

        try {
          await api.updateNotice(updated);
          notify("info", "Notice expired and was automatically disabled.");
        } catch (err) {
          console.warn("Failed to auto-disable expired notice:", err);
        }
      }
    };

    checkExpired();
  }, [importantNotice, setImportantNotice, notify]);

  // =========================================================
  // SAVE NOTICE
  // =========================================================
  const handleSaveNotice = async (e) => {
    e.preventDefault();

    // Time validation for same-day notices
    if (
      importantNotice.startDate &&
      importantNotice.endDate &&
      importantNotice.startDate === importantNotice.endDate &&
      importantNotice.startTime &&
      importantNotice.endTime &&
      importantNotice.endTime <= importantNotice.startTime
    ) {
      notify("danger", "End time must be after the start time on the same day.");
      return;
    }

    // Date validation
    if (
      importantNotice.startDate &&
      importantNotice.endDate &&
      importantNotice.endDate < importantNotice.startDate
    ) {
      notify("danger", "End date must be on or after the start date.");
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
                onChange={(e) =>
                  setImportantNotice({ ...importantNotice, message: e.target.value })
                }
                required
              />
            </div>

            {/* ==============================
                SCHEDULE: START
            ============================== */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                className="form-control"
                min={today}
                value={importantNotice.startDate}
                onChange={(e) =>
                  setImportantNotice({ ...importantNotice, startDate: e.target.value })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Start Time</label>
              <input
                type="time"
                className="form-control"
                value={importantNotice.startTime}
                onChange={(e) =>
                  setImportantNotice({ ...importantNotice, startTime: e.target.value })
                }
              />
            </div>

            {/* ==============================
                SCHEDULE: END (NEW)
            ============================== */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                End Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                min={importantNotice.startDate || today}
                value={importantNotice.endDate || ""}
                onChange={(e) =>
                  setImportantNotice({ ...importantNotice, endDate: e.target.value })
                }
              />
              <small className="text-muted">
                Notice will auto-disable after this date.
              </small>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">End Time</label>
              <input
                type="time"
                className="form-control"
                value={importantNotice.endTime}
                onChange={(e) =>
                  setImportantNotice({ ...importantNotice, endTime: e.target.value })
                }
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
                onChange={(e) =>
                  setImportantNotice({ ...importantNotice, duration: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <div className="form-check form-switch mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="noticeActiveSwitch"
                  checked={importantNotice.isActive}
                  onChange={(e) =>
                    setImportantNotice({ ...importantNotice, isActive: e.target.checked })
                  }
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