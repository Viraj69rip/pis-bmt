// ============================================================
//  StudyHub Class 10 — Resource Database
//  Edit this file to add/remove subjects, chapters, and files
// ============================================================

const GITHUB_RAW = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/";
// ^ Replace with your actual GitHub raw URL

const NCERT_BASE = "https://ncert.nic.in/textbook/pdf/";

/* ── NCERT Chapter Maps (auto-fetched textbooks) ────────────── */
const NCERT = {
  science: {
    code: "jesc1",
    chapters: [
      "Chemical Reactions and Equations",
      "Acids, Bases and Salts",
      "Metals and Non-metals",
      "Carbon and its Compounds",
      "Life Processes",
      "Control and Coordination",
      "How do Organisms Reproduce?",
      "Heredity",
      "Light – Reflection and Refraction",
      "The Human Eye and the Colourful World",
      "Electricity",
      "Magnetic Effects of Electric Current",
      "Our Environment",
    ],
  },
  maths: {
    code: "jemh1",
    chapters: [
      "Real Numbers",
      "Polynomials",
      "Pair of Linear Equations in Two Variables",
      "Quadratic Equations",
      "Arithmetic Progressions",
      "Triangles",
      "Coordinate Geometry",
      "Introduction to Trigonometry",
      "Some Applications of Trigonometry",
      "Circles",
      "Areas Related to Circles",
      "Surface Areas and Volumes",
      "Statistics",
      "Probability",
    ],
  },
  history: {
    code: "jess2",
    chapters: [
      "The Rise of Nationalism in Europe",
      "Nationalism in India",
      "The Making of a Global World",
      "The Age of Industrialisation",
      "Print Culture and the Modern World",
    ],
  },
  geography: {
    code: "jess3",
    chapters: [
      "Resources and Development",
      "Forest and Wildlife Resources",
      "Water Resources",
      "Agriculture",
      "Minerals and Energy Resources",
      "Manufacturing Industries",
      "Lifelines of National Economy",
    ],
  },
  political: {
    code: "jess4",
    chapters: [
      "Power Sharing",
      "Federalism",
      "Democracy and Diversity",
      "Gender, Religion and Caste",
      "Popular Struggles and Movements",
      "Political Parties",
      "Outcomes of Democracy",
      "Challenges to Democracy",
    ],
  },
  economics: {
    code: "jess5",
    chapters: [
      "Development",
      "Sectors of the Indian Economy",
      "Money and Credit",
      "Globalisation and the Indian Economy",
      "Consumer Rights",
    ],
  },
  english: {
    code: "jeen1",
    chapters: [
      "A Letter to God",
      "Nelson Mandela: Long Walk to Freedom",
      "Two Stories About Flying",
      "From the Diary of Anne Frank",
      "The Hundred Dresses–I",
      "The Hundred Dresses–II",
      "Glimpses of India",
      "Mijbil the Otter",
      "Madam Rides the Bus",
      "The Sermon at Benares",
      "The Proposal",
    ],
  },
};

/* ── Build NCERT textbook entries ───────────────────────────── */
function buildNcertTextbooks() {
  const result = {};
  for (const [subject, meta] of Object.entries(NCERT)) {
    result[subject] = {};
    meta.chapters.forEach((chapName, i) => {
      const num = String(i + 1).padStart(2, "0");
      result[subject][`Chapter ${i + 1} – ${chapName}`] = [
        {
          name: `${chapName} (NCERT Textbook)`,
          url: `${NCERT_BASE}${meta.code}${num}.pdf`,
          source: "ncert",
        },
      ];
    });
  }
  return result;
}

/* ── Subject Labels & Icons ─────────────────────────────────── */
const SUBJECTS = {
  science:   { label: "Science",             icon: "🔬", color: "#4ade80" },
  maths:     { label: "Mathematics",         icon: "📐", color: "#60a5fa" },
  history:   { label: "History",             icon: "📜", color: "#f59e0b" },
  geography: { label: "Geography",           icon: "🌍", color: "#34d399" },
  political: { label: "Political Science",   icon: "⚖️",  color: "#a78bfa" },
  economics: { label: "Economics",           icon: "📊", color: "#fb923c" },
  english:   { label: "English",             icon: "📖", color: "#f472b6" },
  hindi:     { label: "Hindi",               icon: "🪔", color: "#fcd34d" },
};

/* ── Categories ─────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "notes",
    label: "Notes",
    icon: "📝",
    desc: "Handwritten & typed chapter notes",
    color: "#6ee7b7",
    gradient: "linear-gradient(135deg,#064e3b,#065f46)",
  },
  {
    id: "practice",
    label: "Practice Sheets",
    icon: "✏️",
    desc: "Extra questions & worksheets",
    color: "#93c5fd",
    gradient: "linear-gradient(135deg,#1e3a5f,#1e40af)",
  },
  {
    id: "solutions",
    label: "Textbook Solutions",
    icon: "✅",
    desc: "Solved NCERT & reference exercises",
    color: "#d8b4fe",
    gradient: "linear-gradient(135deg,#3b0764,#6d28d9)",
  },
  {
    id: "textbooks",
    label: "Textbooks",
    icon: "📚",
    desc: "NCERT books & supplementary material",
    color: "#fcd34d",
    gradient: "linear-gradient(135deg,#78350f,#d97706)",
  },
];

/* ── Main Resource Database ─────────────────────────────────── */
// Structure: RESOURCES[categoryId][subjectId][chapterName] = [{name, url}]
// For "textbooks" category, NCERT chapters are auto-generated above.
// Add YOUR files here using GitHub raw links.

const RESOURCES = {
  notes: {
    science: {
      "Chapter 1 – Chemical Reactions and Equations": [
        { name: "NOTES - 1 - CHEMICAL REACTIONS.pdf",    url: GITHUB_RAW + "notes/science/ch01-chemical-reactions.pdf" },
      ],
      "Chapter 7 – Oxidation and Reduction": [
        { name: "NOTES - 7 - OXIDATION AND REDUCTION.pdf", url: GITHUB_RAW + "notes/science/ch07-oxidation-reduction.pdf" },
      ],
      "Chapter 8 – Rancidity and Corrosion": [
        { name: "NOTES - 8 - RANCIDITY AND CORROSION.pdf", url: GITHUB_RAW + "notes/science/ch08-rancidity-corrosion.pdf" },
      ],
    },
    maths: {},
    history: {},
    geography: {},
    political: {},
    economics: {},
    english: {},
    hindi: {},
  },

  practice: {
    science: {},
    maths: {},
    history: {},
    geography: {},
    political: {},
    economics: {},
    english: {},
    hindi: {},
  },

  solutions: {
    science: {},
    maths: {},
    history: {},
    geography: {},
    political: {},
    economics: {},
    english: {},
    hindi: {},
  },

  textbooks: buildNcertTextbooks(),
};

/* ── Admin password (SHA-256 hash of your password) ─────────── */
// Default password: StudyHub@2025
// To change: run `await crypto.subtle.digest('SHA-256', new TextEncoder().encode('newpass'))`
// and paste the hex string below.
const ADMIN_HASH = "a6b4f3a6a3c1d4a9d7e2c4f8b3e9a1c5d6f2b8e4a9c3d7f1b5e2a4c8d6f3b9a1";
// ^ Replace with your own hash for security
