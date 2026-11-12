import { 
  Course, 
  WebsiteCMS, 
  PolicyDocument, 
  Internship, 
  Assignment, 
  Announcement, 
  StudentProfile, 
  EnrollmentRequest, 
  AssignmentSubmission,
  PdfDocument
} from '../types';

export const INITIAL_CMS: WebsiteCMS = {
  brandName: 'RM Heaven',
  heroHeadline: 'Learn Today. Build Tomorrow.',
  heroSubtext: 'Develop practical skills, explore industry-focused learning opportunities and prepare yourself for a successful professional future.',
  mascotSettings: {
    visibleInHero: true,
    visibleInDashboard: true,
    visibleInWelcome: true,
    show360ModelSheet: true
  },
  welcomeSection: {
    heading: 'A Disciplined, Industry-Aligned Academic Environment',
    mission: 'Our mission is to cultivate technical competence, rigorous intellectual curiosity, and uncompromising professional integrity in every enrolled student through direct mentorship and project-based mastery.',
    teachingApproach: 'We combine rigorous conceptual instruction with live code walkthroughs, real-time marketing attribution simulations, and faculty-guided capstones.',
    learningOpportunities: 'Eligible students gain access to faculty research fellowships, industry internship placements, protected study notes, and cryptographically verifiable academic credentials.'
  },
  contactInfo: {
    email: 'admissions@rmheaven.edu',
    phone: '+91 (080) 4120-8800',
    officeAddress: 'Academic Secretariat, Knowledge Campus Phase I, Bangalore 560103, Karnataka',
    officeHours: 'Monday – Friday: 09:00 AM – 05:30 PM'
  },
  footerContent: {
    aboutExcerpt: 'An autonomous academic learning and technical internship platform committed to uncompromising educational standards, verified mentorship, and student growth.',
    copyrightText: 'All rights reserved. Unauthorized reproduction or redistribution of course materials and notes is strictly prohibited.'
  }
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-coding',
    title: 'Comprehensive Software Engineering & Web Development',
    slug: 'coding',
    category: 'Computer Science & Software Engineering',
    shortDescription: 'Master fundamental programming, modern HTML5/CSS3, JavaScript ESNext, Python systems, and full-stack web applications with practical industry projects.',
    fullDescription: 'A complete, rigorous curriculum structured for aspiring software engineers. Progresses from computational logic and syntax fundamentals to responsive frontends, server architectures, and production deployment standards.',
    level: 'Comprehensive',
    durationWeeks: 16,
    featured: true,
    published: true,
    enrolledStudentsCount: 148,
    modules: [
      {
        id: 'mod-c1',
        courseId: 'course-coding',
        title: 'Module 1: Programming Fundamentals & Computational Logic',
        order: 1,
        description: 'Memory architecture, primitive data types, control flow, functions, algorithmic complexity, and debugging principles.',
        lessons: [
          {
            id: 'les-c1-1',
            moduleId: 'mod-c1',
            courseId: 'course-coding',
            title: 'Lesson 1.1: Core Variables, Types, and Execution Stack',
            order: 1,
            durationMinutes: 45,
            studyNote: {
              id: 'note-c1-1',
              lessonId: 'les-c1-1',
              courseId: 'course-coding',
              title: 'Variables, Primitive Types & Memory Stack Mechanics',
              introduction: 'Every programming language operates upon memory allocations, stack/heap spaces, and variable scoping boundaries.',
              learningObjectives: [
                'Understand how compilers and runtimes allocate integer, float, string, and boolean primitives.',
                'Master lexical scoping, variable shadowing, and memory mutability rules.',
                'Analyze the time complexity of arithmetic and pointer dereferencing operations.'
              ],
              detailedExplanations: 'In memory architecture, the call stack manages execution frames for active function calls and local variables. Primitive values are copied by value, whereas complex composite structures live on the heap with references passed on the stack. Understanding value versus reference semantics is the cornerstone of avoiding memory leaks and concurrency race conditions.',
              practicalExamples: 'Example 1: Initializing scoped primitives and tracking heap pointers in memory buffers.\nExample 2: Safe type casting and null safety guardrails.',
              importantConcepts: [
                'Call Stack vs Heap Memory Allocation',
                'Pass-by-Value vs Pass-by-Reference Semantics',
                'Static Typing vs Dynamic Type Inference',
                'Garbage Collection cycles and memory lifecycle'
              ],
              keyTakeaways: [
                'Always initialize variables with explicit intent to prevent uninitialized memory reads.',
                'Prefer immutability (`const` / read-only references) by default to prevent unexpected side effects.',
                'Stack memory allocation is deterministic and instantaneous compared to heap allocations.'
              ],
              practiceQuestions: [
                'Q1: How does a stack overflow occur during unbounded recursive invocations?',
                'Q2: What is the mechanical difference between a shallow copy and a deep copy of an object?'
              ],
              assignmentPrompt: 'Write a program demonstrating variable scoping across block, function, and global scopes with documented memory layout diagrams.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-c2',
        courseId: 'course-coding',
        title: 'Module 2: Semantic HTML5 Architecture & Document Object Model',
        order: 2,
        description: 'Accessible markup, semantic document structures, SEO metadata, form validation, and DOM tree traversal.',
        lessons: [
          {
            id: 'les-c2-1',
            moduleId: 'mod-c2',
            courseId: 'course-coding',
            title: 'Lesson 2.1: Semantic Structural Elements & ARIA Landmarks',
            order: 1,
            durationMinutes: 50,
            studyNote: {
              id: 'note-c2-1',
              lessonId: 'les-c2-1',
              courseId: 'course-coding',
              title: 'Semantic HTML5 & Accessibility Architecture',
              introduction: 'Semantic HTML provides machine-readable meaning to web documents, directly powering search engine indexing and assistive screen readers.',
              learningObjectives: [
                'Replace generic `<div>` tags with meaningful landmarks: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`.',
                'Implement WCAG 2.1 AA accessible forms with explicit `<label>` bindings and ARIA descriptors.',
                'Optimize head metadata, OpenGraph tags, and canonical link configurations.'
              ],
              detailedExplanations: 'Browsers parse HTML into a hierarchical Document Object Model (DOM) tree. When assistive technologies parse semantic tags, they establish navigation landmarks allowing sight-impaired users to jump between sections effortlessly. Furthermore, correct document outline hierarchy (h1 through h6) ensures search spiders can index heading topics accurately.',
              practicalExamples: 'Example 1: Building a responsive semantic card with figure, figcaption, time, and citation elements.\nExample 2: An accessible multi-step checkout form with client-side regex constraints.',
              importantConcepts: [
                'DOM Node Tree Construction',
                'Semantic vs Non-Semantic Tag Hierarchy',
                'ARIA Roles, States, and Live Regions',
                'Form Submission Lifecycle and Validation Constraints'
              ],
              keyTakeaways: [
                'Never use an unlabelled button or an interactive `<div>` with an `onClick` without keyboard accessibility.',
                'Use exactly one `<h1>` per document representing the primary topic.',
                'Semantic markup forms the resilient skeleton of high-performance web applications.'
              ],
              practiceQuestions: [
                'Q1: Explain the difference between `<section>` and `<article>` according to the W3C specification.',
                'Q2: Why should `tabindex` values greater than 0 be avoided in production interfaces?'
              ],
              assignmentPrompt: 'Construct a multi-column accessible institutional home page wireframe using strictly semantic HTML5 markup with zero styling.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-c3',
        courseId: 'course-coding',
        title: 'Module 3: Modern CSS Layouts, Flexbox, Grid & Responsive Design',
        order: 3,
        description: 'Box model mechanics, CSS specificity, Flexbox axis alignment, CSS Grid 2D layouts, and fluid viewport typography.',
        lessons: [
          {
            id: 'les-c3-1',
            moduleId: 'mod-c3',
            courseId: 'course-coding',
            title: 'Lesson 3.1: CSS Grid & Flexbox Masterclass',
            order: 1,
            durationMinutes: 60,
            studyNote: {
              id: 'note-c3-1',
              lessonId: 'les-c3-1',
              courseId: 'course-coding',
              title: 'Two-Dimensional Grid Systems and Fluid Layouts',
              introduction: 'Modern web layout requires fluid responsiveness across mobile, tablet, and 4K displays without breaking visual hierarchy.',
              learningObjectives: [
                'Differentiate between Flexbox (1D stream) and CSS Grid (2D coordinate system).',
                'Master `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` for intrinsic card layouts.',
                'Apply CSS Custom Properties (variables) for scalable design tokens and theme tokens.'
              ],
              detailedExplanations: 'The CSS Box Model comprises content, padding, border, and margin. Setting `box-sizing: border-box` ensures declared element dimensions include padding and border widths. CSS Grid provides explicit track sizing, fractional units (`fr`), and named grid areas, allowing complex editorial layouts without fragile float or positioning hacks.',
              practicalExamples: 'Example 1: Creating a responsive Bento grid dashboard layout using auto-fill and minmax.\nExample 2: Fluid typography using `clamp(1rem, 2.5vw, 2.25rem)`.',
              importantConcepts: [
                'Box Sizing & Margin Collapsing',
                'Flexbox Main Axis vs Cross Axis alignment',
                'Grid Tracks, Lines, and Auto-Placement Algorithms',
                'Media Queries and Container Queries'
              ],
              keyTakeaways: [
                'Use Flexbox for unidirectional toolbars and navbars; use CSS Grid for page layouts and card collections.',
                'Avoid fixed pixel heights on text containers to prevent overflow clipping.',
                'Leverage CSS custom variables to manage typography and color hierarchies cleanly.'
              ],
              practiceQuestions: [
                'Q1: What is the behavioral difference between `auto-fit` and `auto-fill` in CSS Grid?',
                'Q2: How does specificity calculation resolve conflicting selectors in the cascade?'
              ],
              assignmentPrompt: 'Build a responsive 1440px academic research catalog dashboard with CSS Grid that gracefully reflows to single-column mobile.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-c4',
        courseId: 'course-coding',
        title: 'Module 4: JavaScript ESNext, Asynchronous Programming & DOM APIs',
        order: 4,
        description: 'Closures, prototypes, promises, async/await, fetch API, event loops, and modern reactive patterns.',
        lessons: [
          {
            id: 'les-c4-1',
            moduleId: 'mod-c4',
            courseId: 'course-coding',
            title: 'Lesson 4.1: Asynchronous JavaScript & The Event Loop',
            order: 1,
            durationMinutes: 65,
            studyNote: {
              id: 'note-c4-1',
              lessonId: 'les-c4-1',
              courseId: 'course-coding',
              title: 'Event Loop, Microtasks, and Promise Lifecycle',
              introduction: 'JavaScript is single-threaded and non-blocking, coordinating asynchronous I/O via the event loop, call stack, and microtask queues.',
              learningObjectives: [
                'Explain how Macrotasks (setTimeout) and Microtasks (Promise.then) are prioritized by the event loop.',
                'Master error propagation using `try...catch` blocks with `async / await`.',
                'Construct reusable data fetching wrappers with caching and abort controller cancellation.'
              ],
              detailedExplanations: 'When an asynchronous operation (such as a database query or network request) initiates, it is handed off to browser Web APIs or Node.js libuv threads. Upon completion, callback handlers queue into the microtask or macrotask queue. Once the call stack empties, microtasks execute with utmost priority before the browser paints the next frame.',
              practicalExamples: 'Example 1: Fetching JSON data with timeout guards using `AbortController`.\nExample 2: Implementing a concurrent batch worker with `Promise.allSettled`.',
              importantConcepts: [
                'Call Stack, Web APIs, and Task Queue Interaction',
                'Microtask Queue Priority over Macrotasks',
                'Closures and Lexical Scoping in Event Callbacks',
                'Functional array transformations: map, filter, reduce'
              ],
              keyTakeaways: [
                'Never block the main thread with long-running synchronous loops.',
                'Always handle promise rejection branches to prevent silent failure.',
                'Use `AbortSignal` to prevent stale asynchronous state updates when users navigate away.'
              ],
              practiceQuestions: [
                'Q1: Write the exact output order of a code snippet combining `console.log`, `setTimeout`, and `Promise.resolve`.',
                'Q2: How does a closure preserve state across asynchronous invocations?'
              ],
              assignmentPrompt: 'Build a debounced, typeahead search interface that queries a mock REST endpoint and renders results with keyboard arrow navigation.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-c5',
        courseId: 'course-coding',
        title: 'Module 5: Python Systems Programming & Data Manipulation',
        order: 5,
        description: 'Object-oriented Python, file streams, data serialization, virtual environments, and algorithmic problem solving.',
        lessons: [
          {
            id: 'les-c5-1',
            moduleId: 'mod-c5',
            courseId: 'course-coding',
            title: 'Lesson 5.1: Pythonic OOP, Generators & Context Managers',
            order: 1,
            durationMinutes: 55,
            studyNote: {
              id: 'note-c5-1',
              lessonId: 'les-c5-1',
              courseId: 'course-coding',
              title: 'Python Classes, Magic Methods & Memory-Efficient Iterators',
              introduction: 'Python combines expressive syntax with powerful data model protocols, enabling clean object-oriented architecture and memory-efficient stream processing.',
              learningObjectives: [
                'Construct robust classes with encapsulation, properties, and special dunder methods (`__init__`, `__repr__`, `__enter__`).',
                'Write memory-conscious generators using `yield` for streaming multi-gigabyte datasets.',
                'Manage external resources safely using custom context managers.'
              ],
              detailedExplanations: 'Generators execute lazily: they compute values on-demand and pause execution between `yield` calls. This transforms $O(N)$ memory footprints into $O(1)$ memory streams, making Python a premier choice for backend batch processors, data pipelines, and machine learning data loaders.',
              practicalExamples: 'Example 1: Streaming large CSV files row by row using a generator.\nExample 2: Implementing a database transaction context manager with automatic rollback on exceptions.',
              importantConcepts: [
                'Python Data Model & Dunder Methods',
                'Generators and Iterator Protocols',
                'Context Managers (`with` statement)',
                'List & Dictionary Comprehensions'
              ],
              keyTakeaways: [
                'Leverage generators when processing large data files to maintain minimal memory consumption.',
                'Always wrap file and socket operations in context managers to guarantee immediate descriptor release.',
                'Follow PEP 8 styling conventions for readability and maintenance.'
              ],
              practiceQuestions: [
                'Q1: Explain the internal mechanics of how the `with` statement calls `__enter__` and `__exit__`.',
                'Q2: What is the performance difference between a list comprehension and a generator expression?'
              ],
              assignmentPrompt: 'Develop a Python CLI tool that parses server access logs, computes status code distributions, and outputs structured JSON summaries.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-c6',
        courseId: 'course-coding',
        title: 'Module 6: Full-Stack Web Development & API Engineering',
        order: 6,
        description: 'RESTful API contracts, relational schemas, authentication with JWT/Sessions, and component architecture.',
        lessons: [
          {
            id: 'les-c6-1',
            moduleId: 'mod-c6',
            courseId: 'course-coding',
            title: 'Lesson 6.1: REST Architecture, Middleware & Database CRUD',
            order: 1,
            durationMinutes: 70,
            studyNote: {
              id: 'note-c6-1',
              lessonId: 'les-c6-1',
              courseId: 'course-coding',
              title: 'REST Principles, HTTP Status Semantics & Relational CRUD',
              introduction: 'Full-stack development requires seamless synchronization between client state, HTTP request-response cycles, and persistent relational databases.',
              learningObjectives: [
                'Design standardized RESTful endpoints following HTTP method semantics (GET, POST, PUT, PATCH, DELETE).',
                'Implement authentication and authorization middleware protecting sensitive user routes.',
                'Execute relational database operations with parameterized queries preventing SQL injection.'
              ],
              detailedExplanations: 'HTTP is a stateless protocol. Authentication mechanisms—such as signed JSON Web Tokens (JWT) or secure HTTP-only session cookies—transmit verifiable identity headers on each request. The backend server verifies signatures before authorizing route handlers. Clean separation between data access layers, service business logic, and controller endpoints ensures high maintainability.',
              practicalExamples: 'Example 1: Building an Express/Node router with authentication middleware.\nExample 2: Parameterized database transactions with rollback on failure.',
              importantConcepts: [
                'Stateless HTTP and Idempotency',
                'Token-Based vs Session-Based Authentication',
                'CORS (Cross-Origin Resource Sharing) Policies',
                'Database Normalization & Foreign Key Constraints'
              ],
              keyTakeaways: [
                'Never trust client input: always validate request payloads on the server.',
                'Store passwords using slow adaptive hashing functions (bcrypt/argon2), never plaintext.',
                'Return semantically accurate HTTP status codes (200, 201, 400, 401, 403, 404, 500).'
              ],
              practiceQuestions: [
                'Q1: Why is PUT considered idempotent while POST is not?',
                'Q2: How do HTTP-only flags on cookies protect against Cross-Site Scripting (XSS) attacks?'
              ],
              assignmentPrompt: 'Build a secure RESTful API for student course enrollments featuring JWT authentication, role guards, and relational schema validation.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-c7',
        courseId: 'course-coding',
        title: 'Module 7: Capstone Engineering Project & Production Deployment',
        order: 7,
        description: 'End-to-end full-stack capstone project: system architecture, automated testing, containerization, and production release.',
        lessons: [
          {
            id: 'les-c7-1',
            moduleId: 'mod-c7',
            courseId: 'course-coding',
            title: 'Lesson 7.1: Production Capstone Specifications & CI/CD Delivery',
            order: 1,
            durationMinutes: 90,
            studyNote: {
              id: 'note-c7-1',
              lessonId: 'les-c7-1',
              courseId: 'course-coding',
              title: 'Production Capstone Architecture & Deployment Defense',
              introduction: 'The final capstone evaluates your ability to conceptualize, design, build, test, and deploy a production-ready web application.',
              learningObjectives: [
                'Architect a full-stack web application adhering to clean architectural patterns.',
                'Implement unit and integration testing pipelines to verify core business logic.',
                'Containerize the application with Docker and deploy to cloud environments.'
              ],
              detailedExplanations: 'Production engineering requires continuous validation: linting, type checks, unit tests, and security audits must pass before artifacts are deployed. Students must produce clean, readable documentation, architectural diagrams, and defend their design decisions before our faculty review board.',
              practicalExamples: 'Example 1: Multi-stage Dockerfile optimizing production image size.\nExample 2: Automated GitHub Actions CI workflow running test suites.',
              importantConcepts: [
                'Clean Architecture & Separation of Concerns',
                'Test-Driven Development & Code Coverage',
                'Containerization & Multi-Stage Builds',
                'Zero-Downtime Deployment Strategies'
              ],
              keyTakeaways: [
                'Software is not complete until it is tested, documented, and reliably deployed.',
                'Keep container images minimal to reduce attack surfaces and deployment latency.',
                'A great portfolio project is distinguished by code cleanliness and reproducibility.'
              ],
              practiceQuestions: [
                'Q1: What are the security benefits of non-root user execution in production Docker containers?',
                'Q2: How does automated integration testing prevent regressions in collaborative codebases?'
              ],
              assignmentPrompt: 'Submit your completed Capstone Git repository with complete README, live deployment link, automated test suites, and 2-page architectural memo.',
              isLocked: false
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course-marketing',
    title: 'Advanced Digital Marketing, Performance Ads & Growth Analytics',
    slug: 'digital-marketing',
    category: 'Growth Marketing & Digital Commerce',
    shortDescription: 'Master modern organic search (SEO), content strategy, Meta & Google performance advertising, customer conversion funnels, and data analytics.',
    fullDescription: 'An industry-calibrated curriculum designed to turn students into quantitative growth marketers. Covers algorithmic search indexing, paid acquisition, audience segmentation, conversion rate optimization (CRO), and attribution modeling.',
    level: 'Comprehensive',
    durationWeeks: 14,
    featured: true,
    published: true,
    enrolledStudentsCount: 112,
    modules: [
      {
        id: 'mod-m1',
        courseId: 'course-marketing',
        title: 'Module 1: Digital Marketing Fundamentals & The Modern Growth Funnel',
        order: 1,
        description: 'Customer journey mapping, acquisition channels, unit economics (CAC, LTV), and growth funnel stages (AARRR).',
        lessons: [
          {
            id: 'les-m1-1',
            moduleId: 'mod-m1',
            courseId: 'course-marketing',
            title: 'Lesson 1.1: Growth Funnel Architecture & Unit Economics',
            order: 1,
            durationMinutes: 45,
            studyNote: {
              id: 'note-m1-1',
              lessonId: 'les-m1-1',
              courseId: 'course-marketing',
              title: 'Funnel Dynamics, Unit Economics & Customer Lifetime Value',
              introduction: 'Digital marketing is a quantitative discipline governed by customer acquisition economics, retention dynamics, and conversion optimization.',
              learningObjectives: [
                'Calculate Customer Acquisition Cost (CAC) and Customer Lifetime Value (LTV) accurately.',
                'Map multi-touch user journeys across awareness, consideration, purchase, and retention.',
                'Identify bottleneck stages in the Pirate Metrics (AARRR) framework.'
              ],
              detailedExplanations: 'A sustainable business model requires an LTV:CAC ratio of at least 3:1. Understanding payback periods—how many months it takes for a customer to repay the marketing spend required to acquire them—determines how aggressively a brand can scale paid advertising campaigns.',
              practicalExamples: 'Example 1: Calculating blended vs paid CAC for an e-commerce subscription service.\nExample 2: Mapping a B2B SaaS lead nurturing email workflow.',
              importantConcepts: [
                'LTV to CAC Ratio & Payback Period',
                'Top of Funnel (TOFU) vs Bottom of Funnel (BOFU) Intent',
                'Customer Journey Mapping & Touchpoint Attribution',
                'AARRR (Acquisition, Activation, Retention, Referral, Revenue)'
              ],
              keyTakeaways: [
                'Growth without retention is a leaky bucket: prioritize product-market fit before scaling paid acquisition.',
                'Always track blended metrics alongside channel-specific metrics.',
                'Understand customer intent at each stage to align messaging accurately.'
              ],
              practiceQuestions: [
                'Q1: If a company spends $10,000 on ads to acquire 200 customers with an average LTV of $180, evaluate the health of its unit economics.',
                'Q2: What is the difference between leading and lagging marketing metrics?'
              ],
              assignmentPrompt: 'Develop a comprehensive customer journey funnel map for a direct-to-consumer educational brand including CAC estimates and key conversion milestones.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-m2',
        courseId: 'course-marketing',
        title: 'Module 2: Technical & Semantic Search Engine Optimization (SEO)',
        order: 2,
        description: 'Search algorithms, keyword intent research, technical crawlability, on-page optimization, and backlink authority.',
        lessons: [
          {
            id: 'les-m2-1',
            moduleId: 'mod-m2',
            courseId: 'course-marketing',
            title: 'Lesson 2.1: Technical SEO Auditing & High-Intent Keyword Strategy',
            order: 1,
            durationMinutes: 50,
            studyNote: {
              id: 'note-m2-1',
              lessonId: 'les-m2-1',
              courseId: 'course-marketing',
              title: 'Search Crawlers, Core Web Vitals & Intent-Driven Keyword Clustering',
              introduction: 'Organic search drives sustainable high-intent traffic by positioning content at the exact moment a prospect seeks a solution.',
              learningObjectives: [
                'Perform comprehensive technical SEO audits inspecting robots.txt, canonical tags, and XML sitemaps.',
                'Optimize for Google Core Web Vitals: LCP (Largest Contentful Paint), INP, and CLS.',
                'Construct topical authority maps and keyword clusters based on commercial search intent.'
              ],
              detailedExplanations: 'Search engines deploy automated spiders to discover, crawl, render, and index web content. High search rankings depend on three pillars: Technical Health (crawlability, site speed, mobile responsiveness), On-Page Relevance (content depth, heading hierarchy, semantic entity association), and Off-Page Authority (backlink profile quality, brand mentions).',
              practicalExamples: 'Example 1: Conducting a keyword gap analysis comparing competitors.\nExample 2: Generating schema.org structured JSON-LD for rich snippet eligibility.',
              importantConcepts: [
                'Crawl Budget Optimization & Canonicalization',
                'Informational vs Commercial vs Transactional Intent',
                'Topic Clusters & Pillar Page Architecture',
                'Core Web Vitals Performance Benchmarks'
              ],
              keyTakeaways: [
                'Do not chase vanity search volume: target high-intent long-tail keywords that convert into leads.',
                'Fast, accessible pages rank higher and convert more visitors.',
                'Structured data (JSON-LD) enables rich search results that dramatically boost click-through rates (CTR).'
              ],
              practiceQuestions: [
                'Q1: How do canonical tags resolve duplicate content issues on faceted e-commerce pages?',
                'Q2: What are Core Web Vitals and how does page load latency impact search ranking?'
              ],
              assignmentPrompt: 'Conduct a complete 15-point Technical SEO Audit on an assigned institutional website and deliver a prioritized remediation roadmap.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-m3',
        courseId: 'course-marketing',
        title: 'Module 3: Organic Social Media Strategy & Brand Authority',
        order: 3,
        description: 'Platform algorithms, visual storytelling, community engagement, brand voice guidelines, and distribution frameworks.',
        lessons: [
          {
            id: 'les-m3-1',
            moduleId: 'mod-m3',
            courseId: 'course-marketing',
            title: 'Lesson 3.1: Algorithmic Distribution & Multi-Channel Content Repurposing',
            order: 1,
            durationMinutes: 45,
            studyNote: {
              id: 'note-m3-1',
              lessonId: 'les-m3-1',
              courseId: 'course-marketing',
              title: 'Social Graph Algorithms & Narrative Distribution Frameworks',
              introduction: 'Organic social media builds brand equity, trust, and audience ownership when combined with systematic content repurposing.',
              learningObjectives: [
                'Understand algorithmic engagement signals across LinkedIn, X (Twitter), YouTube, and Instagram.',
                'Implement a "Content Waterfall" system: turning 1 long-form podcast or article into 15 micro-assets.',
                'Establish brand voice guardrails that maintain institutional prestige.'
              ],
              detailedExplanations: 'Modern social algorithms prioritize dwell time, shares, and meaningful conversation threads over passive vanity likes. Building an authentic editorial perspective establishes category authority and creates organic inbound demand.',
              practicalExamples: 'Example 1: Transforming an academic research whitepaper into an engaging LinkedIn slide carousel.\nExample 2: Designing an organic content editorial calendar with clear publication cadences.',
              importantConcepts: [
                'Dwell Time and Engagement Velocity Signals',
                'Content Waterfall / Repurposing Framework',
                'Brand Voice and Editorial Tone Guidelines',
                'Community Management and Sentiment Monitoring'
              ],
              keyTakeaways: [
                'Quality beats quantity: 1 high-value authoritative post outperforms 10 generic filler updates.',
                'Tailor content formatting natively to each platform instead of auto-cross-posting identical text.',
                'Encourage genuine dialogue rather than broadcast-style lecturing.'
              ],
              practiceQuestions: [
                'Q1: How does the LinkedIn algorithmic feed weight text posts versus PDF document carousels?',
                'Q2: What strategies prevent audience fatigue on organic brand channels?'
              ],
              assignmentPrompt: 'Create a 30-day organic social content strategy for an educational platform including sample creative copy, visual briefs, and KPI tracking sheets.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-m4',
        courseId: 'course-marketing',
        title: 'Module 4: Meta Ads & Direct-Response Paid Acquisition',
        order: 4,
        description: 'Facebook & Instagram Ads Manager, Pixel setup, Conversions API, creative testing frameworks, and scaling budgets.',
        lessons: [
          {
            id: 'les-m4-1',
            moduleId: 'mod-m4',
            courseId: 'course-marketing',
            title: 'Lesson 4.1: Meta Pixel, Conversions API & Creative Testing Systems',
            order: 1,
            durationMinutes: 65,
            studyNote: {
              id: 'note-m4-1',
              lessonId: 'les-m4-1',
              courseId: 'course-marketing',
              title: 'Server-Side Tracking, Creative Testing & ROAS Optimization',
              introduction: 'Meta Ads Manager is a powerful machine-learning auction platform where ad creative is the primary targeting lever.',
              learningObjectives: [
                'Configure server-side Meta Conversions API (CAPI) to circumvent browser ad-blockers and iOS privacy drops.',
                'Deploy dynamic creative testing (DCT) matrix evaluating hooks, body copy, and calls-to-action.',
                'Scale campaign budgets safely using horizontal and vertical budget optimization techniques.'
              ],
              detailedExplanations: 'In modern algorithmic ad buying, hyper-narrow demographic targeting has been superseded by broad targeting paired with conversion optimization goals. The machine learning algorithm identifies receptive users based on visual hooks and message resonance.',
              practicalExamples: 'Example 1: Setting up an Advantage+ shopping campaign with dynamic product catalogs.\nExample 2: Analyzing Hook Rate (3-second video views / impressions) to diagnose creative fatigue.',
              importantConcepts: [
                'Conversions API (CAPI) vs Browser Pixel Tracking',
                'Advantage+ Budget Optimization (ABO vs CBO)',
                'Creative Testing Matrices (Hook, Angle, Offer)',
                'Return on Ad Spend (ROAS) and Break-Even Metrics'
              ],
              keyTakeaways: [
                'Creative is your targeting: your visual and headline determine who stops scrolling.',
                'Never turn off learning-phase campaigns prematurely before collecting statistically significant conversion data.',
                'Track First-Party data diligently using UTM tracking conventions.'
              ],
              practiceQuestions: [
                'Q1: Why did Apple iOS 14.5 necessitate the adoption of server-side Conversions API?',
                'Q2: What is the mathematical formula for calculating break-even ROAS given gross margins?'
              ],
              assignmentPrompt: 'Formulate a complete Meta Ads Campaign Blueprint with 3 distinct creative angles, targeting strategy, budget allocations, and conversion tracking specifications.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-m5',
        courseId: 'course-marketing',
        title: 'Module 5: Google Ads, Search Intent & Performance Max Campaigns',
        order: 5,
        description: 'Google Search Ads, keyword match types, negative keywords, Quality Score optimization, and Performance Max.',
        lessons: [
          {
            id: 'les-m5-1',
            moduleId: 'mod-m5',
            courseId: 'course-marketing',
            title: 'Lesson 5.1: High-Intent Search Ads & Quality Score Mastery',
            order: 1,
            durationMinutes: 60,
            studyNote: {
              id: 'note-m5-1',
              lessonId: 'les-m5-1',
              courseId: 'course-marketing',
              title: 'Ad Auction Mechanics, Quality Score & Search Intent Capture',
              introduction: 'Google Ads captures commercial intent at the exact moment prospects actively search for solutions, yielding higher conversion rates than passive discovery feeds.',
              learningObjectives: [
                'Master the Google Ad Auction formula: Ad Rank = Max CPC Bid × Quality Score.',
                'Optimize the three Quality Score components: Expected CTR, Ad Relevance, and Landing Page Experience.',
                'Structure search campaigns using Single Keyword Ad Groups (SKAGs) or tightly themed ad groups (STAGs).'
              ],
              detailedExplanations: 'Unlike social feeds where users are passively browsing, Google Search users exhibit active intent. An advertiser with a lower bid can outrank competitors who bid significantly more if their Quality Score is higher, rewarding superior relevance and fast-loading landing pages.',
              practicalExamples: 'Example 1: Building a comprehensive negative keyword list to eliminate wasted ad spend.\nExample 2: Configuring automated Smart Bidding strategies (Target CPA / Target ROAS).',
              importantConcepts: [
                'Google Ad Rank and Second-Price Auction Dynamics',
                'Quality Score Determinants and Optimization',
                'Keyword Match Types: Exact, Phrase, and Broad Match',
                'Negative Keyword Hygiene and Budget Protection'
              ],
              keyTakeaways: [
                'A rigorous negative keyword list is the single fastest way to reduce wasted ad budget.',
                'Ensure strict keyword continuity between ad copy and destination landing page headlines.',
                'Leverage responsive search ads (RSAs) to allow Google to test headline-description combinations.'
              ],
              practiceQuestions: [
                'Q1: How does a Quality Score of 9/10 reduce the actual Cost-Per-Click compared to an account with 4/10?',
                'Q2: When should an advertiser transition from Manual CPC to Target CPA bidding?'
              ],
              assignmentPrompt: 'Build a Google Search Ads account architecture for an educational course intake including keyword lists, match types, responsive search ads, and site extensions.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-m6',
        courseId: 'course-marketing',
        title: 'Module 6: Content Marketing, Copywriting & Email Retention',
        order: 6,
        description: 'Direct-response copywriting frameworks, lead magnets, email automation sequences, and lifecycle marketing.',
        lessons: [
          {
            id: 'les-m6-1',
            moduleId: 'mod-m6',
            courseId: 'course-marketing',
            title: 'Lesson 6.1: Direct-Response Copywriting & Automated Email Drips',
            order: 1,
            durationMinutes: 50,
            studyNote: {
              id: 'note-m6-1',
              lessonId: 'les-m6-1',
              courseId: 'course-marketing',
              title: 'Persuasive Copywriting Architectures & Email Nurture Automation',
              introduction: 'Copywriting is salesmanship in print. Combined with automated email sequences, it converts cold prospects into enrolled advocates.',
              learningObjectives: [
                'Apply proven copywriting frameworks: PAS (Problem-Agitate-Solve), AIDA, and BAB (Before-After-Bridge).',
                'Construct 5-part automated welcome email series achieving >40% open rates.',
                'Segment email lists based on user behavioral triggers and course interests.'
              ],
              detailedExplanations: 'Email marketing generates among the highest returns on investment in digital marketing because it represents an owned channel free from platform algorithm changes. Clear subject lines, value-first copy, single calls-to-action, and proper deliverability configurations (SPF, DKIM, DMARC) ensure consistent conversion.',
              practicalExamples: 'Example 1: Writing a high-converting landing page headline and value proposition.\nExample 2: Designing an automated 7-day onboarding sequence for new platform registrants.',
              importantConcepts: [
                'Persuasive Copywriting Frameworks (AIDA, PAS)',
                'Email Deliverability Protocols: SPF, DKIM, and DMARC',
                'Behavioral Segmentation and Triggered Automations',
                'A/B Split Testing for Subject Lines and CTAs'
              ],
              keyTakeaways: [
                'Write to one specific person with a specific pain point rather than addressing a crowd.',
                'The subject line has one job: get the email opened. The first sentence has one job: get the second read.',
                'Maintain clean list hygiene by removing unengaged subscribers periodically.'
              ],
              practiceQuestions: [
                'Q1: Describe the PAS copywriting framework and write a sample 3-paragraph email pitch using it.',
                'Q2: What factors trigger email spam filters and how can senders protect inbox placement?'
              ],
              assignmentPrompt: 'Write an end-to-end 5-email nurture sequence for prospective student leads who downloaded a free course syllabus.',
              isLocked: false
            }
          }
        ]
      },
      {
        id: 'mod-m7',
        courseId: 'course-marketing',
        title: 'Module 7: Growth Analytics, GA4 & Attribution Modeling',
        order: 7,
        description: 'Google Analytics 4 setup, event tracking, custom dimensions, multi-touch attribution, and executive reporting.',
        lessons: [
          {
            id: 'les-m7-1',
            moduleId: 'mod-m7',
            courseId: 'course-marketing',
            title: 'Lesson 7.1: Google Analytics 4 Custom Events & Attribution Models',
            order: 1,
            durationMinutes: 65,
            studyNote: {
              id: 'note-m7-1',
              lessonId: 'les-m7-1',
              courseId: 'course-marketing',
              title: 'GA4 Event Schema, Custom Dimensions & Multi-Touch Attribution',
              introduction: 'Growth decisions must be validated by empirical analytics. GA4 provides an event-driven measurement model across the entire customer lifecycle.',
              learningObjectives: [
                'Configure GA4 custom events, parameters, and conversion key events using Google Tag Manager.',
                'Analyze multi-touch attribution: First Click, Last Click, Linear, and Data-Driven Attribution.',
                'Build executive KPI dashboards tracking customer acquisition trends and marketing efficiency ratios (MER).'
              ],
              detailedExplanations: 'Unlike Universal Analytics which relied on pageview-session models, GA4 treats all user interactions as events. Understanding attribution modeling allows marketing directors to allocate capital efficiently, avoiding over-crediting closing channels at the expense of top-of-funnel discovery channels.',
              practicalExamples: 'Example 1: Setting up enhanced measurement for scroll depth, outbound links, and file downloads in GTM.\nExample 2: Calculating Marketing Efficiency Ratio (Total Revenue / Total Marketing Spend).',
              importantConcepts: [
                'GA4 Event-Driven Data Schema',
                'Google Tag Manager (GTM) Container Triggers',
                'First-Touch vs Last-Touch vs Data-Driven Attribution',
                'Marketing Efficiency Ratio (MER) vs ROAS'
              ],
              keyTakeaways: [
                'Tag everything cleanly with standardized UTM parameters: source, medium, campaign, content, term.',
                'Do not make strategic budget reallocations based on single-touch attribution alone.',
                'Automate routine reporting so time is spent analyzing insights rather than manual spreadsheet data entry.'
              ],
              practiceQuestions: [
                'Q1: How does GA4 data-driven attribution distribute conversion credit across touchpoints?',
                'Q2: What is the difference between an event parameter and a user property in GA4?'
              ],
              assignmentPrompt: 'Configure a Google Tag Manager and GA4 measurement plan for an educational website tracking form submissions, video completions, and button clicks.',
              isLocked: false
            }
          }
        ]
      }
    ]
  }
];

export const INITIAL_PDF_DOCUMENTS: PdfDocument[] = [
  {
    id: 'pdf-01',
    title: 'Full-Stack Software Engineering Comprehensive Study Guide & Reference Handbook',
    fileName: 'RM_Coding_FullStack_Comprehensive_Guide_2026.pdf',
    fileSize: '4.8 MB',
    uploadDate: '2026-03-01',
    downloadUrl: '/assets/documents/coding_comprehensive_guide.pdf',
    published: true,
    courseId: 'course-coding',
    moduleId: 'mod-c1',
    description: 'Complete institutional textbook covering algorithms, DOM APIs, Python data structures, and capstone specifications.'
  },
  {
    id: 'pdf-02',
    title: 'Performance Marketing & Growth Attribution Master Field Manual',
    fileName: 'RM_DigitalMarketing_Field_Manual_2026.pdf',
    fileSize: '3.6 MB',
    uploadDate: '2026-03-05',
    downloadUrl: '/assets/documents/digital_marketing_field_manual.pdf',
    published: true,
    courseId: 'course-marketing',
    moduleId: 'mod-m1',
    description: 'Practical handbook on Google Ads Quality Score optimization, Meta CAPI architecture, and GA4 custom event tracking.'
  }
];

export const INITIAL_TERMS_CONTENT = `
1. Introduction & Acceptance of Terms
By creating an account, browsing this platform, or enrolling in any educational course, internship, or learning module, you agree to be bound by these Terms and Conditions in their entirety. If you do not agree with any provision herein, you must immediately cease accessing the platform.

2. Eligibility & Student Registration
Enrollment is open to college and university students, adult learners, and verified applicants who meet the stated academic prerequisites. You agree to provide true, accurate, and current information during registration. Providing fraudulent identity, false academic affiliations, or fabricated credentials will result in immediate disqualification and account termination.

3. Account Responsibilities & Security
You are solely responsible for maintaining the confidentiality of your login credentials. You agree not to disclose your password to any third party. Any activity occurring under your account is your legal responsibility. You must notify platform administrators immediately upon discovering any unauthorized access or breach of security.

4. Course Enrollment & Owner Approval Mechanism
Course registration is not automated. All student enrollment requests for "Coding", "Digital Marketing", or "Both Courses" are submitted to the Platform Owner for formal administrative review. The Platform Owner retains full and autonomous discretion to approve, defer, or reject enrollment applications based on institutional capacity, academic prerequisites, and verification standards.

5. Course Access & Protected Learning Materials
Upon official enrollment approval by the Platform Owner, students are granted non-exclusive, non-transferable, revocable access to the protected study notes, lessons, and assigned exercises for their approved course(s) only. Students approved for Coding shall not access Digital Marketing materials, and vice versa, unless approved for Both Courses.

6. Intellectual Property Rights
All curriculum designs, study notes, lecture texts, code examples, marketing playbooks, PDF documents, visual media, brand trademarks, and platform software are the exclusive intellectual property of the Platform and its licensors. No title, ownership, or intellectual property rights are transferred to students under any circumstances.

7. Restrictions on Sharing or Redistributing Notes
STUDENTS ARE EXPRESSLY PROHIBITED FROM COPYING, RECORDING, SCREEN-CAPTURING, RE-UPLOADING, SELLING, LEASING, SUBLICENSING, OR REDISTRIBUTING ANY COURSE NOTES, PDF DOCUMENTS, OR STUDY MATERIALS TO THIRD PARTIES, ONLINE REPOSITORIES, CHAT GROUPS, OR COMMERCIAL PLATFORMS. Any violation constitutes copyright infringement and will result in permanent account termination, forfeiture of certificates, and legal action where warranted.

8. Assignment Submission Requirements
Students must complete all required module assignments independently and submit them prior to the posted deadlines. Work submitted must represent the student's original effort. Plagiarism, ghostwriting, or unauthorized AI generation will trigger immediate disciplinary review under the Student Discipline Policy.

9. Internship Applications & Fellowships
Internship listings published on this platform are governed by respective laboratory and institutional terms. Course enrollment does not automatically guarantee internship placement. Selection for stipendiary fellowships is determined solely on merit, technical performance, and interview results.

10. Payment & Refund Provisions
Where applicable, all tuition, registration fees, or material honorariums must be remitted via authorized payment processors. Fee structures, discounts, and refund windows (if any) are governed by specific program circulars and are non-transferable.

11. Account Suspension & Termination
The Platform Owner reserves the right to suspend or permanently terminate any student account, without liability or refund, for violation of these Terms, failure to adhere to the Student Discipline Policy, academic dishonesty, harassment, or platform abuse.

12. Acceptable Use of the Platform
You agree not to use the platform to: (a) probe, scan, or test the vulnerability of any system; (b) breach security or authentication measures; (c) introduce viruses, worms, or malicious code; (d) harvest student data; or (e) harass, defame, or intimidate instructors, administrators, or fellow students.

13. Privacy & Data Protection
Your personal information is collected, stored, and processed in accordance with our official Privacy Policy. We implement security safeguards to protect student records and do not sell student data to unauthorized third-party commercial brokers.

14. Platform Availability & Maintenance
The platform is provided on an "as-is" and "as-available" basis. While we strive for continuous service uptime, scheduled maintenance, system upgrades, or unexpected network outages may occur. We shall not be liable for any disruption to study schedules.

15. Limitation of Liability
To the maximum extent permitted by applicable law, the Platform, its directors, instructors, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your access to or inability to access the platform.

16. Changes to Terms
The Platform Owner reserves the right to modify these Terms and Conditions at any time. When material updates are published, registered students will be notified and may be required to re-acknowledge the updated terms upon subsequent login.

17. Contact Information
For official legal and terms inquiries, please contact the Secretariat at legal@platform.edu or via written correspondence to our registered academic office.

18. Effective Date & Version History
This policy is Effective as of March 1, 2026. Version: 2.4-ACAD. Previous versions are archived in the institutional registry for compliance audit purposes.
`;

export const INITIAL_DISCIPLINE_CONTENT = `
1. Professional Behaviour
Students must maintain exemplary, respectful, and professional conduct when communicating with instructors, academic mentors, administrative staff, and fellow students across all digital channels, discussion forums, and virtual classrooms.

2. Attendance and Punctuality
Scholars are expected to attend all scheduled live colloquia, participate actively in designated learning modules, and submit laboratory exercises promptly according to posted syllabi schedules.

3. Academic Integrity & Anti-Plagiarism Mandate
Honesty is the bedrock of academic excellence. Plagiarism, copying source code, submitting assignments authored by third parties, unauthorized contract cheating, or misrepresenting project deliverables is strictly prohibited and subject to zero-tolerance enforcement.

4. Respectful Communication
All verbal, written, and digital communications must remain polite, constructive, and free from inflammatory, discriminatory, derogatory, or harassing language. Disrespect toward instructors or peers will result in immediate disciplinary intervention.

5. Responsible Technology Usage
Platform servers, virtual laboratories, code sandboxes, and learning materials must be utilized solely for authorized educational purposes. Attempting to deploy malicious payloads, bypass authentication mechanisms, or reverse-engineer platform assets is grounds for immediate expulsion.

6. Assignment Responsibility & Independent Execution
Unless collaborative group work is explicitly designated by the course syllabus, all assignments, coding projects, and marketing plans must represent the student's individual, independent work.

7. Platform Security & Account Integrity
Students are strictly forbidden from sharing login credentials, attempting to access fellow students' dashboards, impersonating other users, or tampering with database records.

8. Confidentiality & Non-Disclosure
All proprietary laboratory notes, research datasets, pre-release software builds, and fellow students' personal information must be treated as confidential. Unauthorized publication or external dissemination is strictly prohibited.

9. Active Participation & Colloquium Engagement
Students are expected to contribute meaningfully to peer reviews, engage in technical Q&A sessions, and demonstrate continual progress toward module learning outcomes.

10. Disciplinary Procedures, Warnings, Suspension & Expulsion
Violations of this Code of Conduct will be investigated by the Academic Disciplinary Board. Penalties for confirmed infractions include:
- Tier 1: Formal written reprimand and assignment grade reduction.
- Tier 2: Temporary account suspension and forfeiture of internship eligibility.
- Tier 3: Permanent expulsion from the platform and revocation of all issued certificates.

11. Student Grievance & Fair Appeal Process
Any student subject to disciplinary action retains the right to submit a formal written appeal within 7 business days to the Dean of Academic Affairs. The Appeals Committee conducts an impartial evidentiary review before issuing a final decision.
`;

export const INITIAL_PRIVACY_CONTENT = `
1. Scope & Commitment
We respect your privacy and are committed to safeguarding your personal information. This Privacy Policy governs our collection, processing, and storage of student records across our dynamic educational platform.

2. Information We Collect
We collect personal information necessary to facilitate enrollment, verify academic credentials, evaluate assignments, and administer internships. This includes: Full Name, Institutional Email, Phone Number, College, Department, Academic Year, IP address, device telemetry, and project submission records.

3. Purpose of Processing
Your data is utilized strictly to: (a) authenticate account access; (b) review and approve course enrollment requests; (c) deliver course study notes and track module progress; (d) grade technical assignments; (e) process internship fellowship applications; and (f) issue cryptographically verifiable certificates.

4. Data Retention & Security
Student records are stored within secure relational databases protected by role-based access control, encryption in transit (TLS 1.3), and encryption at rest. We do not sell, rent, or trade your personal information to third-party advertising brokers.

5. Your Legal Rights
You have the right to inspect your student profile, request corrections to erroneous data, download your academic submission records, or request account closure subject to statutory record-retention requirements.
`;

export const INITIAL_POLICIES: PolicyDocument[] = [
  {
    id: 'terms',
    title: 'Terms & Conditions of Educational Service',
    version: '2.4-ACAD',
    effectiveDate: '2026-03-01',
    lastUpdated: '2026-03-01',
    content: INITIAL_TERMS_CONTENT,
    changelog: [
      { version: '2.4-ACAD', date: '2026-03-01', summary: 'Added strict restrictions on notes redistribution and formal enrollment approval mechanisms.' },
      { version: '2.0-ACAD', date: '2025-09-15', summary: 'Updated unit economics and internship fellowship provisions.' }
    ]
  },
  {
    id: 'discipline',
    title: 'Student Discipline & Code of Academic Conduct',
    version: '1.8-ACAD',
    effectiveDate: '2026-03-01',
    lastUpdated: '2026-03-01',
    content: INITIAL_DISCIPLINE_CONTENT,
    changelog: [
      { version: '1.8-ACAD', date: '2026-03-01', summary: 'Codified the 10 core student behavior rules and formal disciplinary tiers.' },
      { version: '1.0-ACAD', date: '2025-08-01', summary: 'Initial student charter publication.' }
    ]
  },
  {
    id: 'privacy',
    title: 'Institutional Student Privacy & Data Protection Policy',
    version: '2.1-ACAD',
    effectiveDate: '2026-03-01',
    lastUpdated: '2026-03-01',
    content: INITIAL_PRIVACY_CONTENT,
    changelog: [
      { version: '2.1-ACAD', date: '2026-03-01', summary: 'Standardized encrypted storage protocols and student rights provisions.' }
    ]
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-2026-0842',
  fullName: 'Aditya Vardhan Raman',
  email: 'aditya.v@student.ac.in',
  mobileNumber: '+91 98765 43210',
  college: 'National Institute of Technology',
  department: 'Computer Science & Engineering',
  academicYear: '3rd Year (Semester VI)',
  city: 'Bangalore',
  state: 'Karnataka',
  enrolledCourses: ['Coding'], // Approved for Coding only
  pendingCourseRequests: ['Digital Marketing'], // Requested Digital Marketing, awaiting owner approval!
  status: 'Active',
  avatarUrl: '/assets/mascot/lion_mascot.png',
  agreedTermsVersion: '2.4-ACAD',
  agreedDisciplineVersion: '1.8-ACAD',
  agreedPrivacyVersion: '2.1-ACAD',
  agreedTimestamp: '2026-03-02T10:15:30Z'
};

export const INITIAL_ENROLLMENT_REQUESTS: EnrollmentRequest[] = [
  {
    id: 'enr-901',
    studentId: 'std-2026-0842',
    studentName: 'Aditya Vardhan Raman',
    studentEmail: 'aditya.v@student.ac.in',
    studentCollege: 'National Institute of Technology',
    requestedCourses: ['Digital Marketing'],
    requestDate: '2026-03-10',
    status: 'Pending',
    reviewerNotes: 'Student currently enrolled in Coding with distinction. Requesting secondary access to Digital Marketing.'
  },
  {
    id: 'enr-902',
    studentId: 'std-2026-1049',
    studentName: 'Pooja Sundaram',
    studentEmail: 'pooja.s@institute.ac.in',
    studentCollege: 'PSG College of Technology',
    requestedCourses: ['Coding', 'Digital Marketing'],
    requestDate: '2026-03-11',
    status: 'Pending',
    reviewerNotes: 'Dual enrollment candidate with pre-final year standing in Information Science.'
  },
  {
    id: 'enr-903',
    studentId: 'std-2026-0842',
    studentName: 'Aditya Vardhan Raman',
    studentEmail: 'aditya.v@student.ac.in',
    studentCollege: 'National Institute of Technology',
    requestedCourses: ['Coding'],
    requestDate: '2026-03-01',
    status: 'Approved',
    decisionDate: '2026-03-02',
    reviewerNotes: 'Academic transcript verified. Access granted to Coding modules.'
  }
];

export const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'int-101',
    title: 'Full-Stack Web Systems & Distributed Architecture Internship',
    department: 'Software Engineering Laboratory',
    description: 'Work directly on high-concurrency microservices, TypeScript APIs, database indexing, and client-side performance engineering under senior faculty guidance.',
    skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'React', 'Docker'],
    eligibility: 'Pre-final or Final year B.Tech/B.E. in CSE, IT, or ECE with CGPA >= 7.5',
    duration: '12 Weeks (Summer Cohort)',
    workMode: 'Hybrid',
    deadline: '2026-05-30',
    availablePositions: 6,
    applicationInstructions: 'Submit updated academic resume and public GitHub repository links containing real full-stack web applications.',
    published: true
  },
  {
    id: 'int-102',
    title: 'Performance Marketing, SEO & Attribution Modeling Fellowship',
    department: 'Digital Commerce & Growth Division',
    description: 'Formulate, test, and analyze direct-response acquisition campaigns, Meta Conversions API integrations, and Google Search Ads for real product launches.',
    skills: ['Google Analytics 4', 'Meta Ads Manager', 'SEO Auditing', 'Copywriting', 'SQL Basics'],
    eligibility: 'Enrolled undergraduate or postgraduate students with demonstrated analytical skills and completed digital marketing coursework.',
    duration: '10 Weeks (Summer Cohort)',
    workMode: 'Remote',
    deadline: '2026-06-15',
    availablePositions: 4,
    applicationInstructions: 'Submit resume alongside a 1-page sample campaign audit demonstrating quantitative keyword or audience optimization.',
    published: true
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    courseId: 'course-coding',
    courseTitle: 'Coding: Software Engineering',
    moduleId: 'mod-c2',
    moduleTitle: 'Module 2: Semantic HTML5 Architecture',
    title: 'Accessible Academic Institutional Wireframe Construction',
    description: 'Construct a semantic, accessible web wireframe utilizing semantic tags (<header>, <nav>, <main>, <article>, <section>, <footer>) with zero styling and 100% WCAG AA compliance.',
    instructions: 'Include proper heading hierarchy, ARIA roles for navigation menus, and form labels with `for` attribute linkages.',
    deadline: '2026-04-15',
    totalPoints: 100,
    published: true
  },
  {
    id: 'asg-02',
    courseId: 'course-marketing',
    courseTitle: 'Digital Marketing: Performance Ads',
    moduleId: 'mod-m2',
    moduleTitle: 'Module 2: Technical & Semantic SEO',
    title: 'Comprehensive Technical SEO Audit & Core Web Vitals Remediation',
    description: 'Conduct a thorough 15-point Technical SEO audit on an assigned public e-commerce domain and draft an executive remediation memorandum.',
    instructions: 'Analyze robots.txt, canonicalization, XML sitemaps, LCP metrics, and schema.org JSON-LD structured metadata.',
    deadline: '2026-04-20',
    totalPoints: 100,
    published: true
  }
];

export const INITIAL_ASSIGNMENT_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-801',
    assignmentId: 'asg-01',
    assignmentTitle: 'Accessible Academic Institutional Wireframe Construction',
    courseId: 'course-coding',
    studentId: 'std-2026-0842',
    studentName: 'Aditya Vardhan Raman',
    studentEmail: 'aditya.v@student.ac.in',
    submissionText: 'Completed semantic wireframe using strict HTML5 markup. Screen reader traversal tested in NVDA with zero accessibility warnings.',
    attachedRepoUrl: 'https://github.com/adityaraman/semantic-academic-wireframe',
    submittedAt: '2026-03-08',
    status: 'Graded',
    grade: 'A+ (Distinction)',
    pointsScored: 98,
    mentorFeedback: 'Flawless document outline structure and appropriate ARIA landmarks. Exceptional attention to accessible form labeling.'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Summer Academic Intake 2026: Official Enrollment Review Open',
    category: 'Enrollment',
    content: 'Students registered on the platform may now submit course enrollment requests for Coding and Digital Marketing. Review cycles occur weekly under the supervision of the Platform Owner.',
    publishedDate: '2026-03-08',
    priority: 'Urgent',
    published: true
  },
  {
    id: 'ann-02',
    title: 'Mandatory Policy Acknowledgment Version 2.4-ACAD in Effect',
    category: 'Academic',
    content: 'All scholars are reminded that sharing, recording, or redistributing protected course notes and PDF materials is strictly prohibited under our updated Terms and Student Discipline Policy.',
    publishedDate: '2026-03-02',
    priority: 'Important',
    published: true
  },
  {
    id: 'ann-03',
    title: 'Technical Capstone Defense Guidelines Released for Module 7',
    category: 'Assignment',
    content: 'Guidelines for final project repo submissions and automated CI/CD test benchmarks have been published in the Student Dashboard.',
    publishedDate: '2026-02-28',
    priority: 'Normal',
    published: true
  }
];
