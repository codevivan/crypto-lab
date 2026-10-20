/**
 * Concepts & Educational Course Data
 * Comprehensive viva cheatsheets, mathematical formulations, and visual workflows.
 * The concepts module includes a comprehensive 10-question university-level assessment quiz.
 */

export const CONCEPTS = [
  {
    "id": 1,
    "number": "01",
    "title": "Cryptography",
    "tag": "Security Foundation",
    "definition": "Cryptography is the science and practice of securing communication by transforming readable messages into unintelligible secret formats.",
    "whyItMatters": "Without cryptography, digital messages, passwords, and sensitive records could be intercepted and read by unauthorized adversaries.",
    "keyIdea": "Readable Plaintext is converted into unreadable Ciphertext via an algorithm and a secret key, then inverted back to Plaintext.",
    "visualType": "crypto-flow",
    "example": {
      "plain": "HELLO",
      "key": "Shift = 3",
      "cipher": "KHOOR",
      "action": "Encryption transforms 'HELLO' into 'KHOOR'. Decryption reverses it."
    },
    "vivaQuestion": "What is the difference between an encryption algorithm and an encryption key?",
    "vivaAnswer": "The algorithm is the mathematical set of rules (e.g. Caesar shift), whereas the key is the secret parameter that determines the specific transformation.",
    "vivaTakeaway": "Cryptography protects information by transforming readable plaintext into ciphertext using an algorithm and key."
  },
  {
    "id": 2,
    "number": "02",
    "title": "Cryptanalysis",
    "tag": "Attack Science",
    "definition": "Cryptanalysis is the study of analyzing encrypted messages to recover the secret plaintext or deduce the hidden key without prior authorization.",
    "whyItMatters": "Understanding attack methodologies allows security engineers to design mathematically resilient cryptosystems and recognize flawed designs.",
    "keyIdea": "Cryptanalysis identifies and exploits structural, statistical, or mathematical weaknesses in a cipher system.",
    "visualType": "attack-flow",
    "example": {
      "plain": "Target Plaintext",
      "key": "Unknown Key",
      "cipher": "KHOOR ZRUOG",
      "action": "Analyst attacks the ciphertext using Brute Force or Frequency Analysis."
    },
    "vivaQuestion": "What is Kerckhoffs's principle in cryptanalysis?",
    "vivaAnswer": "A cryptosystem must remain secure even if everything about the algorithm is publicly known; only the key must be kept secret.",
    "vivaTakeaway": "Cryptanalysis attempts to exploit structural and mathematical weaknesses in a cryptographic system."
  },
  {
    "id": 3,
    "number": "03",
    "title": "Monoalphabetic Cipher",
    "tag": "Classical Substitution",
    "definition": "A cipher where each plaintext letter is mapped to exactly one unique ciphertext letter, and that mapping remains fixed throughout the message.",
    "whyItMatters": "It represents the fundamental baseline of substitution ciphers. Its primary flaw is that it preserves natural language letter frequency distributions.",
    "keyIdea": "One-to-one letter substitution: if 'E' is replaced by 'X', every occurrence of 'E' in the message becomes 'X'.",
    "visualType": "mapping-table",
    "example": {
      "plain": "HELLO",
      "key": "H→I, E→T, L→S, O→G",
      "cipher": "ITSSG",
      "action": "Notice double letters 'LL' directly produce double letters 'SS'."
    },
    "vivaQuestion": "Why does monoalphabetic substitution preserve letter frequencies?",
    "vivaAnswer": "Because each letter is replaced by the same substitute every single time, directly transferring the plaintext letter frequencies to the ciphertext.",
    "vivaTakeaway": "A monoalphabetic substitution cipher uses a fixed one-to-one substitution alphabet."
  },
  {
    "id": 4,
    "number": "04",
    "title": "Caesar Cipher",
    "tag": "Shift Cipher",
    "definition": "A specific monoalphabetic cipher in which every letter in the plaintext is shifted by a fixed integer key K (0–25) positions in the alphabet.",
    "whyItMatters": "It is the oldest known military substitution cipher. Its trivial key space (26 shifts) makes it the prime educational model for brute-force attacks.",
    "keyIdea": "Modular arithmetic on letters: C = (P + K) mod 26. Inversion: P = (C - K + 26) mod 26.",
    "visualType": "shift-formula",
    "example": {
      "plain": "HELLO",
      "key": "K = 3 (A→D, B→E...)",
      "cipher": "KHOOR",
      "action": "H(+3)=K, E(+3)=H, L(+3)=O, L(+3)=O, O(+3)=R."
    },
    "vivaQuestion": "Why is ROT13 considered a symmetric special case of the Caesar cipher?",
    "vivaAnswer": "ROT13 uses shift K = 13. Because 13 + 13 = 26 (modulo 26), applying the same operation twice restores the original text.",
    "vivaTakeaway": "Caesar is vulnerable to brute force because only 26 shifts are possible."
  },
  {
    "id": 5,
    "number": "05",
    "title": "Brute Force Attack",
    "tag": "Exhaustive Search",
    "definition": "A cryptanalytic attack that systematically checks every possible key in the key space until the meaningful plaintext is discovered.",
    "whyItMatters": "It establishes the absolute upper bound of a cipher's security. If a cipher's key space is too small, brute force breaks it immediately.",
    "keyIdea": "Test Key 0, Key 1, Key 2... Key N. Practical against Caesar (26 keys), but impossible against general substitution (26! keys).",
    "visualType": "brute-keys",
    "example": {
      "plain": "HELLO WORLD",
      "key": "Shift 0: KHOOR... Shift 3: HELLO WORLD ✓",
      "cipher": "KHOOR ZRUOG",
      "action": "Computer tests shifts 0 through 25 in under a millisecond."
    },
    "vivaQuestion": "What factors determine if a brute-force attack is feasible?",
    "vivaAnswer": "The total size of the key space and the computational time required to evaluate candidate decryptions.",
    "vivaTakeaway": "Brute force is practical when the keyspace is sufficiently small."
  },
  {
    "id": 6,
    "number": "06",
    "title": "Frequency Analysis",
    "tag": "Statistical Attack",
    "definition": "A technique that studies the frequency of letters in ciphertext to deduce the substitution alphabet based on natural language statistics.",
    "whyItMatters": "It completely defeats monoalphabetic substitution ciphers without testing 26! keys, proving that large key spaces alone do not guarantee security.",
    "keyIdea": "In English, 'E' is ~12.7%, 'T' is ~9.1%, 'A' is ~8.2%. The most frequent ciphertext letter is hypothesized to be 'E'.",
    "visualType": "freq-bars",
    "example": {
      "plain": "E is most common in English (~12.7%)",
      "key": "Hypothesis: E maps to X",
      "cipher": "X appears 13% in ciphertext",
      "action": "Analyst forms hypothesis: X represents E. Note: frequency is a hypothesis, not proof."
    },
    "vivaQuestion": "Why can't frequency analysis easily break polyalphabetic ciphers like Vigenère?",
    "vivaAnswer": "Polyalphabetic ciphers use multiple shifting alphabets, causing a single plaintext letter to map to several ciphertext letters and flattening the distribution.",
    "vivaTakeaway": "Frequency analysis exploits statistical patterns preserved by substitution."
  },
  {
    "id": 7,
    "number": "07",
    "title": "N-Gram Analysis",
    "tag": "Digraph & Trigraph",
    "definition": "The statistical examination of sequences of n consecutive letters (Bigrams for n=2, Trigrams for n=3) in encrypted text.",
    "whyItMatters": "Individual letter frequencies often produce ties or statistical noise. N-grams reveal grammatical structure and common words like 'THE'.",
    "keyIdea": "Common English bigrams include TH, HE, IN, ER, AN. Common trigrams include THE, AND, ENT, ION.",
    "visualType": "ngram-boxes",
    "example": {
      "plain": "THE is the most common English trigram",
      "key": "Trigram 'ZIT' appears 3 times",
      "cipher": "ZIT LTEKTZ... ZIT UQKRTF",
      "action": "Strongly indicates ZIT represents THE (Z→T, I→H, T→E)."
    },
    "vivaQuestion": "How do n-grams assist cryptanalysis when letter frequencies are ambiguous?",
    "vivaAnswer": "N-grams provide contextual pairings that identify common prefixes, suffixes, and short structural words (e.g. 'OF', 'IN', 'THE').",
    "vivaTakeaway": "N-gram analysis helps identify likely word structures and letter combinations."
  },
  {
    "id": 8,
    "number": "08",
    "title": "Keyspace",
    "tag": "Mathematical Space",
    "definition": "The set of all possible secret keys that can be utilized to initialize an encryption algorithm.",
    "whyItMatters": "Keyspace size dictates whether an exhaustive brute-force attack is computationally achievable or mathematically impossible.",
    "keyIdea": "Caesar has 26 keys. Monoalphabetic substitution has 26! ≈ 4.03 × 10²⁶ keys.",
    "visualType": "keyspace-comparison",
    "example": {
      "plain": "Caesar: 26 keys (< 0.001 ms)",
      "key": "Substitution: 26! keys (> 12 billion years at 10¹² keys/sec)",
      "cipher": "Exhaustive brute force fails on 26!",
      "action": "Demonstrates why different attacks (Brute Force vs Frequency) are chosen based on key space."
    },
    "vivaQuestion": "If a supercomputer tests 1 trillion keys/sec, why is 26! still secure against brute force?",
    "vivaAnswer": "At 10¹² keys/sec, testing 4.03 × 10²⁶ keys requires ~4.03 × 10¹⁴ seconds, which is over 12.7 billion years.",
    "vivaTakeaway": "Larger keyspaces make exhaustive search increasingly difficult."
  },
  {
    "id": 9,
    "number": "09",
    "title": "Cryptanalysis Workflow",
    "tag": "Full Lab Methodology",
    "definition": "The systematic lifecycle used by cryptanalysts to identify, attack, deduce, and verify recovered messages.",
    "whyItMatters": "It ties together all theoretical knowledge and practical virtual lab modules into a coherent operational procedure.",
    "keyIdea": "Plaintext → Cipher Simulator → Target Ciphertext → Strategy (Brute Force / Frequency) → Hypothesis → Practice Lab Verification.",
    "visualType": "lab-workflow",
    "example": {
      "plain": "Module 1: Cipher Simulator",
      "key": "Module 2: Brute Force & Frequency Analysis",
      "cipher": "Module 3: Practice Lab Challenges",
      "action": "The complete pipeline taught across the CryptoBreak-Lab virtual laboratory."
    },
    "vivaQuestion": "Why is human analyst intervention still necessary in classical cryptanalysis?",
    "vivaAnswer": "Algorithms generate candidate decryptions and statistical ranks, but human linguistic judgment verifies semantic validity and word boundaries.",
    "vivaTakeaway": "Effective cryptanalysis combines statistical hypothesis testing, structural n-gram inspection, and contextual verification."
  },
  {
    "id": 10,
    "number": "10",
    "title": "Affine Cipher",
    "tag": "Linear Substitution",
    "definition": "A monoalphabetic substitution cipher that applies a linear algebraic transformation to each plaintext letter using two keys: a multiplicative key 'a' and an additive key 'b'. Each letter index x is mapped to (ax + b) mod 26.",
    "whyItMatters": "The Affine Cipher generalises the Caesar Cipher by adding modular multiplication, increasing the key space to 312 valid keys. It introduces the concept of modular inverses required for decryption, a foundational idea in modern cryptography.",
    "keyIdea": "E(x) = (ax + b) mod 26. The key 'a' MUST be coprime with 26 (gcd(a,26)=1), otherwise the mapping is not one-to-one and unique decryption is impossible.",
    "visualType": "affine-formula",
    "example": {
      "plain": "HELLO",
      "key": "a = 5, b = 8",
      "cipher": "RCLLA",
      "action": "H=7 → (5×7+8) mod 26 = 43 mod 26 = 17 = R. E=4 → (5×4+8) mod 26 = 28 mod 26 = 2 = C. L=11 → (5×11+8) mod 26 = 63 mod 26 = 11 = L."
    },
    "vivaQuestion": "Why must the multiplicative key 'a' be coprime with 26?",
    "vivaAnswer": "If gcd(a, 26) ≠ 1, the function E(x) = (ax + b) mod 26 is not injective — multiple plaintext letters map to the same ciphertext letter. This means the modular inverse a⁻¹ does not exist and unique decryption is mathematically impossible.",
    "vivaTakeaway": "The Affine Cipher introduces modular linear algebra: 12 valid 'a' values × 26 'b' values = 312 total keys."
  },
  {
    "id": 11,
    "number": "11",
    "title": "Product Cipher",
    "tag": "Composite Transformation",
    "definition": "A Product Cipher applies multiple cryptographic transformations sequentially (in composition) to produce the final ciphertext. The security of the composition is generally stronger than any single component transformation.",
    "whyItMatters": "Product ciphers are the conceptual ancestor of modern block ciphers (like AES), which alternate substitution (S-boxes) and permutation (P-boxes) across multiple rounds. Understanding composition is fundamental to modern cryptographic design.",
    "keyIdea": "CryptoBreak Lab defines its Product Cipher as: Plaintext → Caesar → Intermediate Text → Affine → Final Ciphertext. Decryption reverses the order: Ciphertext → Affine⁻¹ → Caesar⁻¹ → Plaintext.",
    "visualType": "product-pipeline",
    "example": {
      "plain": "HELLO",
      "key": "Caesar Shift = 3, Affine a = 5, b = 8",
      "cipher": "GRAAP",
      "action": "Step 1 (Caesar): HELLO → KHOOR. Step 2 (Affine a=5,b=8): KHOOR → GRAAP. Decryption reverses: GRAAP → Affine⁻¹ → KHOOR → Caesar⁻¹ → HELLO."
    },
    "vivaQuestion": "Why must decryption of a Product Cipher reverse the transformation order?",
    "vivaAnswer": "Because function composition (f∘g)(x) = f(g(x)) inverts as (f∘g)⁻¹ = g⁻¹∘f⁻¹. The last transformation applied must be the first undone. If Caesar was applied first and Affine second during encryption, then Affine⁻¹ must be applied first and Caesar⁻¹ second during decryption.",
    "vivaTakeaway": "A Product Cipher composes multiple transformations sequentially; decryption must invert them in exact reverse order."
  }
];

