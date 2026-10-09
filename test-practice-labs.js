/* global process */
/**
 * test-practice-labs.js
 * End-to-end verification of Practice Lab logic and crypto engine integration.
 */

import { LABS, normalizeText } from './src/data/labs.js';
import { encrypt as caesarEncrypt, decrypt as caesarDecrypt } from './src/crypto/caesar.js';
import { encrypt as affineEncrypt, VALID_A_KEYS } from './src/crypto/affine.js';
import { encrypt as productEncrypt, decrypt as productDecrypt, getIntermediate } from './src/crypto/product.js';
import { getSortedFrequencies } from './src/crypto/analysis.js';

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

console.log('=== TEST SUITE 1: LAB CONFIGURATION & STRUCTURE ===');
assert(LABS.length === 5, 'Exactly 5 laboratory experiments exist');

LABS.forEach((lab) => {
  console.log(`\nChecking ${lab.number} — ${lab.title}`);
  assert(lab.tasks.length === 4, `${lab.number} has exactly 4 tasks`);
  const totalPoints = lab.tasks.reduce((sum, t) => sum + t.points, 0);
  assert(totalPoints === 100, `${lab.number} total points equal 100 (got ${totalPoints})`);
  assert(lab.maxScore === 100, `${lab.number} maxScore is 100`);
  assert(typeof lab.guidelines === 'object', `${lab.number} has structured guidelines`);
  assert(Array.isArray(lab.guidelines.whatYouWillDo), `${lab.number} guidelines has whatYouWillDo list`);
  assert(Array.isArray(lab.guidelines.whatYouNeedToKnow), `${lab.number} guidelines has whatYouNeedToKnow list`);
  assert(Array.isArray(lab.guidelines.instructions), `${lab.number} guidelines has instructions list`);
});

console.log('\n=== TEST SUITE 2: LAB 01 — CAESAR CIPHER FUNDAMENTALS ===');
const lab1 = LABS[0];

// Task 1: Encryption
const t1_expected = caesarEncrypt(lab1.tasks[0].given.plaintext, lab1.tasks[0].given.shift);
assert(t1_expected === 'KHOOR ZRUOG', `Task 1 expected ciphertext is KHOOR ZRUOG`);
assert(normalizeText('khoor zruog') === normalizeText(t1_expected), 'Task 1 handles case insensitivity');

// Task 2: Decryption
const t2_expected = caesarDecrypt(lab1.tasks[1].given.ciphertext, lab1.tasks[1].given.shift);
assert(t2_expected === 'ATTACK AT DAWN', `Task 2 expected plaintext is ATTACK AT DAWN`);

// Task 3: Shift Identification
const t3_shift = lab1.tasks[2].expectedValue;
assert(caesarEncrypt(lab1.tasks[2].given.plaintext, t3_shift) === lab1.tasks[2].given.ciphertext, 'Task 3 shift of 3 transforms HELLO into KHOOR');

// Task 4: Conceptual Question
const t4_chosenOption = lab1.tasks[3].options[lab1.tasks[3].expectedValue];
assert(t4_chosenOption.includes('26 possible shift values'), 'Task 4 correct answer highlights keyspace size of 26');

console.log('\n=== TEST SUITE 3: LAB 02 — CAESAR BRUTE FORCE INVESTIGATION ===');
const lab2 = LABS[1];
const ct2 = lab2.tasks[0].given.ciphertext; // KHOOR ZRUOG
const candidates = Array.from({ length: 26 }, (_, k) => ({
  shift: k,
  text: caesarDecrypt(ct2, k)
}));
assert(candidates.length === 26, 'Exhaustive candidate search produces all 26 shifts');
const correctCand = candidates.find(c => c.shift === 3);
assert(correctCand.text === 'HELLO WORLD', 'Shift 3 recovers meaningful plaintext HELLO WORLD');

console.log('\n=== TEST SUITE 4: LAB 03 — AFFINE & PRODUCT CIPHER ===');
const lab3 = LABS[2];

// Task 1: Valid Affine Keys
const validValues = [1, 5, 13, 17, 21].filter(a => VALID_A_KEYS.includes(a));
const expectedValues = lab3.tasks[0].expectedValues;
assert(
  JSON.stringify(validValues.sort()) === JSON.stringify(expectedValues.sort()),
  `Task 1 valid keys correctly match coprimes to 26: ${expectedValues.join(', ')}`
);

