/**
 * Monoalphabetic Substitution Cipher Engine
 *
 * Mathematical Formulation:
 * -------------------------
 * A monoalphabetic substitution cipher replaces each letter of the alphabet
 * with another letter according to a fixed permutation key.
 *
 * Let the standard 26-letter alphabet be:
 *   A = {A, B, C, ..., Z}
 * A substitution key is a bijective mapping (permutation) π: A -> A.
 *
 * Key Space:
 * ----------
 * Total possible permutations = 26! ≈ 4.0329 × 10^26 keys.
 * An exhaustive brute-force search trying 10^12 keys per second would still
 * take billions of years. Therefore, brute force is computationally infeasible.
 *
 * Cryptanalysis Vulnerability:
 * ----------------------------
 * Because each plaintext letter is consistently replaced by the same ciphertext letter,
 * the underlying frequency distribution of the natural language is fully preserved.
 * Frequency analysis exploits this structural weakness.
 */

export const STANDARD_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Validates whether a provided key is a valid 26-letter monoalphabetic substitution key.
 *
 * Requirements:
 * 1. Must be a string of exactly 26 characters.
 * 2. Must only contain English alphabetic characters (A-Z).
 * 3. Must contain each letter exactly once (no duplicates, no omissions).
 *
 * @param {string} key - The candidate key string
 * @returns {{ isValid: boolean, error: string | null }} Validation result object
 */
export function validateKey(key) {
  if (typeof key !== "string") {
    return { isValid: false, error: "Key must be a string." };
  }

  const cleaned = key.trim().toUpperCase();

  if (cleaned.length !== 26) {
    return {
      isValid: false,
      error: `Key must be exactly 26 letters long (received ${cleaned.length}).`,
    };
  }

  if (!/^[A-Z]{26}$/.test(cleaned)) {
    return {
      isValid: false,
      error: "Key must only contain alphabetic characters (A-Z).",
    };
  }

  const seen = new Set();
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (seen.has(char)) {
      return {
        isValid: false,
        error: `Duplicate letter '${char}' found in key. Each letter must appear exactly once.`,
      };
    }
    seen.add(char);
  }

  return { isValid: true, error: null };
}

/**
 * Generates a randomized 26-letter substitution key using the Fisher-Yates shuffle algorithm.
 * Produces an unbiased random permutation of the alphabet A-Z.
 *
 * @returns {string} 26-letter randomized substitution key
 */
export function generateRandomKey() {
  const letters = STANDARD_ALPHABET.split("");
  // Fisher-Yates shuffle
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = letters[i];
    letters[i] = letters[j];
    letters[j] = temp;
  }
  return letters.join("");
}

/**
 * Creates bidirectional lookup maps for encryption and decryption.
 * Plaintext A-Z maps to Key[0..25].
 *
 * @param {string} key - 26-letter substitution key
 * @returns {{ encMap: Record<string, string>, decMap: Record<string, string> }} Lookup dictionaries
 */
export function createMapping(key) {
  const validation = validateKey(key);
  if (!validation.isValid) {
    throw new Error(`Invalid substitution key: ${validation.error}`);
  }

  const normalizedKey = key.trim().toUpperCase();
  const encMap = {};
  const decMap = {};

  for (let i = 0; i < 26; i++) {
    const plainChar = STANDARD_ALPHABET[i];
    const cipherChar = normalizedKey[i];

    // Uppercase mapping
    encMap[plainChar] = cipherChar;
    decMap[cipherChar] = plainChar;

    // Lowercase mapping
    encMap[plainChar.toLowerCase()] = cipherChar.toLowerCase();
    decMap[cipherChar.toLowerCase()] = plainChar.toLowerCase();
  }

  return { encMap, decMap };
}

/**
 * Encrypts text using a monoalphabetic substitution key.
 * Preserves letter casing, spaces, digits, and punctuation.
 *
 * @param {string} text - Plaintext to encrypt
 * @param {string} key - 26-letter substitution key
 * @returns {string} Ciphertext
 */
export function encrypt(text, key) {
  if (typeof text !== "string") return "";
  const { encMap } = createMapping(key);

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += encMap[char] || char;
  }
  return result;
}

/**
 * Decrypts text encrypted with a monoalphabetic substitution key.
 *
 * @param {string} text - Ciphertext to decrypt
 * @param {string} key - The 26-letter substitution key used to encrypt
 * @returns {string} Recovered Plaintext
 */
export function decrypt(text, key) {
  if (typeof text !== "string") return "";
  const { decMap } = createMapping(key);

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += decMap[char] || char;
  }
  return result;
}