/**
 * Exactly 10 Difficult-Level Cryptography Quiz Questions
 * University-level assessment covering:
 * 1. Caesar Cipher and unknown-shift recovery
 * 2. Affine Cipher encryption and modular arithmetic
 * 3. Affine Cipher key validity and modular inverses
 * 4. Product Cipher transformation order
 * 5. Monoalphabetic Substitution and mapping constraints
 * 6. Brute Force Attack and search-space reasoning
 * 7. Frequency Analysis and statistical inference
 * 8. Bigram/Trigram Analysis
 * 9. Keyspace and exhaustive-search feasibility
 * 10. Selecting a suitable cryptanalysis strategy for a given scenario
 */
export const CONCEPTS_QUIZ = [
  {
    "id": 1,
    "topic": "Caesar Cipher and unknown-shift recovery",
    "question": "An analyst intercepts the 4-letter ciphertext fragment 'OLSS', generated by an unknown Caesar shift key K in {0, 1, ..., 25}. Contextual intelligence confirms the plaintext is a standard English word whose last two letters are 'LL'. What is the secret encryption shift key K, and what plaintext word does this recover?",
    "options": [
      "K = 7, recovering plaintext 'HELL'",
      "K = 19, recovering plaintext 'FALL'",
      "K = 11, recovering plaintext 'DAHH'",
      "K = 14, recovering plaintext 'AXEE'"
    ],
    "answer": 0,
    "explanation": "In the Caesar Cipher, C = (P + K) mod 26, so decryption is P = (C - K) mod 26. For the ciphertext letter 'S' (18) to decrypt to 'L' (11), the key must satisfy (18 - K) = 11 (mod 26), which yields K = 7. Applying K = 7 to all letters: O(14) - 7 = 7 ('H'), L(11) - 7 = 4 ('E'), S(18) - 7 = 11 ('L'), S(18) - 7 = 11 ('L'), yielding the valid English word 'HELL'."
  },
  {
    "id": 2,
    "topic": "Affine Cipher encryption and modular arithmetic",
    "question": "An Affine Cipher uses the encryption function E(x) = (ax + b) mod 26 with multiplicative key a = 7 and additive key b = 11, where A = 0, B = 1, ..., Z = 25. What is the resulting 2-letter ciphertext produced by encrypting the plaintext word 'GO'?",
    "options": [
      "QU",
      "HL",
      "BF",
      "CG"
    ],
    "answer": 2,
    "explanation": "Using standard 0-indexed positions, G = 6 and O = 14. Applying E(x) = (7x + 11) mod 26: For G (6): E(6) = (7 * 6 + 11) mod 26 = (42 + 11) mod 26 = 53 mod 26 = 1, which corresponds to 'B'. For O (14): E(14) = (7 * 14 + 11) mod 26 = (98 + 11) mod 26 = 109 mod 26 = 5 (since 109 = 4 * 26 + 5), which corresponds to 'F'. Thus, 'GO' encrypts to 'BF'."
  },
  {
    "id": 3,
    "topic": "Affine Cipher key validity and modular inverses",
    "question": "A cryptanalyst reviews four candidate values for the multiplicative key a in an Affine Cipher modulo 26: a in {4, 9, 13, 14}. Which candidate value is mathematically valid for encryption, and what is its modular multiplicative inverse a^-1 mod 26 required for decryption?",
    "options": [
      "Only a = 13 is valid, with a^-1 = 2, because 13 * 2 = 0 (mod 26).",
      "Only a = 9 is valid, with a^-1 = 3, because gcd(9, 26) = 1 and (9 * 3) = 1 (mod 26).",
      "Both a = 4 and a = 9 are valid, with a^-1 = 7 and a^-1 = 3 respectively.",
      "Only a = 14 is valid, with a^-1 = 19, because gcd(14, 26) = 2 preserves even parity."
    ],
    "answer": 1,
    "explanation": "For an Affine Cipher over Z_26, the multiplicative key 'a' must be coprime to 26 (gcd(a, 26) = 1) so that encryption is a bijection and a modular inverse a^-1 exists. Values 4 and 14 share factor 2 with 26, and 13 shares factor 13 with 26, leaving only a = 9 as valid (gcd(9, 26) = 1). The modular inverse satisfies (9 * a^-1) = 1 (mod 26). Because 9 * 3 = 27 = 1 * 26 + 1 = 1 (mod 26), the inverse is a^-1 = 3."
  },
  {
    "id": 4,
    "topic": "Product Cipher transformation order",
    "question": "In CryptoBreak Lab's defined Product Cipher, encryption applies a Caesar Cipher (shift K = 4) followed by an Affine Cipher (a = 5, b = 2). If an intercepted ciphertext letter is 'Q' (index 16), what is the mathematically correct sequence of inverse operations to recover the plaintext letter, and what plaintext letter is produced? (Note: 5^-1 = 21 mod 26)",
    "options": [
      "Apply Affine decryption first to obtain intermediate index 8 ('I'), then subtract the Caesar shift 4 to obtain 'E' (index 4).",
      "Subtract the Caesar shift 4 first to obtain intermediate index 12 ('M'), then apply Affine decryption to obtain 'C' (index 2).",
      "Apply Caesar decryption first to obtain intermediate index 12, then add the additive key b = 2 to obtain 'O' (index 14).",
      "Multiply by a = 5 first, then subtract the Caesar shift 4 and additive key b = 2 to obtain 'G' (index 6)."
    ],
    "answer": 0,
    "explanation": "Function composition (f o g)(x) inverts in reverse order: (f o g)^-1 = g^-1 o f^-1. Since encryption applies Caesar first and Affine second (C = Affine(Caesar(P))), decryption must invert Affine first and Caesar second (P = Caesar^-1(Affine^-1(C))). Step 1 (Affine decryption on Q = 16): D_Affine(16) = 21 * (16 - 2) mod 26 = 21 * 14 mod 26 = 294 mod 26 = 8 ('I') (since 294 = 11 * 26 + 8). Step 2 (Caesar decryption on intermediate 8): P = (8 - 4) mod 26 = 4 ('E'). Verification: P = 'E' (4) -> Caesar(+4) = 8 ('I') -> Affine: (5 * 8 + 2) mod 26 = 42 mod 26 = 16 ('Q')."
  },
  {
    "id": 5,
    "topic": "Monoalphabetic Substitution and mapping constraints",
    "question": "An analyst is reconstructing a monoalphabetic substitution cipher alphabet from partial known plaintext. The known pairs already establish the mappings: C -> M, R -> K, Y -> B, P -> X, T -> V, and O -> Q. Which of the following proposed additions would violate the fundamental one-to-one (bijective) mapping constraint of a monoalphabetic substitution cipher?",
    "options": [
      "Mapping plaintext 'D' to ciphertext 'J'",
      "Mapping plaintext 'E' to ciphertext 'S'",
      "Mapping plaintext 'L' to ciphertext 'W'",
      "Mapping plaintext 'A' to ciphertext 'K'"
    ],
    "answer": 3,
    "explanation": "A monoalphabetic substitution cipher requires a bijective (one-to-one and onto) permutation of the 26-letter alphabet. If two distinct plaintext letters mapped to the same ciphertext letter (non-injective mapping), unique decryption would be impossible. Because plaintext 'R' is already mapped to ciphertext 'K', assigning plaintext 'A' to ciphertext 'K' creates a collision where two different plaintext letters map to 'K', directly violating the one-to-one constraint."
  },
  {
    "id": 6,
    "topic": "Brute Force Attack and search-space reasoning",
    "question": "A cryptanalyst implements an automated cracker that tests candidate keys at an evaluation rate of 10^7 (10 million) keys per second, automatically scoring each decryption against an English quadgram language model. Comparing an exhaustive search against the Caesar Cipher versus a general Monoalphabetic Substitution Cipher over a 26-letter alphabet, which statement accurately characterizes the search spaces and exhaustive search durations?",
    "options": [
      "Caesar has 25 total keys (search completes in 2.5 microseconds); general substitution has 26^2 = 676 keys (search completes in under 0.1 milliseconds).",
      "Caesar has 26 total keys (search completes in under 3 microseconds); general substitution has 26! approx 4.03 * 10^26 keys (search requires over 1.2 * 10^12 years).",
      "Caesar has 26 total keys (search completes in 2.6 microseconds); general substitution has 2^26 approx 6.71 * 10^7 keys (search completes in approximately 6.7 seconds).",
      "Caesar has 26! total keys (search requires trillions of years); general substitution has 26 keys (search completes in microseconds)."
    ],
    "answer": 1,
    "explanation": "Caesar has exactly 26 possible shifts (keys K = 0 through 25). At 10^7 keys/sec, 26 / 10^7 = 2.6 * 10^-6 seconds (2.6 microseconds, under 3 microseconds). In contrast, an arbitrary monoalphabetic substitution key is a permutation of the 26 letters, giving a keyspace of 26! approx 4.0329 * 10^26. At 10^7 keys/sec, exhausting this keyspace takes (4.0329 * 10^26) / 10^7 approx 4.03 * 10^19 seconds approx 1.28 * 10^12 years (over 1.2 trillion years), proving exhaustive brute force is computationally infeasible against general substitution."
  },
  {
    "id": 7,
    "topic": "Frequency Analysis and statistical inference",
    "question": "An analyst intercepts a short 40-character ciphertext encrypted with an unknown monoalphabetic substitution cipher. Counting letter occurrences reveals that ciphertext letter 'V' appears 10 times (25%), while all other letters appear 2 times or fewer. A student asserts: 'Because E is the most frequent letter in standard English (~12.7%), V must definitely decrypt to E, guaranteeing that this substitution mapping is solved.' Why is this assertion cryptanalytically flawed?",
    "options": [
      "Frequency analysis is only applicable to polyalphabetic ciphers like Vigenere, so it cannot be used on monoalphabetic substitution ciphers.",
      "In standard English, E must always appear at exactly 12.7% of characters in every message regardless of length, so a 25% frequency proves the plaintext is not English.",
      "Frequency analysis yields probabilistic hypotheses rather than mathematical certainties; on short samples (such as 40 characters), sample variance is high, and message content can easily cause letters like T, A, or O to dominate rather than E.",
      "In monoalphabetic ciphers, letter frequencies are completely uniform and randomized, meaning no statistical correlation exists between plaintext and ciphertext frequencies."
    ],
    "answer": 2,
    "explanation": "Frequency analysis relies on the Law of Large Numbers, which only guarantees convergence to expected language distributions over large corpora. On short messages (such as 40 letters), variance is extreme: a short dispatch such as 'ATTACK AT DAWN TODAY' contains zero occurrences of 'E' and an abundance of 'A' and 'T'. Thus, observed frequencies provide candidate hypotheses to test, never definitive proofs, and frequency analysis can be inconclusive on short messages."
  },
  {
    "id": 8,
    "topic": "Bigram/Trigram Analysis",
    "question": "An analyst attacking a monoalphabetic ciphertext observes that the ciphertext trigram 'XMB' appears 6 times and the bigram 'MB' appears 14 times. Using trigram statistics, the analyst hypothesizes that 'XMB' maps to the common English trigram 'THE' (establishing X -> T, M -> H, B -> E). Later, the analyst inspects the 5-letter ciphertext word 'XMBSE'. Which of the following candidate plaintexts is strictly consistent with the partial key and the bijective mapping constraints of a monoalphabetic substitution cipher?",
    "options": [
      "THEIR",
      "THESE",
      "THERE",
      "TEETH"
    ],
    "answer": 0,
    "explanation": "In the ciphertext word 'XMBSE', all 5 letters {X, M, B, S, E} are distinct. Under the established key: X -> T, M -> H, and B -> E. If the plaintext were 'THESE' or 'THERE', the 5th letter would be 'E'. Because 'E' is already mapped to ciphertext 'B', the 5th ciphertext letter would have to be 'B' (producing 'XMB_B'). But the actual 5th ciphertext letter is 'E' (distinct from 'B'). 'TEETH' violates the mapping M -> H at position 2. Only 'THEIR' features 5 distinct letters {T, H, E, I, R}, mapping to 5 distinct ciphertext letters {X, M, B, S, E} without violating the bijective mapping requirement."
  },
  {
    "id": 9,
    "topic": "Keyspace and exhaustive-search feasibility",
    "question": "A student claims: 'A monoalphabetic substitution cipher has a keyspace of 26! approx 4.03 * 10^26, whereas Caesar has only 26 keys. Because 26! is so astronomically vast that even a supercomputer testing 10^15 keys per second would take over 12,000 years to test all keys, a monoalphabetic substitution cipher provides high security for modern communications.' Which of the following correctly critiques the student's reasoning?",
    "options": [
      "The student's keyspace calculation is incorrect because a monoalphabetic substitution cipher only has 26^2 = 676 possible keys, making brute force trivial.",
      "The student's conclusion is correct because Kerckhoffs's principle guarantees that any cipher with a keyspace exceeding 10^20 is unbreakable by any cryptanalytic method.",
      "The student is mistaken because modern quantum computers can evaluate 26! keys in under a second using Grover's algorithm, which reduces any keyspace to zero.",
      "The calculation of exhaustive search time is mathematically accurate, but the security conclusion is false because substitution preserves natural language letter and n-gram frequencies, allowing statistical cryptanalysis to break the cipher in seconds without searching the keyspace."
    ],
    "answer": 3,
    "explanation": "A large keyspace is a necessary condition for cryptographic security (to defeat exhaustive brute-force search), but it is NOT a sufficient condition. Although 26! approx 4.03 * 10^26 makes exhaustive search computationally infeasible, monoalphabetic substitution preserves letter frequencies, digraphs, and trigraphs, allowing frequency analysis to recover the key in seconds without searching the keyspace."
  },
  {
    "id": 10,
    "topic": "Selecting a suitable cryptanalysis strategy for a given scenario",
    "question": "A cryptanalyst intercepts two separate transmissions encrypted with classical ciphers: Transmission 1 is a 14-character tactical order encrypted with a Caesar Cipher (shift unknown). Transmission 2 is a 3,000-character intercepted diplomatic dispatch encrypted with a Monoalphabetic Substitution Cipher (arbitrary permutation). Which cryptanalysis strategy is the most mathematically and computationally sound approach for each transmission?",
    "options": [
      "For Transmission 1, use Frequency Analysis (because 14 characters is ideal for frequency distribution); for Transmission 2, use Exhaustive Brute Force (because substitution keys are easily checked sequentially).",
      "For Transmission 1, use Exhaustive Brute Force (evaluating all 26 shifts in microseconds); for Transmission 2, use Frequency and N-gram Analysis (as 3,000 characters provides a statistically robust sample to match English distributions, whereas the 26! keyspace makes brute force impossible).",
      "For Transmission 1, use a Known-Plaintext Attack requiring at least 500 characters; for Transmission 2, use Modular Linear Inversion using gcd(a, 26) = 1.",
      "For both transmissions, use Exhaustive Brute Force, as modern computers can exhaust both 26 and 26! keyspaces within milliseconds."
    ],
    "answer": 1,
    "explanation": "Transmission 1 has only 26 possible keys. A 14-character message is far too short for reliable statistical frequency analysis, but testing all 26 shifts by brute force takes less than a millisecond and immediately reveals the plaintext. Transmission 2 has a keyspace of 26! approx 4.03 * 10^26, making brute force mathematically impossible. However, 3,000 characters provides a rich statistical sample where letter and n-gram frequencies closely mirror English language averages, making frequency and n-gram analysis the optimal cryptanalytic strategy."
  }
];