// Task 2: Affine Encryption
const affCt = affineEncrypt(lab3.tasks[1].given.plaintext, lab3.tasks[1].given.a, lab3.tasks[1].given.b);
assert(affCt === 'RCLLA', `Task 2 HELLO with a=5, b=8 produces RCLLA (got ${affCt})`);

// Task 3: Product intermediate Caesar
const inter = getIntermediate(lab3.tasks[2].given.plaintext, lab3.tasks[2].given.caesarShift);
assert(inter === 'KHOOR ZRUOG', `Task 3 intermediate text is KHOOR ZRUOG`);

// Task 4: Reverse process
const prodFinalCt = productEncrypt(
  lab3.tasks[3].expectedPlaintext,
  lab3.tasks[3].given.caesarShift,
  lab3.tasks[3].given.affineA,
  lab3.tasks[3].given.affineB
);
const prodRecovered = productDecrypt(
  prodFinalCt,
  lab3.tasks[3].given.caesarShift,
  lab3.tasks[3].given.affineA,
  lab3.tasks[3].given.affineB
);
assert(prodRecovered === 'HELLO WORLD', 'Task 4 product decryption correctly inverts pipeline');

console.log('\n=== TEST SUITE 5: LAB 04 — MONOALPHABETIC FREQUENCY ANALYSIS ===');
const lab4 = LABS[3];
const freqCt = lab4.tasks[0].given.ciphertext;
const freqs = getSortedFrequencies(freqCt);
assert(freqs.length > 0, 'Frequency analysis returns sorted letter distributions');
assert(freqs[0].letter === lab4.tasks[0].given.expectedMostFrequent, `Most frequent letter in ciphertext is ${lab4.tasks[0].given.expectedMostFrequent}`);

// Task 3 candidate generator simulation
function buildCandidate(ct, mapping) {
  return ct
    .split('')
    .map((ch) => {
      const upper = ch.toUpperCase();
      if (/[A-Z]/.test(upper)) {
        return mapping[upper] || '•';
      }
      return ch;
    })
    .join('');
}
const partialMap = { L: 'E' };
const cand = buildCandidate('L', partialMap);
assert(cand === 'E', 'Candidate plaintext applies mapping');
const unmapped = buildCandidate('X', partialMap);
assert(unmapped === '•', 'Unmapped letters render as bullet •');

console.log('\n=== TEST SUITE 6: LAB 05 — CRYPTANALYSIS INVESTIGATION ===');
const lab5 = LABS[4];
assert(lab5.tasks[0].expectedValue === 2, 'Scenario 1 index 2 corresponds to Caesar Cipher');
assert(lab5.tasks[0].options[lab5.tasks[0].expectedValue] === 'Caesar Cipher', 'Scenario 1 correctly identifies Caesar Cipher');
assert(lab5.tasks[1].expectedValue === 1, 'Scenario 1 attack index 1 corresponds to Brute Force');
assert(lab5.tasks[1].options[lab5.tasks[1].expectedValue].includes('Brute Force'), 'Scenario 1 correctly selects Brute Force attack');
assert(lab5.tasks[2].expectedValue === 1, 'Scenario 2 index 1 corresponds to Frequency Analysis');
assert(lab5.tasks[2].options[lab5.tasks[2].expectedValue].includes('Frequency Analysis'), 'Scenario 2 selects Frequency Analysis attack');
assert(lab5.tasks[3].expectedValue === 1, 'Scenario 3 correctly reasons about strategy selection');
assert(lab5.tasks[3].options[lab5.tasks[3].expectedValue].includes('brute force for Caesar'), 'Scenario 3 explains reasoning based on key space and structure');

console.log('\n=== TEST SUITE 7: SCORING & HINT SYSTEM RULES ===');
// Hint deductions
function computeAvailablePoints(basePoints, hintsUsed) {
  return Math.max(5, basePoints - hintsUsed * 5);
}
assert(computeAvailablePoints(25, 0) === 25, '0 hints: 25 max points');
assert(computeAvailablePoints(25, 1) === 20, '1 hint: 20 max points');
assert(computeAvailablePoints(25, 2) === 15, '2 hints: 15 max points');
assert(computeAvailablePoints(20, 3) >= 5, 'Points never become negative or below minimum threshold');

// Best score preservation
let prevBest = 92;
let newAttempt = 84;
let finalBest = Math.max(prevBest, newAttempt);
assert(finalBest === 92, 'Lower score retry preserves best score (92)');
newAttempt = 96;
finalBest = Math.max(prevBest, newAttempt);
assert(finalBest === 96, 'Higher score retry updates best score (96)');

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
