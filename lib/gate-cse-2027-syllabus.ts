
export type SyllabusTopic = {
  id: string;
  title: string;
};

export type SyllabusChapter = {
  id: string;
  title: string;
  topics: SyllabusTopic[];
};

export type SyllabusSubject = {
  id: string;
  paperCode: "CS" | "GA";
  sectionNumber: number | null;
  name: string;
  shortName: string;
  description: string;
  category: "technical" | "common";
  href: string | null;
  status: "available" | "planned";
  sourceUrl: string;
  chapters: SyllabusChapter[];
};

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeChapter(
  id: string,
  title: string,
  topicTitles: string[],
): SyllabusChapter {
  return {
    id,
    title,
    topics: topicTitles.map((topicTitle) => ({
      id: `${id}-${toSlug(topicTitle)}`,
      title: topicTitle,
    })),
  };
}

const CS_SOURCE =
  "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/CS_GATE2027_Syllabus.pdf";

const GA_SOURCE =
  "https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/GA_GATE2027_Syllabus.pdf";

export const GATE_CSE_2027_TECHNICAL_SUBJECTS: SyllabusSubject[] = [
  {
    id: "engineering-mathematics",
    paperCode: "CS",
    sectionNumber: 1,
    name: "Engineering Mathematics",
    shortName: "MATH",
    description:
      "Discrete Mathematics, Linear Algebra, Calculus, Probability and Statistics.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("discrete-mathematics", "Discrete Mathematics", [
        "Propositional and first-order logic",
        "Sets, relations and functions",
        "Partial orders and lattices",
        "Monoids and groups",
        "Graphs: connectivity, matching and colouring",
        "Combinatorics: counting, recurrence relations and generating functions",
      ]),
      makeChapter("linear-algebra", "Linear Algebra", [
        "Matrices and determinants",
        "Systems of linear equations",
        "Eigenvalues and eigenvectors",
        "LU decomposition",
      ]),
      makeChapter("calculus", "Calculus", [
        "Limits",
        "Continuity and differentiability",
        "Maxima and minima",
        "Mean value theorem",
        "Integration",
      ]),
      makeChapter("probability-statistics", "Probability and Statistics", [
        "Random variables",
        "Uniform, normal, exponential, Poisson and binomial distributions",
        "Mean, median, mode and standard deviation",
        "Conditional probability and Bayes theorem",
      ]),
    ],
  },

  {
    id: "digital-logic",
    paperCode: "CS",
    sectionNumber: 2,
    name: "Digital Logic",
    shortName: "DL",
    description:
      "Boolean algebra, minimization, circuit design and number representation.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("boolean-algebra", "Boolean Algebra and Minimization", [
        "Boolean algebra",
        "Algebraic minimization technique",
        "Karnaugh map",
        "Tabular minimization method",
      ]),
      makeChapter("circuit-design", "Combinational and Sequential Circuits", [
        "Design of combinational circuits",
        "Design of sequential circuits",
      ]),
      makeChapter("number-systems", "Number Representation and Arithmetic", [
        "Number representation",
        "Fixed-point arithmetic",
        "Floating-point arithmetic",
      ]),
    ],
  },

  {
    id: "computer-organization",
    paperCode: "CS",
    sectionNumber: 3,
    name: "Computer Organization and Architecture",
    shortName: "COA",
    description:
      "Instruction sets, ALU, control units, memory hierarchy, I/O and pipelining.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("instruction-set", "Instruction Set Architecture", [
        "Instruction set",
        "Addressing modes",
      ]),
      makeChapter("alu-design", "Arithmetic and Logic Unit", [
        "Design of arithmetic and logic unit (ALU)",
      ]),
      makeChapter("control-unit", "Control Unit Design", [
        "Hardwired control unit",
        "Microprogrammed control unit",
      ]),
      makeChapter("memory-organization", "Memory Organization", [
        "Memory interfacing",
        "Memory hierarchy performance",
        "Cache memory mapping",
      ]),
      makeChapter("io-organization", "Input and Output Organization", [
        "Interrupts",
        "Direct Memory Access (DMA)",
      ]),
      makeChapter("instruction-pipelining", "Instruction Pipelining", [
        "Instruction pipelining",
        "Pipeline hazards",
      ]),
    ],
  },

  {
    id: "programming-data-structures",
    paperCode: "CS",
    sectionNumber: 4,
    name: "Programming and Data Structures",
    shortName: "PDS",
    description:
      "C programming, recursion, linear data structures, trees, heaps and graphs.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("programming-in-c", "Programming in C", [
        "Programming in C",
      ]),
      makeChapter("recursion", "Recursion", [
        "Recursion",
      ]),
      makeChapter("linear-data-structures", "Linear Data Structures", [
        "Arrays",
        "Stacks",
        "Queues",
        "Linked lists",
      ]),
      makeChapter("trees-and-heaps", "Trees and Heaps", [
        "Trees",
        "Binary search trees",
        "Binary heaps",
      ]),
      makeChapter("pds-graphs", "Graphs", [
        "Graphs",
      ]),
    ],
  },

  {
    id: "algorithms",
    paperCode: "CS",
    sectionNumber: 5,
    name: "Algorithms",
    shortName: "ALGO",
    description:
      "Searching, sorting, hashing, complexity, algorithm design and graph algorithms.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("searching-sorting", "Searching, Sorting and Hashing", [
        "Searching",
        "Sorting",
        "Hashing",
      ]),
      makeChapter("complexity-analysis", "Complexity Analysis", [
        "Asymptotic worst-case time complexity",
        "Asymptotic worst-case space complexity",
      ]),
      makeChapter("algorithm-design", "Algorithm Design Techniques", [
        "Greedy algorithms",
        "Dynamic programming",
        "Divide and conquer",
      ]),
      makeChapter("graph-algorithms", "Graph Algorithms", [
        "Graph traversals",
        "Minimum spanning trees",
        "Shortest paths",
      ]),
    ],
  },

  {
    id: "theory-of-computation",
    paperCode: "CS",
    sectionNumber: 6,
    name: "Theory of Computation",
    shortName: "TOC",
    description:
      "Regular languages, automata, context-free grammars and computability.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("regular-languages", "Regular Languages and Automata", [
        "Regular expressions",
        "Finite automata",
        "Regular languages",
      ]),
      makeChapter("context-free-languages", "Context-Free Languages", [
        "Context-free grammars",
        "Push-down automata",
        "Context-free languages",
        "Pumping lemma",
      ]),
      makeChapter("computability", "Computability and Decidability", [
        "Turing machines",
        "Undecidability",
      ]),
    ],
  },

  {
    id: "compiler-design",
    paperCode: "CS",
    sectionNumber: 7,
    name: "Compiler Design",
    shortName: "CD",
    description:
      "Lexical analysis, parsing, translation, runtime environments and optimization.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("lexical-analysis", "Lexical Analysis", [
        "Lexical analysis",
      ]),
      makeChapter("syntax-analysis", "Syntax Analysis", [
        "Parsing",
      ]),
      makeChapter("syntax-directed-translation", "Syntax-Directed Translation", [
        "Syntax-directed translation",
      ]),
      makeChapter("runtime-environments", "Runtime Environments", [
        "Runtime environments",
      ]),
      makeChapter("intermediate-code", "Intermediate Code Generation", [
        "Intermediate code generation",
      ]),
      makeChapter("compiler-optimization", "Code Optimization and Data Flow", [
        "Local optimisation",
        "Constant propagation",
        "Liveness analysis",
        "Common subexpression elimination",
      ]),
    ],
  },

  {
    id: "operating-systems",
    paperCode: "CS",
    sectionNumber: 8,
    name: "Operating System",
    shortName: "OS",
    description:
      "Processes, threads, synchronization, deadlocks, scheduling and memory management.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("system-calls", "System Calls", [
        "System calls",
      ]),
      makeChapter("processes-and-threads", "Processes and Threads", [
        "Processes",
        "Threads",
        "Inter-process communication",
      ]),
      makeChapter("synchronization", "Concurrency and Synchronization", [
        "Concurrency",
        "Synchronization",
      ]),
      makeChapter("deadlocks", "Deadlocks", [
        "Deadlock",
      ]),
      makeChapter("cpu-io-scheduling", "CPU and I/O Scheduling", [
        "CPU scheduling",
        "I/O scheduling",
      ]),
      makeChapter("memory-management", "Memory Management", [
        "Memory management",
        "Virtual memory",
      ]),
      makeChapter("file-systems", "File Systems", [
        "File systems",
      ]),
    ],
  },

  {
    id: "dbms",
    paperCode: "CS",
    sectionNumber: 9,
    name: "Databases",
    shortName: "DBMS",
    description:
      "ER model, relational model, SQL, normalization, indexing and transactions.",
    category: "technical",
    href: "/subjects/dbms",
    status: "available",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("er-model", "Entity Relationship Model", [
        "ER model",
      ]),
      makeChapter("relational-model", "Relational Model", [
        "Relational model",
        "Relational algebra",
        "Tuple calculus",
        "SQL",
      ]),
      makeChapter(
        "integrity-normalization",
        "Integrity Constraints and Normal Forms",
        [
          "Integrity constraints",
          "Normal forms",
        ],
      ),
      makeChapter("file-organization-indexing", "File Organization and Indexing", [
        "File organization",
        "Indexing",
        "B-trees",
        "B+ trees",
      ]),
      makeChapter(
        "transactions-concurrency",
        "Transactions and Concurrency Control",
        [
          "Transactions",
          "Concurrency control",
        ],
      ),
    ],
  },

  {
    id: "computer-networks",
    paperCode: "CS",
    sectionNumber: 10,
    name: "Computer Networks",
    shortName: "CN",
    description:
      "Layering, switching, data link, routing, IPv4, TCP, sockets, DNS and HTTP.",
    category: "technical",
    href: null,
    status: "planned",
    sourceUrl: CS_SOURCE,
    chapters: [
      makeChapter("network-layering-switching", "Layering and Switching", [
        "Principles of layering",
        "Circuit switching",
        "Packet switching",
        "Virtual circuit switching",
        "Network performance metrics",
      ]),
      makeChapter("data-link-layer", "Data Link Layer", [
        "Error detection",
        "Medium Access Control",
        "Ethernet",
      ]),
      makeChapter("routing", "Routing", [
        "Distance vector routing",
        "Link state routing",
      ]),
      makeChapter("ipv4", "IPv4 and Addressing", [
        "IPv4 fragmentation",
        "CIDR notation",
        "Network Address Translation",
      ]),
      makeChapter("transport-application", "Transport and Application Layers", [
        "TCP flow control",
        "TCP congestion control",
        "Socket API",
        "DNS",
        "HTTP",
      ]),
    ],
  },
];

