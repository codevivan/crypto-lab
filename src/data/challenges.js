/**
 * Practice Lab Challenges Data
 *
 * Each challenge simulates a cryptanalysis problem with progressive difficulty,
 * comprehensive viva hints, and scoring.
 */

export function normalizeAnswer(text) {
  if (typeof text !== "string") return "";
  return text
    .toUpperCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g, "")
    .replace(/\s+/g, " ");
}

export const CHALLENGES = [
  {
    id: 1,
    title: "Caesar Warm-up",
    difficulty: "Easy",
    cipherType: "Caesar Cipher",
    attackType: "Exhaustive Brute Force",
    points: 100,
    ciphertext: "KHOOR ZRUOG",
    correctShift: 3,
    expectedAnswer: "HELLO WORLD",
    objective: "Identify the correct shift key (0–25) and enter the recovered plaintext message.",
    hints: [
      { text: "Caesar has only 26 possible shifts. Try counting backward from 'K' to find the original letter.", cost: 10 },
      { text: "The shift value is between 1 and 5. Notice that K shifted backward by 3 becomes H.", cost: 20 },
    ],
    explanation:
      "Because Caesar ciphers only have 26 possible keys, testing shift K = 3 immediately decodes 'KHOOR ZRUOG' into the standard English greeting 'HELLO WORLD'.",
  },
  {
    id: 2,
    title: "Caesar Investigation",
    difficulty: "Easy / Medium",
    cipherType: "Caesar Cipher",
    attackType: "Exhaustive Brute Force",
    points: 100,
    ciphertext: "FYYFHP FY IFBS",
    correctShift: 5,
    expectedAnswer: "ATTACK AT DAWN",
    objective: "Determine the shift key and decrypt this intercept to uncover the plaintext order.",
    hints: [
      { text: "Notice the double letter in 'FYYFHP' and the short two-letter word 'FY'.", cost: 10 },
      { text: "In English, common short prepositions include 'AT', 'IN', 'ON'. If 'FY' corresponds to 'AT', calculate the shift from F to A.", cost: 20 },
    ],
    explanation:
      "A shift of K = 5 decrypts 'FYYFHP FY IFBS' to 'ATTACK AT DAWN'. Exhaustive brute force checks all 25 non-trivial keys to recover the message with zero prior key knowledge.",
  },
  {
    id: 3,
    title: "Frequency Detective",
    difficulty: "Medium",
    cipherType: "Monoalphabetic Substitution",
    attackType: "Frequency Analysis",
    points: 100,
    ciphertext: "RTYTFR ZIT TQLZ VQSS GY ZIT EQLZST QZ LXFKOLT",
    correctShift: null,
    expectedAnswer: "DEFEND THE EAST WALL OF THE CASTLE AT SUNRISE",
    objective: "Use letter frequencies and recurring word patterns to deduce the plaintext.",
    hints: [
      { text: "Notice that 'ZIT' appears twice in the message. What is the most common three-letter English word?", cost: 10 },
      { text: "'ZIT' is 'THE' (Z→T, I→H, T→E). With 'E', 'RTYTFR' becomes 'DE•END' which is 'DEFEND'.", cost: 25 },
    ],
    explanation:
      "Monoalphabetic substitution preserves the exact frequency and structure of recurring words. Identifying 'ZIT' as 'THE' gave 3 key letters, allowing the rest of the sentence to be deduced from context.",
  },
  {
    id: 4,
    title: "Mapping Challenge",
    difficulty: "Medium / Hard",
    cipherType: "Monoalphabetic Substitution",
    attackType: "Letter Mapping & Pattern Deduction",
    points: 100,
    ciphertext: "ZIT LTEKTZ EGRT OL IORRTF OF ZIT UQKRTF",
    correctShift: null,
    expectedAnswer: "THE SECRET CODE IS HIDDEN IN THE GARDEN",
    objective: "Use provided starting clues to complete the letter mappings and reveal the hidden location.",
    providedClues: {
      Z: "T",
      I: "H",
      T: "E",
    },
    hints: [
      { text: "With clues Z→T, I→H, T→E: 'ZIT LTEKTZ EGRT' begins as 'THE •E••E• •••E'. What word resembles 'LTEKTZ'?", cost: 10 },
      { text: "'LTEKTZ' is 'SECRET' (L→S, K→R, E→C). Then 'OL IORRTF OF' becomes 'IS HIDDEN IN'!", cost: 25 },
    ],
    explanation:
      "Starting with a few high-confidence anchors ('THE'), analysts deduce remaining consonants and vowels by examining valid English syllables, completing the full message.",
  },
  {
    id: 5,
    title: "Cryptanalysis Strategy Selection",
    difficulty: "Hard",
    cipherType: "Monoalphabetic Substitution",
    attackType: "Attack Strategy Selection",
    points: 100,
    ciphertext: "AFGVSTRUT OL HGVTK",
    correctShift: null,
    expectedStrategy: "frequency",
    expectedAnswer: "KNOWLEDGE IS POWER",
    objective: "Select the scientifically viable attack strategy for this 26! cipher and submit the decoded message.",
    hints: [
      { text: "Exhaustive brute force requires testing 26! (403 septillion) keys, which would take billions of years.", cost: 10 },
      { text: "Select 'Frequency Analysis' as the strategy. 'OL' is 'IS', and the famous proverb is 'KNOWLEDGE IS POWER'.", cost: 20 },
    ],
    explanation:
      "For a general monoalphabetic substitution, the 26! key space makes brute force physically impossible. Frequency analysis combined with language patterns is the only viable attack technique.",
  },
];
