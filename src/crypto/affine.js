/**
 * Affine Cipher Cryptographic Engine
 *
 * Mathematical Formulation:
 * -------------------------
 * Encryption:  E(x) = (a * x + b) mod 26
 * Decryption:  D(y) = a⁻¹ * (y - b) mod 26
 *
 * Where:
 * - x is the plaintext letter index (0 = A, 25 = Z)
 * - y is the ciphertext letter index (0 = A, 25 = Z)
 * - a is the multiplicative key; MUST satisfy gcd(a, 26) = 1
 * - b is the additive key (shift); 0 <= b <= 25
 * - a⁻¹ is the modular multiplicative inverse of a modulo 26
 *
 * Key Space:
 * ----------
 * Valid values for 'a': 12 coprime integers {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}
 * Valid values for 'b': 26 integers {0..25}
 * Total Key Space = 12 × 26 = 312 keys (excluding trivial identity key a=1, b=0).
 */

/**
 * Valid multiplicative keys for modulo 26 (coprime with 26).
 */
export const VALID_A_KEYS = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

/**
 * Computes the Greatest Common Divisor (GCD) using the Euclidean algorithm.
 *
 * @param {number} a - First integer
 * @param {number} b - Second integer
 * @returns {number} Greatest common divisor of a and b
 */
export function gcd(a, b) {
  let x = Math.abs(Math.floor(Number(a)));
  let y = Math.abs(Math.floor(Number(b)));
  if (isNaN(x) || isNaN(y)) return 0;
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

/**
 * Computes the modular multiplicative inverse of a modulo m.
 * Finds x such that (a * x) mod m = 1.
 *
 * @param {number} a - Integer to invert
 * @param {number} [m=26] - Modulus
 * @returns {number|null} Modular inverse in range [1, m-1], or null if it does not exist
 */
export function modInverse(a, m = 26) {
  const parsedA = Math.floor(Number(a));
  const parsedM = Math.floor(Number(m));
  if (isNaN(parsedA) || isNaN(parsedM) || parsedM <= 1) return null;

  const normA = ((parsedA % parsedM) + parsedM) % parsedM;
  if (gcd(normA, parsedM) !== 1) {
    return null;
  }

  for (let x = 1; x < parsedM; x++) {
    if ((normA * x) % parsedM === 1) {
      return x;
    }
  }

  return null;
}

/**
 * Validates whether candidate affine keys (a, b) are mathematically valid for modulo 26.
 *
 * @param {number|string} a - Multiplicative key
 * @param {number|string} [b=0] - Additive key
 * @param {number} [m=26] - Modulus (defaults to 26)
 * @returns {boolean} True if keys are valid, false otherwise
 */
export function isValidAffineKey(a, b = 0, m = 26) {
  const parsedA = parseInt(a, 10);
  const parsedB = parseInt(b, 10);

  if (isNaN(parsedA) || isNaN(parsedB)) return false;
  if (gcd(parsedA, m) !== 1) return false;
  return true;
}

/**
 * Encrypts a text string using the Affine cipher.
 * E(x) = (a * x + b) mod 26
 * Preserves letter casing, spaces, digits, and punctuation.
 *
 * @param {string} text - Plaintext to encrypt
 * @param {number|string} a - Multiplicative key (must be coprime to 26)
 * @param {number|string} b - Additive key (shift)
 * @returns {string} Ciphertext
 * @throws {Error} If 'a' is not relatively prime to 26
 */
export function encrypt(text, a, b) {
  if (typeof text !== "string") return "";

  const parsedA = parseInt(a, 10);
  const parsedB = parseInt(b, 10);

  if (!isValidAffineKey(parsedA, parsedB, 26)) {
    throw new Error("Invalid multiplication key. 'a' must be relatively prime to 26.");
  }

  const normA = ((parsedA % 26) + 26) % 26;
  const normB = ((parsedB % 26) + 26) % 26;

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);

    // Uppercase English letters (A: 65 - Z: 90)
    if (code >= 65 && code <= 90) {
      const x = code - 65;
      const cipherIdx = ((normA * x + normB) % 26 + 26) % 26;
      result += String.fromCharCode(cipherIdx + 65);
    }
    // Lowercase English letters (a: 97 - z: 122)
    else if (code >= 97 && code <= 122) {
      const x = code - 97;
      const cipherIdx = ((normA * x + normB) % 26 + 26) % 26;
      result += String.fromCharCode(cipherIdx + 97);
    }
    // Non-alphabetic characters remain unchanged
    else {
      result += char;
    }
  }

  return result;
}

/**
 * Decrypts an Affine ciphertext string using known keys (a, b).
 * D(y) = a⁻¹ * (y - b) mod 26
 *
 * @param {string} text - Ciphertext to decrypt
 * @param {number|string} a - Multiplicative key used for encryption
 * @param {number|string} b - Additive key used for encryption
 * @returns {string} Recovered plaintext
 * @throws {Error} If 'a' is not relatively prime to 26
 */
export function decrypt(text, a, b) {
  if (typeof text !== "string") return "";

  const parsedA = parseInt(a, 10);
  const parsedB = parseInt(b, 10);

  if (!isValidAffineKey(parsedA, parsedB, 26)) {
    throw new Error("Invalid multiplication key. 'a' must be relatively prime to 26.");
  }

  const aInv = modInverse(parsedA, 26);
  if (aInv === null) {
    throw new Error("Invalid multiplication key. Modular inverse does not exist.");
  }

  const normB = ((parsedB % 26) + 26) % 26;

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);

    // Uppercase English letters (A: 65 - Z: 90)
    if (code >= 65 && code <= 90) {
      const y = code - 65;
      const plainIdx = ((aInv * (y - normB)) % 26 + 26) % 26;
      result += String.fromCharCode(plainIdx + 65);
    }
    // Lowercase English letters (a: 97 - z: 122)
    else if (code >= 97 && code <= 122) {
      const y = code - 97;
      const plainIdx = ((aInv * (y - normB)) % 26 + 26) % 26;
      result += String.fromCharCode(plainIdx + 97);
    }
    // Non-alphabetic characters remain unchanged
    else {
      result += char;
    }
  }

  return result;
}
