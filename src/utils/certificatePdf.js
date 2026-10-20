/**
 * certificatePdf.js — Client-Side Certificate PDF Generator & Validator
 *
 * Provides:
 *   - evaluateCertificateEligibility: Pure function to compute completion and eligibility
 *   - getOrCreateCredentialId: Stable unique credential ID persisted in localStorage
 *   - downloadCertificatePdf: High-resolution PDF generation using jsPDF with vector fallback
 */

import { jsPDF } from "jspdf";

/**
 * Pure evaluation function calculating certificate eligibility from raw task states.
 * Guarantees that neither stored flags nor simple totals can bypass requirements.
 *
 * Rules:
 *   1. Each lab is worth 100 points.
 *   2. Must score exactly 100/100 in EVERY lab.
 *   3. Total score must be exactly 500/500.
 *   4. Total tasks completed must be 32/32.
 *   5. Total score alone does NOT unlock if any individual lab is incomplete.
 */
export function evaluateCertificateEligibility(labs, allTaskStates) {
  let totalVerifiedScore = 0;
  let totalTasksRequired = 0;
  let totalTasksCompleted = 0;

  const labDetails = (labs || []).map((lab) => {
    const lState = allTaskStates?.[lab.id] || {};
    const taskCount = lab.tasks ? lab.tasks.length : 0;
    totalTasksRequired += taskCount;

    let labScore = 0;
    let labCompletedTasks = 0;
    const remainingTasks = [];

    (lab.tasks || []).forEach((task) => {
      const ts = lState[task.id];
      const isDone = ts?.completed === true;
      const pts = typeof ts?.pointsEarned === "number" ? ts.pointsEarned : 0;
      labScore += pts;
      if (isDone) {
        labCompletedTasks += 1;
      } else {
        remainingTasks.push({ id: task.id, title: task.title, points: task.points });
      }
    });

    totalVerifiedScore += labScore;
    totalTasksCompleted += labCompletedTasks;

    const isLabComplete =
      labCompletedTasks === taskCount &&
      labScore === lab.maxScore &&
      labScore === 100;

    return {
      labId: lab.id,
      labNumber: lab.number,
      title: lab.title,
      score: labScore,
      maxScore: lab.maxScore,
      tasksCompleted: labCompletedTasks,
      totalTasks: taskCount,
      remainingPoints: Math.max(0, lab.maxScore - labScore),
      isComplete: isLabComplete,
      remainingTasks,
    };
  });

  const completedLabsCount = labDetails.filter((ld) => ld.isComplete).length;
  const allFiveLabsCompleted = completedLabsCount === labs.length && labs.length === 5;
  const allTasksFinished = totalTasksCompleted === totalTasksRequired && totalTasksRequired === 32;
  const perfectScore500 = totalVerifiedScore === 500;

  const isEligible = allFiveLabsCompleted && allTasksFinished && perfectScore500;

  return {
    isEligible,
    totalVerifiedScore,
    maxPossibleScore: 500,
    totalTasksCompleted,
    totalTasksRequired,
    completedLabsCount,
    totalLabsCount: labs.length,
    labDetails,
  };
}

/**
 * Retrieves an existing unique credential ID from localStorage or creates and persists a new one.
 * Ensures the credential ID is stable for this certificate.
 */
export function getOrCreateCredentialId() {
  const STORAGE_KEY = "cryptobreak-certificate-serial";
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing && existing.trim()) {
        return existing.trim();
      }
      const randHex1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newId = `CBL-2026-${randHex1}-${randHex2}`;
      localStorage.setItem(STORAGE_KEY, newId);
      return newId;
    }
  } catch {
    // Fallback if localStorage is inaccessible
  }
  return "CBL-2026-9E4B-500M";
}

/**
 * Downloads the certificate as an official PDF.
 * Uses high-resolution canvas capture of the SVG document (exact visual replica)
 * rendered into an ISO-compliant A4 Landscape PDF via jsPDF, with vector fallback.
 */
