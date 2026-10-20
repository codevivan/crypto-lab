# Experiment Aim: Monoalphabetic Cipher Cryptanalysis

## Title of Experiment
**Cryptanalysis of Monoalphabetic Substitution Ciphers using Brute-Force and Frequency-Analysis Attacks**

---

## 1. Statement of Aim
The primary aim of this virtual laboratory experiment is to demonstrate, evaluate, and compare two fundamental cryptanalytic methodologies—**exhaustive brute-force search** and **statistical frequency analysis**—against classical monoalphabetic substitution ciphers.

Through an interactive, web-based simulation environment, learners will:
1. Examine the structural and mathematical mechanics of classical substitution ciphers, including the Caesar shift cipher, the Affine cipher, and general arbitrary monoalphabetic substitutions.
2. Demonstrate how a constrained key space ($|\mathcal{K}| = 26$) renders shift ciphers completely vulnerable to automated brute-force attacks within negligible computation time.
3. Demonstrate why an astronomically large key space ($26! \approx 4.03 \times 10^{26}$ keys) in general monoalphabetic substitution provides resilience against brute-force attacks, yet completely fails to protect the confidentiality of messages against statistical frequency analysis.
4. Apply unigram, bigram, and trigram frequency distributions of natural language (English) to systematically break substitution ciphers without knowing the underlying secret key.
5. Derive essential security principles (Shannon's confusion and diffusion, Kerckhoffs's principle) that govern modern cryptographic design.

---

## 2. Scope & Target Environment
- **Platform**: CryptoBreak Lab (React + Vite single-page application hosted via production Nginx Docker container).
- **Domain**: Cryptography and System Security (CSS) Virtual Laboratory.
- **Audience**: Undergraduate computer science and cybersecurity students studying classical ciphers, cryptanalysis, and mathematical foundations of information security.
