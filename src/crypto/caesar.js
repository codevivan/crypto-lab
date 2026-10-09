/**
 * Caesar Cipher Cryptographic Engine
 *
 * Mathematical Formulation:
 * -------------------------
 * Encryption:  C = (P + K) mod 26
 * Decryption:  P = (C - K) mod 26 = (C - K + 26) mod 26
 *
 * Where:
 * - P is the plaintext letter index (0 = A, 25 = Z)
 * - C is the ciphertext letter index (0 = A, 25 = Z)
 * - K is the key (shift value between 0 and 25)
 *
 * Key Space:
 * Alphabet size = 26. Since shift = 0 produces identical plaintext,
 * there are only 25 non-trivial keys. This small key space makes
 * exhaustive brute-force attack trivial to compute.
 */

/**
 * Normalizes any integer shift value into the canonical 0-25 range.
 * Handles negative shifts (e.g. -1 -> 25) and shifts >= 26 (e.g. 29 -> 3).
 *
 * @param {number|string} shift - The shift value to normalize
 * @returns {number} Normalized shift integer in range [0, 25]
 */
export function normalizeShift(shift) {
  const parsed = parseInt(shift, 10);
  if (isNaN(parsed)) return 0;
  // In JavaScript, % operator returns negative results for negative numbers.
  // Using ((parsed % 26) + 26) % 26 guarantees a positive index in [0, 25].
  return ((parsed % 26) + 26) % 26;
}

/**
 * Encrypts a text string using the Caesar cipher.
 * Preserves letter casing, spaces, digits, and punctuation.
 *
 * @param {string} text - Plaintext to encrypt
 * @param {number|string} shift - Shift key
 * @returns {string} Ciphertext
 */
export function encrypt(text, shift) {
  if (typeof text !== "string") return "";
  const k = normalizeShift(shift);
  if (k === 0) return text;

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);

    // Uppercase English letters (A: 65 - Z: 90)
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(((code - 65 + k) % 26) + 65);
    }
    // Lowercase English letters (a: 97 - z: 122)
    else if (code >= 97 && code <= 122) {
      result += String.fromCharCode(((code - 97 + k) % 26) + 97);
    }
    // Non-alphabetic characters remain unchanged
    else {
      result += char;
    }
  }

  return result;
}

/**
 * Decrypts a Caesar ciphertext string using the known shift.
 * Decryption is equivalent to shifting in reverse: (C - K + 26) mod 26.
 *
 * @param {string} text - Ciphertext to decrypt
 * @param {number|string} shift - Shift key that was used for encryption
 * @returns {string} Recovered Plaintext
 */
export function decrypt(text, shift) {
  if (typeof text !== "string") return "";
  const k = normalizeShift(shift);
  // Decrypting with shift k is identical to encrypting with shift (26 - k)
  return encrypt(text, (26 - k) % 26);
}
