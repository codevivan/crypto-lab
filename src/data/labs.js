/**
 * Practice Lab — Realistic Case-Study Laboratory Definitions
 *
 * Combines hands-on cryptography experiments with realistic scenario-based case studies:
 * Lab 1 — Caesar Cipher Investigation: Historical Message Interception
 * Lab 2 — Affine Cipher Workshop: Incorrectly Configured Encryption
 * Lab 3 — Product Cipher Laboratory: Transformation Pipeline Failure
 * Lab 4 — Substitution & Frequency Analysis: Investigating a Leaked Message
 * Lab 5 — Cryptanalysis Mission: Choose the Right Attack
 *
 * Open Access: All 5 labs accessible immediately in any order.
 * Each lab contains 6–7 case-study investigation tasks totaling exactly 100 points (500 pts total).
 * All ciphers use real deterministic math validated against src/crypto/* engines.
 */

// ──────────────────────────────────────────────────────────────────────────────
// HELPER: normalize answer strings for loose comparison
// ──────────────────────────────────────────────────────────────────────────────
export function normalizeText(str) {
  if (typeof str !== "string") return "";
  return str.toUpperCase().trim().replace(/\s+/g, " ");
}

// ──────────────────────────────────────────────────────────────────────────────
// LAB DEFINITIONS
// ──────────────────────────────────────────────────────────────────────────────

