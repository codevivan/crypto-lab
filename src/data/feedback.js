/**
 * feedback.js
 * Definitions, options, and constants for the CryptoBreak Lab feedback system.
 */

export const RATING_OPTIONS = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Fair" },
  { value: 3, label: "Good" },
  { value: 4, label: "Very Good" },
  { value: 5, label: "Excellent" },
];

export const FEEDBACK_CATEGORIES = [
  "Overall Experience",
  "Dashboard",
  "Cipher Simulator",
  "Brute Force",
  "Frequency Analysis",
  "Practice Lab",
  "Concepts / Learn",
  "Attack Comparison",
  "Interface / Design",
  "Performance",
  "Bug Report",
  "Feature Request",
  "Other",
];

export const IMPROVEMENT_AREAS = [
  "Nothing right now",
  "Visual design",
  "Ease of navigation",
  "Cipher explanations",
  "Practical experiments",
  "Accuracy of results",
  "Accessibility",
  "Performance",
  "More features",
  "Other",
];

export const STORAGE_KEY = "cryptobreak-feedback";

/**
 * Generate a unique local feedback identifier.
 */
export function generateFeedbackId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `fb_${timestamp}_${randomStr}`;
}

/**
 * Safely persists feedback entry into localStorage.
 * Returns { success: true } or { success: false, error: string }
 */
export function saveFeedbackToStorage(entry) {
  try {
    let list = [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      } catch {
        list = [];
      }
    }

    list.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return { success: true };
  } catch {
    return {
      success: false,
      error:
        "Unable to save feedback to local browser storage. Storage quota may be exceeded or disabled in your browser settings.",
    };
  }
}
