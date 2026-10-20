/**
 * CertificateDocument.jsx — Official CryptoBreak Lab Completion Certificate
 *
 * Renders the actual, fully designed landscape certificate (A4 1.414:1 ratio)
 * containing all academic and cryptographic accreditation elements.
 * Palette: Professional Navy (#0b192c), Teal (#0d9488), Ivory (#fdfcf8), and Gold (#c59b27).
 * Used for both on-screen preview and high-resolution PDF generation.
 */

export default function CertificateDocument({
  studentName = "Cryptanalyst",
  issueDate,
  serialNumber,
  score = "500/500",
  id = "crypto-certificate-svg",
}) {
  const name = (studentName || "Cryptanalyst").trim() || "Cryptanalyst";
  const date =
    issueDate ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const serial = serialNumber || "CBL-2026-MASTERY-500";
  const finalScore = score || "500/500";

  return (
    <div className="certificate-document-wrapper">
      <svg
        id={id}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 707"
        className="certificate-svg-document"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="CryptoBreak Lab Official Certificate of Completion"
      >
        <defs>
          {/* Subtle ivory parchment background gradient */}
          <linearGradient id="cert-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdfcf8" />
            <stop offset="50%" stopColor="#faf7ee" />
            <stop offset="100%" stopColor="#fbf9f2" />
          </linearGradient>

          {/* Gold metallic gradient for seal & accents */}
          <linearGradient id="cert-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="35%" stopColor="#d97706" />
            <stop offset="70%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Teal gradient for modern cryptographic accents */}
          <linearGradient id="cert-teal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>

          {/* Navy ribbon gradient */}
          <linearGradient id="cert-navy-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0b192c" />
            <stop offset="50%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0b192c" />
          </linearGradient>

          {/* Security Hatch Pattern */}
          <pattern id="cert-security-hatch" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="rgba(11, 25, 44, 0.025)" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* ── BASE BACKGROUND & WATERMARK ──────────────────────────── */}
        <rect x="0" y="0" width="1000" height="707" fill="url(#cert-bg-grad)" />
        <rect x="0" y="0" width="1000" height="707" fill="url(#cert-security-hatch)" />

        {/* Cryptographic Cipher Wheel Watermark */}
        <g opacity="0.038" stroke="#0b192c" fill="none" transform="translate(500, 355)">
          <circle r="190" strokeWidth="2" />
          <circle r="160" strokeWidth="1" strokeDasharray="5 5" />
          <circle r="130" strokeWidth="1.5" />
          <circle r="100" strokeWidth="1" strokeDasharray="6 3" />
          <circle r="70" strokeWidth="1" />
          <line x1="-200" y1="0" x2="200" y2="0" strokeWidth="1" />
          <line x1="0" y1="-200" x2="0" y2="200" strokeWidth="1" />
          <line x1="-140" y1="-140" x2="140" y2="140" strokeWidth="1" />
          <line x1="-140" y1="140" x2="140" y2="-140" strokeWidth="1" />
        </g>

        {/* ── BORDERS & FRAMING ────────────────────────────────────── */}
        {/* Outer Heavy Navy Border */}
        <rect x="20" y="20" width="960" height="667" rx="4" fill="none" stroke="#0b192c" strokeWidth="4" />

        {/* Secondary Gold Inset Border */}
        <rect x="28" y="28" width="944" height="651" rx="2" fill="none" stroke="#c59b27" strokeWidth="2.5" />

        {/* Tertiary Teal Accent Line */}
        <rect x="35" y="35" width="930" height="637" fill="none" stroke="#0d9488" strokeWidth="1" strokeDasharray="8 4" />

        {/* Four Corner Ornaments */}
        {/* Top-Left */}
        <g transform="translate(35, 35)">
          <polygon points="0,0 30,0 0,30" fill="#0b192c" />
          <circle cx="10" cy="10" r="3.5" fill="#c59b27" />
        </g>
        {/* Top-Right */}
        <g transform="translate(965, 35)">
          <polygon points="0,0 -30,0 0,30" fill="#0b192c" />
          <circle cx="-10" cy="10" r="3.5" fill="#c59b27" />
        </g>
        {/* Bottom-Left */}
        <g transform="translate(35, 672)">
          <polygon points="0,0 30,0 0,-30" fill="#0b192c" />
          <circle cx="10" cy="-10" r="3.5" fill="#c59b27" />
        </g>
        {/* Bottom-Right */}
        <g transform="translate(965, 672)">
          <polygon points="0,0 -30,0 0,-30" fill="#0b192c" />
          <circle cx="-10" cy="-10" r="3.5" fill="#c59b27" />
        </g>

        {/* ── HEADER: BRANDING & ACADEMY CREST ─────────────────────── */}
        <g transform="translate(500, 72)">
          {/* Shield / Emblem */}
          <path
            d="M 0 -22 L 18 -13 L 18 5 C 18 16 0 24 0 24 C 0 24 -18 16 -18 5 L -18 -13 Z"
            fill="url(#cert-navy-grad)"
            stroke="#c59b27"
            strokeWidth="1.8"
          />
          {/* Keyhole / Cipher Glyph in Shield */}
          <circle cx="0" cy="-2" r="4.5" fill="#fde047" />
          <polygon points="-2.5,-2 2.5,-2 1.5,9 -1.5,9" fill="#fde047" />
          <circle cx="0" cy="-2" r="1.8" fill="#0b192c" />
        </g>

        {/* Institution Title */}
        <text
          x="500"
          y="114"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', 'Segoe UI', system-ui, sans-serif"
          fontSize="13.5"
          fontWeight="800"
          letterSpacing="4"
          fill="#0b192c"
        >
          CRYPTOGRAPHY VIRTUAL LAB ACADEMY
        </text>

        {/* Official Credential Tag */}
        <text
          x="500"
          y="131"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="9.5"
          fontWeight="800"
          letterSpacing="2.5"
          fill="#c59b27"
        >
          OFFICIAL ACADEMY CREDENTIAL
        </text>

        {/* Gold & Teal Divider */}
        <g transform="translate(500, 140)">
          <line x1="-100" y1="0" x2="100" y2="0" stroke="#c59b27" strokeWidth="1.5" />
          <polygon points="0,-4 5,0 0,4 -5,0" fill="#0d9488" />
        </g>

        {/* ── CERTIFICATE HEADLINE ──────────────────────────────────── */}
        <text
          x="500"
          y="180"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="32"
          fontWeight="800"
          letterSpacing="3"
          fill="#0b192c"
        >
          CERTIFICATE OF COMPLETION
        </text>

        {/* Course Title Banner Plaque */}
        <g transform="translate(500, 212)">
          <rect
            x="-390"
            y="-17"
            width="780"
            height="34"
            rx="5"
            fill="#f1f5f9"
            stroke="#0d9488"
            strokeWidth="1.2"
          />
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="13.5"
            fontWeight="700"
            letterSpacing="0.4"
            fill="#0b192c"
          >
            Demonstrate Brute Force and Frequency Analysis Using Monoalphabetic Cipher
          </text>
        </g>

        {/* ── RECIPIENT SECTION ────────────────────────────────────── */}
        <text
          x="500"
          y="260"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="13"
          fill="#64748b"
        >
          This credential is officially conferred upon
        </text>

        {/* Recipient Name */}
        <text
          x="500"
          y="304"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="33"
          fontWeight="700"
          letterSpacing="0.8"
          fill="#1e3a8a"
        >
          {name}
        </text>

        {/* Elegant Underline with Gold & Teal Accents */}
        <g transform="translate(500, 317)">
          <line x1="-220" y1="0" x2="220" y2="0" stroke="#c59b27" strokeWidth="1.8" />
          <circle cx="0" cy="0" r="4" fill="#0d9488" stroke="#ffffff" strokeWidth="1" />
        </g>

        {/* ── COMPLETION STATEMENT ─────────────────────────────────── */}
        <text
          x="500"
          y="350"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="12.8"
          fill="#334155"
        >
          <tspan x="500" dy="0">
            This certificate is awarded to{" "}
            <tspan fontWeight="bold" fill="#0b192c">
              {name}
            </tspan>{" "}
            for successfully completing all five guided cryptanalysis laboratories with distinction,
          </tspan>
          <tspan x="500" dy="19">
            verifying operational mastery in cipher architectures, modular arithmetic, brute-force keyspace
          </tspan>
          <tspan x="500" dy="19">
            exhaustion, and statistical frequency cryptanalysis using monoalphabetic substitution ciphers.
          </tspan>
        </text>

        {/* ── METRICS & VERIFICATION ROW ──────────────────────────── */}
        <g transform="translate(500, 442)">
          {/* Card background */}
          <rect
            x="-420"
            y="-27"
            width="840"
            height="54"
            rx="6"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />

          {/* Metric 1: Labs Completed */}
          <g transform="translate(-335, -2)">
            <text
              x="0"
              y="-4"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="8.5"
              fontWeight="800"
              letterSpacing="1.2"
              fill="#64748b"
            >
              LABS COMPLETED
            </text>
            <text
              x="0"
              y="16"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="14.5"
              fontWeight="900"
              fill="#0b192c"
            >
              5 / 5 Labs
            </text>
          </g>

          <line x1="-250" y1="-18" x2="-250" y2="18" stroke="#e2e8f0" strokeWidth="1" />

          {/* Metric 2: Tasks Resolved */}
          <g transform="translate(-165, -2)">
            <text
              x="0"
              y="-4"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="8.5"
              fontWeight="800"
              letterSpacing="1.2"
              fill="#64748b"
            >
              TASKS RESOLVED
            </text>
            <text
              x="0"
              y="16"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="14.5"
              fontWeight="900"
              fill="#0d9488"
            >
              32 / 32 Tasks
            </text>
          </g>

          <line x1="-80" y1="-18" x2="-80" y2="18" stroke="#e2e8f0" strokeWidth="1" />

          {/* Metric 3: Score */}
          <g transform="translate(10, -2)">
            <text
              x="0"
              y="-4"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="8.5"
              fontWeight="800"
              letterSpacing="1.2"
              fill="#64748b"
            >
              VERIFIED SCORE
            </text>
            <text
              x="0"
              y="16"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="14.5"
              fontWeight="900"
              fill="#166534"
            >
              {finalScore} (100%)
            </text>
          </g>

          <line x1="100" y1="-18" x2="100" y2="18" stroke="#e2e8f0" strokeWidth="1" />

          {/* Metric 4: Issue Date */}
          <g transform="translate(195, -2)">
            <text
              x="0"
              y="-4"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="8.5"
              fontWeight="800"
              letterSpacing="1.2"
              fill="#64748b"
            >
              ISSUE DATE
            </text>
            <text
              x="0"
              y="15"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="12.5"
              fontWeight="700"
              fill="#0b192c"
            >
              {date}
            </text>
          </g>

          <line x1="290" y1="-18" x2="290" y2="18" stroke="#e2e8f0" strokeWidth="1" />

          {/* Metric 5: Credential ID */}
          <g transform="translate(365, -2)">
            <text
              x="0"
              y="-4"
              textAnchor="middle"
              fontFamily="system-ui, sans-serif"
              fontSize="8.5"
              fontWeight="800"
              letterSpacing="1.2"
              fill="#64748b"
            >
              CREDENTIAL ID
            </text>
            <text
              x="0"
              y="15"
              textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="11.5"
              fontWeight="700"
              fill="#0b192c"
            >
              {serial}
            </text>
          </g>
        </g>

        {/* ── SIGNATURES & OFFICIAL GOLD/TEAL SEAL ──────────────────── */}
        {/* Left Signature: Dr. Ronald L. Rivest — Lab Instructor */}
        <g transform="translate(225, 555)">
          <text
            x="0"
            y="-12"
            textAnchor="middle"
            fontFamily="'Brush Script MT', 'Caveat', 'Segoe Script', cursive"
            fontSize="26"
            fill="#0b192c"
          >
            Ronald L. Rivest
          </text>
          <line x1="-95" y1="0" x2="95" y2="0" stroke="#94a3b8" strokeWidth="1.2" />
          <text
            x="0"
            y="15"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontSize="10"
            fontWeight="800"
            fill="#0b192c"
          >
            Dr. Ronald L. Rivest
          </text>
          <text
            x="0"
            y="28"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="600"
            fill="#0d9488"
          >
            Lab Instructor
          </text>
        </g>

        {/* Center Official Gold Rosette Seal with Teal Ring */}
        <g transform="translate(500, 550)">
          {/* Gold Sunburst Base */}
          <circle r="44" fill="url(#cert-gold-grad)" stroke="#92400e" strokeWidth="2" />
          {/* Teal Ring */}
          <circle r="36" fill="url(#cert-teal-grad)" stroke="#ffffff" strokeWidth="1.5" />
          {/* Center Dark Disc */}
          <circle r="28" fill="#0b192c" />
          <text
            x="0"
            y="-9"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontSize="7"
            fontWeight="900"
            letterSpacing="1"
            fill="#fde047"
          >
            ★ VERIFIED ★
          </text>
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontSize="13.5"
            fontWeight="900"
            fill="#ffffff"
          >
            500/500
          </text>
          <text
            x="0"
            y="18"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontSize="6.5"
            fontWeight="800"
            letterSpacing="0.8"
            fill="#fde047"
          >
            OFFICIAL SEAL
          </text>
        </g>

        {/* Right Signature: Prof. Claude E. Shannon — Virtual Lab Coordinator */}
        <g transform="translate(775, 555)">
          <text
            x="0"
            y="-12"
            textAnchor="middle"
            fontFamily="'Brush Script MT', 'Caveat', 'Segoe Script', cursive"
            fontSize="26"
            fill="#0b192c"
          >
            Claude E. Shannon
          </text>
          <line x1="-95" y1="0" x2="95" y2="0" stroke="#94a3b8" strokeWidth="1.2" />
          <text
            x="0"
            y="15"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontSize="10"
            fontWeight="800"
            fill="#0b192c"
          >
            Prof. Claude E. Shannon
          </text>
          <text
            x="0"
            y="28"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            fontSize="8.5"
            fontWeight="600"
            fill="#0d9488"
          >
            Virtual Lab Coordinator
          </text>
        </g>

        {/* ── FOOTER STATEMENT ─────────────────────────────────────── */}
        <g transform="translate(500, 656)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="10"
            fontWeight="700"
            letterSpacing="1.2"
            fill="#64748b"
          >
            CryptoBreak Lab &mdash; Virtual Cryptography Laboratory &bull; Verified Accreditation
          </text>
        </g>
      </svg>
    </div>
  );
}