export const GATE_CSE_2027_GENERAL_APTITUDE: SyllabusSubject = {
  id: "general-aptitude",
  paperCode: "GA",
  sectionNumber: null,
  name: "General Aptitude",
  shortName: "GA",
  description:
    "Verbal, quantitative, analytical and spatial aptitude.",
  category: "common",
  href: null,
  status: "planned",
  sourceUrl: GA_SOURCE,
  chapters: [
    makeChapter("verbal-aptitude", "Verbal Aptitude", [
      "Basic English grammar",
      "Basic vocabulary",
      "Reading and comprehension",
      "Narrative sequencing",
    ]),
    makeChapter("quantitative-aptitude", "Quantitative Aptitude", [
      "Data interpretation",
      "Numerical computation and estimation",
      "Ratios and percentages",
      "Powers, exponents and logarithms",
      "Permutations and combinations",
      "Series",
      "Mensuration and geometry",
      "Elementary statistics and probability",
    ]),
    makeChapter("analytical-aptitude", "Analytical Aptitude", [
      "Deduction and induction",
      "Analogy",
      "Numerical relations and reasoning",
    ]),
    makeChapter("spatial-aptitude", "Spatial Aptitude", [
      "Translation, rotation, scaling and mirroring",
      "Assembling and grouping",
      "Paper folding and cutting",
      "Patterns in two and three dimensions",
    ]),
  ],
};

export const GATE_CSE_2027_SUBJECTS: SyllabusSubject[] = [
  ...GATE_CSE_2027_TECHNICAL_SUBJECTS,
  GATE_CSE_2027_GENERAL_APTITUDE,
];

export const GATE_CSE_2027_CATALOG = {
  examYear: 2027,
  paperCode: "CS",
  totalMarks: 100,
  commonAptitudeMarks: 15,
  technicalMarks: 85,
  technicalSubjectCount: GATE_CSE_2027_TECHNICAL_SUBJECTS.length,
  totalSubjectCount: GATE_CSE_2027_SUBJECTS.length,
  officialSources: {
    computerScience: CS_SOURCE,
    generalAptitude: GA_SOURCE,
    officialSyllabusPage:
      "https://gate2027.iitm.ac.in/exam_papers_and_syllabus",
  },
} as const;
