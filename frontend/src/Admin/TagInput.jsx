import React, { useState } from "react";

/**
 * Clickable chip-style input. Type a value and hit Enter/comma or the
 * Add button to turn it into a removable tag. Used for package
 * inclusions/exclusions so admins pick discrete items instead of
 * writing free-form paragraphs.
 */
export default function TagInput({
  label,
  values,
  onChange,
  placeholder,
  variant = "neutral", // "include" | "exclude" | "neutral"
  helpText,
}) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const v = draft.trim();
    if (!v) return;
    if (values.some((existing) => existing.toLowerCase() === v.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...values, v]);
    setDraft("");
  };

  const removeTag = (idx) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      removeTag(values.length - 1);
    }
  };

  return (
    <div>
      {label && <label className="form-label fw-semibold">{label}</label>}
      <div className={`tag-input-box tag-input-${variant}`}>
        {values.map((v, idx) => (
          <span className={`tag-chip tag-chip-${variant}`} key={`${v}-${idx}`}>
            <i className={`bi ${variant === "exclude" ? "bi-x-circle" : "bi-check-circle"} me-1`}></i>
            {v}
            <button
              type="button"
              className="tag-chip-remove"
              onClick={() => removeTag(idx)}
              aria-label={`Remove ${v}`}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          className="tag-input-field"
          placeholder={placeholder || "Type and press Enter..."}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="d-flex justify-content-between align-items-center mt-2">
        {helpText ? <span className="small text-muted">{helpText}</span> : <span />}
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addTag}>
          <i className="bi bi-plus-lg me-1"></i>Add
        </button>
      </div>
    </div>
  );
}
