/* global process */
/**
 * test-feedback.js
 * Verification of Feedback options, data structure, validation, and storage functions.
 */

import {
  RATING_OPTIONS,
  FEEDBACK_CATEGORIES,
  IMPROVEMENT_AREAS,
  STORAGE_KEY,
  generateFeedbackId,
  saveFeedbackToStorage,
} from "./src/data/feedback.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✕ FAIL: ${message}`);
    failed++;
  }
}

console.log("=== TEST SUITE 1: FEEDBACK CONFIGURATION & OPTIONS ===");

assert(STORAGE_KEY === "cryptobreak-feedback", "Storage key is cryptobreak-feedback");

// 1. Rating options
assert(RATING_OPTIONS.length === 5, "Rating options has exactly 5 levels");
const expectedRatings = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Fair" },
  { value: 3, label: "Good" },
  { value: 4, label: "Very Good" },
  { value: 5, label: "Excellent" },
];
expectedRatings.forEach((r) => {
  const found = RATING_OPTIONS.find((item) => item.value === r.value && item.label === r.label);
  assert(Boolean(found), `Rating ${r.value} is '${r.label}'`);
});

// 2. Feedback Categories
const expectedCategories = [
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

assert(FEEDBACK_CATEGORIES.length === expectedCategories.length, `Has exactly ${expectedCategories.length} categories`);
expectedCategories.forEach((cat) => {
  assert(FEEDBACK_CATEGORIES.includes(cat), `Category includes '${cat}'`);
});

// 3. Improvement Areas
const expectedImprovements = [
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

assert(IMPROVEMENT_AREAS.length === expectedImprovements.length, `Has exactly ${expectedImprovements.length} improvement areas`);
expectedImprovements.forEach((area) => {
  assert(IMPROVEMENT_AREAS.includes(area), `Improvement area includes '${area}'`);
});

console.log("\n=== TEST SUITE 2: UNIQUE ID GENERATION ===");
const id1 = generateFeedbackId();
const id2 = generateFeedbackId();
assert(id1.startsWith("fb_"), `ID starts with fb_ prefix (got ${id1})`);
assert(id1 !== id2, `Generated IDs are unique (${id1} !== ${id2})`);

console.log("\n=== TEST SUITE 3: LOCAL STORAGE PROTOTYPE BEHAVIOR ===");
// Mock localStorage in Node environment
const mockStorage = {};
globalThis.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach((k) => delete mockStorage[k]); },
};

const sampleEntry = {
  id: generateFeedbackId(),
  rating: 5,
  category: "Overall Experience",
  feedback: "This virtual cryptography lab provides exceptional pedagogical clarity.",
  improvementArea: "More features",
  email: "student@university.edu",
  timestamp: new Date().toISOString(),
};

const result = saveFeedbackToStorage(sampleEntry);
assert(result.success === true, "saveFeedbackToStorage returns success: true");

const storedRaw = globalThis.localStorage.getItem(STORAGE_KEY);
assert(Boolean(storedRaw), "Data saved to localStorage under key 'cryptobreak-feedback'");
const storedList = JSON.parse(storedRaw);
assert(Array.isArray(storedList) && storedList.length === 1, "Stored data is an array of length 1");
assert(storedList[0].id === sampleEntry.id, "Stored entry has correct ID");
assert(storedList[0].rating === 5, "Stored entry has correct rating");
assert(storedList[0].category === "Overall Experience", "Stored entry has correct category");
assert(storedList[0].feedback === sampleEntry.feedback, "Stored entry has correct feedback text");
assert(storedList[0].improvementArea === "More features", "Stored entry has correct improvementArea");
assert(storedList[0].email === "student@university.edu", "Stored entry has correct email");
assert(Boolean(storedList[0].timestamp), "Stored entry has ISO timestamp");

// Test second entry appends without overwriting
const sampleEntry2 = {
  id: generateFeedbackId(),
  rating: 4,
  category: "Cipher Simulator",
  feedback: "Affine and Caesar cipher animations are very helpful.",
  improvementArea: "Visual design",
  email: "",
  timestamp: new Date().toISOString(),
};

saveFeedbackToStorage(sampleEntry2);
const updatedList = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY));
assert(updatedList.length === 2, "Second feedback entry appends cleanly (now 2 entries)");
assert(updatedList[1].id === sampleEntry2.id, "Second entry has correct ID");

// Test malformed storage resilience
globalThis.localStorage.setItem(STORAGE_KEY, "{corrupted-not-json");
const sampleEntry3 = {
  id: generateFeedbackId(),
  rating: 3,
  category: "Frequency Analysis",
  feedback: "Recovering monoalphabetic keys requires good patience.",
  improvementArea: "Ease of navigation",
  email: "",
  timestamp: new Date().toISOString(),
};
const recoverResult = saveFeedbackToStorage(sampleEntry3);
assert(recoverResult.success === true, "Handles corrupted localStorage without throwing");
const recoveredList = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY));
assert(recoveredList.length === 1 && recoveredList[0].id === sampleEntry3.id, "Reinitialized cleanly upon malformed data");

console.log("\n=============================================");
console.log(`TEST RUN COMPLETE: ${passed} passed, ${failed} failed`);
console.log("=============================================");

if (failed > 0) {
  process.exit(1);
}
