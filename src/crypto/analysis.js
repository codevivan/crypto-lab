/**
 * Frequency Analysis Cryptographic Utility
 *
 * Core Concept:
 * -------------
 * In natural languages, letters do not occur with equal probability.
 * In the English language, 'E' is the most frequent (~12.7%), followed by 'T', 'A', 'O', 'I', 'N'.
 * Monoalphabetic substitution replaces letters one-to-one, meaning the original frequency
 * distribution of the plaintext is directly mapped onto the ciphertext letters.
 *
 * Attack Technique:
 * -----------------
 * By counting letter occurrences in the ciphertext and comparing the observed
 * distribution against expected English frequencies, an analyst can formulate
 * strong hypotheses for letter decryptions without requiring key brute-forcing.
 */

/**
 * Standard English letter frequencies (percentages from 0% to 100%).
 * Derived from statistical analysis of extensive English text corpora.
 */
export const ENGLISH_FREQUENCIES = {
  A: 8.167,
  B: 1.492,
  C: 2.782,
  D: 4.253,
  E: 12.702,
  F: 2.228,
  G: 2.015,
  H: 6.094,
  I: 6.966,
  J: 0.153,
  K: 0.772,
  L: 4.025,
  M: 2.406,
  N: 6.749,
  O: 7.507,
  P: 1.929,
  Q: 0.095,
  R: 5.987,
  S: 6.327,
  T: 9.056,
  U: 2.758,
  V: 0.978,
  W: 2.360,
  X: 0.150,
  Y: 1.974,
  Z: 0.074,
};

/**
 * Standard English letters ordered by frequency from highest to lowest:
 * ETAOIN SHRDLU ...
 */
export const ENGLISH_LETTERS_BY_FREQUENCY = [
  "E", "T", "A", "O", "I", "N", "S", "H", "R", "D",
  "L", "C", "U", "M", "W", "F", "G", "Y", "P", "B",
  "V", "K", "J", "X", "Q", "Z",
];

/**
 * Counts occurrences of each letter (A-Z) in the given text.
 * Ignores case, whitespace, numbers, and punctuation.
 *
 * @param {string} text - Text to analyze
 * @returns {{ counts: Record<string, number>, totalLetters: number }} Frequency counts and total letter count
 */
export function countLetterFrequency(text) {
  const counts = {};
  for (let i = 65; i <= 90; i++) {
    counts[String.fromCharCode(i)] = 0;
  }

  if (typeof text !== "string") {
    return { counts, totalLetters: 0 };
  }

  let totalLetters = 0;
  const upper = text.toUpperCase();

  for (let i = 0; i < upper.length; i++) {
    const code = upper.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      const char = upper[i];
      counts[char] = (counts[char] || 0) + 1;
      totalLetters++;
    }
  }

  return { counts, totalLetters };
}

/**
 * Calculates frequency percentages for each letter (A-Z) in the input text.
 *
 * @param {string} text - Text to analyze
 * @returns {Record<string, number>} Object mapping letter to percentage (0.00 to 100.00)
 */
export function calculateFrequencyPercentages(text) {
  const { counts, totalLetters } = countLetterFrequency(text);
  const percentages = {};

  for (let i = 65; i <= 90; i++) {
    const char = String.fromCharCode(i);
    const count = counts[char] || 0;
    percentages[char] = totalLetters > 0
      ? Number(((count / totalLetters) * 100).toFixed(2))
      : 0;
  }

  return percentages;
}

/**
 * Returns letter frequency data sorted in descending order of occurrence.
 * Formatted cleanly for charts, bar graphs, and statistical comparison tables.
 *
 * @param {string} text - Text to analyze
 * @returns {Array<{ letter: string, count: number, percentage: number, expectedPercentage: number }>}
 */
export function getSortedFrequencies(text) {
  const { counts, totalLetters } = countLetterFrequency(text);

  const letters = Object.keys(counts);

  const items = letters.map((letter) => {
    const count = counts[letter];
    const percentage = totalLetters > 0
      ? Number(((count / totalLetters) * 100).toFixed(2))
      : 0;
    const expectedPercentage = ENGLISH_FREQUENCIES[letter] || 0;

    return {
      letter,
      count,
      percentage,
      expectedPercentage,
    };
  });

  // Sort descending by count, then alphabetically if counts tie
  return items.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.letter.localeCompare(b.letter);
  });
}

/**
 * Common English bigrams (ordered by frequency in standard English corpora).
 */
export const COMMON_ENGLISH_BIGRAMS = [
  "TH", "HE", "IN", "ER", "AN", "RE", "ED", "ON", "ES", "ST",
];

/**
 * Common English trigrams (ordered by frequency in standard English corpora).
 */
export const COMMON_ENGLISH_TRIGRAMS = [
  "THE", "AND", "THA", "ENT", "ION", "TIO", "FOR", "NDE", "HAS", "NCE",
];

/**
 * Counts overlapping n-grams of size n from alphabetic characters in the text.
 * Non-alphabetic characters are stripped and characters are capitalized.
 *
 * @param {string} text - Input text
 * @param {number} n - Length of n-gram (e.g. 2 for bigram, 3 for trigram)
 * @returns {{ ngrams: Record<string, number>, totalNGrams: number }}
 */
export function countNGrams(text, n) {
  const ngrams = {};
  if (typeof text !== "string" || n < 1) {
    return { ngrams, totalNGrams: 0 };
  }

  // Strip non-alphabetic characters to analyze language digraph/trigraph flow
  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, "");
  if (cleaned.length < n) {
    return { ngrams, totalNGrams: 0 };
  }

  const totalNGrams = cleaned.length - n + 1;
  for (let i = 0; i <= cleaned.length - n; i++) {
    const gram = cleaned.slice(i, i + n);
    ngrams[gram] = (ngrams[gram] || 0) + 1;
  }

  return { ngrams, totalNGrams };
}

/**
 * Returns sorted list of n-grams in descending order of frequency.
 *
 * @param {string} text - Input text
 * @param {number} n - Length of n-gram
 * @param {number} [limit=10] - Maximum number of items to return
 * @returns {Array<{ ngram: string, count: number, percentage: number }>}
 */
export function getSortedNGrams(text, n, limit = 10) {
  const { ngrams, totalNGrams } = countNGrams(text, n);

  const items = Object.entries(ngrams).map(([ngram, count]) => ({
    ngram,
    count,
    percentage: totalNGrams > 0 ? Number(((count / totalNGrams) * 100).toFixed(2)) : 0,
  }));

  items.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.ngram.localeCompare(b.ngram);
  });

  return items.slice(0, limit);
}