export async function downloadCertificatePdf({
  studentName = "Cryptanalyst",
  issueDate,
  serialNumber,
  score = "500/500",
  svgElementId = "crypto-certificate-svg",
}) {
  const name = (studentName || "Cryptanalyst").trim() || "Cryptanalyst";
  const safeName = name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "") || "Cryptanalyst";
  const fileName = `CryptoBreak_Lab_Certificate_${safeName}.pdf`;
  const date = issueDate || new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const serial = serialNumber || getOrCreateCredentialId();

  // Try high-resolution SVG to Canvas to jsPDF
  try {
    const svgElement =
      document.getElementById(svgElementId) ||
      document.getElementById("crypto-certificate-svg") ||
      document.getElementById("crypto-certificate-svg-offscreen");

    if (svgElement && typeof window !== "undefined" && window.document) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      const imgLoadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
      });
      img.src = blobUrl;
      await imgLoadPromise;

      // High-resolution A4 landscape (2800 x 1980 px approx 1.414:1)
      const canvas = document.createElement("canvas");
      canvas.width = 2800;
      canvas.height = 1980;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fdfcf8";
      ctx.fillRect(0, 0, 2800, 1980);
      ctx.drawImage(img, 0, 0, 2800, 1980);
      URL.revokeObjectURL(blobUrl);

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // A4 Landscape is 841.89 x 595.28 points
      pdf.addImage(imgData, "JPEG", 0, 0, 841.89, 595.28, undefined, "FAST");
      pdf.setProperties({
        title: "CryptoBreak Lab Official Certificate of Completion",
        subject: "Demonstrate Brute Force and Frequency Analysis Using Monoalphabetic Cipher",
        author: "Cryptography Virtual Lab Academy",
        keywords: "cryptography, cryptanalysis, certificate, monoalphabetic, brute-force",
        creator: "CryptoBreak Virtual Lab Academy",
      });

      pdf.save(fileName);
      return;
    }
  } catch (err) {
    console.warn("Exact canvas jsPDF capture failed, generating high-quality vector jsPDF fallback:", err);
  }

  // Graceful Fallback: Direct vector rendering in jsPDF
  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // 1. Parchment background
    pdf.setFillColor(253, 252, 248);
    pdf.rect(0, 0, 842, 595, "F");

    // 2. Borders
    // Outer Navy Border
    pdf.setDrawColor(11, 25, 44);
    pdf.setLineWidth(4);
    pdf.rect(20, 20, 802, 555, "S");

    // Inner Gold Border
    pdf.setDrawColor(197, 155, 39);
    pdf.setLineWidth(2);
    pdf.rect(28, 28, 786, 539, "S");

    // Inner Teal Accent Border
    pdf.setDrawColor(13, 148, 136);
    pdf.setLineWidth(0.8);
    pdf.rect(34, 34, 774, 527, "S");

    // 3. Header
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(11, 25, 44);
    pdf.setFontSize(13);
    pdf.text("CRYPTOGRAPHY VIRTUAL LAB ACADEMY", 421, 68, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(197, 155, 39);
    pdf.text("OFFICIAL ACADEMY CREDENTIAL", 421, 84, { align: "center" });

    // 4. Certificate Title
    pdf.setFont("times", "bold");
    pdf.setFontSize(26);
    pdf.setTextColor(11, 25, 44);
    pdf.text("CERTIFICATE OF COMPLETION", 421, 126, { align: "center" });

    // Course Title Plaque
    pdf.setFillColor(241, 245, 249);
    pdf.setDrawColor(203, 213, 225);
    pdf.setLineWidth(1);
    pdf.roundedRect(80, 142, 682, 30, 4, 4, "FD");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(11, 25, 44);
    pdf.text("Demonstrate Brute Force and Frequency Analysis Using Monoalphabetic Cipher", 421, 161, { align: "center" });

    // 5. Recipient
    pdf.setFont("times", "italic");
    pdf.setFontSize(11);
    pdf.setTextColor(100, 116, 139);
    pdf.text("This credential is officially conferred upon", 421, 204, { align: "center" });

    pdf.setFont("times", "bold");
    pdf.setFontSize(27);
    pdf.setTextColor(30, 58, 138);
    pdf.text(name, 421, 240, { align: "center" });

    // Underline
    pdf.setDrawColor(197, 155, 39);
    pdf.setLineWidth(1.5);
    pdf.line(260, 248, 582, 248);

    // 6. Completion Statement
    pdf.setFont("times", "normal");
    pdf.setFontSize(10.5);
    pdf.setTextColor(51, 65, 85);
    pdf.text(
      `This certificate is awarded to ${name} for successfully completing all five guided cryptanalysis laboratories`,
      421,
      278,
      { align: "center" }
    );
    pdf.text(
      "demonstrating brute-force attacks and frequency analysis using a monoalphabetic substitution cipher,",
      421,
      294,
      { align: "center" }
    );
    pdf.text("verifying complete operational mastery.", 421, 310, { align: "center" });

    // 7. Metrics Box
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(1);
    pdf.roundedRect(70, 336, 702, 54, 5, 5, "FD");

    // Metrics Columns
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text("LABS COMPLETED", 140, 355, { align: "center" });
    pdf.text("TASKS RESOLVED", 280, 355, { align: "center" });
    pdf.text("FINAL VERIFIED SCORE", 430, 355, { align: "center" });
    pdf.text("ISSUE DATE", 580, 355, { align: "center" });
    pdf.text("CREDENTIAL ID", 700, 355, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(11, 25, 44);
    pdf.text("5 / 5 Labs", 140, 375, { align: "center" });
    pdf.text("32 / 32 Tasks", 280, 375, { align: "center" });
    pdf.setTextColor(22, 101, 52);
    pdf.text(`${score} (100%)`, 430, 375, { align: "center" });
    pdf.setTextColor(11, 25, 44);
    pdf.setFontSize(10.5);
    pdf.text(date, 580, 375, { align: "center" });
    pdf.setFont("courier", "bold");
    pdf.setFontSize(9.5);
    pdf.text(serial, 700, 375, { align: "center" });

    // 8. Signatures & Seal
    // Lab Instructor (Left)
    pdf.setFont("times", "italic");
    pdf.setFontSize(17);
    pdf.setTextColor(11, 25, 44);
    pdf.text("Dr. Ronald L. Rivest", 210, 470, { align: "center" });
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(1);
    pdf.line(125, 480, 295, 480);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("Dr. Ronald L. Rivest", 210, 495, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text("Lab Instructor", 210, 508, { align: "center" });

    // Center Gold Seal
    pdf.setFillColor(197, 155, 39);
    pdf.circle(421, 475, 32, "F");
    pdf.setFillColor(120, 53, 15);
    pdf.circle(421, 475, 24, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(6.5);
    pdf.setTextColor(253, 224, 71);
    pdf.text("★ VERIFIED ★", 421, 467, { align: "center" });
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text("500/500", 421, 479, { align: "center" });
    pdf.setFontSize(6);
    pdf.setTextColor(253, 224, 71);
    pdf.text("OFFICIAL SEAL", 421, 489, { align: "center" });

    // Virtual Lab Coordinator (Right)
    pdf.setFont("times", "italic");
    pdf.setFontSize(17);
    pdf.setTextColor(11, 25, 44);
    pdf.text("Prof. Claude E. Shannon", 632, 470, { align: "center" });
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(1);
    pdf.line(547, 480, 717, 480);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("Prof. Claude E. Shannon", 632, 495, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text("Virtual Lab Coordinator", 632, 508, { align: "center" });

    // 9. Footer
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      "CryptoBreak Lab — Cryptography & System Security Virtual Laboratory • Academy Accreditation",
      421,
      560,
      { align: "center" }
    );

    pdf.save(fileName);
  } catch (vectorErr) {
    console.error("Vector PDF generation also failed:", vectorErr);
  }
}
