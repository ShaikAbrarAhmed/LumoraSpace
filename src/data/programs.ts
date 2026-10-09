/**
 * Enrollment state shown everywhere a program appears (home, /cohorts, /programs/[slug]).
 * Keep this the single source of truth so every page shows the same label.
 */
export type ProgramStatus = "Enrollment open" | "Launching soon";

export interface Program {
  slug: string;
  title: string;
  description: string;
  status?: ProgramStatus;
  /** Who the program suits, taken from the program's own FAQ. */
  level?: string;
  /** Display strings. The numbers below feed the Course JSON-LD and must say the same thing. */
  duration: string;
  schedule: string;
  weeks: number;
  daysPerWeek: number;
  hoursPerDay: number;
  mode: string;
  fee: string;
  feeAmount: number;
  showCurriculum?: boolean;
  demoVideo?: {
    url: string;
    thumbnail: string;
  };
  promotionalGraphic?: string;
  brochureUrl?: string;
  overview: {
    whatIsIt: string;
    whatYouWorkOn: string;
    learningExperience: string;
  };
  competencies: {
    title: string;
    description: string;
    icon: string;
  }[];
  curriculum: {
    week: string;
    title: string;
    topics: string[];
    practicalWork: string;
    milestone?: string;
  }[];
  projects: {
    title: string;
    stage: string;
    description: string;
    technologies: string[];
  }[];
  genAI: {
    description: string;
    tools: string[];
  };
  careerPrep: {
    title: string;
    description: string;
    /** Groups the list on the program page. */
    group?: "Profile" | "Interviews";
  }[];
  mentors: {
    name: string;
    role: string;
    company: string;
    expertise: string;
    image: string;
    linkedin?: string;
    quote?: string;
  }[];
  paymentPlans: {
    type: "FULL PAYMENT" | "SPLIT PAYMENT";
    amount: string;
    description: string;
    schedule?: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const programs: Record<string, Program> = {
  "web-development-with-genai": {
    slug: "web-development-with-genai",
    title: "MERN Stack Development with GenAI",
    description: "Build and deploy full-stack web apps with MongoDB, Express, React, Node.js and Next.js, and ship AI features into them.",
    status: "Enrollment open",
    level: "Beginner to intermediate",
    duration: "12 weeks",
    schedule: "Mon to Fri, 1.5 hours a day",
    weeks: 12,
    daysPerWeek: 5,
    hoursPerDay: 1.5,
    mode: "Live online, hands-on building",
    fee: "₹4,999 + GST",
    feeAmount: 4999,
    showCurriculum: false,
    promotionalGraphic: "/programs/mern-stack-gen-ai-cover.jpg",
    brochureUrl: "/brochures/mern-genai.pdf",
    overview: {
      whatIsIt: "A hands-on program in full-stack web development. You build complete systems end to end, from the interface to the database and deployment.",
      whatYouWorkOn: "From responsive interfaces to complex backend APIs, you'll design database schemas, add authentication and deploy production-ready applications.",
      learningExperience: "We focus on building. Less passive video watching, more writing code, debugging, and receiving direct feedback from mentors on actual projects."
    },
    competencies: [
      {
        title: "Frontend architecture",
        description: "Build responsive, accessible and fast interfaces with React and modern CSS.",
        icon: "layout",
      },
      {
        title: "Backend engineering",
        description: "Build REST APIs with Node.js and Express, with proper error handling.",
        icon: "server",
      },
      {
        title: "Database design",
        description: "Design MongoDB schemas, model relationships between data and write efficient queries.",
        icon: "database",
      },
      {
        title: "Authentication systems",
        description: "Build user sign-in with JWT and secure password hashing.",
        icon: "shield",
      },
      {
        title: "Full-stack integration",
        description: "Connect React frontends to Node backends and manage state across them.",
        icon: "code2",
      },
      {
        title: "AI application development",
        description: "Call LLM APIs from your apps to add AI features.",
        icon: "terminal",
      },
      {
        title: "Testing and quality",
        description: "Write tests and check code quality before you ship to production.",
        icon: "zap",
      },
      {
        title: "Deployment and DevOps",
        description: "Deploy your full-stack apps through CI/CD pipelines.",
        icon: "rocket",
      }
    ],
    curriculum: [
         {
        week: "01",
        title: "HTML, CSS & Tailwind",
        topics: ["Semantic HTML", "Flexbox & Grid", "Tailwind Configuration", "Responsive Design Systems"],
        practicalWork: "Convert a Figma design into a pixel-perfect, responsive UI."
      },
      {
        week: "02",
        title: "JavaScript foundations",
        topics: ["ES6+ Syntax", "Promises & Async/Await", "DOM Manipulation", "Functional Array Methods"],
        practicalWork: "Build a dynamic interactive web component."
      },
      {
        week: "03",
        title: "React",
        topics: ["Component Architecture", "State & Props", "React Hooks (useState, useEffect)", "Context API"],
        practicalWork: "Build a multi-component stateful application.",
        milestone: "Frontend interface deployment"
      },
      {
        week: "04",
        title: "TypeScript",
        topics: ["Types & Interfaces", "Generics", "Type Inference", "React with TypeScript"],
        practicalWork: "Migrate an existing React app to TypeScript for type safety."
      },
      {
        week: "05",
        title: "Node.js & Express",
        topics: ["Event Loop", "REST API Design", "Express Middleware", "Error Handling"],
        practicalWork: "Create a robust backend API serving JSON data."
      },
      {
        week: "06",
        title: "MongoDB and data validation",
        topics: ["NoSQL Concepts", "Mongoose Schemas", "Data Relationships", "Zod Validation"],
        practicalWork: "Design a relational schema and connect it to your Express API.",
        milestone: "Backend database architecture"
      },
      {
        week: "07",
        title: "Full-stack integration",
        topics: ["CORS & Proxying", "Fetching Data", "API State Management", "Handling Loading States"],
        practicalWork: "Connect your React frontend to your Express/MongoDB backend."
      },
      {
        week: "08",
        title: "Authentication and security",
        topics: ["JWT Tokens", "Bcrypt Hashing", "Protected Routes", "Role-Based Access"],
        practicalWork: "Implement a complete login and registration flow."
      },
      {
        week: "09",
        title: "Advanced state and real-time",
        topics: ["Redux/Zustand", "WebSockets", "Socket.io", "Real-Time Updates"],
        practicalWork: "Build a real-time feature (e.g., live chat or notifications)."
      },
      {
        week: "10",
        title: "Next.js",
        topics: ["Server Components", "App Router", "Server Actions", "SEO & Meta"],
        practicalWork: "Build an SEO-optimized full-stack Next.js application.",
        milestone: "Next.js architecture"
      },
      {
        week: "11",
        title: "Testing, DevOps and deployment",
        topics: ["Jest/Vitest", "CI/CD Pipelines", "Vercel & Render Deployment", "Environment Variables"],
        practicalWork: "Deploy your full-stack application to the public internet."
      },
      {
        week: "12",
        title: "GenAI integration and capstone",
        topics: ["OpenAI/Anthropic API", "Prompt Engineering", "AI Tooling", "Capstone Presentation"],
        practicalWork: "Build the final Capstone project integrating AI capabilities.",
        milestone: "Final production app"
      }
    ],
    projects: [
      {
        stage: "Learning",
        title: "Interactive components",
        description: "Build basic web components to learn the DOM, state and UI logic.",
        technologies: ["JavaScript", "HTML", "Tailwind CSS"]
      },
      {
        stage: "Building",
        title: "Full-stack dashboard",
        description: "Build a secure dashboard with authentication, CRUD operations and responsive charts.",
        technologies: ["React", "Node.js", "Express", "MongoDB"]
      },
      {
        stage: "Deploying",
        title: "Real-time application",
        description: "Build a web app that syncs state in real time over WebSockets.",
        technologies: ["Next.js", "TypeScript", "Socket.io"]
      },
      {
        stage: "Capstone",
        title: "AI-powered SaaS MVP",
        description: "Build and launch a SaaS product with a GenAI pipeline that solves one specific user problem.",
        technologies: ["MERN Stack", "GenAI APIs", "Vercel"]
      }
    ],
    genAI: {
      description: "You code with AI tools every day and call LLM APIs from your own apps to generate content and analyze data, while still understanding the code underneath.",
      tools: ["ChatGPT", "Claude", "Cursor", "GitHub Copilot", "Gemini"]
    },
    careerPrep: [
      {
        title: "Resume refinement",
        description: "Write a developer resume that shows what you built instead of listing generic duties.",
        group: "Profile"
      },
      {
        title: "GitHub portfolio",
        description: "Organize your repositories with clean commits, clear READMEs and architecture documentation.",
        group: "Profile"
      },
      {
        title: "LinkedIn optimization",
        description: "Set up your LinkedIn profile so recruiters hiring engineers can find you.",
        group: "Profile"
      },
      {
        title: "Technical interviews",
        description: "Practice explaining how you solve problems and prepare for standard technical screening rounds.",
        group: "Interviews"
      },
      {
        title: "System design basics",
        description: "Learn to discuss application architecture, scalability and technical tradeoffs.",
        group: "Interviews"
      },
      {
        title: "Mock interviews",
        description: "Practice behavioral and technical interviews with experienced industry mentors.",
        group: "Interviews"
      }
    ],
    mentors: [
      {
        name: "Gokul",
        role: "Sr. MERN Stack & Polymath Developer",
        company: "Cirakas Consultancy",
        expertise: "800+ Students Trained · 5+ Years of Industry Experience",
        image: "/mentors/Gokul.jpeg",
        linkedin: "https://www.linkedin.com/in/gokul-dev1/",
        quote: "Students don't need more information. They need better direction."
      },
    ],
    paymentPlans: [
      {
        type: "FULL PAYMENT",
        amount: "₹4,999 + GST",
        description: "One-time payment",
      },
      {
        type: "SPLIT PAYMENT",
        amount: "₹4,999 + GST",
        description: "Split into two installments",
        schedule: [
          "₹2,499.50 at enrollment",
          "₹2,499.50 after 25 days"
        ]
      }
    ],
    faqs: [
      {
        question: "Who is this program for?",
        answer: "This program is for beginners and intermediate developers who want to transition from tutorial hell to building production-ready applications. It's ideal for those who want structured guidance, mentorship, and practical project experience."
      },
      {
        question: "How long is the program?",
        answer: "The program spans 12 weeks, requiring approximately 1.5 hours of dedicated learning and building time per day."
      },
      {
        question: "What is the class schedule?",
        answer: "The structured sessions and guided building take place Monday through Friday. Weekends are generally reserved for project work, catching up, or resting."
      },
      {
        question: "What projects will I build?",
        answer: "You will progress from interactive frontend components to a full-stack dashboard, a real-time web application, and ultimately an AI-powered SaaS Capstone project."
      },
      {
        question: "What are the payment options?",
        answer: "We offer two payment plans: a one-time Full Payment of ₹4,999 + GST, or a Split Payment where you pay ₹2,499.50 at enrollment and the remaining ₹2,499.50 after 25 days."
      },
      {
        question: "What happens after I apply?",
        answer: "After you submit the application form, your request is logged. Our program coordinator will personally reach out to you to discuss your application, confirm your selected payment plan, and handle the actual enrollment."
      },
      {
        question: "Is a certificate provided?",
        answer: "Yes, upon successfully completing the program and your capstone project, you will receive a certificate of completion."
      },
      {
        question: "What happens after completing the program?",
        answer: "You will graduate with a professional portfolio, an optimized resume and GitHub profile, and the engineering confidence to tackle complex web development roles or build your own products."
      }
    ]
  },
  "data-analyst": {
    slug: "data-analyst",
    title: "Data Analyst",
    description: "Excel, SQL, Python and Power BI: learn to turn raw data into business decisions, with AI-assisted workflows.",
    status: "Enrollment open",
    level: "No coding experience needed",
    duration: "12 weeks",
    schedule: "Mon to Fri, 1.5 hours a day",
    weeks: 12,
    daysPerWeek: 5,
    hoursPerDay: 1.5,
    mode: "Live online, hands-on building",
    fee: "₹4,999 + GST",
    feeAmount: 4999,
    showCurriculum: false,
    promotionalGraphic: "/programs/data-analytics-gen-ai-cover.jpg",
    overview: {
      whatIsIt: "A practical program for beginners and aspiring analysts. You learn analytical thinking, database querying, data visualization and business intelligence, and use them to make data-driven decisions.",
      whatYouWorkOn: "From writing complex SQL queries and cleaning raw datasets to building interactive Power BI dashboards and automating analysis with Python and AI tooling.",
      learningExperience: "Hands-on data solving from day one. You will analyze real-world datasets, solve business case studies, and build portfolio-ready dashboards with direct mentor feedback."
    },
    competencies: [
      {
        title: "Excel and advanced analytics",
        description: "Use pivot tables, advanced formulas, lookup functions and data modeling in Excel.",
        icon: "file-spreadsheet"
      },
      {
        title: "SQL and database querying",
        description: "Write complex SQL queries, multi-table joins, aggregations, CTEs and window functions.",
        icon: "database"
      },
      {
        title: "Python for data analysis",
        description: "Transform datasets, handle missing values and run statistical analysis with Pandas and NumPy.",
        icon: "terminal"
      },
      {
        title: "Data visualization and dashboards",
        description: "Build interactive business dashboards and visual reports with Power BI, Matplotlib and Seaborn.",
        icon: "bar-chart"
      },
      {
        title: "Exploratory data analysis",
        description: "Find patterns, anomalies, correlations and trends in raw data.",
        icon: "search"
      },
      {
        title: "Business problem solving",
        description: "Turn business questions into an analysis plan and clear recommendations for leadership.",
        icon: "target"
      },
      {
        title: "AI-assisted analytics",
        description: "Use GenAI tools to write queries, generate reports and clean data faster.",
        icon: "zap"
      },
      {
        title: "Statistical modeling",
        description: "Apply hypothesis testing, regression analysis and descriptive statistics to real scenarios.",
        icon: "line-chart"
      }
    ],
    curriculum: [
      {
        week: "01",
        title: "Foundations of data analysis and Excel",
        topics: ["Data Analyst Mindset", "Excel Essentials & Formulas", "Data Formatting & Cleaning", "Filtering & Sorting"],
        practicalWork: "Clean an unformatted multi-sheet business dataset and prepare a summary overview."
      },
      {
        week: "02",
        title: "Advanced Excel and data modeling",
        topics: ["VLOOKUP / XLOOKUP", "Pivot Tables & Pivot Charts", "Nested Logical Functions", "Excel Dashboards"],
        practicalWork: "Build an interactive sales performance dashboard in Microsoft Excel.",
        milestone: "Excel analytics milestone"
      },
      {
        week: "03",
        title: "SQL fundamentals and relational databases",
        topics: ["Relational Database Concepts", "SELECT, WHERE, ORDER BY", "Filtering & Pattern Matching", "Aggregate Functions & GROUP BY"],
        practicalWork: "Query a relational database to extract customer purchase metrics."
      },
      {
        week: "04",
        title: "Advanced SQL querying",
        topics: ["INNER / LEFT / RIGHT Joins", "Subqueries & Nested Queries", "Common Table Expressions (CTEs)", "Window Functions"],
        practicalWork: "Solve complex multi-table SQL queries for e-commerce user cohort retention."
      },
      {
        week: "05",
        title: "Database optimization and analytics SQL",
        topics: ["Database Indexing Basics", "Data Transformation in SQL", "Case Statements & Conditional Aggregation", "SQL Case Studies"],
        practicalWork: "Execute an end-to-end business query audit for a retail chain dataset.",
        milestone: "SQL engineering architecture"
      },
      {
        week: "06",
        title: "Python foundations for data",
        topics: ["Python Data Types & Data Structures", "Control Flow & Functions", "NumPy Arrays & Vectorization", "Working with Files"],
        practicalWork: "Write Python scripts to parse, filter, and summarize raw text and CSV logs."
      },
      {
        week: "07",
        title: "Data manipulation with Pandas",
        topics: ["Pandas DataFrames & Series", "Data Cleaning & Imputation", "Grouping, Aggregating & Merging", "Time-Series Data"],
        practicalWork: "Perform exploratory data analysis (EDA) on a real-world financial transaction dataset."
      },
      {
        week: "08",
        title: "Data visualization and storytelling",
        topics: ["Matplotlib & Seaborn", "Visual Hierarchy & Chart Selection", "Communicating Insights to Stakeholders", "Plot Customization"],
        practicalWork: "Create a visual data story report highlighting churn factors for a SaaS application.",
        milestone: "Exploratory data analysis milestone"
      },
      {
        week: "09",
        title: "Power BI and business intelligence",
        topics: ["Connecting Data Sources", "Data Transformation in Power Query", "DAX Formulas & Measures", "Building Interactive Views"],
        practicalWork: "Build a production Power BI executive dashboard with drill-down filters."
      },
      {
        week: "10",
        title: "Applied business analytics and metrics",
        topics: ["Key Performance Indicators (KPIs)", "Funnel Analysis & Cohort Analysis", "A/B Testing Foundations", "Financial & Operational Metrics"],
        practicalWork: "Conduct an A/B experiment evaluation and construct an executive summary."
      },
      {
        week: "11",
        title: "AI-assisted data workflows",
        topics: ["ChatGPT & Claude for SQL Generation", "Automating Python EDA with GenAI", "Prompting for Report Synthesis", "AI Quality Auditing"],
        practicalWork: "Build an AI-augmented data pipeline that converts raw CSVs into executive summaries."
      },
      {
        week: "12",
        title: "Capstone project and business defense",
        topics: ["End-to-End Analytics Pipeline", "Dashboard Refinement", "Presentation Techniques", "Capstone Defense"],
        practicalWork: "Present and defend an end-to-end Business Intelligence Capstone Project.",
        milestone: "Final analytics capstone"
      }
    ],
    projects: [
      {
        stage: "Learning",
        title: "Sales and performance Excel dashboard",
        description: "Analyze multi-channel sales data with advanced formulas, pivot tables and interactive slicers.",
        technologies: ["Microsoft Excel", "Pivot Tables", "Data Modeling"]
      },
      {
        stage: "Analysis",
        title: "E-commerce customer cohort SQL audit",
        description: "Query relational tables with window functions and CTEs to find retention trends and customer lifetime value.",
        technologies: ["SQL", "PostgreSQL", "Database Aggregations"]
      },
      {
        stage: "Visualization",
        title: "Exploratory data analysis with Python",
        description: "Clean messy real-world datasets with Pandas and chart what you find with Seaborn and Matplotlib.",
        technologies: ["Python", "Pandas", "Matplotlib", "Seaborn"]
      },
      {
        stage: "Business problem solving",
        title: "Executive Power BI dashboard",
        description: "Build a multi-page Power BI dashboard with DAX measures, KPI tracking and interactive cross-filtering.",
        technologies: ["Power BI", "DAX", "Power Query"]
      },
      {
        stage: "Capstone",
        title: "AI-augmented business intelligence capstone",
        description: "Turn raw company data into a full business report using SQL, Python, Power BI and GenAI-assisted summaries.",
        technologies: ["SQL", "Python", "Power BI", "GenAI Tools"]
      }
    ],
    genAI: {
      description: "You use GenAI tools to write SQL, clean data in Python EDA scripts and draft executive summaries faster, and you still check every result yourself.",
      tools: ["ChatGPT", "Claude", "Cursor", "Code Interpreter", "Gemini"]
    },
    careerPrep: [
      {
        title: "Resume refinement",
        description: "Write an analytics resume that shows business impact, measurable results and your SQL and Python projects.",
        group: "Profile"
      },
      {
        title: "GitHub and portfolio showcase",
        description: "Organize your SQL queries, Python notebooks and Power BI dashboards into a public portfolio.",
        group: "Profile"
      },
      {
        title: "LinkedIn optimization",
        description: "Set up your LinkedIn profile so recruiters hiring data analysts and BI specialists can find you.",
        group: "Profile"
      },
      {
        title: "SQL and analytics interviews",
        description: "Prepare for live SQL coding challenges, data puzzle screenings and database problem solving.",
        group: "Interviews"
      },
      {
        title: "Business case preparation",
        description: "Learn to break down open-ended business problems, form hypotheses and present your findings.",
        group: "Interviews"
      },
      {
        title: "Mock interviews",
        description: "Practice technical query rounds and behavioral presentations with experienced industry mentors.",
        group: "Interviews"
      }
    ],
    mentors: [
      {
        name: "Sandeep",
        role: "Data Science Trainer & Mentor",
        company: "byteXL",
        expertise: "Python · SQL · Power BI · Data Science · Machine Learning",
        image: "/mentors/sandeep.jpeg",
        linkedin: "https://www.linkedin.com/in/sandeepgivari",
        quote: "Technology keeps evolving. Your ability to learn should too."
      }
    ],
    paymentPlans: [
      {
        type: "FULL PAYMENT",
        amount: "₹4,999 + GST",
        description: "One-time payment"
      },
      {
        type: "SPLIT PAYMENT",
        amount: "₹4,999 + GST",
        description: "Split into two installments",
        schedule: [
          "₹2,499.50 at enrollment",
          "₹2,499.50 after 25 days"
        ]
      }
    ],
    faqs: [
      {
        question: "Who is this Data Analyst program for?",
        answer: "This program is designed for beginners, graduates, and working professionals who want to develop practical data analysis skills in SQL, Python, Excel, and Power BI."
      },
      {
        question: "Do I need a prior programming background?",
        answer: "No prior programming experience is required. We start from foundational data concepts and build up step-by-step through guided hands-on practice."
      },
      {
        question: "How long is the program?",
        answer: "The program spans 12 weeks, requiring approximately 1.5 hours per day of live learning and practical project building."
      },
      {
        question: "What tools will I learn?",
        answer: "You will learn Microsoft Excel, SQL (PostgreSQL), Python (Pandas, NumPy, Matplotlib, Seaborn), Power BI, and GenAI analytical tools."
      },
      {
        question: "What projects will I build?",
        answer: "You will progress from interactive Excel dashboards to an e-commerce SQL retention audit, a Python EDA report, an executive Power BI dashboard, and a final AI-augmented BI Capstone."
      },
      {
        question: "What are the payment options?",
        answer: "We offer two payment plans: a one-time Full Payment of ₹4,999 + GST, or a Split Payment of ₹2,499.50 at enrollment and ₹2,499.50 after 25 days."
      },
      {
        question: "What happens after I apply?",
        answer: "Our program coordinator will personally reach out to discuss your application, confirm your selected payment plan, and guide you through enrollment."
      },
      {
        question: "Is a certificate provided?",
        answer: "Yes, upon completing the program curriculum and passing the Capstone project defense, you will receive a certificate of completion."
      }
    ]
  }
};

/** Programs in display order. */
export const programList: Program[] = Object.values(programs);

/**
 * Programs on the roadmap. Shown only as plain "Coming soon" text: they have no
 * page, no data and must never be linked.
 */
export const plannedPrograms = ["Python Builder", "AI Builder"] as const;

/** Instalment lines of the split plan, straight from the data (e.g. "₹2,499.50 at enrollment"). */
export function splitSchedule(program: Program): string[] {
  return program.paymentPlans.find((plan) => plan.type === "SPLIT PAYMENT")?.schedule ?? [];
}

/**
 * Short label for the split plan, e.g. "or 2 × ₹2,499.50".
 * Derived from the schedule strings so it can never disagree with the data.
 */
export function splitLabel(program: Program): string | null {
  const schedule = splitSchedule(program);
  if (schedule.length === 0) return null;
  const amounts = schedule.map((line) => line.match(/₹[\d,]+(?:\.\d+)?/)?.[0]).filter(Boolean) as string[];
  if (amounts.length === schedule.length && amounts.every((amount) => amount === amounts[0])) {
    return `or ${schedule.length} × ${amounts[0]}`;
  }
  return `or ${schedule.length} instalments`;
}
