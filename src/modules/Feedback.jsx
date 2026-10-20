import { useState } from "react";
import {
  RATING_OPTIONS,
  FEEDBACK_CATEGORIES,
  IMPROVEMENT_AREAS,
  STORAGE_KEY,
  generateFeedbackId,
  saveFeedbackToStorage,
} from "../data/feedback";

export default function Feedback({ setActivePage }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [improvementArea, setImprovementArea] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savedReferenceId, setSavedReferenceId] = useState(null);

  // Validate fields without mutating state or losing input
  const validateForm = () => {
    const newErrors = {};

    // 1. Rating validation (required, 1-5)
    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = "Please select an overall rating from 1 to 5 stars.";
    }

    // 2. Category validation (required)
    if (!category || !category.trim()) {
      newErrors.category = "Please select what you are providing feedback about.";
    }

    // 3. Feedback text validation (required, trimmed 10-1000 chars)
    const trimmedText = (feedbackText || "").trim();
    if (!trimmedText) {
      newErrors.feedbackText = "Please enter your feedback (minimum 10 characters).";
    } else if (trimmedText.length < 10) {
      newErrors.feedbackText = `Feedback must be at least 10 characters (currently ${trimmedText.length}).`;
    } else if (trimmedText.length > 1000) {
      newErrors.feedbackText = `Feedback must not exceed 1000 characters (currently ${trimmedText.length}).`;
    }

    // 4. Optional email validation (only validate format if non-empty)
    const trimmedEmail = (email || "").trim();
    if (trimmedEmail) {
      // RFC-compliant basic email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(trimmedEmail)) {
        newErrors.email =
          "Please enter a valid email address (e.g., student@university.edu) or leave this field blank.";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error field for accessibility
      const firstField = Object.keys(validationErrors)[0];
      const targetElement = document.getElementById(`feedback-${firstField}`);
      if (targetElement) {
        targetElement.focus();
      }
      return;
    }

    // Clear validation errors
    setErrors({});
    setIsSubmitting(true);

    const newId = generateFeedbackId();
    const entry = {
      id: newId,
      rating: Number(rating),
      category: category.trim(),
      feedback: feedbackText.trim(),
      improvementArea: improvementArea ? improvementArea.trim() : "",
      email: email.trim() ? email.trim() : "",
      timestamp: new Date().toISOString(),
    };

    const saveResult = saveFeedbackToStorage(entry);
    setIsSubmitting(false);

    if (!saveResult.success) {
      setSaveError(saveResult.error);
      return;
    }

    setSavedReferenceId(newId);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setCategory("");
    setFeedbackText("");
    setImprovementArea("");
    setEmail("");
    setErrors({});
    setSaveError(null);
    setIsSubmitting(false);
    setIsSubmitted(false);
    setSavedReferenceId(null);
  };

  const activeRatingValue = hoveredRating || rating;
  const activeRatingObj = RATING_OPTIONS.find((r) => r.value === activeRatingValue);

  return (
    <div className="feedback-page">
      {/* PAGE HEADER */}
      <section className="feedback-page-header">
        <div className="section-label">FEEDBACK &amp; SUGGESTIONS</div>
        <h2>Help Us Improve CryptoBreak Lab</h2>
        <p>
          Share your experience with this virtual cryptography laboratory. Your
          feedback can help us improve the experiments, explanations, and overall
          usability.
        </p>
      </section>

      {/* PRIVACY & STORAGE NOTICE */}
      <div
        className="feedback-privacy-banner"
        role="region"
        aria-label="Privacy and Local Storage Notice"
      >
        <div className="privacy-banner-icon" aria-hidden="true">🔒</div>
        <div className="privacy-banner-body">
          <strong>Local Storage Prototype Notice</strong>
          <p>
            CryptoBreak Lab is a client-side laboratory. Feedback submitted here is
            saved only in your current browser&apos;s local storage (<code>{STORAGE_KEY}</code>).
            It is not sent to the project team, instructors, or a central database.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        /* SUCCESS CONFIRMATION STATE */
        <div
          className="feedback-success-card"
          role="status"
          aria-live="polite"
        >
          <div className="success-icon-badge" aria-hidden="true">✓</div>
          <h3>Thank you for your feedback.</h3>
          <p className="success-subtext">
            Your feedback has been saved in this browser. It has not been sent to the project team.
          </p>

          <div className="feedback-storage-details">
            <div className="storage-detail-row">
              <span className="detail-label">Local Reference ID</span>
              <code className="detail-value">{savedReferenceId}</code>
            </div>
            <div className="storage-detail-row">
              <span className="detail-label">Storage Location</span>
              <span className="detail-value">
                Browser LocalStorage (<code>{STORAGE_KEY}</code>)
              </span>
            </div>
            <div className="storage-detail-row">
              <span className="detail-label">Transmission Status</span>
              <span className="detail-value status-local">
                Local Only (No Network Transmission)
              </span>
            </div>
          </div>

          <div className="success-actions">
            <button
              type="button"
              className="lab-btn primary-btn"
              onClick={handleResetForm}
            >
              Submit Another Response
            </button>
            <button
              type="button"
              className="lab-btn secondary-btn"
              onClick={() => setActivePage && setActivePage("Dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* FEEDBACK FORM */
        <form
          className="feedback-form-card"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Feedback Form"
        >
          {saveError && (
            <div
              className="feedback-alert alert-error"
              role="alert"
              aria-live="assertive"
            >
              <span className="alert-icon" aria-hidden="true">⚠️</span>
              <div>
                <strong>Save Failed:</strong> {saveError}
              </div>
            </div>
          )}

          {/* FIELD A: OVERALL RATING */}
          <div
            className={`form-group ${errors.rating ? "has-error" : ""}`}
            id="group-rating"
          >
            <label id="rating-label" className="form-label">
              How would you rate your overall experience?
              <span className="required-mark" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>

            <div
              id="feedback-rating"
              className="star-rating-control"
              role="radiogroup"
              aria-labelledby="rating-label"
              aria-required="true"
              aria-invalid={errors.rating ? "true" : "false"}
              aria-describedby={errors.rating ? "rating-error" : undefined}
            >
              <div className="star-buttons-row">
                {RATING_OPTIONS.map((opt) => {
                  const isFilled = opt.value <= (hoveredRating || rating);
                  const isSelected = rating === opt.value;
                  const isFocusedStar = rating ? rating === opt.value : opt.value === 1;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${opt.value} star${opt.value > 1 ? "s" : ""} - ${opt.label}`}
                      tabIndex={isFocusedStar ? 0 : -1}
                      className={`star-btn ${isFilled ? "filled" : "empty"} ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => {
                        setRating(opt.value);
                        if (errors.rating) {
                          setErrors((prev) => ({ ...prev, rating: undefined }));
                        }
                      }}
                      onMouseEnter={() => setHoveredRating(opt.value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                          e.preventDefault();
                          const nextVal = Math.min(5, (rating || 0) + 1);
                          setRating(nextVal);
                          if (errors.rating) {
                            setErrors((prev) => ({ ...prev, rating: undefined }));
                          }
                        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                          e.preventDefault();
                          const prevVal = Math.max(1, (rating || 2) - 1);
                          setRating(prevVal);
                          if (errors.rating) {
                            setErrors((prev) => ({ ...prev, rating: undefined }));
                          }
                        }
                      }}
                    >
                      <svg
                        className="star-svg"
                        viewBox="0 0 24 24"
                        width="28"
                        height="28"
                        fill={isFilled ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={isFilled ? "0" : "1.8"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              <div className="star-rating-indicator" aria-live="polite">
                {activeRatingObj ? (
                  <span className="rating-badge">
                    <strong>{activeRatingObj.value} / 5</strong> — {activeRatingObj.label}
                  </span>
                ) : (
                  <span className="rating-prompt">Select a rating (1 to 5 stars)</span>
                )}
              </div>
            </div>

            {errors.rating && (
              <div
                id="rating-error"
                className="form-error-msg"
                role="alert"
              >
                <span className="error-icon" aria-hidden="true">⚠</span>
                {errors.rating}
              </div>
            )}
          </div>

          {/* FIELD B: FEEDBACK CATEGORY */}
          <div
            className={`form-group ${errors.category ? "has-error" : ""}`}
            id="group-category"
          >
            <label htmlFor="feedback-category" className="form-label">
              What are you providing feedback about?
              <span className="required-mark" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>

            <select
              id="feedback-category"
              className={`feedback-select ${errors.category ? "input-error" : ""}`}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) {
                  setErrors((prev) => ({ ...prev, category: undefined }));
                }
              }}
              aria-required="true"
              aria-invalid={errors.category ? "true" : "false"}
              aria-describedby={errors.category ? "category-error" : undefined}
            >
              <option value="">-- Select a category --</option>
              {FEEDBACK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {errors.category && (
              <div
                id="category-error"
                className="form-error-msg"
                role="alert"
              >
                <span className="error-icon" aria-hidden="true">⚠</span>
                {errors.category}
              </div>
            )}
          </div>

          {/* FIELD C: YOUR FEEDBACK */}
          <div
            className={`form-group ${errors.feedbackText ? "has-error" : ""}`}
            id="group-feedbackText"
          >
            <div className="form-label-row">
              <label htmlFor="feedback-feedbackText" className="form-label">
                Your feedback
                <span className="required-mark" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>

              <div
                id="char-counter"
                className={`char-counter ${
                  feedbackText.trim().length > 1000
                    ? "counter-exceeded"
                    : feedbackText.trim().length >= 950
                    ? "counter-near"
                    : ""
                }`}
                aria-live="polite"
              >
                {feedbackText.length} / 1000 characters
              </div>
            </div>

            <textarea
              id="feedback-feedbackText"
              className={`lab-textarea feedback-textarea ${
                errors.feedbackText ? "input-error" : ""
              }`}
              rows={5}
              placeholder="Tell us what worked well, what was confusing, or what you would like us to improve..."
              value={feedbackText}
              onChange={(e) => {
                setFeedbackText(e.target.value);
                if (errors.feedbackText) {
                  setErrors((prev) => ({ ...prev, feedbackText: undefined }));
                }
              }}
              aria-required="true"
              aria-invalid={errors.feedbackText ? "true" : "false"}
              aria-describedby={
                errors.feedbackText
                  ? "feedback-text-error feedback-helper"
                  : "feedback-helper"
              }
            />

            <div className="feedback-textarea-meta">
              <span id="feedback-helper" className="form-helper-text">
                Minimum 10 characters, maximum 1000 characters.
              </span>
            </div>

            {errors.feedbackText && (
              <div
                id="feedback-text-error"
                className="form-error-msg"
                role="alert"
              >
                <span className="error-icon" aria-hidden="true">⚠</span>
                {errors.feedbackText}
              </div>
            )}
          </div>

          {/* FIELD D: WHAT COULD WE IMPROVE? (OPTIONAL) */}
          <div className="form-group" id="group-improvementArea">
            <label htmlFor="feedback-improvementArea" className="form-label">
              What could we improve?
              <span className="optional-tag">(optional)</span>
            </label>

            <select
              id="feedback-improvementArea"
              className="feedback-select"
              value={improvementArea}
              onChange={(e) => setImprovementArea(e.target.value)}
              aria-describedby="improvement-helper"
            >
              <option value="">-- Select an area of improvement (optional) --</option>
              {IMPROVEMENT_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <span id="improvement-helper" className="form-helper-text">
              Highlight a specific aspect of the lab experience you would like enhanced.
            </span>
          </div>

          {/* FIELD E: EMAIL (OPTIONAL) */}
          <div
            className={`form-group ${errors.email ? "has-error" : ""}`}
            id="group-email"
          >
            <label htmlFor="feedback-email" className="form-label">
              Email (optional)
              <span className="optional-tag">(optional)</span>
            </label>

            <input
              type="email"
              id="feedback-email"
              className={`feedback-input ${errors.email ? "input-error" : ""}`}
              placeholder="e.g., student@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={
                errors.email
                  ? "email-error email-helper"
                  : "email-helper"
              }
              autoComplete="email"
            />

            <span id="email-helper" className="form-helper-text">
              Only provide an email if you would like to be contacted about your feedback.
            </span>

            {errors.email && (
              <div
                id="email-error"
                className="form-error-msg"
                role="alert"
              >
                <span className="error-icon" aria-hidden="true">⚠</span>
                {errors.email}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON ROW */}
          <div className="feedback-submit-section">
            <button
              type="submit"
              className="lab-btn primary-btn submit-feedback-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-dot" aria-hidden="true"></span>
                  Saving Feedback...
                </>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
