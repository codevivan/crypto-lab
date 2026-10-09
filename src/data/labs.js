/**
 * Practice Lab — Laboratory Experiment Definitions
 *
 * Five guided practical experiments for the CryptoBreak Lab virtual laboratory.
 * Each lab has guidelines, sequential tasks, scoring, and hints.
 *
 * Crypto answers are validated against the actual crypto engines, not hard-coded strings.
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
  // LAB 01 — CAESAR CIPHER FUNDAMENTALS
  // ════════════════════════════════════════════════════════════════
  {
    id: 1,
    number: "01",
    title: "Caesar Cipher Fundamentals",
    topic: "Caesar Cipher",
    category: "FOUNDATION",
    shortDescription:
      "Practice Caesar encryption, decryption, key identification, and basic security analysis.",
    difficulty: "Beginner",
    estimatedTime: "~5 minutes",
    maxScore: 100,
    objective:
      "Learn to encrypt and decrypt messages using the Caesar Cipher and understand its limited key space through direct application.",
    guidelines: {
      whatYouWillDo: [
        "Encrypt a plaintext message using a given Caesar shift.",
        "Decrypt a ciphertext message using a known shift value.",
        "Identify the correct shift from a known plaintext/ciphertext pair.",
        "Analyse why Caesar is vulnerable to exhaustive brute-force attack.",
      ],
      whatYouNeedToKnow: [
        "Caesar shifts every letter by a fixed amount K (0–25).",
        "The alphabet wraps around: Z shifted by 1 becomes A.",
        "Encryption: C = (P + K) mod 26",
        "Decryption: P = (C − K + 26) mod 26",
        "There are exactly 26 possible keys (shifts), making exhaustive search trivial.",
      ],
      instructions: [
        "Complete every task in order — tasks unlock sequentially.",
        "Each task must be verified before advancing to the next.",
        "Points are awarded only when an answer is verified as correct.",
        "Incorrect attempts do not end the experiment — you may retry.",
        "Hints reduce the maximum points available for that task.",
        "Complete all 4 tasks to receive the final experiment score.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Encrypt the Message",
        description:
          "Using the Caesar Cipher with the provided shift, encrypt the plaintext message below.",
        points: 20,
        type: "text-answer",
        given: { plaintext: "HELLO WORLD", shift: 3 },
        expectedKey: "caesarEncrypt",
        hints: [
          { text: "Shift each letter forward by 3. H → K, E → H, L → O, L → O, O → R.", cost: 5 },
          { text: "Expected result: KHOOR ZRUOG. Spaces are preserved unchanged.", cost: 5 },
        ],
        feedbackCorrect: "Correct. HELLO WORLD encrypted with shift 3 produces KHOOR ZRUOG.",
        feedbackIncorrect:
          "Incorrect. Apply C = (P + K) mod 26 to each letter. Verify each letter individually.",
      },
      {
        id: 2,
        title: "Decrypt the Ciphertext",
        description:
          "The following ciphertext was encrypted with Caesar shift K = 3. Recover the original plaintext.",
        points: 25,
        type: "text-answer",
        given: { ciphertext: "DWWDFN DW GDZQ", shift: 3 },
        expectedKey: "caesarDecrypt",
        hints: [
          { text: "Subtract the shift from each letter. D → A (D is index 3, 3−3 = 0 = A).", cost: 5 },
          { text: "The plaintext is a military command: ATTACK AT DAWN.", cost: 5 },
        ],
        feedbackCorrect: "Correct. DWWDFN DW GDZQ decrypts with shift 3 to ATTACK AT DAWN.",
        feedbackIncorrect:
          "Incorrect. Use P = (C − K + 26) mod 26 to shift each letter backward by 3.",
      },
      {
        id: 3,
        title: "Identify the Shift",
        description:
          "You have been given a plaintext and its Caesar-encrypted ciphertext. Determine the shift value K that was used.",
        points: 25,
        type: "number-answer",
        given: { plaintext: "HELLO", ciphertext: "KHOOR" },
        expectedKey: "shiftValue",
        expectedValue: 3,
        hints: [
          { text: "Compare the first letter pair: H → K. Count how many positions forward K is from H.", cost: 5 },
          { text: "H is index 7, K is index 10. The shift is 10 − 7 = 3.", cost: 5 },
        ],
        feedbackCorrect: "Correct. The shift K = 3 maps H → K, E → H, L → O, L → O, O → R.",
        feedbackIncorrect:
          "Incorrect. Compare any plaintext letter with its ciphertext counterpart: cipher_idx − plain_idx = K.",
      },
      {
        id: 4,
        title: "Conceptual Analysis",
        description:
          "Select the statement that best explains why brute-force attack is practical against the Caesar Cipher.",
        points: 30,
        type: "multiple-choice",
        options: [
          "The Caesar Cipher uses a complex permutation that requires statistical analysis to break.",
          "There are only 26 possible shift values, so every key can be tested in microseconds.",
          "The Caesar Cipher has a key space of 26! permutations, which is too large to enumerate.",
          "Brute force is impractical for Caesar — frequency analysis is always required.",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 1,
        hints: [
          { text: "Consider how many distinct shift values exist between 0 and 25.", cost: 5 },
          { text: "Compare 26 keys (Caesar) with 26! keys (general substitution): which is exhaustable?", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. Caesar has only 26 possible keys. A computer can test all 26 shifts in less than a millisecond, making exhaustive brute-force search completely trivial.",
        feedbackIncorrect:
          "Incorrect. Consider how many distinct shift values exist and compare that to the general substitution cipher key space.",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // LAB 02 — CAESAR BRUTE-FORCE INVESTIGATION
  // ════════════════════════════════════════════════════════════════
  {
    id: 2,
    number: "02",
    title: "Caesar Brute-Force Investigation",
    topic: "Brute-Force Cryptanalysis",
    category: "CRYPTANALYSIS",
    shortDescription:
      "Investigate an unknown Caesar shift using exhaustive brute-force search.",
    difficulty: "Intermediate",
    estimatedTime: "~8 minutes",
    maxScore: 100,
    objective:
      "Use exhaustive search to recover an unknown Caesar shift and understand the mechanics of brute-force cryptanalysis.",
    guidelines: {
      whatYouWillDo: [
        "Examine an intercepted Caesar ciphertext with an unknown shift.",
        "Generate all 26 candidate decryptions by simulating brute force.",
        "Identify the meaningful English plaintext among the candidates.",
        "Identify the shift key that produced the correct decryption.",
        "Reason about what makes brute force feasible for Caesar.",
      ],
      whatYouNeedToKnow: [
        "Brute force exhaustively tests every key in the key space.",
        "Caesar has exactly 26 keys (shifts 0–25), making exhaustive search trivial.",
        "Only one shift will produce recognisable English plaintext.",
        "A fitness function (language score) identifies the correct candidate.",
        "For 26! monoalphabetic keys, brute force is computationally infeasible.",
      ],
      instructions: [
        "Complete every task in order — tasks unlock sequentially.",
        "In Task 1, run the brute force simulation to reveal all 26 candidates.",
        "In Task 2, select the meaningful plaintext from the candidate list.",
        "In Task 3, enter the shift value that corresponds to your selection.",
        "In Task 4, answer the conceptual question about feasibility.",
        "Hints reduce available points for that task.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Run Brute-Force Search",
        description:
          "Below is an intercepted Caesar ciphertext. Click 'Run Brute Force' to generate all 26 candidate decryptions.",
        points: 20,
        type: "brute-force-action",
        given: { ciphertext: "KHOOR ZRUOG" },
        expectedKey: "bruteForceRun",
        hints: [
          { text: "Brute force simply tests every shift from 0 to 25 and shows all decryptions.", cost: 5 },
          { text: "The correct decryption will be the only one that reads as recognisable English.", cost: 5 },
        ],
        feedbackCorrect:
          "Brute-force search complete. All 26 candidate decryptions are displayed. Inspect them to identify the English plaintext.",
        feedbackIncorrect: "",
      },
      {
        id: 2,
        title: "Identify the Plaintext",
        description:
          "Review the 26 candidate decryptions generated in Task 1. Select the candidate that represents meaningful English plaintext.",
        points: 25,
        type: "candidate-select",
        given: { ciphertext: "KHOOR ZRUOG", correctShift: 3 },
        expectedKey: "candidateSelect",
        hints: [
          { text: "Look for recognisable English words rather than random letter sequences.", cost: 5 },
          { text: "The plaintext is a common English phrase: HELLO WORLD.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. HELLO WORLD (shift 3) is the only candidate that produces recognisable English text.",
        feedbackIncorrect:
          "Incorrect. Review the candidates again and select the one that reads as valid English.",
      },
      {
        id: 3,
        title: "Identify the Key",
        description:
          "Enter the Caesar shift value (K) that decrypted the ciphertext to produce the correct plaintext.",
        points: 25,
        type: "number-answer",
        given: { ciphertext: "KHOOR ZRUOG", plaintext: "HELLO WORLD" },
        expectedKey: "shiftValue",
        expectedValue: 3,
        hints: [
          { text: "The shift is the value you selected from the candidate list in Task 2.", cost: 5 },
          { text: "Compare K → H: K is index 10, H is index 7. The shift used was 10 − 7 = 3.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. Shift K = 3 decrypts KHOOR ZRUOG → HELLO WORLD.",
        feedbackIncorrect:
          "Incorrect. The shift key is the number of positions the ciphertext letters are ahead of the plaintext letters.",
      },
      {
        id: 4,
        title: "Cryptanalysis Conclusion",
        description:
          "Select the most accurate explanation for why brute-force attack is computationally feasible against Caesar ciphers.",
        points: 30,
        type: "multiple-choice",
        options: [
          "Caesar ciphers use a polyalphabetic key structure that can be reversed analytically.",
          "Modern computers can test arbitrary cipher depths in constant time.",
          "The key space contains only 26 possible shifts, so all keys are exhausted instantly.",
          "Caesar ciphers always produce ciphertext with recognisable letter frequencies.",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 2,
        hints: [
          { text: "Focus on the size of the key space — how many distinct keys exist?", cost: 5 },
          { text: "26 keys at even 1 key/second = 26 seconds. At 10⁹ keys/second it is instantaneous.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. Caesar's key space of 26 shifts is so small that all candidates are exhausted in microseconds on modern hardware.",
        feedbackIncorrect:
          "Incorrect. Consider specifically how many distinct key values exist for the Caesar Cipher.",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // LAB 03 — AFFINE & PRODUCT CIPHER
  // ════════════════════════════════════════════════════════════════
  {
    id: 3,
    number: "03",
    title: "Affine & Product Cipher",
    topic: "Affine Cipher and Product Cipher",
    category: "CLASSICAL CIPHERS",
    shortDescription:
      "Apply Affine transformations and understand sequential Product Cipher operations.",
    difficulty: "Intermediate",
    estimatedTime: "~10 minutes",
    maxScore: 100,
    objective:
      "Understand the mathematical structure of the Affine Cipher and learn how multiple transformations compose into a Product Cipher.",
    guidelines: {
      whatYouWillDo: [
        "Identify which values of the multiplicative key 'a' are valid for Affine encryption.",
        "Encrypt a plaintext using the Affine Cipher with given keys.",
        "Trace the two-stage Product Cipher pipeline and identify the intermediate result.",
        "Reverse the Product Cipher pipeline to recover the original plaintext.",
      ],
      whatYouNeedToKnow: [
        "Affine Cipher: E(x) = (ax + b) mod 26.",
        "The key 'a' MUST satisfy gcd(a, 26) = 1 for unique decryption to be possible.",
        "Valid 'a' values: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25 (12 valid values).",
        "Product Cipher = Caesar(P, shift) → Affine(result, a, b).",
        "Decryption reverses the order: Affine⁻¹ → Caesar⁻¹.",
      ],
      instructions: [
        "Complete every task in order.",
        "In Task 1, select ALL valid values of 'a' from the provided list.",
        "In Task 2, calculate and enter the Affine ciphertext.",
        "In Task 3, trace the Product Cipher and identify the intermediate text.",
        "In Task 4, enter the recovered plaintext after reversing both transformations.",
        "Hints are available but reduce the available task score.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Valid Affine Key Selection",
        description:
          "From the list of candidate values for the Affine multiplicative key 'a', select ALL values that are valid (i.e., gcd(a, 26) = 1).",
        points: 20,
        type: "multi-select",
        options: [
          { value: 1, label: "a = 1" },
          { value: 5, label: "a = 5" },
          { value: 13, label: "a = 13" },
          { value: 17, label: "a = 17" },
          { value: 21, label: "a = 21" },
        ],
        expectedKey: "validAffineKeys",
        expectedValues: [1, 5, 17, 21],
        hints: [
          { text: "Compute gcd(a, 26) for each candidate. Only values where gcd = 1 are valid.", cost: 5 },
          { text: "Invalid: a=13 because gcd(13, 26) = 13 > 1. Valid: 1, 5, 17, 21.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. Values 1, 5, 17, 21 all satisfy gcd(a, 26) = 1, making them valid multiplicative keys. The value a = 13 shares a common factor with 26 (gcd = 13), so it is not invertible modulo 26.",
        feedbackIncorrect:
          "Incorrect. Check each value: compute gcd(a, 26). If gcd = 1, the value is valid; if gcd > 1, it is invalid.",
      },
      {
        id: 2,
        title: "Affine Encryption",
        description:
          "Encrypt the plaintext below using the Affine Cipher with the given keys. Apply E(x) = (ax + b) mod 26 to each letter.",
        points: 25,
        type: "text-answer",
        given: { plaintext: "HELLO", a: 5, b: 8 },
        expectedKey: "affineEncrypt",
        hints: [
          { text: "H=7: (5×7+8) mod 26 = 43 mod 26 = 17 = R. Apply the same formula to each letter.", cost: 5 },
          { text: "Letter-by-letter: H→R, E→C, L→L, L→L, O→A. The ciphertext is RCLLA.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. With a=5, b=8: H(7)→R(17), E(4)→C(2), L(11)→L(11), L(11)→L(11), O(14)→A(0). Result: RCLLA.",
        feedbackIncorrect:
          "Incorrect. Apply E(x) = (5x + 8) mod 26 to each letter index (A=0 … Z=25).",
      },
      {
        id: 3,
        title: "Product Cipher — Intermediate Trace",
        description:
          "The Product Cipher applies Caesar first, then Affine. Given the plaintext and keys below, identify the INTERMEDIATE text (output of the Caesar layer before Affine is applied).",
        points: 25,
        type: "text-answer",
        given: {
          plaintext: "HELLO WORLD",
          caesarShift: 3,
          affineA: 5,
          affineB: 8,
          description: "Caesar(HELLO WORLD, shift=3) → Intermediate → Affine(Intermediate, a=5, b=8) → Ciphertext",
        },
        expectedKey: "caesarEncryptIntermediate",
        hints: [
          { text: "The intermediate text is simply the output of Caesar encryption on the plaintext, before Affine is applied.", cost: 5 },
          { text: "Caesar(HELLO WORLD, shift=3) = KHOOR ZRUOG. Enter that as the intermediate text.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. HELLO WORLD encrypted with Caesar shift 3 produces KHOOR ZRUOG as the intermediate text. The Affine layer then transforms this further.",
        feedbackIncorrect:
          "Incorrect. Apply only the Caesar cipher (shift 3) to HELLO WORLD to obtain the intermediate text.",
      },
      {
        id: 4,
        title: "Reverse the Product Cipher",
        description:
          "You are given the final Product Cipher ciphertext and all keys. Reverse the pipeline (Affine⁻¹ → Caesar⁻¹) to recover the original plaintext.",
        points: 30,
        type: "text-answer",
        given: {
          caesarShift: 3,
          affineA: 5,
          affineB: 8,
          description: "Ciphertext is the Product Cipher output of HELLO WORLD with shift=3, a=5, b=8.",
        },
        expectedKey: "productDecrypt",
        expectedPlaintext: "HELLO WORLD",
        hints: [
          { text: "First apply Affine decryption (using a⁻¹=21 for a=5) to recover the Caesar intermediate.", cost: 5 },
          { text: "Then apply Caesar decryption (shift=3) to the intermediate. Result: HELLO WORLD.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. Affine⁻¹ recovers KHOOR ZRUOG, then Caesar⁻¹ (shift 3) recovers HELLO WORLD. Decryption must reverse the layer order.",
        feedbackIncorrect:
          "Incorrect. Remember to apply Affine decryption FIRST, then Caesar decryption. The order must be reversed relative to encryption.",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // LAB 04 — MONOALPHABETIC FREQUENCY ANALYSIS
  // ════════════════════════════════════════════════════════════════
  {
    id: 4,
    number: "04",
    title: "Monoalphabetic Frequency Analysis",
    topic: "Frequency Analysis",
    category: "FREQUENCY ANALYSIS",
    shortDescription:
      "Break a monoalphabetic substitution cipher using frequency and language analysis.",
    difficulty: "Advanced",
    estimatedTime: "~12 minutes",
    maxScore: 100,
    objective:
      "Break a monoalphabetic substitution cipher using statistical properties of natural language without exhaustive key enumeration.",
    guidelines: {
      whatYouWillDo: [
        "Inspect an intercepted substitution ciphertext and its letter frequency table.",
        "Form a substitution hypothesis by mapping the most frequent ciphertext letter to 'E'.",
        "Build a letter mapping table to progressively decode the ciphertext.",
        "Submit the fully recovered plaintext once all key letters are mapped.",
      ],
      whatYouNeedToKnow: [
        "Monoalphabetic substitution preserves plaintext letter frequencies in ciphertext.",
        "In English, 'E' appears ~12.7%, 'T' ~9.1%, 'A' ~8.2%, 'O' ~7.5%.",
        "The most frequent ciphertext letter likely represents 'E'.",
        "Common trigram 'THE' in ciphertext pinpoints three letter mappings simultaneously.",
        "26! key space makes brute force infeasible — frequency analysis is the correct technique.",
      ],
      instructions: [
        "Complete every task in order.",
        "Task 1: Identify the most frequent ciphertext letter from the frequency table.",
        "Task 2: Enter a mapping hypothesis for that letter.",
        "Task 3: Use the interactive mapping table to build your substitution and observe the candidate plaintext live.",
        "Task 4: Submit the final recovered plaintext.",
        "Unmapped letters appear as '•' in the live preview — map all required letters before submitting.",
        "Hints reduce available task points.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Frequency Observation",
        description:
          "The frequency table below shows letter occurrences in the intercepted ciphertext. Identify the single most frequent ciphertext letter.",
        points: 20,
        type: "freq-observation",
        given: {
          ciphertext: "ZIT LTEKTZ EGRT OL IORRTF OF ZIT UQKRTF",
          expectedMostFrequent: "T",
        },
        expectedKey: "mostFrequentLetter",
        hints: [
          { text: "Sort the frequency table in descending order. The letter appearing most often is your answer.", cost: 5 },
          { text: "In this ciphertext, 'T' appears most frequently, consistent with 'E' in English.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. 'T' is the most frequent letter in this ciphertext. In English, 'E' is the most common letter (~12.7%), so 'T' likely represents 'E'.",
        feedbackIncorrect:
          "Incorrect. Count each letter occurrence in the ciphertext. The letter with the highest count is the most frequent.",
      },
      {
        id: 2,
        title: "Mapping Hypothesis",
        description:
          "Based on your frequency observation, form an initial substitution hypothesis. Which plaintext letter does the most frequent ciphertext letter most likely represent?",
        points: 25,
        type: "mapping-hypothesis",
        given: {
          cipherLetter: "T",
          correctPlainLetter: "E",
        },
        expectedKey: "mappingHypothesis",
        hints: [
          { text: "In English, the letter 'E' accounts for approximately 12.7% of all letters — more than any other.", cost: 5 },
          { text: "The most frequent ciphertext letter 'T' most likely represents the most frequent English letter 'E'.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct hypothesis. T → E. This matches the statistical pattern: the most frequent ciphertext letter corresponds to the most frequent English letter.",
        feedbackIncorrect:
          "Incorrect. The most frequent ciphertext letter statistically corresponds to the most frequent English letter, which is 'E'.",
      },
      {
        id: 3,
        title: "Candidate Plaintext Construction",
        description:
          "Use the interactive mapping table to assign plaintext letters to ciphertext letters. The candidate plaintext updates live as you build the mapping. Use the provided starting clues and your frequency analysis to complete the mapping.",
        points: 25,
        type: "mapping-interactive",
        given: {
          ciphertext: "ZIT LTEKTZ EGRT OL IORRTF OF ZIT UQKRTF",
          providedClues: { Z: "T", I: "H", T: "E" },
          expectedAnswer: "THE SECRET CODE IS HIDDEN IN THE GARDEN",
        },
        expectedKey: "mappingInteractive",
        hints: [
          { text: "With Z→T, I→H, T→E: 'ZIT' = 'THE'. Try to identify 'LTEKTZ' (6 letters starting with L→S).", cost: 5 },
          { text: "LTEKTZ = SECRET (L→S, E→C, K→R, T→E, Z→T). Then OL = IS, IORRTF = HIDDEN, OF = IN, UQKRTF = GARDEN.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. All mappings are consistent. THE SECRET CODE IS HIDDEN IN THE GARDEN is the recovered plaintext.",
        feedbackIncorrect:
          "The candidate plaintext does not match. Ensure all ciphertext letters are mapped and that mapped letters are consistent with English words.",
      },
      {
        id: 4,
        title: "Recover the Plaintext",
        description:
          "Using your completed mapping from Task 3, enter the fully recovered plaintext message.",
        points: 30,
        type: "text-answer",
        given: {
          ciphertext: "ZIT LTEKTZ EGRT OL IORRTF OF ZIT UQKRTF",
          expectedAnswer: "THE SECRET CODE IS HIDDEN IN THE GARDEN",
        },
        expectedKey: "freqAnalysisPlaintext",
        hints: [
          { text: "If you completed the mapping in Task 3, copy the candidate plaintext directly.", cost: 5 },
          { text: "The plaintext is: THE SECRET CODE IS HIDDEN IN THE GARDEN.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. THE SECRET CODE IS HIDDEN IN THE GARDEN. Frequency analysis successfully broke the monoalphabetic substitution without enumerating any of the 26! keys.",
        feedbackIncorrect:
          "Incorrect. Ensure your letter mapping is complete and consistent, then re-read the candidate plaintext.",
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  // LAB 05 — CRYPTANALYSIS INVESTIGATION
  // ════════════════════════════════════════════════════════════════
  {
    id: 5,
    number: "05",
    title: "Cryptanalysis Investigation",
    topic: "Choosing the Appropriate Attack",
    category: "FINAL INVESTIGATION",
    shortDescription:
      "Analyze an intercepted message and select an appropriate cryptanalysis strategy.",
    difficulty: "Advanced",
    estimatedTime: "~10 minutes",
    maxScore: 100,
    objective:
      "Develop the analytical skill of selecting the correct cryptanalytic technique based on cipher structure, key space, and feasibility.",
    guidelines: {
      whatYouWillDo: [
        "Identify the cipher type used in an intercepted message.",
        "Select the appropriate attack strategy for a Caesar cipher scenario.",
        "Select the appropriate attack strategy for a substitution cipher scenario.",
        "Justify which approach is more practical for a given scenario with reasoning.",
      ],
      whatYouNeedToKnow: [
        "Caesar Cipher: 26-key space → Brute Force is feasible (microseconds).",
        "Monoalphabetic Substitution: 26! key space → Brute Force is infeasible (billions of years).",
        "Frequency analysis exploits statistical patterns preserved in monoalphabetic ciphers.",
        "Attack selection depends on: key space size, cipher structure, and statistical properties.",
        "A large key space alone does not guarantee security — frequency patterns may still leak information.",
      ],
      instructions: [
        "Complete every task in order.",
        "Read each scenario carefully before selecting your answer.",
        "Tasks 1–3 test specific identification and strategy skills.",
        "Task 4 tests your ability to reason about feasibility and attack selection.",
        "There are no trick questions — base your answers on the principles learned in this lab.",
        "Hints are available but reduce available task points.",
      ],
    },
    tasks: [
      {
        id: 1,
        title: "Identify the Cipher Type",
        description:
          'Scenario: An analyst intercepts the message "KHOOR ZRUOG". It is suspected to be a simple shift cipher where every letter has been moved forward by a fixed number of positions in the alphabet. Identify the cipher type.',
        points: 20,
        type: "multiple-choice",
        options: [
          "Affine Cipher",
          "Vigenère Cipher",
          "Caesar Cipher",
          "Monoalphabetic Substitution Cipher",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 2,
        hints: [
          { text: "The description says 'every letter moved forward by a fixed number of positions'. This is the defining property of a specific classical cipher.", cost: 5 },
          { text: "A fixed single shift applied uniformly to all letters is the Caesar Cipher.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. A uniform fixed shift applied to every letter is the defining characteristic of the Caesar Cipher, a specific monoalphabetic shift cipher.",
        feedbackIncorrect:
          "Incorrect. Read the scenario again: every letter is moved by the same fixed amount. Which cipher is defined by a single constant shift?",
      },
      {
        id: 2,
        title: "Select the Attack Strategy",
        description:
          "For the Caesar cipher scenario from Task 1, select the most appropriate and efficient cryptanalytic attack strategy.",
        points: 25,
        type: "multiple-choice",
        options: [
          "Frequency Analysis — analyse letter frequency distribution",
          "Brute Force — test all 26 possible shift values",
          "Known-Plaintext Attack — compare plaintext/ciphertext letter pairs",
          "N-Gram Analysis — inspect digraph and trigraph patterns",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 1,
        hints: [
          { text: "Consider how many keys Caesar has. Is it feasible to test all of them?", cost: 5 },
          { text: "26 keys × ~1 microsecond each = 26 microseconds total. Brute force is the direct and natural attack.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. With only 26 possible shifts, brute force is the most direct attack. All candidates are generated and evaluated in microseconds, with the correct one identified by a language fitness function.",
        feedbackIncorrect:
          "Incorrect. Consider the size of the key space first. For Caesar, can you enumerate ALL possible keys in a reasonable time?",
      },
      {
        id: 3,
        title: "Second Scenario — Substitution Attack",
        description:
          'Scenario: A second intercept reads: "ZIT LTEKTZ EGRT OL IORRTF OF ZIT UQKRTF". Analysis confirms this is a monoalphabetic substitution cipher with an arbitrary permutation key. Select the appropriate attack strategy.',
        points: 25,
        type: "multiple-choice",
        options: [
          "Brute Force — enumerate all possible permutations",
          "Frequency Analysis — exploit preserved statistical language patterns",
          "Caesar Decryption — apply all 26 shift values",
          "Polyalphabetic Decryption — use Kasiski examination",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 1,
        hints: [
          { text: "Monoalphabetic substitution has 26! ≈ 4×10²⁶ keys. At 10¹² keys/sec: ~12.7 billion years. Brute force is infeasible.", cost: 5 },
          { text: "The fixed one-to-one mapping preserves frequency distributions. Frequency analysis is the correct strategy.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. With 26! keys, brute force is infeasible. However, the fixed one-to-one mapping preserves English letter frequencies in the ciphertext, enabling frequency analysis to deduce the key without enumeration.",
        feedbackIncorrect:
          "Incorrect. Consider the key space size and whether frequency patterns are preserved. Which attack exploits statistical structure rather than exhaustive enumeration?",
      },
      {
        id: 4,
        title: "Final Cryptanalysis Decision",
        description:
          "You receive two ciphertexts: one from a Caesar cipher and one from a monoalphabetic substitution cipher. You must decide which attack to use for each. Which statement best describes the correct strategy selection?",
        points: 30,
        type: "multiple-choice",
        options: [
          "Always use frequency analysis regardless of the cipher, because it is always statistically robust.",
          "Use brute force for Caesar (26 keys, trivial) and frequency analysis for substitution (26! keys, frequency patterns preserved).",
          "Always use brute force because modern computers are fast enough for any classical cipher.",
          "Frequency analysis is only useful when the ciphertext is longer than 500 characters.",
        ],
        expectedKey: "multipleChoice",
        expectedValue: 1,
        hints: [
          { text: "Strategy depends on key space size AND preserved statistical structure — consider both factors.", cost: 5 },
          { text: "Caesar: small key space → brute force. Substitution: huge key space but frequency preserved → frequency analysis.", cost: 5 },
        ],
        feedbackCorrect:
          "Correct. Attack selection is determined by the cipher properties: Caesar's 26-key space makes brute force trivial; substitution's 26! key space makes brute force infeasible but its frequency-preserving nature makes statistical analysis effective.",
        feedbackIncorrect:
          "Incorrect. Consider both the key space size AND whether letter frequencies are preserved. No single attack suits all classical ciphers equally.",
      },
    ],
  },
];
