/**
 * CertificateSection.jsx — CryptoBreak Lab Completion Certificate
 *
 * Implements strict unlock requirements:
 *   - Lab 1 completed with 100/100
 *   - Lab 2 completed with 100/100
 *   - Lab 3 completed with 100/100
 *   - Lab 4 completed with 100/100
 *   - Lab 5 completed with 100/100
 *   - Every required task across all five labs completed (32/32)
 *   - Total verified score exactly 500/500
 *
 * All eligibility is calculated directly from live task states and points.
 * Preview is accessible at any time; Download is unlocked ONLY when 100% complete.
 */

import { useState, useMemo } from "react";
import {
  downloadCertificatePdf,
  evaluateCertificateEligibility,
  getOrCreateCredentialId,
} from "../utils/certificatePdf";
import CertificateDocument from "./CertificateDocument";

export function CertificateModal({
  isOpen,
  onClose,
  studentName,
  onNameChange,
  issueDate,
  serialNumber,
  isEligible,
  onDownload,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="certificate-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
    >
      <div className="certificate-modal-card">
        <div className="certificate-modal-header">
          <div>
            <span className="cert-modal-tag">ACADEMY ACCREDITATION DOCUMENT</span>
            <h3 id="cert-modal-title" className="cert-modal-title">
              Official Certificate of Completion Preview
            </h3>
          </div>
          <button
            type="button"
            className="cert-modal-close-btn"
            onClick={onClose}
            aria-label="Close certificate preview"
          >
            ✕
          </button>
        </div>

        {/* Status banner in modal */}
        {!isEligible ? (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(217, 119, 6, 0.1)",
              border: "1px solid rgba(217, 119, 6, 0.3)",
              borderRadius: "8px",
              color: "#b45309",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🔒</span>
            <span>
              <strong>Preview Mode:</strong> Official certificate download will unlock once all 5 laboratories are completed with 100/100 points (500/500 total verified score across all 32 tasks).
            </span>
          </div>
        ) : (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(22, 101, 52, 0.1)",
              border: "1px solid rgba(22, 101, 52, 0.3)",
              borderRadius: "8px",
              color: "#166534",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>🏆</span>
            <span>
              <strong>Certificate Unlocked:</strong> All requirements met (500/500 PTS & 32/32 tasks). Your official credential is ready for high-resolution PDF download!
            </span>
          </div>
        )}

        {/* Recipient name input customization */}
        <div className="cert-name-input-row">
          <label htmlFor="cert-recipient-input" className="cert-input-label">
            Recipient Name on Official Certificate:
          </label>
          <input
            id="cert-recipient-input"
            type="text"
            className="cert-name-input"
            value={studentName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter recipient full name..."
            maxLength={60}
          />
        </div>

        {/* Actual Fully Designed Certificate Canvas Preview */}
        <div className="cert-preview-frame-container" id="printable-certificate">
          <CertificateDocument
            id="crypto-certificate-svg"
            studentName={studentName}
            issueDate={issueDate}
            serialNumber={serialNumber}
            score="500/500"
          />
        </div>

        {/* Modal Actions */}
        <div className="cert-modal-actions">
          <button
            type="button"
            className="practice-action-btn btn-secondary"
            onClick={onClose}
          >
            ✕ Close Preview
          </button>

          {isEligible ? (
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              onClick={() => window.print()}
              title="Print certificate or save directly using browser print dialog"
            >
              🖨 Print / Save as PDF
            </button>
          ) : null}

          <button
            type="button"
            className={`practice-action-btn ${isEligible ? "btn-start" : "btn-locked"}`}
            disabled={!isEligible}
            onClick={onDownload}
            title={
              isEligible
                ? "Download official high-resolution PDF certificate"
                : "Locked: Complete all 5 labs with 100/100 to download"
            }
          >
            {isEligible
              ? "⬇ Download Lab Completion Certificate (PDF)"
              : "🔒 Download Certificate (Locked)"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CertificateSection({ labs, allTaskStates }) {
  const [studentName, setStudentName] = useState(() => {
    try {
      return (
        localStorage.getItem("cryptobreak-certificate-name") || "Vivan Shetty"
      );
    } catch {
      return "Vivan Shetty";
    }
  });

  const [nameError, setNameError] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Unique stable credential ID generated once and persisted in localStorage
  const serialNumber = useMemo(() => getOrCreateCredentialId(), []);

  // Live evaluation strictly calculated from actual task records
  const evaluation = useMemo(
    () => evaluateCertificateEligibility(labs, allTaskStates),
    [labs, allTaskStates]
  );

  const {
    isEligible,
    totalVerifiedScore,
    totalTasksCompleted,
    totalTasksRequired,
    completedLabsCount,
    totalLabsCount,
    labDetails,
  } = evaluation;

  const issueDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const handleNameChange = (name) => {
    setStudentName(name);
    if (!name.trim()) {
      setNameError("Please enter a valid learner name for the certificate.");
    } else {
      setNameError("");
    }
    try {
      localStorage.setItem("cryptobreak-certificate-name", name);
    } catch {
      // Graceful fallback
    }
  };

  const handleDownload = () => {
    if (!isEligible) return;
    const finalName = studentName.trim() || "Vivan Shetty";
    if (!studentName.trim()) {
      setNameError("Name cannot be empty. Falling back to default.");
    }

    downloadCertificatePdf({
      studentName: finalName,
      issueDate,
      serialNumber,
      score: "500/500",
      svgElementId: isPreviewOpen
        ? "crypto-certificate-svg"
        : "crypto-certificate-svg-offscreen",
    });
  };

  return (
    <section
      className="practice-certificate-section"
      aria-label="Practice Lab Completion Certificate"
    >
      {/* Off-screen actual certificate document for instant background PDF rasterization */}
      <div
        style={{
          position: "fixed",
          left: "-10000px",
          top: "-10000px",
          width: "1000px",
          height: "707px",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <CertificateDocument
          id="crypto-certificate-svg-offscreen"
          studentName={studentName}
          issueDate={issueDate}
          serialNumber={serialNumber}
          score="500/500"
        />
      </div>

      <div className={`practice-certificate-card ${isEligible ? "unlocked" : "locked"}`}>
        {/* Certificate Card Header */}
        <div className="certificate-card-top">
          <div className="certificate-badge-wrap">
            <span className={`certificate-status-badge ${isEligible ? "badge-unlocked" : "badge-locked"}`}>
              {isEligible ? "🏆 CERTIFICATE UNLOCKED" : "🔒 PENDING REQUIREMENTS"}
            </span>
            <span className="certificate-accreditation-tag">ACCREDITED CAPSTONE</span>
          </div>

          <div className="certificate-points-summary">
            <span className="summary-label">TOTAL VERIFIED SCORE</span>
            <strong className="summary-val">
              {totalVerifiedScore} / 500 PTS
            </strong>
          </div>
        </div>

        {/* Certificate Titles */}
        <div className="certificate-title-block">
          <div className="certificate-eyebrow">OFFICIAL ACADEMY CREDENTIAL</div>
          <h2 className="certificate-main-title">CERTIFICATE OF COMPLETION</h2>
          <h3 className="certificate-subtitle">
            Demonstrate Brute Force and Frequency Analysis Using Monoalphabetic Cipher
          </h3>
          <p className="certificate-description">
            Awarded to learners who achieve a perfect 100/100 points in every one of the five
            guided cryptanalysis laboratories (500/500 total points and 32/32 tasks resolved),
            certifying mastery in brute-force keyspace exhaustion and statistical frequency analysis.
          </p>
        </div>

        {/* Progress Dashboard: 4 Core Requirements Metrics */}
        <div className="certificate-metrics-grid">
          <div className="cert-metric-item">
            <span className="metric-label">LABS COMPLETED</span>
            <strong className="metric-val">
              {completedLabsCount} / {totalLabsCount}
            </strong>
            <span className="metric-sub">Strict 100/100 in each lab</span>
          </div>

          <div className="cert-metric-item">
            <span className="metric-label">TOTAL VERIFIED SCORE</span>
            <strong className="metric-val">{totalVerifiedScore} / 500</strong>
            <span className="metric-sub">Cumulative Points</span>
          </div>

          <div className="cert-metric-item">
            <span className="metric-label">TASKS RESOLVED</span>
            <strong className="metric-val">
              {totalTasksCompleted} / {totalTasksRequired}
            </strong>
            <span className="metric-sub">Across 5 Laboratories</span>
          </div>

          <div className="cert-metric-item">
            <span className="metric-label">CREDENTIAL STATUS</span>
            <strong
              className="metric-val"
              style={{ color: isEligible ? "#166534" : "#92400e" }}
            >
              {isEligible ? "Certificate Unlocked" : "Pending Requirements"}
            </strong>
            <span className="metric-sub">
              {isEligible
                ? "Ready for Issuance"
                : `${totalLabsCount - completedLabsCount} of ${totalLabsCount} Labs Incomplete`}
            </span>
          </div>
        </div>

        {/* Individual Laboratory Progress Breakdown Table */}
        <div className="certificate-requirements-box">
          <div className="requirements-header">
            <span className="requirements-icon">📊</span>
            <strong className="requirements-title">
              LABORATORY PROGRESS & SCORE BREAKDOWN
            </strong>
          </div>
          <p className="requirements-desc">
            To earn the official certificate, you must achieve 100/100 in each lab and resolve all 32 tasks.
            Progress is verified in real-time as you solve challenges.
          </p>

          <div className="requirements-list">
            {labDetails.map((ld) => (
              <div
                key={ld.labId}
                className={`requirement-item ${ld.isComplete ? "item-complete" : "item-pending"}`}
              >
                <div className="requirement-status-icon">
                  {ld.isComplete ? "✓" : "○"}
                </div>
                <div className="requirement-info">
                  <div className="requirement-name">
                    <strong>Lab {ld.labNumber}:</strong> {ld.title}
                  </div>
                  <div className="requirement-detail">
                    {ld.isComplete ? (
                      <span className="detail-success">
                        Completed with 100/100 Points ({ld.totalTasks}/{ld.totalTasks} Tasks Resolved) &bull; 0 points remaining
                      </span>
                    ) : (
                      <span className="detail-pending">
                        Current Score: <strong>{ld.score}/100 PTS</strong> &bull; Completed Tasks: <strong>{ld.tasksCompleted}/{ld.totalTasks}</strong> &bull;{" "}
                        <strong style={{ color: "#d97706" }}>{ld.remainingPoints} points remaining</strong>
                      </span>
                    )}
                  </div>
                </div>
                <div className="requirement-score-tag">
                  {ld.score} / {ld.maxScore} PTS
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learner Name Field */}
        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <label htmlFor="student-name-input" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
              Learner Name for Certificate:
            </label>
            <input
              id="student-name-input"
              type="text"
              className="congrats-name-field"
              value={studentName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your full name..."
              maxLength={60}
              style={{ minWidth: "260px" }}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
              Unique Credential ID: <code style={{ fontWeight: 700 }}>{serialNumber}</code>
            </span>
          </div>
          {nameError && (
            <span style={{ color: "#dc2626", fontSize: "0.8rem" }}>{nameError}</span>
          )}
        </div>

        {/* Unlocked State Congratulatory Message */}
        {isEligible && (
          <div className="certificate-congrats-box">
            <div className="congrats-header">
              <span className="congrats-icon">🎉</span>
              <div>
                <strong className="congrats-title">
                  CONGRATULATIONS, CRYPTANALYSIS SPECIALIST!
                </strong>
                <p className="congrats-desc">
                  You have achieved a perfect 500/500 points across all five laboratories,
                  resolving all 32 required investigative tasks. Your official credential has been
                  verified and is unlocked for download and preview.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Card Actions */}
        <div className="certificate-actions-row">
          <div className="cert-action-status-text">
            {isEligible ? (
              <span style={{ color: "#166534", fontWeight: 700 }}>
                ✓ All 5 Labs Completed (500/500 PTS, 32/32 Tasks). Credential Unlocked.
              </span>
            ) : (
              <span>
                🔒 Download is locked until all five labs reach 100/100 points (32/32 tasks). You can preview anytime!
              </span>
            )}
          </div>

          <div className="cert-action-buttons">
            {/* Preview is ALWAYS clickable so learner can see preview certificate */}
            <button
              type="button"
              className="practice-action-btn btn-secondary"
              onClick={() => setIsPreviewOpen(true)}
              aria-label="Preview official certificate of completion"
            >
              👁 Preview Certificate
            </button>

            {/* Download button is locked until isEligible is true */}
            <button
              type="button"
              className={`practice-action-btn ${isEligible ? "btn-start" : "btn-locked"}`}
              disabled={!isEligible}
              onClick={handleDownload}
              title={
                isEligible
                  ? "Download official high-resolution PDF certificate"
                  : "Locked: All 5 labs must reach 100/100 points to download"
              }
              aria-label="Download Lab Completion Certificate PDF"
            >
              {isEligible
                ? "⬇ Download Lab Completion Certificate (PDF)"
                : "🔒 Download Certificate (Locked)"}
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <CertificateModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        studentName={studentName}
        onNameChange={handleNameChange}
        issueDate={issueDate}
        serialNumber={serialNumber}
        isEligible={isEligible}
        onDownload={handleDownload}
      />
    </section>
  );
}