export const LABS = [
  // ════════════════════════════════════════════════════════════════
  // LAB 01 — CAESAR CIPHER: HISTORICAL MESSAGE INTERCEPTION
  // ════════════════════════════════════════════════════════════════
  {
    id: 1,
    number: "01",
    title: "Caesar Cipher Investigation: Historical Message Interception",
    topic: "Caesar Cipher",
    category: "CASE STUDY // FIELD INTERCEPTION",
    shortDescription:
      "Intercept an operational military dispatch, execute an automated brute-force attack, isolate candidate streams, and reconstruct tactical intelligence.",
    difficulty: "Beginner–Intermediate",
    estimatedTime: "~8 minutes",
    maxScore: 100,
    objective:
      "Investigate an intercepted tactical dispatch, determine the secret shift key using brute-force analysis, recover the verified plaintext, and debrief on keyspace vulnerability.",
    guidelines: {
      whatYouWillDo: [
        "Examine an intercepted tactical radio transmission and its transmission metadata.",
        "Launch an exhaustive brute-force search engine across all 26 possible shift keys.",
        "Identify the correct shift key and linguistically justify the selection against decoy candidates.",
        "Recover the complete operational plaintext instructions.",
        "Algorithmic verification of the Caesar decryption transformation.",
        "Debrief on the structural keyspace vulnerabilities of monoalphabetic shift ciphers.",
      ],
      whatYouNeedToKnow: [
        "Caesar ciphers shift each letter uniformly by key K (0–25) modulo 26.",
        "Spaces, digits, and punctuation characters are preserved unchanged.",
        "The total keyspace is only 26 keys, making exhaustive search computationally trivial in O(1) time.",
      ],
      instructions: [
        "All five labs are open and accessible immediately in any order.",
        "Interact with the evidence panel in each task to deduce the required findings.",
        "Earn all 100 points to complete this case study.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Examine Intercepted Evidence & Ciphertext Record",
        description:
          "Signals intelligence intercepted a tactical dispatch on a military frequency. Punctuation, digits ('0600'), and colons remain intact. Notice the opening word 'WKLV'. Compare this word with the common English military opening 'THIS'. Deduce the candidate shift key K.",
        points: 15,
        type: "number-answer",
        caseId: "CASE-C01 // STEP 1",
        scenario:
          "At 04:32Z, an outpost listening station intercepted an encrypted radio transmission on VHF Band 3. Preliminary SIGINT reports suggest a classical Caesar shift cipher was used to encode tactical movement orders.",
        objective:
          "Inspect the intercepted evidence record and calculate the candidate shift key K using crib alignment on the opening word.",
        evidence: {
          transmissionId: "INTEL-SIGINT-014",
          interceptSource: "VHF Military Channel 4 (04:32Z)",
          interceptedCiphertext:
            "WKLV LV DQ RSHUDWLRQDO GLVSDWFK: DOO XQLWV PXVW ZLWKGUDZ WR WKH VHFRQGDUB FRQWDLQPHQW OLQH DW 0600 KRXUV.",
          cribAnalysis: "Ciphertext 'WKLV' matches candidate English opening 'THIS'.",
        },
        given: {
          ciphertext:
            "WKLV LV DQ RSHUDWLRQDO GLVSDWFK: DOO XQLWV PXVW ZLWKGUDZ WR WKH VHFRQGDUB FRQWDLQPHQW OLQH DW 0600 KRXUV.",
        },
        expectedKey: "shiftValue",
        expectedValue: 3,
        hints: [
          { text: "Compare letter indices: W is index 22, T is index 19. (22 - 19) = 3.", cost: 3 },
          { text: "Verify: K(10) - 3 = 7 ('H'), L(11) - 3 = 8 ('I'), V(21) - 3 = 18 ('S'). The shift is K = 3.", cost: 4 },
        ],
        feedbackCorrect:
          "Evidence verified! Ciphertext word 'WKLV' aligns with 'THIS' under shift K = 3 (W:22 - 3 = T:19).",
        feedbackIncorrect:
          "Incorrect shift key. Calculate the offset: Index(W) - Index(T) = 22 - 19 = 3.",
      },
      {
        id: 2,
        title: "Execute Exhaustive Brute-Force Attack",
        description:
          "To eliminate any possibility of coincidence, deploy the automated brute-force attack engine to compute all 26 possible shift candidates for the intercepted dispatch.",
        points: 15,
        type: "brute-force-action",
        caseId: "CASE-C01 // STEP 2",
        scenario:
          "Standard operating procedure requires evaluating all candidate shifts to verify that no alternative English decryptions exist.",
        objective:
          "Run the automated brute-force decryption engine and inspect the resulting candidate plaintexts.",
        evidence: {
          attackMethod: "Exhaustive Key Search",
          searchSpaceSize: "26 Keys (K = 00 through 25)",
        },
        given: {
          ciphertext:
            "WKLV LV DQ RSHUDWLRQDO GLVSDWFK: DOO XQLWV PXVW ZLWKGUDZ WR WKH VHFRQGDUB FRQWDLQPHQW OLQH DW 0600 KRXUV.",
        },
        expectedKey: "bruteForceRun",
        hints: [
          { text: "Click 'Run Exhaustive Brute-Force Engine' to generate and index all 26 candidate streams.", cost: 3 },
        ],
        feedbackCorrect:
          "Brute-force telemetry generated! All 26 candidate outputs are indexed below for forensic inspection.",
        feedbackIncorrect:
          "Click 'Run Exhaustive Brute-Force Engine' to compute the candidate outputs.",
      },
      {
        id: 3,
        title: "Identify Correct Shift & Linguistic Justification",
        description:
          "From the 26 computed candidate streams, select the row containing intelligible, coherent English military instructions and confirm shift K = 3.",
        points: 15,
        type: "candidate-select",
        caseId: "CASE-C01 // STEP 3",
        scenario:
          "The analyst must isolate the true signal from the 25 noise streams and confirm the shift key based on natural language syntax.",
        objective:
          "Select the valid English candidate stream corresponding to shift K = 3.",
        evidence: {
          targetCiphertext:
            "WKLV LV DQ RSHUDWLRQDO GLVSDWFK: DOO XQLWV PXVW ZLWKGUDZ WR WKH VHFRQGDUB FRQWDLQPHQW OLQH DW 0600 KRXUV.",
          keySelectionCriteria: "Syntactically valid military instructions with English n-gram frequencies.",
        },
        given: {
          ciphertext:
            "WKLV LV DQ RSHUDWLRQDO GLVSDWFK: DOO XQLWV PXVW ZLWKGUDZ WR WKH VHFRQGDUB FRQWDLQPHQW OLQH DW 0600 KRXUV.",
          correctShift: 3,
        },
        expectedKey: "candidateSelect",
        hints: [
          { text: "Scan candidate list for K = 03. W(22)-3=T, K(10)-3=H, L(11)-3=I, V(21)-3=S → 'THIS IS AN OPERATIONAL...'.", cost: 3 },
        ],
        feedbackCorrect:
          "Key confirmed! Candidate K = 03 reveals the coherent operational military order.",
        feedbackIncorrect:
          "Incorrect candidate. Scan the generated candidate list for the readable English stream at K = 03.",
      },
      {
        id: 4,
        title: "Recover Complete Operational Plaintext",
        description:
          "Enter the complete decrypted English plaintext recovered from candidate K = 3 to record the operational intelligence.",
        points: 20,
        type: "text-answer",
        caseId: "CASE-C01 // STEP 4",
        scenario:
          "The field command center requires the exact plaintext of the intercepted orders for threat assessment.",
        objective:
          "Transcribe and verify the complete recovered plaintext dispatch.",
        evidence: {
          selectedShift: "K = 3",
          expectedLength: "107 characters (including punctuation and numeric time)",
        },
        given: {
          ciphertext:
            "WKLV LV DQ RSHUDWLRQDO GLVSDWFK: DOO XQLWV PXVW ZLWKGUDZ WR WKH VHFRQGDUB FRQWDLQPHQW OLQH DW 0600 KRXUV.",
          shift: 3,
        },
        expectedKey: "caesarDecrypt",
        hints: [
          { text: "Decrypt each letter with P = (C - 3 + 26) mod 26. Maintain punctuation and '0600 HOURS.'.", cost: 4 },
          { text: "Plaintext: 'THIS IS AN OPERATIONAL DISPATCH: ALL UNITS MUST WITHDRAW TO THE SECONDARY CONTAINMENT LINE AT 0600 HOURS.'", cost: 5 },
        ],
        feedbackCorrect:
          "Plaintext successfully recovered! 'THIS IS AN OPERATIONAL DISPATCH: ALL UNITS MUST WITHDRAW TO THE SECONDARY CONTAINMENT LINE AT 0600 HOURS.'.",
        feedbackIncorrect:
          "Incorrect plaintext. Enter: 'THIS IS AN OPERATIONAL DISPATCH: ALL UNITS MUST WITHDRAW TO THE SECONDARY CONTAINMENT LINE AT 0600 HOURS.'.",
      },
      {
        id: 5,
        title: "Algorithmic Decryption Verification",
        description:
          "How does the formal Caesar decryption function algorithmically reverse the encryption process to guarantee faithful recovery?",
        points: 15,
        type: "multiple-choice",
        caseId: "CASE-C01 // STEP 5",
        scenario:
          "The intelligence unit conducts an audit of the automated decryption tool to confirm mathematical soundness.",
        objective:
          "Identify the correct algebraic inverse formula that restores plaintext P from ciphertext C.",
        options: [
          "P = (C − K + 26) mod 26; adding 26 prevents negative modular residues in standard modular arithmetic",
          "P = (C + K) mod 26; decryption repeats the forward shift until the message wraps around",
          "P = (C × K) mod 26; modular multiplication inverts addition",
          "P = (C − 13) mod 26; all classical ciphers invert using ROT13",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Decryption subtracts the key K. Adding 26 ensures the operand is non-negative before modulo 26.", cost: 3 },
        ],
        feedbackCorrect:
          "Algorithmic verification confirmed! P = (C − K + 26) mod 26 correctly computes the additive modular inverse.",
        feedbackIncorrect:
          "Incorrect formula. Decryption subtracts K: P = (C − K + 26) mod 26.",
      },
      {
        id: 6,
        title: "Vulnerability Debrief: Exhaustive Search Feasibility",
        description:
          "Complete the case debrief: Why is the Caesar cipher categorically insecure against adversary interception in operational environments?",
        points: 20,
        type: "multiple-choice",
        caseId: "CASE-C01 // DEBRIEF",
        scenario:
          "Submit your final case debrief to the cryptographic oversight committee summarizing the fatal vulnerability of the Caesar cipher.",
        objective:
          "Explain why small keyspaces make ciphers completely vulnerable to exhaustive search attacks.",
        options: [
          "With only 26 possible keys, an adversary can exhaust the entire keyspace in under a millisecond, rendering secrecy completely dependent on security-through-obscurity",
          "Caesar ciphers can only encrypt short words under 10 letters",
          "Caesar ciphers produce corrupted characters whenever numbers are transmitted",
          "The cipher requires internet connectivity to transmit key schedules",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Kerckhoffs's Principle: Security must reside solely in the key. When the keyspace is only 26, brute force is trivial.", cost: 4 },
        ],
        feedbackCorrect:
          "Case Study 1 Debrief Complete! The 26-key search space violates Kerckhoffs's principle, allowing trivial exhaustive search. Outstanding investigation!",
        feedbackIncorrect:
          "Incorrect debrief. The fatal flaw is the minute 26-key search space, allowing instantaneous brute force.",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // LAB 02 — AFFINE CIPHER: INCORRECTLY CONFIGURED ENCRYPTION
  // ════════════════════════════════════════════════════════════════
  {
    id: 2,
    number: "02",
    title: "Affine Cipher Workshop: Incorrectly Configured Encryption",
    topic: "Affine Cipher",
    category: "CASE STUDY // CONFIGURATION AUDIT",
    shortDescription:
      "Audit a security trainee's flawed Affine configuration, diagnose fatal collision defects, derive modular inverses, and recover the compromised transmission.",
    difficulty: "Intermediate",
    estimatedTime: "~10 minutes",
    maxScore: 100,
    objective:
      "Diagnose an invalid Affine multiplier key, demonstrate irreversible letter collisions, calculate modular inverses with the Euclidean algorithm, and recover the secure message with the corrected configuration.",
    guidelines: {
      whatYouWillDo: [
        "Audit a trainee's Affine key configuration record containing multiplier a = 4, shift b = 7.",
        "Calculate gcd(4, 26) to demonstrate why the multiplier key fails invertibility.",
        "Compute the modular multiplicative inverse for the corrected key a = 9 modulo 26.",
        "Diagnose the mathematical collision defect where distinct plaintext letters map to identical ciphertext letters.",
        "Decrypt the intercepted transmission 'NRZFEBWP' using the validated key configuration.",
        "Verify the recovered plaintext and deliver the mathematical bijectivity debrief.",
      ],
      whatYouNeedToKnow: [
        "Affine encryption formula: E(x) = (ax + b) mod 26.",
        "Affine decryption formula: D(y) = a⁻¹(y − b) mod 26.",
        "A multiplier key 'a' is invertible if and only if gcd(a, 26) = 1. If gcd(a, 26) > 1, the mapping collapses and loses information.",
      ],
      instructions: [
        "Follow the audit steps sequentially.",
        "Use modular arithmetic over the English alphabet (A = 0, ..., Z = 25).",
        "Earn all 100 points to complete this case study.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Inspect Supplied Key Configuration Record",
        description:
          "A trainee's configuration file reads: 'KEY_CONFIG: a = 4, b = 7'. Calculate gcd(4, 26) to determine whether the multiplication key satisfies invertibility requirements.",
        points: 15,
        type: "number-answer",
        caseId: "CASE-A02 // STEP 1",
        scenario:
          "During an internal security review, an automated monitor flagged an Affine encryption deployment. The trainee reported that certain messages could not be decrypted after transmission.",
        objective:
          "Compute the greatest common divisor gcd(4, 26) of the configured multiplier key.",
        evidence: {
          auditTarget: "Trainee Script: secure_channel_v1.cfg",
          configuredMultiplier: "a = 4",
          configuredShift: "b = 7",
          alphabetModulus: "m = 26",
        },
        given: { a: 4, modulus: 26 },
        expectedKey: "numberValue",
        expectedValue: 2,
        hints: [
          { text: "Find the greatest common factor between 4 and 26. Both are divisible by 2.", cost: 3 },
          { text: "gcd(4, 26) = 2. Enter 2.", cost: 4 },
        ],
        feedbackCorrect:
          "Audit verified! gcd(4, 26) = 2. Because gcd(a, 26) ≠ 1, the key is mathematically invalid and non-invertible.",
        feedbackIncorrect:
          "Incorrect GCD. 4 = 2 × 2 and 26 = 2 × 13. Their greatest common divisor is 2.",
      },
      {
        id: 2,
        title: "Determine Multiplier Key Coprimality",
        description:
          "To fix the trainee's configuration, inspect replacement candidate keys a ∈ {4, 9, 13, 17, 20, 25}. Select all values that satisfy gcd(a, 26) = 1.",
        points: 15,
        type: "multi-select",
        caseId: "CASE-A02 // STEP 2",
        scenario:
          "The trainee needs a replacement key coprime to 26 so the encryption function remains bijective and reversible.",
        objective:
          "Filter and select all candidate multiplier keys that are coprime to 26.",
        evidence: {
          candidatePool: "a ∈ {4, 9, 13, 17, 20, 25}",
          coprimalityCondition: "gcd(a, 26) == 1",
        },
        options: [
          { value: 4, label: "a = 4 (gcd = 2)" },
          { value: 9, label: "a = 9 (gcd = 1)" },
          { value: 13, label: "a = 13 (gcd = 13)" },
          { value: 17, label: "a = 17 (gcd = 1)" },
          { value: 20, label: "a = 20 (gcd = 2)" },
          { value: 25, label: "a = 25 (gcd = 1)" },
        ],
        expectedKey: "validAffineKeys",
        expectedValues: [9, 17, 25],
        hints: [
          { text: "Discard even numbers (4, 20) and multiples of 13 (13).", cost: 3 },
          { text: "The valid coprime values are 9, 17, and 25.", cost: 4 },
        ],
        feedbackCorrect:
          "Candidate pool validated! Keys a = 9, 17, and 25 satisfy gcd(a, 26) = 1 and can be inverted modulo 26.",
        feedbackIncorrect:
          "Incorrect selection. Only select keys where gcd(a, 26) = 1 (values 9, 17, and 25).",
      },
      {
        id: 3,
        title: "Calculate Modular Multiplicative Inverse",
        description:
          "The trainee chooses replacement key a = 9. Calculate its modular multiplicative inverse a⁻¹ modulo 26 such that (9 · a⁻¹) ≡ 1 (mod 26).",
        points: 15,
        type: "number-answer",
        caseId: "CASE-A02 // STEP 3",
        scenario:
          "To prepare the decryption script, the trainee must compute the modular multiplicative inverse of the replacement key a = 9.",
        objective:
          "Calculate an integer x (1–25) satisfying (9 × x) mod 26 = 1.",
        evidence: {
          selectedKey: "a = 9",
          modulus: "m = 26",
          inverseEquation: "(9 × a⁻¹) ≡ 1 (mod 26)",
        },
        given: { a: 9, modulus: 26 },
        expectedKey: "modInverseCalc",
        expectedValue: 3,
        hints: [
          { text: "Test small multiples: 9 × 1 = 9; 9 × 2 = 18; 9 × 3 = 27.", cost: 3 },
          { text: "Notice 27 = 26 + 1 ≡ 1 (mod 26). Therefore 9⁻¹ mod 26 = 3. Enter 3.", cost: 4 },
        ],
        feedbackCorrect:
          "Modular inverse confirmed! 9⁻¹ mod 26 = 3 because 9 × 3 = 27 ≡ 1 (mod 26).",
        feedbackIncorrect:
          "Incorrect inverse. Calculate x where (9 × x) mod 26 = 1. Notice 9 × 3 = 27 = 1 mod 26.",
      },
      {
        id: 4,
        title: "Diagnose Collision Failure on Invalid Configuration",
        description:
          "Demonstrate the mathematical failure of the original key a = 4, b = 7: Under E(x) = (4x + 7) mod 26, plaintext 'A' (x=0) gives E(0) = 7 ('H'), and 'N' (x=13) gives E(13) = (52+7) mod 26 = 7 ('H'). Diagnose why this breaks decryption.",
        points: 20,
        type: "multiple-choice",
        caseId: "CASE-A02 // STEP 4",
        scenario:
          "The trainee needs an explanation of why an invalid key produces unrecoverable errors.",
        objective:
          "Identify the algebraic reason why gcd(a, 26) > 1 causes irreversible information loss.",
        options: [
          "Because gcd(4, 26) = 2, the function is non-injective (many-to-one), collapsing the 26-letter alphabet into only 13 outputs; distinct letters collide into identical ciphertext letters, making unique decryption impossible",
          "Because 4 is smaller than 7, modular operations create negative outputs",
          "Because vowels and consonants cannot share the same affine transformation",
          "Because the Affine cipher requires b to be prime",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Both 'A' and 'N' produce 'H'. When the receiver sees 'H', there is no mathematical way to know whether it was 'A' or 'N'.", cost: 4 },
        ],
        feedbackCorrect:
          "Defect diagnosed! When gcd(a, 26) > 1, the mapping is non-injective (many-to-one). Collisions permanently destroy plaintext data.",
        feedbackIncorrect:
          "Incorrect diagnosis. The failure is due to non-injectivity: gcd(4, 26) = 2 collapses the alphabet into 13 values, causing fatal collisions.",
      },
      {
        id: 5,
        title: "Decrypt Message with Valid Key Configuration",
        description:
          "The trainee re-encrypted the transmission using the valid key pair a = 9 and b = 7, producing ciphertext 'NRZFEBWP'. Using a⁻¹ = 3, decrypt the message with D(y) = 3(y − 7) mod 26.",
        points: 20,
        type: "text-answer",
        caseId: "CASE-A02 // STEP 5",
        scenario:
          "With the corrected key pair (a = 9, b = 7), recover the sensitive transmission sent by the trainee.",
        objective:
          "Apply the Affine decryption function D(y) = 3(y − 7) mod 26 to 'NRZFEBWP'.",
        evidence: {
          correctedCiphertext: "NRZFEBWP",
          validatedKey: "a = 9, b = 7",
          modularInverse: "a⁻¹ = 3",
          decryptionFormula: "D(y) = 3 · (y − 7) mod 26",
        },
        given: {
          ciphertext: "NRZFEBWP",
          a: 9,
          b: 7,
          a_inv: 3,
        },
        expectedKey: "affineDecrypt",
        hints: [
          { text: "For letter N (13): 13 - 7 = 6; (3 × 6) mod 26 = 18 ('S').", cost: 4 },
          { text: "For letter R (17): 17 - 7 = 10; (3 × 10) mod 26 = 30 mod 26 = 4 ('E'). Plaintext begins with 'SE...'.", cost: 5 },
        ],
        feedbackCorrect:
          "Decryption verified! 'NRZFEBWP' decrypted with key pair (a=9, b=7) recovers the operational keyword: 'SECURITY'.",
        feedbackIncorrect:
          "Incorrect plaintext. Apply D(y) = 3(y − 7) mod 26 to 'NRZFEBWP'. Expected: 'SECURITY'.",
      },
      {
        id: 6,
        title: "Plaintext Verification & Mathematical Debrief",
        description:
          "Which algebraic proof demonstrates why the round-trip decryption identity D(E(x)) = x mod 26 holds for every letter x when gcd(a, 26) = 1?",
        points: 15,
        type: "multiple-choice",
        caseId: "CASE-A02 // DEBRIEF",
        scenario:
          "Document the formal proof for the trainee's training record to prevent future configuration errors.",
        objective:
          "Select the correct algebraic identity confirming round-trip bijectivity.",
        options: [
          "D(E(x)) = a⁻¹((ax + b) − b) ≡ a⁻¹(ax) ≡ (a⁻¹a)x ≡ 1 · x = x (mod 26)",
          "D(E(x)) = (ax + b) + (a⁻¹x − b) ≡ 2ax mod 26",
          "D(E(x)) = (ax · a⁻¹x) + (b − b) ≡ x² mod 26",
          "D(E(x)) = (a + a⁻¹) · (b − b) ≡ 26x mod 26",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Substitute E(x) into D(y): D(E(x)) = a⁻¹(E(x) - b) = a⁻¹((ax + b) - b). The b terms cancel, leaving (a⁻¹a)x = 1·x = x mod 26.", cost: 3 },
        ],
        feedbackCorrect:
          "Case Study 2 Complete! You diagnosed the collision flaw, derived modular inverses, and proved round-trip bijectivity. Excellent cryptanalytic audit!",
        feedbackIncorrect:
          "Incorrect proof. D(E(x)) = a⁻¹((ax + b) − b) = a⁻¹(ax) = (a⁻¹a)x = 1 · x = x (mod 26).",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // LAB 03 — PRODUCT CIPHER: TRANSFORMATION PIPELINE FAILURE
  // ════════════════════════════════════════════════════════════════
  {
    id: 3,
    number: "03",
    title: "Product Cipher Laboratory: Transformation Pipeline Failure",
    topic: "Product Cipher",
    category: "CASE STUDY // PIPELINE FAILURE",
    shortDescription:
      "Investigate a two-stage cryptographic pipeline breakdown, diagnose inverted transformation sequences, and execute correct reverse-order decryption.",
    difficulty: "Intermediate–Advanced",
    estimatedTime: "~10 minutes",
    maxScore: 100,
    objective:
      "Inspect a multi-stage cipher composition (Caesar then Affine), diagnose incorrect inversion order defects, execute strict reverse-order decryption, and reduce the pipeline to an equivalent single-stage Affine transformation.",
    guidelines: {
      whatYouWillDo: [
        "Inspect the multi-stage encryption pipeline configuration: Caesar(K = 5) followed by Affine(a = 7, b = 10).",
        "Compute and record the intermediate Caesar ciphertext state.",
        "Generate the final Affine-transformed product ciphertext.",
        "Diagnose the analyst's pipeline failure caused by attempting decryption in the wrong order.",
        "Execute Step 1 of correct reverse decryption (Affine inverse).",
        "Execute Step 2 of correct reverse decryption (Caesar inverse) to recover 'DEFEND THE MATRIX'.",
      ],
      whatYouNeedToKnow: [
        "In this project: Product Cipher = Caesar(K) followed by Affine(a, b).",
        "Function composition is non-commutative: Affine(Caesar(P)) ≠ Caesar(Affine(P)).",
        "Decryption must apply inverse operations in REVERSE order: (g ∘ f)⁻¹ = f⁻¹ ∘ g⁻¹.",
        "Linear composition: a(x + K) + b = ax + (aK + b) mod 26, which is equivalent to a single Affine cipher.",
      ],
      instructions: [
        "Track intermediate text carefully between transformation layers.",
        "Decryption must invert the second layer before inverting the first layer.",
        "Earn all 100 points to complete this case study.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Inspect Pipeline & Calculate Intermediate State",
        description:
          "Case File Record: Plaintext 'DEFEND THE MATRIX' passes into Layer 1: Caesar shift K = 5. Calculate the exact intermediate text generated before Layer 2 executes.",
        points: 15,
        type: "text-answer",
        caseId: "CASE-P03 // STEP 1",
        scenario:
          "A secure gateway uses a layered product cipher. Telemetry logs show the message was processed by Layer 1 (Caesar) before being passed to Layer 2 (Affine).",
        objective:
          "Compute the intermediate state T = Caesar('DEFEND THE MATRIX', 5).",
        evidence: {
          pipelineStage: "Layer 1 of 2: Caesar Transformation",
          inputPlaintext: "DEFEND THE MATRIX",
          caesarShift: "K = 5",
        },
        given: {
          plaintext: "DEFEND THE MATRIX",
          caesarShift: 5,
        },
        expectedKey: "caesarEncryptIntermediate",
        hints: [
          { text: "Shift each letter forward by 5: D(3) → I(8), E(4) → J(9), F(5) → K(10)...", cost: 3 },
          { text: "Intermediate text starts with 'IJKJSI YMJ...'. Full string: 'IJKJSI YMJ RFYWNC'.", cost: 4 },
        ],
        feedbackCorrect:
          "Intermediate state captured! 'DEFEND THE MATRIX' shifted by K=5 produces: 'IJKJSI YMJ RFYWNC'.",
        feedbackIncorrect:
          "Incorrect intermediate text. Apply Caesar shift K=5 to 'DEFEND THE MATRIX'. Expected: 'IJKJSI YMJ RFYWNC'.",
      },
      {
        id: 2,
        title: "Obtain Final Affine-Transformed Ciphertext",
        description:
          "Now apply Layer 2: Affine transformation with a = 7, b = 10 to the intermediate state 'IJKJSI YMJ RFYWNC' using E(x) = (7x + 10) mod 26.",
        points: 20,
        type: "text-answer",
        caseId: "CASE-P03 // STEP 2",
        scenario:
          "The intermediate stream from Layer 1 is transformed by Layer 2 (Affine) to generate the final product ciphertext.",
        objective:
          "Compute the final product ciphertext C = Affine('IJKJSI YMJ RFYWNC', 7, 10).",
        evidence: {
          pipelineStage: "Layer 2 of 2: Affine Transformation",
          intermediateInput: "IJKJSI YMJ RFYWNC",
          affineKey: "a = 7, b = 10",
        },
        given: {
          intermediate: "IJKJSI YMJ RFYWNC",
          affineA: 7,
          affineB: 10,
        },
        expectedKey: "productEncryptFinal",
        expectedValue: "OVCVGO WQV ZTWIXY",
        hints: [
          { text: "Apply E(x) = (7x + 10) mod 26 to each letter of 'IJKJSI YMJ RFYWNC'.", cost: 4 },
          { text: "I(8) → (56 + 10) mod 26 = 14 ('O'). J(9) → (63 + 10) mod 26 = 21 ('V'). Expected: 'OVCVGO WQV ZTWIXY'.", cost: 5 },
        ],
        feedbackCorrect:
          "Final product ciphertext generated! 'IJKJSI YMJ RFYWNC' transformed by Affine(7, 10) produces: 'OVCVGO WQV ZTWIXY'.",
        feedbackIncorrect:
          "Incorrect ciphertext. Apply E(x) = (7x + 10) mod 26 to 'IJKJSI YMJ RFYWNC'. Expected: 'OVCVGO WQV ZTWIXY'.",
      },
      {
        id: 3,
        title: "Diagnose Pipeline Inversion Failure (Wrong Order)",
        description:
          "Incident Report: A field technician attempted recovery by running Caesar decryption FIRST, then Affine decryption, producing corrupted gibberish. Diagnose why reversing the decryption order caused complete pipeline failure.",
        points: 15,
        type: "multiple-choice",
        caseId: "CASE-P03 // STEP 3",
        scenario:
          "The field team reported a corrupted output from their automated decryption tool. Investigation reveals the stages were triggered in the wrong sequence.",
        objective:
          "Explain why composite transformations must be inverted in strict reverse order: (g ∘ f)⁻¹ = f⁻¹ ∘ g⁻¹.",
        options: [
          "Function composition is non-commutative: Since encryption applied Caesar first then Affine second (g ∘ f), decryption must invert the outermost layer first (f⁻¹ ∘ g⁻¹). Applying Caesar inverse directly to Affine ciphertext shifts values before they are scaled, corrupting modular arithmetic",
          "Caesar decryption produces negative numbers that break the Affine cipher",
          "Because Caesar ciphers cannot process letters encrypted by Affine ciphers",
          "Because the product cipher requires double the alphabet size",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Think of socks and shoes: shoes must be removed before socks. The last operation applied must be the first undone.", cost: 3 },
        ],
        feedbackCorrect:
          "Pipeline failure diagnosed! Inverting composite functions strictly requires reverse execution: (g ∘ f)⁻¹ = f⁻¹ ∘ g⁻¹. Inverting Caesar first operates on scaled Affine residues, corrupting the recovery.",
        feedbackIncorrect:
          "Incorrect diagnosis. Decryption must reverse the transformation pipeline: Affine inverse must be executed first, followed by Caesar inverse.",
      },
      {
        id: 4,
        title: "Execute Correct Inversion: Step 1 (Affine Decryption)",
        description:
          "Execute Step 1 of correct decryption: Apply Affine inverse decryption with a = 7 (a⁻¹ = 15) and b = 10 to ciphertext 'OVCVGO WQV ZTWIXY' using D(y) = 15(y − 10) mod 26.",
        points: 15,
        type: "text-answer",
        caseId: "CASE-P03 // STEP 4",
        scenario:
          "Correct the field team's mistake by executing the first inverse stage: removing Layer 2 (Affine).",
        objective:
          "Recover the intermediate Caesar state by applying Affine decryption.",
        evidence: {
          stepTarget: "Layer 2 Inversion",
          inputCiphertext: "OVCVGO WQV ZTWIXY",
          inverseKey: "a⁻¹ = 15, b = 10",
        },
        given: {
          ciphertext: "OVCVGO WQV ZTWIXY",
          affineA: 7,
          affineB: 10,
          a_inv: 15,
        },
        expectedKey: "productDecryptAffineStep",
        expectedValue: "IJKJSI YMJ RFYWNC",
        hints: [
          { text: "Apply D(y) = 15(y − 10) mod 26 to 'OVCVGO WQV ZTWIXY'.", cost: 3 },
          { text: "This reverses Layer 2 and restores intermediate state: 'IJKJSI YMJ RFYWNC'.", cost: 4 },
        ],
        feedbackCorrect:
          "Step 1 inversion successful! Affine decryption of 'OVCVGO WQV ZTWIXY' restores intermediate state: 'IJKJSI YMJ RFYWNC'.",
        feedbackIncorrect:
          "Incorrect text. Affine decryption of 'OVCVGO WQV ZTWIXY' with a=7, b=10 must restore 'IJKJSI YMJ RFYWNC'.",
      },
      {
        id: 5,
        title: "Execute Correct Inversion: Step 2 (Caesar Decryption)",
        description:
          "Execute Step 2 of correct decryption: Apply Caesar inverse decryption (shift K = 5) to the recovered intermediate state 'IJKJSI YMJ RFYWNC' using P = (T − 5 + 26) mod 26.",
        points: 15,
        type: "text-answer",
        caseId: "CASE-P03 // STEP 5",
        scenario:
          "With Layer 2 removed, invert Layer 1 (Caesar) to recover the original operational plaintext.",
        objective:
          "Recover the final operational plaintext.",
        evidence: {
          stepTarget: "Layer 1 Inversion",
          intermediateInput: "IJKJSI YMJ RFYWNC",
          caesarShift: "K = 5",
        },
        given: {
          intermediate: "IJKJSI YMJ RFYWNC",
          caesarShift: 5,
        },
        expectedKey: "productDecryptCaesarStep",
        expectedValue: "DEFEND THE MATRIX",
        hints: [
          { text: "Shift each letter of 'IJKJSI YMJ RFYWNC' backward by 5 positions.", cost: 3 },
          { text: "Plaintext restores the operational order: 'DEFEND THE MATRIX'.", cost: 4 },
        ],
        feedbackCorrect:
          "Pipeline recovery complete! Caesar decryption restores original operational plaintext: 'DEFEND THE MATRIX'.",
        feedbackIncorrect:
          "Incorrect plaintext. Shift each letter of 'IJKJSI YMJ RFYWNC' backward by 5 to recover 'DEFEND THE MATRIX'.",
      },
      {
        id: 6,
        title: "Sequential Transformation Equivalence & Debrief",
        description:
          "Algebraic Synthesis: The two-stage pipeline E(x) = 7(x + 5) + 10 mod 26 collapses into a single Affine cipher E(x) = (Ax + B) mod 26. Calculate the effective single-stage additive key B = (7·5 + 10) mod 26.",
        points: 20,
        type: "number-answer",
        caseId: "CASE-P03 // DEBRIEF",
        scenario:
          "Demonstrate why chaining linear classical ciphers fails to provide exponential security improvements.",
        objective:
          "Calculate the effective single-stage additive parameter B.",
        evidence: {
          compositeFormula: "E(x) = 7(x + 5) + 10 = 7x + 35 + 10 = 7x + 45 mod 26",
          modulus: "m = 26",
        },
        given: {
          caesarShift: 5,
          affineA: 7,
          affineB: 10,
        },
        expectedKey: "numberValue",
        expectedValue: 19,
        hints: [
          { text: "Compute 45 mod 26: 45 - 26 = 19. Enter 19.", cost: 4 },
        ],
        feedbackCorrect:
          "Case Study 3 Complete! B = (7 × 5 + 10) mod 26 = 45 mod 26 = 19. You proved that composing linear transformations collapses into a single affine key without increasing cryptographic security.",
        feedbackIncorrect:
          "Incorrect value for B. Compute (7 × 5 + 10) mod 26 = 45 mod 26 = 19.",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // LAB 04 — SUBSTITUTION & FREQUENCY ANALYSIS: LEAKED MESSAGE
  // ════════════════════════════════════════════════════════════════
  {
    id: 4,
    number: "04",
    title: "Substitution & Frequency Analysis: Investigating a Leaked Message",
    topic: "Substitution & Frequency Analysis",
    category: "CASE STUDY // LEAKED TRANSMISSION",
    shortDescription:
      "Investigate a leaked 134-character monoalphabetic substitution transcript, diagnose naive rank-matching errors, anchor trigrams, and map the key.",
    difficulty: "Advanced",
    estimatedTime: "~12 minutes",
    maxScore: 100,
    objective:
      "Conduct empirical statistical cryptanalysis on an intercepted leaked transmission, avoid naive unigram traps, anchor key mappings with trigrams, iteratively map the key with real-time preview, and evaluate statistical certainty.",
    guidelines: {
      whatYouWillDo: [
        "Inspect the 134-character leaked transmission and generate its unigram frequency distribution.",
        "Compare observed letter percentages with standard English corpus distributions.",
        "Analyze high-frequency trigrams ('WKH' → 'THE') to establish confident mapping anchors.",
        "Enforce one-to-one mapping constraints (injective bijectivity).",
        "Diagnose and revise an initial incorrect mapping that created invalid word structures.",
        "Configure the interactive substitution key mapper and recover the plaintext message.",
        "Debrief on the forensic uncertainty limits of frequency analysis.",
      ],
      whatYouNeedToKnow: [
        "Monoalphabetic substitution preserves the underlying frequency profile of the language.",
        "English unigram frequencies (E ~12.7%, T ~9.1%) represent large averages; individual texts have variance.",
        "Grammatical structure, short words ('THE', 'IS', 'OF'), and n-gram patterns provide decisive validation.",
      ],
      instructions: [
        "Examine the frequency distribution and context before setting mappings.",
        "No two ciphertext letters may map to the same plaintext letter.",
        "Earn all 100 points to complete this case study.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Inspect Leaked Ciphertext & Frequency Distribution",
        description:
          "Examine the leaked transmission: 'ZKHQ WKH FLSKHUWHAW LV DQDOBCHG, OHWWHU IUHTXHQFLHV HASRVH WKH XQGHUOBLQJ SDWWHUQV EHFDXVH FHUWDLQ OHWWHUV UHFXU FRQVLVWHQWOB.' Enter the single most frequent ciphertext letter.",
        points: 15,
        type: "freq-observation",
        caseId: "CASE-S04 // STEP 1",
        scenario:
          "Internal counter-intelligence intercepted a leaked 134-character memo encoded with a monoalphabetic substitution cipher. The analyst must generate the frequency profile to establish primary cryptanalytic targets.",
        objective:
          "Inspect the frequency table and identify the dominant ciphertext letter peak.",
        evidence: {
          dossierId: "LEAK-INTEL-992",
          characterCount: "134 characters",
          suspectedFamily: "Monoalphabetic Substitution",
          ciphertext:
            "ZKHQ WKH FLSKHUWHAW LV DQDOBCHG, OHWWHU IUHTXHQFLHV HASRVH WKH XQGHUOBLQJ SDWWHUQV EHFDXVH FHUWDLQ OHWWHUV UHFXU FRQVLVWHQWOB.",
        },
        given: {
          ciphertext:
            "ZKHQ WKH FLSKHUWHAW LV DQDOBCHG, OHWWHU IUHTXHQFLHV HASRVH WKH XQGHUOBLQJ SDWWHUQV EHFDXVH FHUWDLQ OHWWHUV UHFXU FRQVLVWHQWOB.",
          expectedMostFrequent: "H",
        },
        expectedKey: "mostFrequentLetter",
        hints: [
          { text: "Examine the frequency table. Letter 'H' appears 22 times (20.2%). Enter 'H'.", cost: 3 },
        ],
        feedbackCorrect:
          "Dominant peak identified! Ciphertext letter 'H' occurs 22 times (20.2%), making it the prime candidate for standard English high-frequency letters (such as 'E').",
        feedbackIncorrect:
          "Incorrect letter. Inspect the frequency table and enter the single letter with 22 occurrences ('H').",
      },
      {
        id: 2,
        title: "Compare Observed vs Expected English Frequencies",
        description:
          "Why is it a critical error in cryptanalysis to mechanically map the top 5 ciphertext letters directly to the top 5 English letters (E, T, A, O, I) purely by rank order?",
        points: 15,
        type: "multiple-choice",
        caseId: "CASE-S04 // STEP 2",
        scenario:
          "A novice investigator attempted to map ciphertext letters purely by rank order, producing illegible outputs.",
        objective:
          "Explain why statistical variance prevents blind rank-order matching.",
        options: [
          "Individual sample texts exhibit variance from global corpus averages; without verifying n-grams and valid grammatical words, blind unigram rank matching produces unpronounceable gibberish",
          "English letter frequencies invert every twenty years",
          "Frequency analysis only functions if the text contains over 10,000 words",
          "Substitution ciphers randomly shift letter positions during transmission",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "A 130-word sample differs from a million-word dictionary average due to natural statistical variance.", cost: 3 },
        ],
        feedbackCorrect:
          "Statistical principle verified! Sample variance causes rank order shifts. Linguistic context and n-grams are required to confirm hypotheses.",
        feedbackIncorrect:
          "Incorrect answer. Statistical variance across samples means rank order matching alone frequently fails.",
      },
      {
        id: 3,
        title: "Investigate Likely Bigrams & Trigrams",
        description:
          "The three-letter token 'WKH' appears three times in the leaked memo ('WKH FLSKHUWHAW', 'WKH XQGHUOBLQJ...'). Knowing 'THE' is the most frequent English trigram, deduce the mappings for W, K, and H.",
        points: 15,
        type: "multiple-choice",
        caseId: "CASE-S04 // STEP 3",
        scenario:
          "To avoid the unigram trap, the analyst searches for structural n-grams that anchor the substitution alphabet.",
        objective:
          "Anchor the substitution mapping by aligning the repeated token 'WKH' with 'THE'.",
        evidence: {
          repeatedTrigram: "WKH (3 occurrences)",
          linguisticPrior: "'THE' accounts for >60% of all 3-letter words in English text.",
        },
        options: [
          "W → T, K → H, H → E (reinforces Task 1 where 'H' was the #1 frequency peak)",
          "W → A, K → N, H → D",
          "W → F, K → O, H → R",
          "W → Y, K → O, H → U",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Align 'WKH' letter-for-letter to 'THE': W→T, K→H, H→E.", cost: 3 },
        ],
        feedbackCorrect:
          "Trigram anchored! W → T, K → H, and H → E. This confirms that the statistical peak 'H' represents 'E'.",
        feedbackIncorrect:
          "Incorrect mapping. 'WKH' corresponds to 'THE': W → T, K → H, and H → E.",
      },
      {
        id: 4,
        title: "Enforce One-to-One Letter Mapping Constraints",
        description:
          "In a valid monoalphabetic substitution cipher, why is it strictly forbidden for two distinct ciphertext letters (e.g. W and V) to map to the same plaintext letter (e.g. T)?",
        points: 15,
        type: "multiple-choice",
        caseId: "CASE-S04 // STEP 4",
        scenario:
          "The analyst reviews the mathematical definition of a monoalphabetic substitution key to avoid invalid key assignments.",
        objective:
          "Explain the mathematical injection requirement of substitution keys.",
        options: [
          "Monoalphabetic substitution requires a bijective (one-to-one) permutation; mapping multiple ciphertext letters to one plaintext letter creates irreversible collisions and destroys decipherability",
          "The keyboard layout does not support duplicate mappings",
          "Transmitting duplicate letters triggers an automated firewall alarm",
          "It is permitted, but only on vowels",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "A substitution key is a permutation of the 26 letters: each letter must map uniquely.", cost: 3 },
        ],
        feedbackCorrect:
          "Permutation constraint confirmed! Substitution keys must be bijective (one-to-one) permutations of the 26-letter alphabet.",
        feedbackIncorrect:
          "Incorrect answer. Monoalphabetic substitution requires a one-to-one bijective permutation to maintain unique invertibility.",
      },
      {
        id: 5,
        title: "Revise Initial Incorrect Mapping Using Evidence",
        description:
          "A junior analyst proposed mapping Q → O based on count ranks, turning the opening word 'ZKHQ' into 'W H E O'. Examining the sentence context, what is the correct plaintext letter for ciphertext 'Q'?",
        points: 15,
        type: "text-answer",
        caseId: "CASE-S04 // STEP 5",
        scenario:
          "Contextual revision: Word structure 'W H E _' reveals the correct terminal consonant.",
        objective:
          "Revise the erroneous letter assignment and determine the correct plaintext letter for ciphertext Q.",
        evidence: {
          ciphertextWord: "ZKHQ",
          anchorsKnown: "Z → W, K → H, H → E",
          resultingPattern: "W H E [?]",
        },
        expectedKey: "textValue",
        expectedValue: "N",
        hints: [
          { text: "In English grammar, what 4-letter conjunction begins with 'WHE-'? 'WHEN'.", cost: 3 },
          { text: "Therefore ciphertext Q corresponds to plaintext N. Enter 'N'.", cost: 4 },
        ],
        feedbackCorrect:
          "Mapping revised! Ciphertext Q represents plaintext 'N', resolving 'ZKHQ' to the English word 'WHEN'.",
        feedbackIncorrect:
          "Incorrect letter. 'W H E [?]' forms the word 'WHEN'. Enter 'N'.",
      },
      {
        id: 6,
        title: "Interactive Key Mapping & Plaintext Recovery",
        description:
          "Configure the interactive substitution key mapper with your verified anchors to decrypt the complete leaked transmission with live preview.",
        points: 15,
        type: "mapping-interactive",
        caseId: "CASE-S04 // STEP 6",
        scenario:
          "Use the interactive mapping panel to substitute the remaining ciphertext letters and reconstruct the full text.",
        objective:
          "Complete the substitution mapping to reconstruct the full leaked message.",
        evidence: {
          anchorsEstablished: "W→T, K→H, H→E, Z→W, Q→N, L→I, V→S",
          ciphertext:
            "ZKHQ WKH FLSKHUWHAW LV DQDOBCHG, OHWWHU IUHTXHQFLHV HASRVH WKH XQGHUOBLQJ SDWWHUQV EHFDXVH FHUWDLQ OHWWHUV UHFXU FRQVLVWHQWOB.",
        },
        given: {
          ciphertext:
            "ZKHQ WKH FLSKHUWHAW LV DQDOBCHG, OHWWHU IUHTXHQFLHV HASRVH WKH XQGHUOBLQJ SDWWHUQV EHFDXVH FHUWDLQ OHWWHUV UHFXU FRQVLVWHQWOB.",
          providedClues: { W: "T", K: "H", H: "E" },
          expectedAnswer:
            "WHEN THE CIPHERTEXT IS ANALYZED, LETTER FREQUENCIES EXPOSE THE UNDERLYING PATTERNS BECAUSE CERTAIN LETTERS RECUR CONSISTENTLY.",
        },
        expectedKey: "mappingInteractive",
        hints: [
          { text: "Notice all letters follow a uniform shift of 3 positions: Z→W, Q→N, L→I, V→S, F→C, P→M, U→R...", cost: 4 },
        ],
        feedbackCorrect:
          "Full message recovered! The live preview reveals: 'WHEN THE CIPHERTEXT IS ANALYZED, LETTER FREQUENCIES EXPOSE THE UNDERLYING PATTERNS BECAUSE CERTAIN LETTERS RECUR CONSISTENTLY.'.",
        feedbackIncorrect:
          "Mapping incomplete. Adjust the selectors until the live preview produces readable English.",
      },
      {
        id: 7,
        title: "Verification & Forensic Uncertainty Debrief",
        description:
          "Case Debrief: Which factors explain why frequency analysis assists cryptanalysis but does not guarantee an automated, unique solution on arbitrary texts?",
        points: 10,
        type: "multiple-choice",
        caseId: "CASE-S04 // DEBRIEF",
        scenario:
          "Complete the final case debrief on the probabilistic nature of statistical cryptanalysis.",
        objective:
          "Explain why frequency analysis requires contextual verification rather than pure automation.",
        options: [
          "Short messages, technical jargon, and constrained vocabularies produce statistical anomalies where letter counts deviate from global averages; cryptanalysis requires verifying n-grams, grammatical context, and dictionary validity",
          "Because frequency analysis only works on texts written in Latin",
          "Because computers cannot calculate percentages accurately",
          "Because substitution ciphers re-encrypt every third word",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Small sample sizes deviate from dictionary averages, requiring human linguistic judgment.", cost: 2 },
        ],
        feedbackCorrect:
          "Case Study 4 Complete! Statistical analysis provides probabilistic clues, but dictionary context and n-grams are required for definitive proof. Outstanding investigation!",
        feedbackIncorrect:
          "Incorrect debrief. Statistical anomalies in short texts mean frequency analysis requires contextual and linguistic validation.",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // LAB 05 — CRYPTANALYSIS MISSION: CHOOSE THE RIGHT ATTACK
  // ════════════════════════════════════════════════════════════════
  {
    id: 5,
    number: "05",
    title: "Cryptanalysis Mission: Choose the Right Attack",
    topic: "Cryptanalysis Mission",
    category: "SPECIAL MISSION // FULL INVESTIGATION",
    shortDescription:
      "Investigate an unclassified transmission with unspecified cipher family: evaluate structural evidence, calculate keyspaces, compare attack strategies, and extract tactical orders.",
    difficulty: "Advanced",
    estimatedTime: "~12 minutes",
    maxScore: 100,
    objective:
      "Conduct an end-to-end investigation of intercepted intelligence: evaluate forensic evidence to identify the cipher family, calculate the keyspace, justify the optimal attack strategy against alternatives, recover tactical orders, and debrief on modern cryptography.",
    guidelines: {
      whatYouWillDo: [
        "Examine intercepted tactical transmission 'WBHSZZWUSBQS FSDCFH: SBSAM TCFQSG OFS FSUFCIDWBU OH ROKB. DFSDOFS HVS RSTSBGWJS ZWBS.'",
        "Formulate and test competing cipher family hypotheses using structural evidence (word lengths, double letters).",
        "Calculate the exact mathematical keyspace and computational complexity.",
        "Compare two plausible attack strategies (Exhaustive Brute-Force Key Search vs Statistical Frequency Mapping) and justify the selection.",
        "Execute the automated cryptanalytic search engine.",
        "Interpret output streams and recover the verified plaintext.",
        "Deliver the mission debrief comparing classical vulnerabilities with modern 256-bit symmetric standards.",
      ],
      whatYouNeedToKnow: [
        "Preserved word structures (lengths: 12, 6, 5, 6, 3, 10, 2, 4, 7, 3, 9, 4) and doubled letters ('ZZ', 'SS', 'BB') strongly indicate a monoalphabetic transformation.",
        "A search space of 26 keys can be exhaustively searched in constant time O(1).",
        "Exhaustive search on small keyspaces is strictly superior to statistical heuristics because it guarantees finding the exact plaintext without ambiguity.",
      ],
      instructions: [
        "Follow the forensic cryptanalytic workflow from evidence to plaintext.",
        "Earn all 100 points to complete Lab 05 and claim your Academy commendation.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Examine Intercepted Message & Evidence Dossier",
        description:
          "Intercepted transmission: 'WBHSZZWUSBQS FSDCFH: SBSAM TCFQSG OFS FSUFCIDWBU OH ROKB. DFSDOFS HVS RSTSBGWJS ZWBS.' Examine the evidence dossier and identify the most plausible cipher family.",
        points: 10,
        type: "multiple-choice",
        caseId: "CASE-M05 // STEP 1",
        scenario:
          "The agency intercepted an unknown transmission from an unflagged transmitter. The cipher family was not declared in the communication header.",
        objective:
          "Analyze the structural evidence and identify the cipher family.",
        evidence: {
          interceptId: "OP-NIGHTWATCH-007",
          rawCiphertext:
            "WBHSZZWUSBQS FSDCFH: SBSAM TCFQSG OFS FSUFCIDWBU OH ROKB. DFSDOFS HVS RSTSBGWJS ZWBS.",
          structuralObservation:
            "Word boundaries intact (lengths 12, 6, 5, 6, 3, 10, 2, 4, 7, 3, 9, 4); punctuation (colon, periods) preserved; doubled letters present ('ZZ', 'SS').",
        },
        options: [
          "Monoalphabetic Shift (Caesar Cipher): Preserved word lengths, punctuation, and recurring doubled letters ('ZZ' in WBHSZZWUSBQS, 'SS' in SBSAM) indicate a uniform one-to-one letter shift",
          "Asymmetric RSA: The colon indicates a modular public exponent",
          "Polyalphabetic Vigenère with long key: Uniform shifts are impossible in monoalphabetic ciphers",
          "Cryptographic SHA-256 Hash Digest: The output is a one-way representation",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Notice doubled letters: 'ZZ' matches 'LL' in 'INTELLIGENCE', 'SS' matches 'EE' in 'ENEMY'.", cost: 3 },
        ],
        feedbackCorrect:
          "Evidence confirmed! Preserved word boundaries, punctuation, and doubled letters ('ZZ', 'SS') signify a monoalphabetic shift cipher.",
        feedbackIncorrect:
          "Incorrect hypothesis. Doubled letter preservation ('ZZ', 'SS') and preserved word boundaries indicate a monoalphabetic shift cipher.",
      },
      {
        id: 2,
        title: "Estimate Relevant Keyspace & Complexity",
        description:
          "Calculate the exact theoretical keyspace size for this monoalphabetic shift cipher over the English alphabet (0–25).",
        points: 15,
        type: "number-answer",
        caseId: "CASE-M05 // STEP 2",
        scenario:
          "The analyst must estimate the computational search complexity before deploying cryptanalytic resources.",
        objective:
          "Calculate the total number of possible shift keys in the search space.",
        evidence: {
          cipherFamily: "Monoalphabetic Shift",
          alphabetSize: "26 letters (A = 0, ..., Z = 25)",
        },
        given: { alphabetSize: 26 },
        expectedKey: "numberValue",
        expectedValue: 26,
        hints: [
          { text: "How many shift values exist from 0 to 25? Exactly 26 keys. Enter 26.", cost: 3 },
        ],
        feedbackCorrect:
          "Keyspace confirmed! Exactly 26 possible shift keys exist, making manual or automated exhaustive search trivial in O(1) time.",
        feedbackIncorrect:
          "Incorrect keyspace size. The Caesar cipher has shifts 0 through 25, totaling 26 possible keys.",
      },
      {
        id: 3,
        title: "Comparative Strategy Evaluation: Choose the Right Attack",
        description:
          "Compare Strategy A (Exhaustive Brute-Force Key Search testing all 26 keys) with Strategy B (Statistical Frequency Analysis on the 86-character text). Why is Strategy A strictly superior for this mission?",
        points: 15,
        type: "multiple-choice",
        caseId: "CASE-M05 // STEP 3",
        scenario:
          "Before executing an attack, the analyst must defend their methodology against alternative approaches.",
        objective:
          "Justify why exhaustive brute-force search is optimal over statistical heuristics for small keyspaces.",
        evidence: {
          strategyA: "Exhaustive Key Search: Test all 26 shifts (<1 millisecond)",
          strategyB: "Frequency Analysis: Count unigrams and manually fit candidate anchors",
          messageLength: "86 characters (susceptible to sample variance)",
        },
        options: [
          "Strategy A evaluates all 26 keys in <1 ms and guarantees deterministic recovery, whereas Strategy B suffers from small-sample statistical variance and requires manual trial-and-error",
          "Strategy B is prohibited by military signals standards",
          "Strategy A only works on odd-length ciphertexts",
          "Strategy B cannot decrypt messages containing the letter 'E'",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "With only 26 keys, brute force is instantaneous and 100% deterministic, eliminating all guesswork.", cost: 3 },
        ],
        feedbackCorrect:
          "Strategy justified! When the keyspace is minuscule (26 keys), exhaustive brute force is deterministic and instantaneous, eliminating all statistical variance.",
        feedbackIncorrect:
          "Incorrect strategy choice. Exhaustive search of 26 keys is instantaneous and deterministic, avoiding sample-size variance.",
      },
      {
        id: 4,
        title: "Execute Cryptanalytic Attack Engine",
        description:
          "Launch the automated brute-force attack engine on 'WBHSZZWUSBQS FSDCFH: SBSAM TCFQSG OFS FSUFCIDWBU OH ROKB. DFSDOFS HVS RSTSBGWJS ZWBS.' to generate all 26 candidate streams.",
        points: 15,
        type: "brute-force-action",
        caseId: "CASE-M05 // STEP 4",
        scenario:
          "Deploy the automated cryptanalytic engine to execute the selected attack strategy.",
        objective:
          "Generate and index all 26 candidate plaintexts.",
        evidence: {
          engineStatus: "Ready for execution",
          targetLength: "86 characters",
        },
        given: {
          ciphertext:
            "WBHSZZWUSBQS FSDCFH: SBSAM TCFQSG OFS FSUFCIDWBU OH ROKB. DFSDOFS HVS RSTSBGWJS ZWBS.",
        },
        expectedKey: "bruteForceRun",
        hints: [
          { text: "Click 'Run Exhaustive Brute-Force Engine' to generate the candidate list.", cost: 3 },
        ],
        feedbackCorrect:
          "Attack executed! All 26 candidate streams are indexed below for telemetry inspection.",
        feedbackIncorrect:
          "Click 'Run Exhaustive Brute-Force Engine' to generate the candidate streams.",
      },
      {
        id: 5,
        title: "Candidate Interpretation & Plaintext Recovery",
        description:
          "Inspect the generated candidate streams. Identify the shift key K that reveals the coherent operational military report.",
        points: 15,
        type: "number-answer",
        caseId: "CASE-M05 // STEP 5",
        scenario:
          "Isolate the genuine military transmission from the decrypted candidate telemetry.",
        objective:
          "Identify the numerical shift key K corresponding to intelligible English orders.",
        evidence: {
          inspectionClue: "Notice candidate at K = 14 begins with 'INTELLIGENCE REPORT: ENEMY FORCES...'.",
        },
        given: {
          ciphertext:
            "WBHSZZWUSBQS FSDCFH: SBSAM TCFQSG OFS FSUFCIDWBU OH ROKB. DFSDOFS HVS RSTSBGWJS ZWBS.",
        },
        expectedKey: "numberValue",
        expectedValue: 14,
        hints: [
          { text: "Inspect candidate K = 14: W(22)-14=8 ('I'), B(1)-14=13 ('N'), H(7)-14=19 ('T'). Enter 14.", cost: 4 },
        ],
        feedbackCorrect:
          "Key isolated! Shift K = 14 deciphers the intelligence: 'INTELLIGENCE REPORT: ENEMY FORCES ARE REGROUPING AT DAWN. PREPARE THE DEFENSIVE LINE.'.",
        feedbackIncorrect:
          "Incorrect key. Inspect candidate K = 14 to recover the tactical intelligence report.",
      },
      {
        id: 6,
        title: "Full Plaintext Verification",
        description:
          "Transcribe and verify the complete recovered tactical orders decrypted under shift K = 14.",
        points: 15,
        type: "text-answer",
        caseId: "CASE-M05 // STEP 6",
        scenario:
          "Submit the decrypted tactical intelligence to headquarters for immediate operational response.",
        objective:
          "Verify the exact recovered plaintext transmission.",
        evidence: {
          selectedShift: "K = 14",
          expectedPlaintext:
            "INTELLIGENCE REPORT: ENEMY FORCES ARE REGROUPING AT DAWN. PREPARE THE DEFENSIVE LINE.",
        },
        expectedKey: "textValue",
        expectedValue:
          "INTELLIGENCE REPORT: ENEMY FORCES ARE REGROUPING AT DAWN. PREPARE THE DEFENSIVE LINE.",
        hints: [
          { text: "Enter: 'INTELLIGENCE REPORT: ENEMY FORCES ARE REGROUPING AT DAWN. PREPARE THE DEFENSIVE LINE.'", cost: 4 },
        ],
        feedbackCorrect:
          "Tactical intelligence verified! 'INTELLIGENCE REPORT: ENEMY FORCES ARE REGROUPING AT DAWN. PREPARE THE DEFENSIVE LINE.'.",
        feedbackIncorrect:
          "Incorrect plaintext. Enter: 'INTELLIGENCE REPORT: ENEMY FORCES ARE REGROUPING AT DAWN. PREPARE THE DEFENSIVE LINE.'.",
      },
      {
        id: 7,
        title: "Evidence-Based Defense Debrief",
        description:
          "Why is modern symmetric encryption (such as AES-256) mathematically impervious to the exhaustive brute-force attack executed in this mission?",
        points: 15,
        type: "multiple-choice",
        caseId: "CASE-M05 // DEBRIEF",
        scenario:
          "Final mission debrief comparing classical keyspaces with modern 256-bit symmetric standards.",
        objective:
          "Contrast the 26-key classical space with the 2²⁵⁶ modern keyspace.",
        options: [
          "AES-256 has a keyspace of 2²⁵⁶ (≈1.15 × 10⁷⁷ keys); even all the world's supercomputers running for billions of years cannot evaluate a noticeable fraction of this space",
          "AES keys are rotated every 5 seconds via GPS signals",
          "AES only uses prime numbers greater than 1,000,000",
          "AES deletes the ciphertext from memory immediately upon reception",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 0,
        hints: [
          { text: "Compare 26 keys with 2²⁵⁶ keys (115 quinvigintillion combinations).", cost: 3 },
        ],
        feedbackCorrect:
          "Mission Debrief Complete! The astronomical keyspace of 2²⁵⁶ (≈1.15 × 10⁷⁷ keys) makes exhaustive search physically impossible under known physics. Outstanding cryptanalytic work, Agent!",
        feedbackIncorrect:
          "Incorrect debrief. The insurmountable defense of AES-256 is its astronomical 256-bit keyspace (2²⁵⁶ ≈ 1.15 × 10⁷⁷ keys).",
      },
    ],
  },
];
