import React, { useEffect, useState } from "react";
import { Bell, X, Check } from "lucide-react";
import { api } from "../Admin/api";

const NotificationCenter = () => {
  const [notice, setNotice] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const data = await api.getNotice();

      if (data && data.is_active === true) {
        setNotice(data);
      } else {
        setNotice(null);
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to load notice:", error);
      setNotice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotice();
    const interval = setInterval(fetchNotice, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!loading && !notice) {
    return null;
  }

  return (
    <>
      {/* Floating Bell Icon at Bottom Right */}
      <div
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          zIndex: 9990,
        }}
      >
        <button
          onClick={() => setOpen(true)}
          className="btn btn-light shadow-lg rounded-circle position-relative d-flex align-items-center justify-content-center"
          style={{
            width: "52px",
            height: "52px",
            border: "1px solid rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            cursor: "pointer",
          }}
          aria-label="Open notifications"
        >
          <Bell size={22} className="text-dark" />

          {notice && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "10px", padding: "4px 6px" }}
            >
              1
            </span>
          )}
        </button>
      </div>

      {/* Centered Modal Overlay Popup */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            animation: "fadeInBackdrop 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card shadow-lg border-0 rounded-4 overflow-hidden"
            style={{
              width: "100%",
              maxWidth: "460px",
              animation: "slideInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Header */}
            <div
              className="d-flex justify-content-between align-items-center px-4 py-3"
              style={{
                backgroundColor: "#0f2d52",
                color: "#ffffff",
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Bell size={20} className="text-warning" />
                <h6 className="mb-0 fw-bold">Notification</h6>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="btn btn-sm text-white p-1 rounded-circle d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", width: "28px", height: "28px" }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4" style={{ maxHeight: "65vh", overflowY: "auto" }}>
              {loading ? (
                <div className="text-center py-4 text-muted">
                  Loading announcement...
                </div>
              ) : !notice ? (
                <div className="text-center py-4 text-muted">
                  <Bell size={32} className="mb-2 opacity-50" />
                  <p className="mb-0 small">No active notifications</p>
                </div>
              ) : (
                <div className="d-flex gap-3 align-items-start">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "42px",
                      height: "42px",
                      backgroundColor: "rgba(212, 175, 55, 0.15)",
                      color: "#b48b14",
                    }}
                  >
                    <Bell size={20} />
                  </div>

                  <div>
                    <h6 className="fw-bold text-dark mb-1 fs-6">
                      {notice.title}
                    </h6>

                    <p className="mb-2 text-secondary small" style={{ lineHeight: "1.55" }}>
                      {notice.message}
                    </p>

                    {notice.updated_at && (
                      <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                        {new Date(notice.updated_at).toLocaleString()}
                      </small>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-light border-top d-flex justify-content-between align-items-center">
              <small className="text-muted d-flex align-items-center" style={{ fontSize: "12px" }}>
                <Check size={14} className="text-success me-1" />
                Latest Announcement
              </small>

              <button
                onClick={() => setOpen(false)}
                className="btn btn-sm btn-dark px-3 py-1 rounded-pill"
                style={{ fontSize: "12px", fontWeight: "600" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeInBackdrop {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInModal {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

export default NotificationCenter;