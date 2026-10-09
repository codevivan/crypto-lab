/**
 * Concepts & Educational Course Data
 * Comprehensive viva cheatsheets, mathematical formulations, and visual workflows.
 * Every concept includes a 5-question interactive quiz.
 */

export const CONCEPTS = [
  {
    id: 1,
    number: "01",
    title: "Cryptography",
    tag: "Security Foundation",
    definition:
      "Cryptography is the science and practice of securing communication by transforming readable messages into unintelligible secret formats.",
    whyItMatters:
      "Without cryptography, digital messages, passwords, and sensitive records could be intercepted and read by unauthorized adversaries.",
    keyIdea:
      "Readable Plaintext is converted into unreadable Ciphertext via an algorithm and a secret key, then inverted back to Plaintext.",
    visualType: "crypto-flow",
    example: {
      plain: "HELLO",
      key: "Shift = 3",
      cipher: "KHOOR",
      action: "Encryption transforms 'HELLO' into 'KHOOR'. Decryption reverses it.",
    },
    vivaQuestion: "What is the difference between an encryption algorithm and an encryption key?",
    vivaAnswer:
      "The algorithm is the mathematical set of rules (e.g. Caesar shift), whereas the key is the secret parameter that determines the specific transformation.",
    vivaTakeaway:
      "Cryptography protects information by transforming readable plaintext into ciphertext using an algorithm and key.",
    quiz: [
      {
        id: "cry-q1",
        question: "What is the primary goal of cryptography?",
        options: [
          "To compress data for faster transmission",
          "To secure communication by transforming plaintext into unreadable ciphertext",
          "To detect errors in data transmission",
          "To speed up data processing",
        ],
        answer: 1,
        explanation: "Cryptography secures communication by converting readable plaintext into unintelligible ciphertext, preventing unauthorized access.",
      },
      {
        id: "cry-q2",
        question: "What is 'plaintext' in cryptography?",
        options: [
          "The encrypted, unreadable form of a message",
          "The secret key used to encrypt a message",
          "The original, readable message before encryption",
          "A type of cipher algorithm",
        ],
        answer: 2,
        explanation: "Plaintext is the original, readable message that is fed into the encryption algorithm. After encryption it becomes ciphertext.",
      },
      {
        id: "cry-q3",
        question: "Which of the following best describes 'ciphertext'?",
        options: [
          "A readable message after decryption",
          "The encryption algorithm itself",
          "The secret key shared between parties",
          "The unintelligible output produced after encrypting plaintext",
        ],
        answer: 3,
        explanation: "Ciphertext is the scrambled, unreadable output produced when plaintext is transformed by the encryption algorithm using a key.",
      },
      {
        id: "cry-q4",
        question: "What is the role of a 'key' in a cryptographic system?",
        options: [
          "It defines which letters to remove from the message",
          "It is the secret parameter that controls the specific transformation",
          "It determines the length of the output ciphertext",
          "It stores the encrypted message",
        ],
        answer: 1,
        explanation: "The key is the secret parameter that, combined with the algorithm, determines the exact transformation applied to the plaintext. Without the key, the ciphertext cannot be decrypted.",
      },
      {
        id: "cry-q5",
        question: "What is the process of converting ciphertext back to plaintext called?",
        options: [
          "Encryption",
          "Hashing",
          "Decryption",
          "Compression",
        ],
        answer: 2,
        explanation: "Decryption is the reverse of encryption: it uses the key and algorithm to convert ciphertext back into the original, readable plaintext.",
      },
    ],
  },
  {
    id: 2,
    number: "02",
    title: "Cryptanalysis",
    tag: "Attack Science",
    definition:
      "Cryptanalysis is the study of analyzing encrypted messages to recover the secret plaintext or deduce the hidden key without prior authorization.",
    whyItMatters:
      "Understanding attack methodologies allows security engineers to design mathematically resilient cryptosystems and recognize flawed designs.",
    keyIdea:
      "Cryptanalysis identifies and exploits structural, statistical, or mathematical weaknesses in a cipher system.",
    visualType: "attack-flow",
    example: {
      plain: "Target Plaintext",
      key: "Unknown Key",
      cipher: "KHOOR ZRUOG",
      action: "Analyst attacks the ciphertext using Brute Force or Frequency Analysis.",
    },
    vivaQuestion: "What is Kerckhoffs's principle in cryptanalysis?",
    vivaAnswer:
      "A cryptosystem must remain secure even if everything about the algorithm is publicly known; only the key must be kept secret.",
    vivaTakeaway:
      "Cryptanalysis attempts to exploit structural and mathematical weaknesses in a cryptographic system.",
    quiz: [
      {
        id: "cra-q1",
        question: "What is the goal of cryptanalysis?",
        options: [
          "To design stronger encryption algorithms",
          "To compress ciphertext",
          "To recover plaintext or deduce the key without authorization",
          "To generate new secret keys",
        ],
        answer: 2,
        explanation: "Cryptanalysis aims to recover the original plaintext or deduce the encryption key by analyzing the ciphertext, without prior knowledge of the key.",
      },
      {
        id: "cra-q2",
        question: "Kerckhoffs's principle states that:",
        options: [
          "The algorithm must be kept completely secret",
          "A cryptosystem must be secure even if the algorithm is publicly known; only the key must be secret",
          "The key and algorithm must both be secret",
          "Longer keys are always more secure",
        ],
        answer: 1,
        explanation: "Kerckhoffs's principle: security must rely only on the secrecy of the key, not the secrecy of the algorithm itself.",
      },
      {
        id: "cra-q3",
        question: "Which type of cryptanalytic attack uses only intercepted ciphertext?",
        options: [
          "Known-plaintext attack",
          "Chosen-plaintext attack",
          "Ciphertext-only attack",
          "Man-in-the-middle attack",
        ],
        answer: 2,
        explanation: "A ciphertext-only attack means the analyst has access only to ciphertext samples with no knowledge of any corresponding plaintext.",
      },
      {
        id: "cra-q4",
        question: "In a known-plaintext attack, the attacker has access to:",
        options: [
          "Only the ciphertext",
          "Both plaintext and its corresponding ciphertext",
          "The encryption key",
          "The source code of the algorithm",
        ],
        answer: 1,
        explanation: "In a known-plaintext attack, the attacker possesses both a sample of plaintext and the corresponding ciphertext, which can help deduce the key.",
      },
      {
        id: "cra-q5",
        question: "Why is understanding cryptanalysis important for security engineers?",
        options: [
          "It helps them break encryption for personal gain",
          "It allows them to design ciphers that resist known attack strategies",
          "It reduces the cost of encryption",
          "It eliminates the need for keys",
        ],
        answer: 1,
        explanation: "By understanding how attacks work, security engineers can design cryptosystems that are resistant to those attack methodologies.",
      },
    ],
  },
  {
    id: 3,
    number: "03",
    title: "Monoalphabetic Cipher",
    tag: "Classical Substitution",
    definition:
      "A cipher where each plaintext letter is mapped to exactly one unique ciphertext letter, and that mapping remains fixed throughout the message.",
    whyItMatters:
      "It represents the fundamental baseline of substitution ciphers. Its primary flaw is that it preserves natural language letter frequency distributions.",
    keyIdea:
      "One-to-one letter substitution: if 'E' is replaced by 'X', every occurrence of 'E' in the message becomes 'X'.",
    visualType: "mapping-table",
    example: {
      plain: "HELLO",
      key: "H→I, E→T, L→S, O→G",
      cipher: "ITSSG",
      action: "Notice double letters 'LL' directly produce double letters 'SS'.",
    },
    vivaQuestion: "Why does monoalphabetic substitution preserve letter frequencies?",
    vivaAnswer:
      "Because each letter is replaced by the same substitute every single time, directly transferring the plaintext letter frequencies to the ciphertext.",
    vivaTakeaway:
      "A monoalphabetic substitution cipher uses a fixed one-to-one substitution alphabet.",
    quiz: [
      {
        id: "mono-q1",
        question: "In a monoalphabetic cipher, how many ciphertext letters can a single plaintext letter map to?",
        options: [
          "Multiple — it changes each occurrence",
          "Exactly one — fixed throughout the message",
          "It depends on the position in the word",
          "None — plaintext is not changed",
        ],
        answer: 1,
        explanation: "In a monoalphabetic cipher, each plaintext letter always maps to exactly one fixed ciphertext letter. This is why it is called 'mono' (single) alphabetic.",
      },
      {
        id: "mono-q2",
        question: "What is the size of the key space for a general monoalphabetic substitution cipher?",
        options: ["26", "26²", "26!", "2²⁶"],
        answer: 2,
        explanation: "There are 26! (approximately 4 × 10²⁶) possible permutations of the 26-letter alphabet, giving 26! possible substitution keys.",
      },
      {
        id: "mono-q3",
        question: "If 'E' maps to 'X' in a monoalphabetic cipher, what does every 'E' in the plaintext become?",
        options: ["A random letter each time", "X", "The next letter in the alphabet after E", "Nothing — vowels are skipped"],
        answer: 1,
        explanation: "The mapping is fixed: every occurrence of 'E' in the plaintext becomes 'X' in the ciphertext, regardless of position.",
      },
      {
        id: "mono-q4",
        question: "Why is the monoalphabetic cipher vulnerable to frequency analysis despite its large key space?",
        options: [
          "Because it uses too few letters",
          "Because it is the same as the Caesar cipher",
          "Because the fixed mapping preserves plaintext letter frequency patterns in the ciphertext",
          "Because it can only encrypt uppercase letters",
        ],
        answer: 2,
        explanation: "The fixed one-to-one substitution directly transfers frequency distributions from plaintext to ciphertext. A cryptanalyst can exploit the fact that common letters (e.g. 'E') still appear frequently, just under a different symbol.",
      },
      {
        id: "mono-q5",
        question: "If 'LL' appears in plaintext and L maps to S, what appears in the ciphertext?",
        options: ["LS", "SL", "SS", "LL"],
        answer: 2,
        explanation: "Since the mapping is fixed, both occurrences of 'L' map to 'S', so 'LL' becomes 'SS'. This pattern of repeated letters is preserved and aids cryptanalysis.",
      },
    ],
  },
  {
    id: 4,
    number: "04",
    title: "Caesar Cipher",
    tag: "Shift Cipher",
    definition:
      "A specific monoalphabetic cipher in which every letter in the plaintext is shifted by a fixed integer key K (0–25) positions in the alphabet.",
    whyItMatters:
      "It is the oldest known military substitution cipher. Its trivial key space (26 shifts) makes it the prime educational model for brute-force attacks.",
    keyIdea:
      "Modular arithmetic on letters: C = (P + K) mod 26. Inversion: P = (C - K + 26) mod 26.",
    visualType: "shift-formula",
    example: {
      plain: "HELLO",
      key: "K = 3 (A→D, B→E...)",
      cipher: "KHOOR",
      action: "H(+3)=K, E(+3)=H, L(+3)=O, L(+3)=O, O(+3)=R.",
    },
    vivaQuestion: "Why is ROT13 considered a symmetric special case of the Caesar cipher?",
    vivaAnswer:
      "ROT13 uses shift K = 13. Because 13 + 13 = 26 (modulo 26), applying the same operation twice restores the original text.",
    vivaTakeaway:
      "Caesar is vulnerable to brute force because only 26 shifts are possible.",
    quiz: [
      {
        id: "cae-q1",
        question: "What is the encryption formula for the Caesar Cipher?",
        options: [
          "C = (P × K) mod 26",
          "C = (P + K) mod 26",
          "C = (P - K) mod 26",
          "C = (P + K) mod 52",
        ],
        answer: 1,
        explanation: "The Caesar Cipher uses C = (P + K) mod 26, where P is the numeric position of the plaintext letter (A=0), K is the shift, and mod 26 ensures wrap-around.",
      },
      {
        id: "cae-q2",
        question: "Encrypting 'A' (index 0) with a Caesar shift of K=3 gives which letter?",
        options: ["C (2)", "D (3)", "B (1)", "Z (25)"],
        answer: 1,
        explanation: "E(0) = (0 + 3) mod 26 = 3, which corresponds to 'D'. A shifts 3 positions forward to D.",
      },
      {
        id: "cae-q3",
        question: "How many unique keys exist in the Caesar Cipher?",
        options: ["25", "26", "26!", "312"],
        answer: 1,
        explanation: "There are exactly 26 possible shifts (K = 0 through 25). This makes the key space trivially small and easily exhausted by brute force.",
      },
      {
        id: "cae-q4",
        question: "The decryption formula for Caesar Cipher is:",
        options: [
          "P = (C + K) mod 26",
          "P = (C × K) mod 26",
          "P = (C - K + 26) mod 26",
          "P = (C / K) mod 26",
        ],
        answer: 2,
        explanation: "P = (C - K + 26) mod 26. The +26 ensures the result is non-negative when C - K is negative.",
      },
      {
        id: "cae-q5",
        question: "ROT13 is a special case of the Caesar Cipher where K = 13. Why is applying ROT13 twice the same as no encryption?",
        options: [
          "Because 13 is a prime number",
          "Because 13 + 13 = 26 ≡ 0 (mod 26), returning the original letter",
          "Because ROT13 uses a different alphabet",
          "Because 13 is half of 26",
        ],
        answer: 1,
        explanation: "ROT13 applied twice: (P + 13 + 13) mod 26 = (P + 26) mod 26 = P. The double shift is equivalent to zero shift, making it self-inverse.",
      },
    ],
  },
  {
    id: 5,
    number: "05",
    title: "Brute Force Attack",
    tag: "Exhaustive Search",
    definition:
      "A cryptanalytic attack that systematically checks every possible key in the key space until the meaningful plaintext is discovered.",
    whyItMatters:
      "It establishes the absolute upper bound of a cipher's security. If a cipher's key space is too small, brute force breaks it immediately.",
    keyIdea:
      "Test Key 0, Key 1, Key 2... Key N. Practical against Caesar (26 keys), but impossible against general substitution (26! keys).",
    visualType: "brute-keys",
    example: {
      plain: "HELLO WORLD",
      key: "Shift 0: KHOOR... Shift 3: HELLO WORLD ✓",
      cipher: "KHOOR ZRUOG",
      action: "Computer tests shifts 0 through 25 in under a millisecond.",
    },
    vivaQuestion: "What factors determine if a brute-force attack is feasible?",
    vivaAnswer:
      "The total size of the key space and the computational time required to evaluate candidate decryptions.",
    vivaTakeaway:
      "Brute force is practical when the keyspace is sufficiently small.",
    quiz: [
      {
        id: "bf-q1",
        question: "A brute force attack works by:",
        options: [
          "Guessing the key using letter frequencies",
          "Systematically testing every possible key until the correct one is found",
          "Using known plaintext to deduce the key mathematically",
          "Intercepting the key during transmission",
        ],
        answer: 1,
        explanation: "Brute force exhaustively tries every possible key in the key space until a meaningful plaintext is recovered.",
      },
      {
        id: "bf-q2",
        question: "Why is brute force practical against the Caesar Cipher but not monoalphabetic substitution?",
        options: [
          "Caesar uses a longer key",
          "Caesar has only 26 keys; substitution has 26! ≈ 4×10²⁶ keys",
          "Caesar is harder to decrypt",
          "Substitution uses a shorter alphabet",
        ],
        answer: 1,
        explanation: "Caesar's 26-key space is trivially exhausted in microseconds. Substitution's 26! keys would take billions of years even at a trillion keys per second.",
      },
      {
        id: "bf-q3",
        question: "If a computer tests 10¹² (1 trillion) keys per second, approximately how long would it take to brute force 26! keys?",
        options: [
          "A few minutes",
          "A few hours",
          "A few thousand years",
          "Over 12 billion years",
        ],
        answer: 3,
        explanation: "26! / 10¹² ≈ 4×10¹⁴ seconds ≈ 12.7 billion years. The key space of 26! makes brute force computationally infeasible.",
      },
      {
        id: "bf-q4",
        question: "Which aspect of a cipher determines whether a brute force attack is feasible?",
        options: [
          "The length of the plaintext",
          "The size of the key space",
          "The language of the message",
          "The number of vowels in the ciphertext",
        ],
        answer: 1,
        explanation: "Feasibility of brute force depends entirely on the key space size. A small key space (like Caesar's 26 keys) is quickly exhausted; a large one (26!) is not.",
      },
      {
        id: "bf-q5",
        question: "What additional tool does an automated brute force system use to identify the 'correct' decryption among all candidates?",
        options: [
          "Random guessing",
          "A language scoring function (e.g., letter frequency or dictionary check)",
          "A larger key space",
          "Hash comparison",
        ],
        answer: 1,
        explanation: "Brute force tools score each candidate decryption using a fitness function — e.g., comparing letter frequencies or checking for recognisable words — to identify which key produces meaningful plaintext.",
      },
    ],
  },
  {
    id: 6,
    number: "06",
    title: "Frequency Analysis",
    tag: "Statistical Attack",
    definition:
      "A technique that studies the frequency of letters in ciphertext to deduce the substitution alphabet based on natural language statistics.",
    whyItMatters:
      "It completely defeats monoalphabetic substitution ciphers without testing 26! keys, proving that large key spaces alone do not guarantee security.",
    keyIdea:
      "In English, 'E' is ~12.7%, 'T' is ~9.1%, 'A' is ~8.2%. The most frequent ciphertext letter is hypothesized to be 'E'.",
    visualType: "freq-bars",
    example: {
      plain: "E is most common in English (~12.7%)",
      key: "Hypothesis: E maps to X",
      cipher: "X appears 13% in ciphertext",
      action: "Analyst forms hypothesis: X represents E. Note: frequency is a hypothesis, not proof.",
    },
    vivaQuestion: "Why can't frequency analysis easily break polyalphabetic ciphers like Vigenère?",
    vivaAnswer:
      "Polyalphabetic ciphers use multiple shifting alphabets, causing a single plaintext letter to map to several ciphertext letters and flattening the distribution.",
    vivaTakeaway:
      "Frequency analysis exploits statistical patterns preserved by substitution.",
    quiz: [
      {
        id: "fa-q1",
        question: "Frequency analysis exploits which property of monoalphabetic substitution ciphers?",
        options: [
          "The short key length",
          "The fixed one-to-one mapping that preserves letter frequency distributions",
          "The use of numbers instead of letters",
          "The rotation of letters by a fixed shift",
        ],
        answer: 1,
        explanation: "Because each plaintext letter always maps to the same ciphertext letter, the frequency distribution of letters is preserved, allowing statistical deduction of the substitution.",
      },
      {
        id: "fa-q2",
        question: "Approximately what percentage of letters in typical English text is the letter 'E'?",
        options: ["1.2%", "6.5%", "12.7%", "20.0%"],
        answer: 2,
        explanation: "'E' is the most frequent letter in English, appearing approximately 12.7% of the time. This makes it the first hypothesis in frequency analysis.",
      },
      {
        id: "fa-q3",
        question: "In frequency analysis, if 'X' appears most often in a ciphertext (13%), the analyst's first hypothesis is:",
        options: [
          "X encrypts to A",
          "X decrypts to the most common English letter, E",
          "X means the key is 24",
          "X is a padding character",
        ],
        answer: 1,
        explanation: "The analyst hypothesises that the most frequent ciphertext letter corresponds to 'E', the most common English letter. This is a probabilistic hypothesis, not a certainty.",
      },
      {
        id: "fa-q4",
        question: "Why does frequency analysis fail against the Vigenère cipher?",
        options: [
          "Vigenère uses too short a key",
          "Vigenère uses multiple substitution alphabets, flattening the frequency distribution",
          "Vigenère adds numbers to the ciphertext",
          "Vigenère encrypts two letters at a time",
        ],
        answer: 1,
        explanation: "Vigenère uses a repeating keyword to shift letters by different amounts, so a single plaintext letter can map to multiple ciphertext letters, destroying the frequency signature.",
      },
      {
        id: "fa-q5",
        question: "What is the correct order of the most frequent letters in English (the 'ETAOIN' sequence)?",
        options: [
          "A, B, C, D, E, F",
          "E, T, A, O, I, N",
          "T, H, E, A, N, D",
          "Z, X, Q, J, K, V",
        ],
        answer: 1,
        explanation: "ETAOIN SHRDLU is the traditional sequence of most-to-least frequent letters in English. E (~12.7%) leads, followed by T (~9.1%), A (~8.2%), O (~7.5%), I (~7.0%), N (~6.7%).",
      },
    ],
  },
  {
    id: 7,
    number: "07",
    title: "N-Gram Analysis",
    tag: "Digraph & Trigraph",
    definition:
      "The statistical examination of sequences of n consecutive letters (Bigrams for n=2, Trigrams for n=3) in encrypted text.",
    whyItMatters:
      "Individual letter frequencies often produce ties or statistical noise. N-grams reveal grammatical structure and common words like 'THE'.",
    keyIdea:
      "Common English bigrams include TH, HE, IN, ER, AN. Common trigrams include THE, AND, ENT, ION.",
    visualType: "ngram-boxes",
    example: {
      plain: "THE is the most common English trigram",
      key: "Trigram 'ZIT' appears 3 times",
      cipher: "ZIT LTEKTZ... ZIT UQKRTF",
      action: "Strongly indicates ZIT represents THE (Z→T, I→H, T→E).",
    },
    vivaQuestion: "How do n-grams assist cryptanalysis when letter frequencies are ambiguous?",
    vivaAnswer:
      "N-grams provide contextual pairings that identify common prefixes, suffixes, and short structural words (e.g. 'OF', 'IN', 'THE').",
    vivaTakeaway:
      "N-gram analysis helps identify likely word structures and letter combinations.",
    quiz: [
      {
        id: "ng-q1",
        question: "What is a 'bigram' in n-gram analysis?",
        options: [
          "A single letter",
          "A pair of two consecutive letters",
          "A sequence of three consecutive letters",
          "A word with exactly two syllables",
        ],
        answer: 1,
        explanation: "A bigram (n=2) is a pair of two consecutive letters. Common English bigrams include TH, HE, IN, ER, and AN.",
      },
      {
        id: "ng-q2",
        question: "What is the most common English trigram?",
        options: ["AND", "THE", "ENT", "ION"],
        answer: 1,
        explanation: "'THE' is the most common English trigram. If a sequence of 3 identical ciphertext letters appears frequently, they are likely to represent T, H, and E.",
      },
      {
        id: "ng-q3",
        question: "Why is n-gram analysis more powerful than single-letter frequency analysis alone?",
        options: [
          "It requires fewer calculations",
          "It reveals structural word patterns and disambiguates ties in single-letter frequencies",
          "It works on polyalphabetic ciphers",
          "It only works on very short messages",
        ],
        answer: 1,
        explanation: "Single-letter frequencies can be ambiguous (e.g., two letters with similar frequency). N-grams reveal contextual patterns — common word fragments like 'TH', 'THE', 'AND' — providing stronger evidence.",
      },
      {
        id: "ng-q4",
        question: "If ciphertext trigram 'ZIT' appears very frequently, what is the most likely plaintext mapping?",
        options: [
          "ZIT → AND",
          "ZIT → THE",
          "ZIT → FOR",
          "ZIT → YOU",
        ],
        answer: 1,
        explanation: "'THE' is the most common English trigram. A frequently occurring 3-letter ciphertext group is most likely to be 'THE', suggesting Z→T, I→H, T→E.",
      },
      {
        id: "ng-q5",
        question: "Which of the following is a common English bigram?",
        options: ["QX", "ZK", "TH", "VW"],
        answer: 2,
        explanation: "'TH' is the most common English bigram. Rare letter combinations like QX, ZK, and VW almost never appear in natural English text.",
      },
    ],
  },
  {
    id: 8,
    number: "08",
    title: "Keyspace",
    tag: "Mathematical Space",
    definition:
      "The set of all possible secret keys that can be utilized to initialize an encryption algorithm.",
    whyItMatters:
      "Keyspace size dictates whether an exhaustive brute-force attack is computationally achievable or mathematically impossible.",
    keyIdea:
      "Caesar has 26 keys. Monoalphabetic substitution has 26! ≈ 4.03 × 10²⁶ keys.",
    visualType: "keyspace-comparison",
    example: {
      plain: "Caesar: 26 keys (< 0.001 ms)",
      key: "Substitution: 26! keys (> 12 billion years at 10¹² keys/sec)",
      cipher: "Exhaustive brute force fails on 26!",
      action: "Demonstrates why different attacks (Brute Force vs Frequency) are chosen based on key space.",
    },
    vivaQuestion: "If a supercomputer tests 1 trillion keys/sec, why is 26! still secure against brute force?",
    vivaAnswer:
      "At 10¹² keys/sec, testing 4.03 × 10²⁶ keys requires ~4.03 × 10¹⁴ seconds, which is over 12.7 billion years.",
    vivaTakeaway:
      "Larger keyspaces make exhaustive search increasingly difficult.",
    quiz: [
      {
        id: "ks-q1",
        question: "What does 'keyspace' mean in cryptography?",
        options: [
          "The physical location where keys are stored",
          "The set of all possible keys for a given encryption algorithm",
          "The length of the encryption key in bits",
          "The memory used by the cipher",
        ],
        answer: 1,
        explanation: "Keyspace is the complete set of all possible keys that could be used by a given cipher. Its size determines resistance to brute force.",
      },
      {
        id: "ks-q2",
        question: "How many keys does the Caesar Cipher have?",
        options: ["25", "26", "52", "676"],
        answer: 1,
        explanation: "The Caesar Cipher has 26 possible keys: shifts K=0 through K=25 (K=0 produces no change).",
      },
      {
        id: "ks-q3",
        question: "How many keys does the general monoalphabetic substitution cipher have?",
        options: ["26", "26²", "26!", "2²⁶"],
        answer: 2,
        explanation: "There are 26! ≈ 4.03 × 10²⁶ possible permutation keys. This is the number of ways to rearrange all 26 letters of the alphabet.",
      },
      {
        id: "ks-q4",
        question: "A large keyspace guarantees that a cipher is secure against ALL attacks. Is this true?",
        options: [
          "True — a large keyspace always means the cipher is unbreakable",
          "False — a large keyspace only defeats brute force; other attacks (e.g., frequency analysis) may still work",
          "True — if the keyspace exceeds 10²⁶, no attack can succeed",
          "False — only small keyspaces are used in modern cryptography",
        ],
        answer: 1,
        explanation: "False. Monoalphabetic substitution has 26! keys (brute-force secure) but is defeated by frequency analysis. Security requires both a large keyspace AND no exploitable statistical structure.",
      },
      {
        id: "ks-q5",
        question: "If a brute force machine tests 10¹² keys/second, how long would it take to exhaust 26! keys?",
        options: [
          "About 1 second",
          "About 1,000 years",
          "About 12.7 billion years",
          "About 1 million years",
        ],
        answer: 2,
        explanation: "26! ≈ 4.03 × 10²⁶ keys. At 10¹² keys/s: 4.03 × 10²⁶ / 10¹² = 4.03 × 10¹⁴ seconds ≈ 12.7 billion years.",
      },
    ],
  },
  {
    id: 9,
    number: "09",
    title: "Cryptanalysis Workflow",
    tag: "Full Lab Methodology",
    definition:
      "The systematic lifecycle used by cryptanalysts to identify, attack, deduce, and verify recovered messages.",
    whyItMatters:
      "It ties together all theoretical knowledge and practical virtual lab modules into a coherent operational procedure.",
    keyIdea:
      "Plaintext → Cipher Simulator → Target Ciphertext → Strategy (Brute Force / Frequency) → Hypothesis → Practice Lab Verification.",
    visualType: "lab-workflow",
    example: {
      plain: "Module 1: Cipher Simulator",
      key: "Module 2: Brute Force & Frequency Analysis",
      cipher: "Module 3: Practice Lab Challenges",
      action: "The complete pipeline taught across the CryptoBreak-Lab virtual laboratory.",
    },
    vivaQuestion: "Why is human analyst intervention still necessary in classical cryptanalysis?",
    vivaAnswer:
      "Algorithms generate candidate decryptions and statistical ranks, but human linguistic judgment verifies semantic validity and word boundaries.",
    vivaTakeaway:
      "Effective cryptanalysis combines statistical hypothesis testing, structural n-gram inspection, and contextual verification.",
    quiz: [
      {
        id: "wf-q1",
        question: "What is the first step in the CryptoBreak Lab cryptanalysis workflow?",
        options: [
          "Run frequency analysis on intercepted ciphertext",
          "Use the Cipher Simulator to produce a target ciphertext",
          "Submit answers in the Practice Lab",
          "Brute force all 26 Caesar shifts",
        ],
        answer: 1,
        explanation: "The workflow begins in the Cipher Simulator, where plaintext is encrypted to produce the target ciphertext that will be attacked in later modules.",
      },
      {
        id: "wf-q2",
        question: "When should you use Brute Force vs Frequency Analysis to attack a cipher?",
        options: [
          "Always use brute force — it is faster",
          "Use Brute Force for small key spaces (e.g., Caesar); use Frequency Analysis for large key spaces with preserved frequencies (e.g., substitution)",
          "Use Frequency Analysis for Caesar; Brute Force for substitution",
          "Both attacks are always used simultaneously",
        ],
        answer: 1,
        explanation: "The strategy depends on the cipher: Caesar's tiny 26-key space is exhausted by brute force; substitution's 26! keys are impractical for brute force but vulnerable to frequency analysis.",
      },
      {
        id: "wf-q3",
        question: "Why is a recovered candidate decryption called a 'hypothesis' rather than a 'proof'?",
        options: [
          "Because frequency analysis always gives the wrong answer",
          "Because statistical analysis produces probabilistic candidates that must be verified by human linguistic judgment",
          "Because only supercomputers can verify decryptions",
          "Because candidate texts are always encrypted again",
        ],
        answer: 1,
        explanation: "Statistical methods assign probabilities, not certainties. The recovered text must be validated by a human analyst to confirm it is semantically meaningful English.",
      },
      {
        id: "wf-q4",
        question: "The Practice Lab module's role in the workflow is to:",
        options: [
          "Generate new random ciphertexts",
          "Provide interactive challenges that reinforce the full attack cycle from ciphertext to plaintext recovery",
          "Replace the Cipher Simulator",
          "Display frequency bar charts only",
        ],
        answer: 1,
        explanation: "The Practice Lab provides hands-on cryptanalysis challenges where students apply brute force and frequency analysis skills learned in earlier modules to recover unknown plaintexts.",
      },
      {
        id: "wf-q5",
        question: "In the complete workflow, what is the role of 'n-gram analysis' relative to single-letter frequency analysis?",
        options: [
          "N-gram analysis replaces frequency analysis entirely",
          "N-gram analysis is used before frequency analysis",
          "N-gram analysis supplements frequency analysis by revealing word structure and disambiguating close frequencies",
          "N-gram analysis is only relevant for polyalphabetic ciphers",
        ],
        answer: 2,
        explanation: "N-gram analysis is a refinement step: after single-letter frequencies give initial candidates, bigram and trigram patterns (e.g., 'THE', 'TH') provide additional structural evidence to confirm or reject hypotheses.",
      },
    ],
  },
  {
    id: 10,
    number: "10",
    title: "Affine Cipher",
    tag: "Linear Substitution",
    definition:
      "A monoalphabetic substitution cipher that applies a linear algebraic transformation to each plaintext letter using two keys: a multiplicative key 'a' and an additive key 'b'. Each letter index x is mapped to (ax + b) mod 26.",
    whyItMatters:
      "The Affine Cipher generalises the Caesar Cipher by adding modular multiplication, increasing the key space to 312 valid keys. It introduces the concept of modular inverses required for decryption, a foundational idea in modern cryptography.",
    keyIdea:
      "E(x) = (ax + b) mod 26. The key 'a' MUST be coprime with 26 (gcd(a,26)=1), otherwise the mapping is not one-to-one and unique decryption is impossible.",
    visualType: "affine-formula",
    example: {
      plain: "HELLO",
      key: "a = 5, b = 8",
      cipher: "RCLLA",
      action: "H=7 → (5×7+8) mod 26 = 43 mod 26 = 17 = R. E=4 → (5×4+8) mod 26 = 28 mod 26 = 2 = C. L=11 → (5×11+8) mod 26 = 63 mod 26 = 11 = L.",
    },
    vivaQuestion: "Why must the multiplicative key 'a' be coprime with 26?",
    vivaAnswer:
      "If gcd(a, 26) ≠ 1, the function E(x) = (ax + b) mod 26 is not injective — multiple plaintext letters map to the same ciphertext letter. This means the modular inverse a⁻¹ does not exist and unique decryption is mathematically impossible.",
    vivaTakeaway:
      "The Affine Cipher introduces modular linear algebra: 12 valid 'a' values × 26 'b' values = 312 total keys.",
    quiz: [
      {
        id: "aff-q1",
        question: "What is the encryption formula for the Affine Cipher?",
        options: [
          "E(x) = (ax + b) mod 26",
          "E(x) = (x + K) mod 26",
          "E(x) = (a + bx) mod 52",
          "E(x) = (x × K) mod 26",
        ],
        answer: 0,
        explanation: "The Affine Cipher uses E(x) = (ax + b) mod 26, combining modular multiplication by 'a' and addition of 'b'.",
      },
      {
        id: "aff-q2",
        question: "Which of the following is a VALID value for the multiplicative key 'a' in the Affine Cipher (mod 26)?",
        options: ["4", "13", "7", "26"],
        answer: 2,
        explanation: "gcd(7, 26) = 1, so 7 is coprime with 26 and is a valid key. gcd(4,26)=2, gcd(13,26)=13, gcd(26,26)=26 — all invalid.",
      },
      {
        id: "aff-q3",
        question: "If a = 5 and b = 8, what is E('A') where A = 0?",
        options: ["C (2)", "I (8)", "H (7)", "A (0)"],
        answer: 1,
        explanation: "E(0) = (5×0 + 8) mod 26 = 8 = I. The letter 'A' maps to 'I' under this Affine key.",
      },
      {
        id: "aff-q4",
        question: "How many valid key pairs (a, b) exist for the Affine Cipher over a 26-letter alphabet?",
        options: ["26", "312", "676", "25"],
        answer: 1,
        explanation: "There are exactly 12 valid values for 'a' (those coprime with 26) and 26 values for 'b' (0–25), giving 12 × 26 = 312 total valid key pairs.",
      },
      {
        id: "aff-q5",
        question: "The Affine Cipher's decryption formula is D(y) = a⁻¹(y - b) mod 26. What does a⁻¹ represent?",
        options: [
          "The reciprocal 1/a",
          "The modular multiplicative inverse of a modulo 26",
          "The negative of a",
          "The square root of a",
        ],
        answer: 1,
        explanation: "a⁻¹ is the modular multiplicative inverse of a mod 26: the unique integer such that (a × a⁻¹) mod 26 = 1. For example, if a=5, then a⁻¹=21 because (5×21) mod 26 = 105 mod 26 = 1.",
      },
    ],
  },
  {
    id: 11,
    number: "11",
    title: "Product Cipher",
    tag: "Composite Transformation",
    definition:
      "A Product Cipher applies multiple cryptographic transformations sequentially (in composition) to produce the final ciphertext. The security of the composition is generally stronger than any single component transformation.",
    whyItMatters:
      "Product ciphers are the conceptual ancestor of modern block ciphers (like AES), which alternate substitution (S-boxes) and permutation (P-boxes) across multiple rounds. Understanding composition is fundamental to modern cryptographic design.",
    keyIdea:
      "CryptoBreak Lab defines its Product Cipher as: Plaintext → Caesar → Intermediate Text → Affine → Final Ciphertext. Decryption reverses the order: Ciphertext → Affine⁻¹ → Caesar⁻¹ → Plaintext.",
    visualType: "product-pipeline",
    example: {
      plain: "HELLO",
      key: "Caesar Shift = 3, Affine a = 5, b = 8",
      cipher: "GRAAP",
      action: "Step 1 (Caesar): HELLO → KHOOR. Step 2 (Affine a=5,b=8): KHOOR → GRAAP. Decryption reverses: GRAAP → Affine⁻¹ → KHOOR → Caesar⁻¹ → HELLO.",
    },
    vivaQuestion: "Why must decryption of a Product Cipher reverse the transformation order?",
    vivaAnswer:
      "Because function composition (f∘g)(x) = f(g(x)) inverts as (f∘g)⁻¹ = g⁻¹∘f⁻¹. The last transformation applied must be the first undone. If Caesar was applied first and Affine second during encryption, then Affine⁻¹ must be applied first and Caesar⁻¹ second during decryption.",
    vivaTakeaway:
      "A Product Cipher composes multiple transformations sequentially; decryption must invert them in exact reverse order.",
    quiz: [
      {
        id: "prod-q1",
        question: "In CryptoBreak Lab's Product Cipher, what is the correct encryption order?",
        options: [
          "Affine → Caesar",
          "Caesar → Affine",
          "Caesar → XOR → Affine",
          "Affine → Affine",
        ],
        answer: 1,
        explanation: "The CryptoBreak Lab Product Cipher applies Caesar first to get the intermediate text, then applies Affine to get the final ciphertext. C = Affine(Caesar(P)).",
      },
      {
        id: "prod-q2",
        question: "If encrypting 'HELLO' with Caesar shift=3 produces 'KHOOR', what does the Product Cipher then apply to 'KHOOR'?",
        options: [
          "Another Caesar shift",
          "The Affine transformation",
          "Frequency analysis",
          "A brute force key search",
        ],
        answer: 1,
        explanation: "The intermediate text 'KHOOR' (output of Caesar layer) is then passed through the Affine transformation (E(x) = ax + b mod 26) to produce the final ciphertext.",
      },
      {
        id: "prod-q3",
        question: "To decrypt a Product Cipher (Caesar then Affine), the correct decryption order is:",
        options: [
          "Caesar⁻¹ → Affine⁻¹",
          "Affine⁻¹ → Caesar⁻¹",
          "Affine → Caesar",
          "Caesar → Affine",
        ],
        answer: 1,
        explanation: "Decryption must reverse the composition order. Since encryption was Caesar then Affine, decryption must apply Affine⁻¹ first, then Caesar⁻¹. This is the inverse composition rule: (f∘g)⁻¹ = g⁻¹∘f⁻¹.",
      },
      {
        id: "prod-q4",
        question: "What is the main cryptographic advantage of a Product Cipher over a single-layer cipher?",
        options: [
          "It uses a smaller key space",
          "It is easier to implement",
          "The composed transformation is generally more complex and harder to analyse",
          "It eliminates the need for a key",
        ],
        answer: 2,
        explanation: "Composing multiple transformations creates a mapping that is harder to invert without knowledge of all layers and keys, increasing cryptographic strength compared to any single component cipher.",
      },
      {
        id: "prod-q5",
        question: "In classical modular arithmetic, the composition of two linear Affine functions is itself what type of function?",
        options: [
          "Exponential",
          "Linear (Affine)",
          "Quadratic",
          "Non-linear",
        ],
        answer: 1,
        explanation: "If f(x) = (a₁x + b₁) mod 26 and g(x) = (a₂x + b₂) mod 26, then f(g(x)) = (a₁(a₂x + b₂) + b₁) mod 26 = ((a₁a₂)x + (a₁b₂ + b₁)) mod 26 — still a linear Affine function.",
      },
    ],
  },
];
