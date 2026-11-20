import type { StudyNoteUpgradeSpec } from './noteUpgradeHelper';

export const DEPT1_NOTE_UPGRADES: Record<string, StudyNoteUpgradeSpec> = {
  'html-web-dev-fundamentals:note-1': {
    intro:
      'Every reliable website starts with semantic HTML5 markup rather than generic visual containers. Choosing purposeful elements such as `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, and `<footer>` gives browsers, screen readers, and search crawlers an unambiguous structural outline before any CSS styling is applied.',
    learningObjectives: [
      'Explain why `<!DOCTYPE html>` and `<html lang="en">` are mandatory on modern standards-compliant pages.',
      'Configure essential `<head>` metadata including UTF-8 encoding, responsive viewport scaling, and page titles.',
      'Organize page content using landmark regions and an unbroken heading outline (`<h1>` through `<h6>`).',
      'Distinguish standard paired elements from HTML5 void elements such as `<img>` and `<meta>`.',
    ],
    detailedExplanation:
      'When a web browser receives an HTML document, its parser builds two live trees in memory: the Document Object Model (DOM) used for rendering and scripting, and the Accessibility Tree queried by screen readers and assistive keyboards.\n\nIf a developer builds an entire page out of neutral `<div>` wrappers, visually sighted users might rely on font size alone—but assistive tools see no navigation landmarks, no clear start of main content, and no logical document outline. Semantic HTML5 solves this cleanly: `<header>` marks top banner identity, `<nav>` groups major navigation links, `<main>` encloses the unique primary content of the page (used once per visible page), `<article>` wraps self-contained stories or posts, `<section>` groups thematically related headings, and `<footer>` holds institutional credits.\n\nHeading tags (`<h1>` to `<h6>`) operate exactly like chapters and subchapters in a textbook: maintain a single clear `<h1>` for the page topic and descend step-by-step (`<h2>`, `<h3>`) without skipping levels just to pick a smaller font size.',
    keyConcepts:
      '- **DOCTYPE Declaration (`<!DOCTYPE html>`)**: The opening instruction triggering HTML5 Standards Mode so layout engines render box models predictably.\n- **Semantic Element**: An HTML tag whose name carries clear structural meaning (such as `<article>`, `<nav>`, `<time>`) for machines and humans alike.\n- **Landmark Region**: Major page sections (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) allowing keyboard and screen-reader users to jump directly across regions.\n- **Void Element**: An element that cannot wrap inner child content or closing tags, such as `<meta>`, `<link>`, `<br>`, `<hr>`, and `<img>`.\n- **Viewport Metadata**: The `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` tag telling mobile browsers not to zoom out desktop layouts awkwardly.',
    stepByStepExplanation:
      'Step 1: Open line 1 with `<!DOCTYPE html>` to guarantee modern standards rendering.\nStep 2: Wrap the document in `<html lang="en">` so pronunciation dictionaries and translation engines know the primary human language.\nStep 3: Inside `<head>`, place `<meta charset="UTF-8" />`, responsive viewport metadata, and a concise `<title>` summarizing the page.\nStep 4: Inside `<body>`, place banner branding in `<header>` and wrap top menu links inside `<nav aria-label="Primary Navigation">`.\nStep 5: Wrap the page’s unique core topic in a single `<main>` landmark, dividing logical themes into `<section>` blocks with sequential `<h1>` -> `<h2>` -> `<h3>` headings.\nStep 6: Close the page cleanly with a `<footer>` containing institutional ownership and contact details.',
    practicalExampleExtra:
      'Notice how clean semantic HTML still renders meaningfully even if CSS fails to load on slow networks: links stay grouped in `<nav>`, headings clearly separate `<section>` blocks, and `<main>` isolates core study content cleanly.',
    summary:
      'Semantic HTML5 establishes the structural backbone for accessibility, search indexing, and maintainable multi-page interfaces through landmarks, unbroken heading levels, and clean `<head>` metadata.',
    revisionChecklist: [
      'Always start line 1 with `<!DOCTYPE html>` and set `lang` on `<html>`.',
      'Include UTF-8 charset and mobile viewport metadata in every `<head>`.',
      'Use `<main>` once per page and reserve headings (`h1`–`h6`) for hierarchy, never font sizing.',
      'Never wrap clickable actions in plain `<div>` tags when `<a>` or `<button>` fits natively.',
    ],
    practiceExerciseExtra:
      'Inspect an existing plain-`<div>` wireframe and convert every region (`div.top`, `div.menu`, `div.content`, `div.bottom`) into valid HTML5 landmarks validated mentally for unbroken `h1 -> h2` nesting.',
    fiveQuestions: [
      {
        question: 'What visual and technical bug can occur if `<!DOCTYPE html>` is omitted from line 1?',
        answer:
          'Browsers may fall back into legacy Quirks Mode, applying outdated box-sizing and table alignment behaviors inconsistently across browser engines.',
      },
      {
        question: 'Why should developers avoid jumping directly from `<h1>` to `<h4>` simply because `<h4>` looks smaller?',
        answer:
          'Screen readers and search engines interpret heading levels as a nested outline; skipping levels breaks document hierarchy. Visual text size belongs in CSS rather than heading tags.',
      },
      {
        question: 'Name three HTML5 void elements and explain why they do not have closing tags.',
        answer:
          '`<img>`, `<meta>`, and `<br>` (also `<hr>` or `<input>`). Void elements represent standalone embeds or metadata markers that cannot hold child text or nested markup.',
      },
      {
        question: 'How many visible `<main>` landmarks should an HTML5 document contain, and what goes inside it?',
        answer:
          'One visible `<main>` landmark per document, enclosing only the primary unique content of that page—never repeating site-wide headers, sidebars, or footers.',
      },
      {
        question: 'What two critical attributes belong inside `<head>` on every beginner HTML5 page?',
        answer:
          '`<meta charset="UTF-8" />` (so international symbols render cleanly) and `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` (so phones render at native device scale).',
      },
    ],
  },

  'html-web-dev-fundamentals:note-2': {
    intro:
      'HTML forms and structured data tables bridge passive web reading with real user interaction and organized tabular reporting. Building them accessibly ensures mobile shoppers, keyboard navigators, and screen-reader users complete registrations and inspect schedules without confusion.',
    learningObjectives: [
      'Construct valid two-dimensional data tables using `<caption>`, `<thead>`, `<tbody>`, `<th scope>`, and `<td>`.',
      'Pair every `<input>`, `<select>`, and `<textarea>` explicitly using matching `<label for="...">` and `id` attributes.',
      'Choose semantic HTML5 input types (`email`, `tel`, `date`, `number`) to trigger smart mobile keyboards and pre-submit checks.',
      'Group related radio buttons and checkboxes clearly with `<fieldset>` and `<legend>`.',
    ],
    detailedExplanation:
      'HTML tables and forms are two of the most frequently misused constructs on the web. In early web design, tables were abused to position columns across layouts—a habit that confuses assistive technologies. Modern HTML reserves `<table>` strictly for relational grids (timetables, fee breakdowns, mark sheets) where row and column headers give meaning to each cell via `scope="col"` or `scope="row"`.\n\nFor user input, every interactive control needs both a programmatic `name` (sent as the key when submitted to a backend) and an explicit `<label for="control-id">`. Never replace visible labels with `placeholder` hints, because placeholders vanish as soon as a learner begins typing and are unreliable across screen readers.\n\nHTML5 also ships built-in constraint validation attributes (`required`, `minlength`, `maxlength`, `min`, `max`, `pattern`). While client-side attributes give instant beginner-friendly feedback before network requests happen, production backends always validate submitted form payloads again on the server.',
    keyConcepts:
      '- **`<th scope="col">` / `scope="row"`**: Identifies whether a table header cell describes a vertical column or horizontal row for assistive tools.\n- **`<label for="...">`**: Binds visible descriptive text to an input’s `id`, enlarging click targets and reading prompt labels aloud.\n- **Fieldset & Legend**: Semantic containers (`<fieldset>` with `<legend>`) grouping related controls such as payment preferences or track selection.\n- **`name` Attribute**: The exact payload key sent by the browser when a form submits—without `name`, an input value is omitted.\n- **Native Constraint Validation**: Browser-enforced input checks (`required`, `type="email"`, `minlength`) running prior to form submission.',
    stepByStepExplanation:
      'Step 1: Wrap table headers inside `<thead>` and data rows inside `<tbody>`, adding `<th scope="col">` to every column heading.\nStep 2: Open `<form action="..." method="POST">` and wrap logical form sections inside `<fieldset><legend>...</legend></fieldset>`.\nStep 3: For each field, write `<label for="unique-id">Field Name</label>` paired with matching `id="unique-id"` and `name="fieldKey"`.\nStep 4: Pick tailored input types (`type="email"`, `type="tel"`, `type="date"`) so phones display matching keyboards.\nStep 5: Apply constraint attributes (`required`, `minlength="2"`, `maxlength="120"`) and finish with `<button type="submit">`.',
    summary:
      'Accessible tables use `<thead>`, `<tbody>`, and `scope` strictly for tabular records, while accessible forms pair every control with explicit `<label for>`, `<fieldset>`, semantic input types, and constraint validation.',
    revisionChecklist: [
      'Always use `<caption>`, `<thead>`, `<tbody>`, and `<th scope>` for real data tables.',
      'Every `<input>`, `<select>`, and `<textarea>` needs a visible `<label for="...">` plus a `name` attribute.',
      'Use `<fieldset>` + `<legend>` to give radio and checkbox groups clear context.',
      'Remember client-side HTML validation improves UX, while server validation protects security.',
    ],
    practiceExerciseExtra:
      'Extend the enrollment form into a two-section portal: Section 1 (`<fieldset><legend>Personal Details</legend>`) and Section 2 (`<fieldset><legend>Program Schedule</legend>`) plus a 3-column HTML schedule table.',
    fiveQuestions: [
      {
        question: 'Why must a form field include a `name` attribute in addition to its `id`?',
        answer:
          '`id` connects `<label for="...">` and client scripts in the DOM, whereas `name` supplies the key under which the browser packages and submits the field’s value to the server.',
      },
      {
        question: 'Why is placeholder text alone never an acceptable substitute for `<label>`?',
        answer:
          'Placeholders disappear immediately once a user begins typing, offer lower visual contrast, and are not reliably announced by all screen readers.',
      },
      {
        question: 'What role do `<th scope="col">` and `<th scope="row">` play in an HTML table?',
        answer:
          'They explicitly associate each column or row header with its corresponding `<td>` data cells so screen-reader users understand which category a cell belongs to.',
      },
      {
        question: 'When should `<fieldset>` and `<legend>` be used inside a form?',
        answer:
          'Whenever grouping logically related controls—especially radio button groups, multi-option checkboxes, or distinct address/contact sections—so assistive users hear the group prompt automatically.',
      },
      {
        question: 'If an HTML form already uses `required` and `type="email"`, why must the server still validate inputs?',
        answer:
          'Browser HTML attributes can be bypassed easily via developer tools or direct HTTP clients; authoritative integrity and security checks always happen server-side.',
      },
    ],
  },

  'html-practical-website-dev:note-1': {
    intro:
      'Real institutional portals consist of interconnected folders of HTML pages, shared stylesheets, and media assets rather than one isolated file. Mastering multi-page folder architecture and relative path resolution prevents broken links and missing images across environments.',
    learningObjectives: [
      'Organize HTML pages, stylesheets, and assets into predictable multi-folder directories.',
      'Write clean relative file paths using `.`, `..`, and root-relative links without hardcoding `C:\\Users\\...` paths.',
      'Set active-page accessibility cues (`aria-current="page"`) inside shared site navigation.',
      'Structure clean reusable HTML headers, skip-to-content links, and multi-column institutional footers.',
    ],
    detailedExplanation:
      'Beginners frequently write HTML works locally that collapse completely once uploaded to a web server because their file paths point to local computer folders (`C:/Users/Name/Desktop/logo.png`) or forget subdirectory offsets.\n\nRelative path resolution works cleanly from the current HTML file’s location: `./` references a sibling file in the same folder, `assets/logo.png` drills down into a child folder, and `../` steps up one parent directory level. Understanding how a browser resolves `../assets/styles.css` from `/pages/about.html` up to the root and back down into `/assets/` guarantees consistent navigation both locally and on production web hosts.\n\nAcross multi-page websites, consistent `<header>`, `<nav>`, and `<footer>` structures minimize learner disorientation. Adding a visually hidden "Skip to main content" link plus `aria-current="page"` on the active navigation anchor fulfills top-tier WCAG usability standards using pure semantic HTML.',
    keyConcepts:
      '- **Relative Path (`./` and `../`)**: A URL computed relative to the folder containing the active HTML file (`..` moves up one parent directory).\n- **Document Root**: The top-level folder (`index.html` home) served when visitors open a website’s bare domain.\n- **`aria-current="page"`**: Accessibility attribute informing screen readers which link inside `<nav>` represents the currently open page.\n- **Skip Navigation Link**: An anchor (`<a href="#main-content">Skip to main content</a>`) allowing keyboard users to bypass repetitive top menus.\n- **Canonical URL / Metadata Hygiene**: Consistent `<head>` configuration across subpages preventing duplicate indexing errors.',
    stepByStepExplanation:
      'Step 1: Create a clean root folder containing `index.html`, `/pages/` for subpages (`about.html`, `courses.html`, `contact.html`), and `/assets/` for images/CSS.\nStep 2: From root `index.html`, link pages using `href="pages/courses.html"`.\nStep 3: From inside `pages/courses.html`, link home using `href="../index.html"` and images via `src="../assets/crest.png"`.\nStep 4: Place `aria-current="page"` strictly on the current active navigation link on each HTML file.\nStep 5: Verify every relative link by clicking across all pages cleanly from a local static server.',
    summary:
      'Clean folder layouts, accurate `../` relative paths, and consistent `<nav>` semantics with `aria-current="page"` allow multi-page HTML sites to deploy reliably anywhere without broken assets.',
    revisionChecklist: [
      'Never embed local machine file paths (`file:///C:/...`) inside `href` or `src`.',
      'Use `../` to step up one folder level when subpages inside `/pages/` reference root `/assets/`.',
      'Mark the open page’s nav link with `aria-current="page"` for keyboard/screen-reader clarity.',
      'Maintain identical header/footer landmarks across all site pages.',
    ],
    practiceExerciseExtra:
      'Map out a 5-file directory tree (`index.html`, `pages/admissions.html`, `pages/faq.html`, `assets/crest.png`, `assets/brochure.pdf`) and write exact `<a href>` paths connecting `faq.html` back to `admissions.html`, `index.html`, and `brochure.pdf`.',
    fiveQuestions: [
      {
        question: 'If `courses.html` lives inside `/pages/` and `logo.png` lives inside `/assets/`, what relative `src` loads the image inside `courses.html`?',
        answer:
          '`src="../assets/logo.png"`, because `../` exits `/pages/` up to the project root before descending into `/assets/`.',
      },
      {
        question: 'Why do hardcoded links such as `C:/Users/Student/Desktop/site/about.html` fail once hosted online?',
        answer:
          'Online visitors’ browsers cannot read private folders on the developer’s personal hard drive; paths must resolve cleanly inside the hosted web folder.',
      },
      {
        question: 'What is the purpose of `aria-current="page"` on a navigation link?',
        answer:
          'It programmatically identifies which menu link corresponds to the active page being read so assistive-tech users do not re-select the page they are already on.',
      },
      {
        question: 'Why place a `<a href="#main-content">Skip to main content</a>` link near the top of `<body>`?',
        answer:
          'It allows keyboard-only and screen-reader visitors to jump straight past 10+ navigation links directly to the page’s primary content on Tab press.',
      },
      {
        question: 'Why does every major folder on a static website default to containing an `index.html` file?',
        answer:
          'Web servers automatically serve `index.html` when a visitor requests a directory URL (like `/` or `/courses/`), keeping URLs clean and readable.',
      },
    ],
  },

  'html-practical-website-dev:note-2': {
    intro:
      'Modern HTML5 delivers interactive disclosures, searchable input suggestions, responsive multi-resolution image selection, and SEO/social `<head>` metadata natively—no heavy scripting required.',
    learningObjectives: [
      'Implement accessible collapsible FAQ accordions natively using `<details>` and `<summary>`.',
      'Pair text inputs with native autocomplete lists via `<datalist>` without breaking arbitrary user input.',
      'Deliver bandwidth-smart responsive visuals using `<picture>`, `<source media>`, and `srcset` attributes.',
      'Author essential `<meta name="description">`, OpenGraph (`og:*`), and SEO tags inside `<head>`.',
    ],
    detailedExplanation:
      'Before reaching for heavy JavaScript libraries for simple UI widgets, strong HTML developers inspect native browser capabilities first. `<details>` and `<summary>` create keyboard-accessible, screen-reader-announced expandable FAQ items out of the box—handling focus states, Enter/Space toggles, and expanded/collapsed states automatically.\n\nSimilarly, `<datalist>` attaches non-restrictive autocomplete hints directly to an `<input list="...">` control, improving speed on course or city searches while still accepting custom entries (unlike rigid `<select>` dropdowns).\n\nFor imagery, `<picture>` lets developers swap artwork crops cleanly across mobile vs desktop breakpoints via `<source media="(min-width: 768px)">`, while `srcset` lets browsers pick crisp 1x vs 2x Retina resolutions—preserving mobile bandwidth without sacrificing visual sharpness.',
    keyConcepts:
      '- **`<details>` & `<summary>`**: Native expandable disclosure pair creating accessible accordions without external scripts.\n- **`<datalist>`**: Provides suggested autocomplete options linked to an input via `list="id"` while permitting custom typing.\n- **`<picture>` & `srcset`**: Responsive image container enabling art-direction crops and high-DPI asset selection.\n- **`loading="lazy"`**: Defers downloading off-screen images until the reader scrolls near them, boosting initial page load speed.\n- **OpenGraph Meta Tags**: `<meta property="og:title">` and `<meta property="og:description">` tags controlling rich link preview cards.',
    stepByStepExplanation:
      'Step 1: Enclose each FAQ question in `<summary>` directly inside `<details>` (adding `open` only on the first key item).\nStep 2: Link an `<input list="tracks" />` to `<datalist id="tracks">` populated with `<option value="...">` items.\nStep 3: Wrap responsive hero visuals in `<picture>` with wide desktop `<source media="(min-width: 768px)">` before a fallback `<img>` with `alt`, `width`, `height`, and `loading="lazy"` on lower images.\nStep 4: Complete `<head>` with `<meta name="description">`, `<meta property="og:title">`, and `<meta property="og:description">`.',
    summary:
      'Native HTML5 elements (`<details>`, `<datalist>`, `<picture>`) and thorough `<head>` SEO/OpenGraph tags build fast, accessible, responsive web pages cleanly with minimal overhead.',
    revisionChecklist: [
      'Never wrap an `<img />` hero above-the-fold with `loading="lazy"` (reserve lazy loading for below-the-fold images).',
      'Always include an unconditional `<img>` with `alt` inside `<picture>` as the rendered fallback.',
      'Choose `<datalist>` when users may type custom values; choose `<select>` when choices are strictly fixed.',
      'Include descriptive `<title>` and `<meta name="description">` on every published page.',
    ],
    practiceExerciseExtra:
      'Create a 3-item native `<details>` Admission FAQ block paired with a `<datalist>` track finder and a responsive `<picture>` banner with desktop & mobile sources.',
    fiveQuestions: [
      {
        question: 'How does `<datalist>` differ behaviorally from `<select>`?',
        answer:
          '`<select>` restricts the user strictly to choosing one listed option, whereas `<datalist>` offers helpful autocomplete dropdown hints while still allowing custom typed values.',
      },
      {
        question: 'Why must a `<picture>` block always end with a standard `<img>` tag?',
        answer:
          'The `<source>` tags supply candidate image URLs and conditions, while the inner `<img>` element is what the browser actually paints into the DOM and reads `alt` text from.',
      },
      {
        question: 'When should `loading="lazy"` NOT be added to an `<img>` tag?',
        answer:
          'Avoid `loading="lazy"` on critical above-the-fold hero images or logos so the browser prioritizes painting them immediately on first load.',
      },
      {
        question: 'What accessibility advantage does `<details>`/`<summary>` offer over a custom clickable `<div>` accordion?',
        answer:
          'Browsers handle keyboard Enter/Space toggling, tab focusability, and expanded/collapsed assistive announcements natively with zero extra ARIA plumbing.',
      },
      {
        question: 'What role do `<meta property="og:title">` and `<meta property="og:description">` serve?',
        answer:
          'They control how messaging apps and social platforms display a website’s preview card headline and summary when a student or coordinator shares the URL.',
      },
    ],
  },

  'java-beginner-to-advanced:note-1': {
    intro:
      'Java combines strict compile-time type safety with cross-platform portability across operating systems. Understanding the JDK compilation pipeline, JVM bytecode execution, primitive vs reference types, and structured control flow builds a rock-solid foundation for enterprise Java engineering.',
    learningObjectives: [
      'Trace how `.java` source code compiles via `javac` into `.class` bytecode executed by the JVM.',
      'Distinguish primitive value types (`int`, `double`, `boolean`) from reference objects (`String`).',
      'Compare `String` values safely using `.equals()` rather than reference comparison (`==`).',
      'Avoid integer division bugs and select appropriate `if`/`else`, `switch`, and loop constructs.',
    ],
    detailedExplanation:
      'Unlike purely interpreted scripting languages, Java separates compilation from runtime execution. When you run `javac StudentGrade.java`, the compiler verifies syntax, checks every variable’s declared type, and emits platform-neutral bytecode (`.class`). The Java Virtual Machine (JVM) on Windows, macOS, or Linux then executes and Just-In-Time (JIT) optimizes that bytecode natively.\n\nUnderstanding Java’s two data categories prevents early bugs. Primitives (`int`, `long`, `double`, `boolean`, `char`) store exact raw values in memory directly. Reference types (`String`, arrays, custom objects) store memory references to heap objects—which is why comparing two `String` inputs with `==` tests whether they sit at the same memory address rather than checking identical characters! Always compare strings via `.equals(...)`.\n\nWatch arithmetic types carefully: `85 / 100` performs integer division and truncates to `0`, whereas `(double) 85 / 100` evaluates cleanly to `0.85`.',
    keyConcepts:
      '- **JDK / JRE / JVM**: JDK supplies development tools (`javac`, debugger); JVM executes compiled `.class` bytecode cleanly across operating systems.\n- **Static Typing**: Every variable’s type is checked at compile time before the program ever starts running.\n- **Primitive vs Reference Type**: Primitives (`int`, `double`, `boolean`) hold direct values; references (`String`, objects) point to heap instances.\n- **Integer Division Truncation**: Dividing two `int` operands drops the fractional remainder (`9 / 2 == 4`) unless cast to `double`.\n- **Bytecode (`.class`)**: Portable intermediate instruction set enabling Java’s "Write Once, Run Anywhere" execution.',
    stepByStepExplanation:
      'Step 1: Ensure the public class name matches the exact filename (`GradeReport.java` -> `public class GradeReport`).\nStep 2: Define `public static void main(String[] args)` as the JVM entry point.\nStep 3: Declare variables with explicit, fit-for-purpose types (`int` counts, `double` averages, `String` names).\nStep 4: Guard arithmetic denominators (`count > 0`) and cast `int` numerators to `(double)` before computing ratios.\nStep 5: Compile cleanly via `javac GradeReport.java` and run with `java GradeReport`.',
    summary:
      'Java’s `javac` -> `.class` bytecode -> JVM workflow catches type mistakes early while enforcing clear `.equals()` string checks and explicit numeric conversions.',
    revisionChecklist: [
      'Match public class names identically to `.java` filenames.',
      'Always use `.equals()` (never `==`) when comparing `String` contents.',
      'Cast `(double)` before dividing two integers when fractional averages matter.',
      'Use `Scanner` carefully and close or manage resources cleanly.',
    ],
    practiceExerciseExtra:
      'Write a Java console evaluator accepting 5 exam scores into an `int[]` array, guarding against division by zero, printing the `double` average, highest score, and Pass/Merit tier.',
    fiveQuestions: [
      {
        question: 'What is the difference between `javac` and `java` on the command line?',
        answer:
          '`javac` compiles `.java` source code into `.class` bytecode and checks type errors; `java` launches the JVM to execute that compiled bytecode.',
      },
      {
        question: 'Why does `"Java" == new String("Java")` evaluate to `false` even though the letters match?',
        answer:
          '`==` on reference types checks whether both variables point to the exact same object address in memory rather than comparing text characters (`a.equals(b)`).',
      },
      {
        question: 'What does `int pct = 45 / 50 * 100;` evaluate to in Java, and why?',
        answer:
          '`0`! Because `45 / 50` divides two `int` values first, truncating `0.9` to `0`, and `0 * 100` remains `0`. Multiply or cast to `double` first: `(45.0 / 50) * 100`.',
      },
      {
        question: 'How does a `for` loop differ from a `while` loop in typical Java programs?',
        answer:
          '`for` loops suit known counts or array indices cleanly, while `while` loops handle condition-driven repetition such as reading input until a sentinel appears.',
      },
      {
        question: 'Why does Java store decimal currency or high-precision ratios differently from raw `int`?',
        answer:
          '`int` cannot hold fractional parts (`0.75`); `double` handles floating-point calculations, and `BigDecimal` prevents binary rounding drift in financial ledgers.',
      },
    ],
  },

  'java-beginner-to-advanced:note-2': {
    intro:
      'Real-world Java applications process dynamic collections of learners, orders, and records whose size changes at runtime—and must survive missing keys or corrupted files gracefully via `try-catch` exception handling.',
    learningObjectives: [
      'Choose `ArrayList<T>` over fixed arrays for dynamically growing lists and `HashMap<K, V>` for O(1) key lookups.',
      'Guard `map.get(key)` calls safely using `getOrDefault` or `containsKey` to prevent `NullPointerException`.',
      'Catch specific checked exceptions (like `IOException`) with `try-with-resources` rather than swallowing broad `Exception`.',
      'Maintain clean collection iteration without causing `ConcurrentModificationException`.',
    ],
    detailedExplanation:
      'Standard Java arrays (`String[]`) lock their capacity permanently at creation time. Whenever an application dynamically adds new enrollments, logs, or tasks, `ArrayList<T>` resizes its backing array automatically while preserving positional ordering and generics type safety.\n\nWhen looking up records by unique ID, student email, or category label, scanning a whole `ArrayList` linearly slows down on large datasets. `HashMap<K, V>` hashes keys directly to buckets so `.get(key)` resolves almost instantly regardless of collection size. Note that collections store object wrapper types (`Integer`, `Double`) rather than raw primitives (`int`).\n\nProduction Java code pairs collections with disciplined exception safety. Always use `try-with-resources` (`try (BufferedReader br = ...)`) when opening files or streams so handles close automatically even when errors strike, and catch specific failures (`FileNotFoundException`, `NumberFormatException`) cleanly rather than silently catching everything.',
    keyConcepts:
      '- **`ArrayList<T>`**: Resizable, type-safe ordered list replacing rigid fixed arrays for dynamic collections.\n- **`HashMap<K, V>`**: Key-value hash structure supporting near-constant-time (`O(1)`) lookups by key.\n- **Checked Exception**: Compile-time-enforced error condition (e.g., `IOException`) that callers must catch or declare.\n- **`try-with-resources`**: Automated resource block closing `AutoCloseable` files/streams safely upon completion or exception.\n- **`getOrDefault(key, fallback)`**: Safe `HashMap` lookup returning a sensible default instead of `null` when a key is absent.',
    stepByStepExplanation:
      'Step 1: Import `java.util.*` (or explicit `ArrayList`, `HashMap`) and `java.nio.file.*`.\nStep 2: Instantiate typed collections cleanly (`List<String> names = new ArrayList<>();`, `Map<String, Integer> counts = new HashMap<>();`).\nStep 3: Accumulate tallies concisely with `counts.merge(key, 1, Integer::sum)` or `counts.getOrDefault(key, 0) + 1`.\nStep 4: Wrap file reads inside `try (BufferedReader reader = Files.newBufferedReader(path))`.\nStep 5: Catch specific exceptions (`IOException | NumberFormatException`) and return contextual error diagnostics.',
    summary:
      '`ArrayList` and `HashMap` provide fast, type-safe dynamic storage in Java, while specific `try-catch` and `try-with-resources` blocks keep file and data operations resilient.',
    revisionChecklist: [
      'Declare collections via interfaces (`List<T>`, `Map<K, V>`) initialized with concrete classes (`ArrayList<>`, `HashMap<>`).',
      'Use `Integer` / `Double` wrapper classes inside generic `<...>` collections.',
      'Prefer `getOrDefault()` over unchecked `.get()` arithmetic that triggers `NullPointerException`.',
      'Always close files via `try-with-resources` and avoid empty `catch (Exception e) {}` blocks.',
    ],
    practiceExerciseExtra:
      'Build a Java `AttendanceRegister` using `HashMap<String, Integer>` to count student check-ins safely, catching malformed lines without crashing mid-file.',
    fiveQuestions: [
      {
        question: 'When should you pick a `HashMap<String, Integer>` instead of an `ArrayList<String>`?',
        answer:
          'Pick `HashMap` when you repeatedly look up, update, or deduplicate records by a unique identifier or category key; pick `ArrayList` when positional order matters.',
      },
      {
        question: 'Why does `ArrayList<int>` fail to compile in Java, and what fixes it?',
        answer:
          'Java generics require reference/object types, not primitives. Replacing `int` with its wrapper class `Integer` (`ArrayList<Integer>`) compiles cleanly.',
      },
      {
        question: 'What bug prevents `map.get("Python") + 1` from running safely if `"Python"` has never been inserted?',
        answer:
          '`map.get("Python")` returns `null`, and unboxing `null` to add `1` throws a `NullPointerException`. Use `map.getOrDefault("Python", 0) + 1` instead.',
      },
      {
        question: 'What key guarantee does `try (BufferedReader br = ...)` provide over a plain `try` block?',
        answer:
          'Java automatically closes `br` when the `try` block finishes—even if an exception occurs inside—preventing leaked OS file descriptors.',
      },
      {
        question: 'Why is an empty `catch (Exception ignored) {}` block considered a serious engineering defect?',
        answer:
          'It silently hides missing files, broken permissions, or logic bugs, causing downstream failures with zero trace of the root cause.',
      },
    ],
  },

  'java-oop:note-1': {
    intro:
      'Object-Oriented Programming (OOP) models software around cohesive domain entities rather than scattered global variables. Encapsulation, constructors, validation invariants, and immutability ensure objects can never enter invalid states.',
    learningObjectives: [
      'Protect internal object state with `private` fields and controlled public behavior methods.',
      'Enforce domain invariants immediately inside constructors and mutator methods.',
      'Distinguish true domain behavior methods from redundant blind getters/setters.',
      'Design immutable value objects (`private final` fields) when data should remain tamper-proof.',
    ],
    detailedExplanation:
      'When beginners learn OOP, they often make fields `public` or blindly auto-generate setters for every attribute—turning classes into thin wrappers around unprotected structs where any external code can set `balance = -500` or `grade = 140`.\n\nTrue **Encapsulation** hides raw data representation (`private`) and exposes meaningful operations (`deposit(amount)`, `completeLesson(id)`) that protect business rules—known as **invariants**—under every circumstance. Constructors guarantee that the moment an object exists (`new CourseEnrollment(...)`), it starts valid.\n\nFor reference types like `List` or `Date` stored inside a class, returning the raw internal list directly breaks encapsulation because callers could `.clear()` it! Return `List.copyOf(items)` (a defensive unmodifiable copy) so internal invariants stay airtight.',
    keyConcepts:
      '- **Encapsulation**: Bundling private fields alongside methods that enforce rules, hiding raw representation from external mutation.\n- **Invariant**: A rule that must always hold true across an object’s lifetime (e.g., `0 <= progress <= 100`).\n- **Constructor Validation**: Verifying arguments right inside `public ClassName(...)` and throwing `IllegalArgumentException` on invalid values.\n- **Defensive Copy**: Returning `List.copyOf(...)` so callers cannot mutate internal collections behind the object’s back.\n- **Immutability (`final`)**: Preventing fields from being reassigned after construction, eliminating accidental aliasing bugs.',
    stepByStepExplanation:
      'Step 1: Mark all instance fields `private` (and `final` wherever reassignment isn’t needed).\nStep 2: Validate every input parameter at the top of the constructor using clear `IllegalArgumentException` checks.\nStep 3: Replace generic setters (`setBalance`) with intention-revealing domain methods (`withdraw`, `awardMarks`).\nStep 4: Return defensive copies (`List.copyOf(...)`) on collection accessors.\nStep 5: Override `toString()` cleanly for clear logging without leaking sensitive internal credentials.',
    summary:
      'Encapsulation safeguards object invariants through `private` fields, strict constructors, intention-revealing methods, and defensive copies.',
    revisionChecklist: [
      'Never leave mutable fields `public` in domain classes.',
      'Enforce valid bounds inside constructors AND any mutating methods.',
      'Return `List.copyOf(list)` instead of raw mutable internal lists.',
      'Prefer immutable `private final` value objects (`record` or `final` fields) for IDs and money/scores.',
    ],
    practiceExerciseExtra:
      'Refactor an exposed `StudentProfile` class (with public mutable `gpa` and `List<String> courses`) into an encapsulated class enforcing `0.0 <= gpa <= 10.0` and defensive copying.',
    fiveQuestions: [
      {
        question: 'Why does making every field `private` AND adding public getters/setters for all fields still weaken encapsulation?',
        answer:
          'Blind setters allow external callers to inject arbitrary invalid states directly instead of going through domain methods that enforce invariants.',
      },
      {
        question: 'What happens if a class returns its raw internal `ArrayList` inside a getter method?',
        answer:
          'Callers can call `.add()` or `.clear()` on the returned list, bypassing class validation and corrupting internal state.',
      },
      {
        question: 'What is a class invariant, and where should it first be verified?',
        answer:
          'An invariant is a condition that must always be true (e.g., positive quantity). It must be checked right inside the constructor when the object is built.',
      },
      {
        question: 'Why does marking class fields `final` simplify debugging in larger Java teams?',
        answer:
          'Immutable objects cannot change unexpectedly after construction, preventing subtle aliasing bugs across shared references and threads.',
      },
      {
        question: 'What exception is idiomatic in Java when a constructor receives an out-of-range argument?',
        answer:
          '`IllegalArgumentException` (or `Objects.requireNonNull` / `NullPointerException` for null checks) with a clear descriptive message.',
      },
    ],
  },

  'java-oop:note-2': {
    intro:
      'Large software systems evolve smoothly without massive `if-else` chains when engineered around interfaces, runtime polymorphism, and composition rather than fragile deep inheritance hierarchies.',
    learningObjectives: [
      'Implement runtime polymorphism using Java `interface` contracts and `@Override` methods.',
      'Explain why "Composition over Inheritance" prevents rigid class hierarchies.',
      'Distinguish when to choose an `interface` (capability contract) vs an `abstract class` (shared base state).',
      'Keep `@Override` annotations active so the compiler catches accidental signature mismatches.',
    ],
    detailedExplanation:
      'Beginner OOP developers often over-apply `extends` ("Inheritance") to reuse a couple lines of helper code, tying child classes tightly to every quirk of their parent class. Worse, Java only allows extending ONE class—so deep inheritance chains fracture whenever requirements overlap.\n\n**Interfaces** and **Polymorphism** solve this cleanly. An interface defines *what capability* a component provides (e.g., `GradeCalculator` with `double calculate(int score)`) without dictating *how* every concrete implementation computes it. Calling code accepts the `GradeCalculator` interface and invokes `calc.calculate(score)`—and at runtime, the JVM dispatches the exact implementation seamlessly.\n\n**Composition** ("has-a") swaps behavior dynamically by passing an interface object into a constructor rather than baking logic permanently into subclasses.',
    keyConcepts:
      '- **Polymorphism**: Treating distinct implementations uniformly through one shared parent or interface type.\n- **Interface Contract**: Pure behavioral blueprint (`interface`) supporting multiple capabilities cleanly on any class.\n- **Abstract Class**: Partial template sharing protected state or default helper methods across closely related subclasses.\n- **Composition (`has-a`)**: Wiring collaborator interfaces inside a class via constructor injection instead of rigid `extends` subclassing.\n- **`@Override` Annotation**: Compiler safeguard verifying a subclass/interface method actually overrides an existing parent signature.',
    stepByStepExplanation:
      'Step 1: Identify varying behavior (such as notification channels or discount policies) and extract an `interface`.\nStep 2: Create small focused concrete classes implementing that `interface` with `@Override`.\nStep 3: Inject the interface dependency cleanly into the service class constructor (Composition).\nStep 4: Iterate or dispatch purely against the interface type—zero `instanceof` branching needed.\nStep 5: Add new implementations later without editing tested orchestrator classes.',
    summary:
      'Polymorphic `interface` contracts paired with constructor-injected composition deliver extensible Java architectures without brittle inheritance chains.',
    revisionChecklist: [
      'Always annotate overridden methods with `@Override`.',
      'Model "is-a" strictly with caution; prefer "has-a" composition via interfaces for flexible behaviors.',
      'Never use long `if (obj instanceof ...)` chains where polymorphic dispatch fits.',
      'Use `interface` for capability contracts (classes can implement many) and `abstract class` sparingly for shared state.',
    ],
    practiceExerciseExtra:
      'Design a `NotificationChannel` interface (`EmailChannel`, `SmsChannel`, `InAppChannel`) composed inside an `EnrollmentNotifier` service so adding a new channel requires zero edits to `EnrollmentNotifier`.',
    fiveQuestions: [
      {
        question: 'Why does Java allow a class to `implements` multiple interfaces while only permitting one `extends` superclass?',
        answer:
          'Multiple inheritance of stateful classes causes diamond-ambiguity conflicts on fields, whereas interfaces define clean capability contracts with minimal conflict.',
      },
      {
        question: 'What bug can occur silently if a developer omits `@Override` when refining a method?',
        answer:
          'A slight typo in parameter types creates a brand-new overloaded method instead of overriding the parent method, silently breaking runtime polymorphism.',
      },
      {
        question: 'Contrast "Composition" vs "Inheritance" in one practical Java example.',
        answer:
          'Composition gives a `CourseService` a `GradingPolicy` field via constructor injection (swappable at runtime), whereas Inheritance forces separate `PercentCourseService` and `PassFailCourseService` subclasses.',
      },
      {
        question: 'When is an `abstract class` genuinely preferable over an `interface`?',
        answer:
          'When tightly related domain classes legitimately share protected constructor logic, non-constant fields, and template-method skeletons.',
      },
      {
        question: 'Why do large `if (x instanceof SubA) ... else if (x instanceof SubB)` blocks violate OOP design?',
        answer:
          'Every time a new subclass is added, callers break and must be edited. Placing the method cleanly on the shared interface dispatches automatically via polymorphism.',
      },
    ],
  },

  'java-advanced:note-1': {
    intro:
      'Modern Java (Java 8+) transforms verbose nested collection loops into declarative, readable `Stream` pipelines paired with bounded Generics and `Optional` null-safety containers.',
    learningObjectives: [
      'Write expressive `Stream` pipelines combining `.filter()`, `.map()`, `.sorted()`, and `.collect()` cleanly.',
      'Differentiate lazy intermediate operations from terminal collectors.',
      'Replace error-prone raw `null` return values cleanly with `Optional<T>` methods (`orElse`, `map`, `orElseThrow`).',
      'Enforce reusable type safety with bounded Generics (`<T extends Comparable<T>>`).',
    ],
    detailedExplanation:
      'Traditional imperative Java code mixes *what* data rule you want (filter active enrollees, extract emails, sort alphabetically) inside nested `for` loops and temporary `ArrayList` variables.\n\nThe **Java Streams API** separates data traversal mechanics cleanly from business logic. A stream pipeline wraps a source (`list.stream()`), chains **lazy intermediate operations** (`filter`, `map`, `distinct`)—which process nothing until needed—and ends cleanly in one **terminal operation** (`toList()`, `count()`, `collect(Collectors.groupingBy(...))`). Crucially, a `Stream` never mutates its underlying collection and can only be consumed once.\n\nAlongside Streams, **Generics** eliminate unsafe `Object` casts at compile time, and **`Optional<T>`** forces callers of lookup methods to handle missing results explicitly via `.orElse(...)` or `.map(...)` rather than crashing unexpectedly with `NullPointerException`.',
    keyConcepts:
      '- **Stream Pipeline**: Single-use sequence of source -> lazy intermediate transforms -> terminal reduction/collection.\n- **Pure Lambda**: Short anonymous function passed to `filter`/`map` that avoids mutating shared external lists.\n- **`Optional<T>`**: Explicit return container indicating a lookup result may be absent—never leave `Optional.get()` unguarded.\n- **Collectors (`Collectors.groupingBy`)**: Terminal reducers building `Map`, `List`, or summary statistics cleanly.\n- **Bounded Type Parameter (`<T extends Number>`)**: Generic constraint enabling shared methods across subclasses safely.',
    stepByStepExplanation:
      'Step 1: Start from any collection with `.stream()` (keep pipelines pure—do not mutate external variables inside lambdas).\nStep 2: Apply `.filter(...)` early to discard irrelevant records before expensive `.map(...)` work.\nStep 3: Transform types cleanly with `.map(...)` or method references (`Student::getEmail`).\nStep 4: Close with `.toList()` or `.collect(Collectors.groupingBy(...))`.\nStep 5: Return `Optional<T>` from single-item searches and unwrap safely with `.orElseThrow()` or `.orElse(...)`.',
    summary:
      'Java Streams, Bounded Generics, and `Optional` replace boilerplate mutation loops and unsafe null checks with concise, compiler-verified pipelines.',
    revisionChecklist: [
      'Streams are single-use and non-mutating: never reuse a consumed Stream reference.',
      'Avoid unguarded `.get()` on `Optional`; use `.orElse()`, `.orElseGet()`, or `.orElseThrow()`.',
      'Prefer `stream().filter().map().toList()` over mutating an external `ArrayList` inside `.forEach()`.',
      'Use `Optional` strictly as a method return type, not for DTO fields or method parameters.',
    ],
    practiceExerciseExtra:
      'Given a `List<CourseRecord>`, build one Stream pipeline that filters `published` courses, groups counts by `department`, and prints an `Optional` lookup for `"java-advanced"` cleanly.',
    fiveQuestions: [
      {
        question: 'Why does nothing execute if you write `list.stream().filter(...).map(...)` without a terminal operation?',
        answer:
          'Intermediate operations (`filter`, `map`) are lazy; a Stream only pulls elements through the pipeline when a terminal operation (such as `.toList()`, `.count()`, or `.findFirst()`) runs.',
      },
      {
        question: 'What runtime error happens if you call `.filter()` a second time on an already-collected `Stream` variable?',
        answer:
          '`IllegalStateException: stream has already been operated upon or closed`—streams are single-pass flows rather than reusable storage.',
      },
      {
        question: 'Why should developers avoid `optional.get()` without checking `isPresent()`?',
        answer:
          'Calling `.get()` on an empty `Optional` throws `NoSuchElementException`, defeating null safety. Use `.orElse()`, `.map()`, or `.orElseThrow(...)`.',
      },
      {
        question: 'Why is mutating an outside `ArrayList` inside `stream.forEach(...)` considered bad practice?',
        answer:
          'Side-effect mutations break functional clarity and cause race-condition corruption if converted to a parallel stream. Collect directly with `.toList()` or `.collect()`.',
      },
      {
        question: 'How does `<T extends Comparable<T>>` improve a generic `findMax` utility method?',
        answer:
          'It constrains `T` strictly to types supporting `.compareTo()`, letting the compiler guarantee comparison works cleanly while keeping full type safety.',
      },
    ],
  },

  'java-advanced:note-2': {
    intro:
      'Production Java backends handle thousands of concurrent requests and background I/O jobs simultaneously. Safely orchestrating thread pools (`ExecutorService`) while preventing shared-memory race conditions is vital for reliable systems.',
    learningObjectives: [
      'Manage background work using bounded `ExecutorService` thread pools rather than spawning unbounded raw threads.',
      'Identify shared mutable state bugs (Read-Modify-Write race conditions) accurately.',
      'Choose `AtomicInteger`, `ConcurrentHashMap`, or tight synchronization cleanly to protect shared counters.',
      'Shut down thread pools cleanly (`shutdown()` + `awaitTermination()`) and handle `InterruptedException` responsibly.',
    ],
    detailedExplanation:
      'Creating a raw `new Thread(...)` for every incoming task exhausts operating-system memory and thrashes CPU context switching under sudden traffic bursts. `ExecutorService` decouples task submission from thread creation using a fixed pool of reusable worker threads.\n\nEven with clean thread pools, sharing mutable data across threads introduces subtle bugs. An apparently simple `count++` actually executes three distinct hardware steps: Read `count`, Add `1`, and Write back. Two threads executing concurrently can both read `5`, both write `6`, and silently drop an increment (**race condition**).\n\nEliminate race conditions using immutable data, thread-safe lock-free primitives (`AtomicInteger`, `LongAdder`), thread-safe collections (`ConcurrentHashMap` with `.merge()`), or narrow `synchronized` blocks. Always keep pools bounded and gracefully terminate executors on service shutdown.',
    keyConcepts:
      '- **`ExecutorService`**: Managed pool reusing bounded worker threads cleanly across submitted `Runnable`/`Callable` tasks.\n- **Race Condition**: Timing-dependent data corruption caused when multiple threads read and mutate shared state uncoordinated.\n- **`AtomicInteger` / CAS**: Lock-free hardware Compare-And-Swap counter ensuring atomic increments without explicit `synchronized` locks.\n- **`ConcurrentHashMap`**: Thread-safe concurrent map supporting atomic `.compute()` and `.merge()` without locking the entire table.\n- **Graceful Shutdown**: Calling `pool.shutdown()` + `awaitTermination(...)` so queued tasks finish cleanly instead of leaking threads.',
    stepByStepExplanation:
      'Step 1: Size a bounded pool (`Executors.newFixedThreadPool(...)`) matched to CPU or I/O load.\nStep 2: Isolate shared state—use immutable objects inside `Callable`/`Runnable` whenever possible.\nStep 3: Use `AtomicInteger` or `ConcurrentHashMap` where concurrent metrics must aggregate safely.\nStep 4: Handle `Future.get()` timeouts and restore interrupt flags (`Thread.currentThread().interrupt()`) if caught.\nStep 5: Execute `pool.shutdown()` and `awaitTermination()` inside `finally` (or `try-with-resources` in Java 19+).',
    summary:
      'Bounded `ExecutorService` thread pools, immutable messages, `AtomicInteger`/`ConcurrentHashMap`, and graceful shutdown keep concurrent Java apps fast and race-free.',
    revisionChecklist: [
      'Never spawn unbounded raw `new Thread()` instances inside request loops.',
      'Protect shared increments with `AtomicInteger` or `ConcurrentHashMap.merge` rather than bare `count++`.',
      'Never swallow `InterruptedException` silently—restore the interrupt state or cancel cleanly.',
      'Always call `executor.shutdown()` and `awaitTermination()` so pools do not hang JVM exit.',
    ],
    practiceExerciseExtra:
      'Run 4 worker tasks on an `ExecutorService` incrementing both a plain `int` counter and an `AtomicInteger` 10,000 times each to observe lost updates vs exact atomic results.',
    fiveQuestions: [
      {
        question: 'Why does `Executors.newFixedThreadPool(4)` scale far better under load than spawning `new Thread()` per task?',
        answer:
          'A fixed pool caps simultaneous OS threads (avoiding out-of-memory crashes and CPU context-switch thrashing) while queuing excess tasks cleanly.',
      },
      {
        question: 'Why is `sharedCounter++` unsafe when executed concurrently by multiple threads?',
        answer:
          '`++` involves three non-atomic operations (read, increment, write). Overlapping threads overwrite each other’s updates, silently losing counts.',
      },
      {
        question: 'How does `ConcurrentHashMap.merge(key, 1, Integer::sum)` prevent lost counts safely?',
        answer:
          'Unlike two separate `.get()` + `.put()` calls, `.merge()` performs lookup and update atomically per bucket inside the concurrent map.',
      },
      {
        question: 'What happens to a console application if you create a non-daemon `ExecutorService` and forget `.shutdown()`?',
        answer:
          'Idle worker threads keep running indefinitely, preventing the JVM from exiting cleanly even after `main()` finishes.',
      },
      {
        question: 'What should a `catch (InterruptedException e)` block do instead of leaving the catch block empty?',
        answer:
          'Restore the thread’s interrupted status (`Thread.currentThread().interrupt();`) and abort or clean up gracefully so cancellation signals propagate properly.',
      },
    ],
  },

  'python-beginner-to-advanced:note-1': {
    intro:
      'Python’s expressive collections (`list`, `tuple`, `dict`, `set`) and readable comprehensions make writing clean data-processing code remarkably fast—provided you understand mutability and object references accurately.',
    learningObjectives: [
      'Select among `list`, `tuple`, `dict`, and `set` based on ordering, uniqueness, mutability, and lookup speed.',
      'Avoid hidden aliasing and mutable default parameter (`def f(x=[]):`) bugs completely.',
      'Write crisp, readable list and dictionary comprehensions replacing noisy accumulation loops.',
      'Verify membership in `O(1)` average time using `set` and `dict` keys.',
    ],
    detailedExplanation:
      'Python offers four workhorse built-in collections. Ordered mutable sequences (`list`) excel at collecting items step-by-step. Immutable `tuple` objects pack fixed coordinate pairs or composite records safely. Hash-indexed `set` collections enforce uniqueness and verify `"x" in my_set` almost instantaneously, while `dict` maps descriptive keys to structured values.\n\nTwo subtleties trip up Python beginners consistently. First, `b = a` copies a *reference* to the exact same mutable list—mutating `b.append(5)` secretly changes `a` too! Use `a.copy()` when independence is intended. Second, default function arguments evaluate **only once when `def` executes**: `def add_item(x, items=[]):` shares one single persistent list across every subsequent function call! Always initialize `items: list | None = None` inside the body.\n\nComprehensions (`[s.strip().title() for s in names if s]`) combine filtering and transformation concisely in one readable line.',
    keyConcepts:
      '- **Mutability**: Whether a collection allows in-place edits (`list`, `dict`, `set`) vs remaining immutable after creation (`tuple`, `str`).\n- **Reference Aliasing**: Two variables pointing to the identical mutable list in memory (`b = a`), causing edits via one to appear in the other.\n- **Mutable Default Trap**: Writing `def f(items=[]):`, causing state to leak across unrelated calls; fix with `items=None`.\n- **Comprehension**: Expressive single-line generator constructing filtered/mapped lists, sets, or dictionaries (`{k: v for ...}`).\n- **`O(1)` Hash Lookup**: Near-instant key or membership tests on `set` and `dict` vs `O(n)` linear scan on `list`.',
    stepByStepExplanation:
      'Step 1: Pick `dict`/`set` whenever checking uniqueness or looking up by key; pick `tuple` for fixed records and `list` for ordered sequences.\nStep 2: Always use `None` as default for optional mutable parameters (`def log(item, entries=None): entries = [] if entries is None else entries`).\nStep 3: Copy lists cleanly (`b = a.copy()`) before in-place sorting or popping.\nStep 4: Use simple 1-clause list/dict comprehensions for mapping + filtering (drop back to loops if logic spans 3+ conditions).\nStep 5: Safely read optional dictionary keys with `record.get("role", "Student")`.',
    summary:
      'Mastering Python’s four collections, safe `None` default parameters, `.copy()` hygiene, and clean comprehensions eliminates whole categories of beginner bugs.',
    revisionChecklist: [
      'Use `set` / `dict` for fast `in` membership tests on large datasets.',
      'Never use `=[]` or `={}` as default function parameter values; use `=None`.',
      'Use `new_list = old_list.copy()` before mutating a shared list.',
      'Use `my_dict.get(key, default)` instead of unguarded `my_dict[key]` when keys may be absent.',
    ],
    practiceExerciseExtra:
      'Write a Python function `group_by_track(records)` taking `(name, track)` tuples, normalizing whitespace/case with a comprehension, deduplicating per track cleanly with `set`, and returning sorted lists per track.',
    fiveQuestions: [
      {
        question: 'Why does `def enroll(name, roster=[]): roster.append(name)` cause bugs across multiple calls?',
        answer:
          'Default argument objects are created once when the function is defined, so every call without an explicit `roster` mutates the same shared list. Use `roster=None` and create a fresh list inside.',
      },
      {
        question: 'How does `x in my_set` compare in speed to `x in my_list` across 100,000 items?',
        answer:
          '`my_set` uses hash indexing (`O(1)` near-instant lookup regardless of size), whereas `my_list` scans elements sequentially from index 0 (`O(n)`).',
      },
      {
        question: 'If `a = [1, 2, 3]` and `b = a`, what does `a` equal after `b.append(4)`?',
        answer:
          '`[1, 2, 3, 4]`, because `b = a` binds a second name to the exact same list object rather than making a copy (`a.copy()`).',
      },
      {
        question: 'Why might a `dict` key raise `TypeError: unhashable type: list`?',
        answer:
          'Dictionary keys must be immutable/hashable (`str`, `int`, `tuple` of immutables); mutable `list` objects cannot serve directly as keys.',
      },
      {
        question: 'When should you prefer a standard `for` loop over a dense nested comprehension?',
        answer:
          'Whenever the expression involves multiple nested loops, complex conditionals, or try/except logic where readability suffers.',
      },
    ],
  },

  'python-beginner-to-advanced:note-2': {
    intro:
      'Reliable Python scripts read configuration files, parse structured CSV/JSON inputs cleanly via `with` context managers, and catch specific exceptions without masking genuine logic bugs.',
    learningObjectives: [
      'Manage file handles safely using `with open(..., encoding="utf-8")` context managers.',
      'Load and save structured records reliably via Python’s standard `json` and `csv` modules.',
      'Catch targeted exceptions (`FileNotFoundError`, `ValueError`, `json.JSONDecodeError`) rather than bare `except:`.',
      'Raise clear domain errors (`raise ValueError(...)`) early when inputs violate preconditions.',
    ],
    detailedExplanation:
      'Manually calling `f = open(...)` followed by `f.close()` breaks easily whenever an error happens mid-read—leaving locks held or buffered writes truncated on disk.\n\nPython’s `with` statement wraps file I/O in a **context manager** guaranteeing `.close()` executes automatically as soon as the block finishes or raises an exception. Always specify `encoding="utf-8"` explicitly so scripts behave identically across Windows and Linux systems.\n\nSimilarly, disciplined exception handling distinguishes **expected external faults** (missing files, malformed JSON, bad user numbers -> catch specifically and recover cleanly) from **developer bugs** (`NameError`, `TypeError`) that bare `except:` clauses accidentally silence.',
    keyConcepts:
      '- **Context Manager (`with`)**: Protocol invoking `__enter__` and `__exit__` automatically so files close cleanly regardless of errors.\n- **Explicit UTF-8 (`encoding="utf-8"`)**: Prevents OS-dependent character decoding crashes on accented names and symbols.\n- **Targeted Exception Handling**: Catching narrow exceptions (`ValueError`, `FileNotFoundError`) instead of blanket `except Exception:`.\n- **`json.loads` / `json.dump`**: Built-in tools serializing Python dicts/lists safely instead of brittle manual string splitting.\n- **Defensive Preconditions**: Failing loudly and early (`if score < 0: raise ValueError(...)`).',
    stepByStepExplanation:
      'Step 1: Construct cross-platform paths with `from pathlib import Path`.\nStep 2: Open files exclusively via `with path.open("r", encoding="utf-8") as f:`.\nStep 3: Parse structured text via `json.load(f)` or `csv.DictReader(f)`.\nStep 4: Surround I/O with narrow `try ... except (FileNotFoundError, json.JSONDecodeError) as err:`.\nStep 5: Validate parsed numbers (`ValueError`) before performing downstream calculations.',
    summary:
      '`with open(..., encoding="utf-8")`, standard `json`/`csv` parsers, and targeted `try-except` blocks keep Python applications portable and fault-tolerant.',
    revisionChecklist: [
      'Always use `with open(..., encoding="utf-8")` instead of raw `open()`/`close()`.',
      'Use `newline=""` when opening files for `csv.writer` / `csv.DictWriter`.',
      'Never write bare `except:`—always catch specific exception classes cleanly.',
      'Log or report contextual errors (filename, row number) whenever recovering from bad input.',
    ],
    practiceExerciseExtra:
      'Write a `load_course_roster(path)` Python function reading JSON via `pathlib` + `with`, catching `FileNotFoundError` and `JSONDecodeError` separately with clear diagnostics.',
    fiveQuestions: [
      {
        question: 'What happens if an exception occurs halfway through reading a file inside a `with open(...) as f:` block?',
        answer:
          'Python’s context manager still guarantees `f.close()` executes automatically before the exception propagates, preventing leaked file handles.',
      },
      {
        question: 'Why is explicitly passing `encoding="utf-8"` inside `open()` considered best practice?',
        answer:
          'Without explicit encoding, Python picks the OS locale default (which differs between Windows cp1252 and Linux UTF-8), causing silent mojibake or crashes on global text.',
      },
      {
        question: 'Why should developers strictly avoid writing bare `except:` clauses?',
        answer:
          'Bare `except:` even catches `KeyboardInterrupt` (Ctrl+C), `SystemExit`, and developer typos (`NameError`), hiding real bugs and making scripts impossible to stop cleanly.',
      },
      {
        question: 'What argument prevents blank extra rows when writing CSV files on Windows with Python’s `csv` module?',
        answer:
          'Passing `newline=""` to `open(..., "w", encoding="utf-8", newline="")` lets the `csv` module control line endings properly.',
      },
      {
        question: 'Why use `json.dump()` instead of writing `str(my_dict)` directly into a `.json` file?',
        answer:
          '`str(my_dict)` produces Python syntax (`\'single quotes\'`, `True`, `None`) which is invalid JSON (`"double quotes"`, `true`, `null`).',
      },
    ],
  },

  'python-automation:note-1': {
    intro:
      'File-system automation saves hours of repetitive sorting and archiving—yet a single careless wildcard or overwrite bug can destroy irreplaceable files in milliseconds unless built around `pathlib`, dry-run modes, and collision safety.',
    learningObjectives: [
      'Manipulate directory trees portably using Python’s object-oriented `pathlib.Path` rather than fragile string concatenation.',
      'Design a `--dry-run` simulation flag printing planned moves before touching a single disk file.',
      'Prevent silent overwrites via destination collision checks and timestamped/numbered renaming.',
      'Skip hidden OS system files, active symlinks, and already-processed destination folders cleanly.',
    ],
    detailedExplanation:
      'Automation scripts differ fundamentally from toy scripts because they modify real files on real hard drives. A broken string join (`folder + "/" + name`) fails across Windows vs Linux separators, and blind `shutil.move` overwrites older files identically named `report.pdf` silently.\n\nModern Python solves path portability cleanly using **`pathlib.Path`**, where `base / "invoices" / "2026"` constructs valid paths everywhere and `.suffix`, `.stem`, and `.mkdir(parents=True, exist_ok=True)` eliminate brittle string slicing.\n\nBest-practice automation ALWAYS follows the **Dry-Run First** engineering pattern: decouple *planning* actions from *executing* them (`dry_run: bool = True`). When `dry_run=True`, the script previews `[DRY RUN] report.pdf -> Archive/report_1.pdf` without moving anything, letting operators verify safety before passing `--execute`.',
    keyConcepts:
      '- **`pathlib.Path`**: Cross-platform object representation of filesystem paths replacing raw `/` or `\\` string joins.\n- **Dry-Run Mode**: Safe preview flag simulating planned moves/renames without altering real disk state.\n- **Collision Handling**: Checking `dest.exists()` before moving and generating unique `_1`, `_2` suffixes instead of overwriting.\n- **Idempotency**: Ensuring running the exact same organizer script twice in a row produces clean zero-damage results.\n- **`mkdir(parents=True, exist_ok=True)`**: Safely creating missing nested destination directories without crashing if they exist.',
    stepByStepExplanation:
      'Step 1: Resolve root `Path(target).resolve()` and filter strictly regular files (`p.is_file()` and not hidden `.` files).\nStep 2: Map extensions (`p.suffix.lower()`) cleanly to destination folder names.\nStep 3: Build collision-free target paths by incrementing `stem_1.ext` while `candidate.exists()`.\nStep 4: If `dry_run=True`, log intended moves only; otherwise create folder (`exist_ok=True`) and move with `shutil.move`.\nStep 5: Output a clear summary tallying moved vs skipped vs duplicate-renamed files.',
    summary:
      'Safe file automation combines `pathlib.Path`, default `dry_run=True` previews, non-destructive collision renaming, and idempotent folder filtering.',
    revisionChecklist: [
      'Prefer `pathlib.Path` over manual `os.path.join` or raw string `+` slashes.',
      'Default dangerous batch scripts to `dry_run=True` until reviewed.',
      'Never overwrite an existing file silently—auto-increment or suffix timestamps cleanly.',
      'Skip destination folders and hidden dotfiles so re-running the script remains safe.',
    ],
    practiceExerciseExtra:
      'Extend a `pathlib` file organizer to skip hidden `.DS_Store`/`.env` files, support `dry_run=True`, and rename colliding `notes.pdf` files into `notes (2).pdf`.',
    fiveQuestions: [
      {
        question: 'Why does `path / "sub" / "file.txt"` beat string concatenation `path + "/file.txt"`?',
        answer:
          '`pathlib.Path` handles trailing slashes and OS path separators automatically across Windows, macOS, and Linux, while also offering `.stem`, `.suffix`, and `.is_file()` cleanly.',
      },
      {
        question: 'What devastating mistake does `dest.exists()` collision handling prevent in batch file movers?',
        answer:
          'Without checking `dest.exists()`, moving two identically named files (like `invoice.pdf` from two folders) into one folder silently overwrites and deletes the first file.',
      },
      {
        question: 'Why should destructive or bulk automation tools default to `dry_run=True`?',
        answer:
          'Operators can inspect the exact planned source -> destination paths safely before authorizing actual filesystem mutations.',
      },
      {
        question: 'What does `exist_ok=True` achieve inside `dest_dir.mkdir(parents=True, exist_ok=True)`?',
        answer:
          'It creates missing parent folders safely on the first run and avoids crashing with `FileExistsError` when the folder already exists on subsequent runs.',
      },
      {
        question: 'What makes a directory cleanup script "idempotent"?',
        answer:
          'Running it multiple times on the same folder produces the exact same organized state without duplicating folders or moving already-sorted files repeatedly.',
      },
    ],
  },

  'python-automation:note-2': {
    intro:
      'Businesses exchange millions of daily records via CSV exports full of trailing spaces, inconsistent date formats, and blank rows. Robust Python automation normalizes clean rows, quarantines invalid lines cleanly, and emits machine-readable audit trails.',
    learningObjectives: [
      'Normalize whitespace, inconsistent casing, and varied formatting cleanly using `csv.DictReader` and `csv.DictWriter`.',
      'Quarantine malformed rows into a separate `errors.csv` rejection report instead of crashing mid-batch or silently dropping data.',
      'Maintain reproducible structured audit logs summarizing processed, accepted, and rejected row counts.',
      'Prevent CSV formula/spreadsheet injection when exporting untrusted user strings.',
    ],
    detailedExplanation:
      'In naive scripts, one unexpected string (`"N/A"` inside an `amount` column) aborts an entire 50,000-row automation pipeline halfway through—leaving partial outputs behind and forcing manual restarts.\n\n**Row-Level Quarantine Engineering** splits automated validation cleanly into two output streams: `valid_rows.csv` (trimmed, normalized, validated records ready for downstream systems) and `rejected_rows.csv` (original row data paired with a crystal-clear `error_reason` column explaining exactly why row #412 failed!). Operations staff can repair just those rejected lines without re-cleaning valid entries.\n\nAlways open CSV streams with `encoding="utf-8-sig"` when files may be opened in Excel, pass `newline=""` so extra blank lines never appear, and track exact metrics (`total`, `valid`, `rejected`) in a structured audit log.',
    keyConcepts:
      '- **`csv.DictReader` / `DictWriter`**: Column-header-aware CSV tools resilient to column order changes.\n- **Row-Level Quarantine**: Isolating invalid records with clear failure reasons rather than aborting whole batches or deleting silently.\n- **Normalization**: Standardizing trim (`strip()`), case (`.lower()` on emails), and numeric parsing cleanly before validation.\n- **Audit Summary**: Structured count record (`processed=500, accepted=488, rejected=12`) verifying zero silent data loss.\n- **CSV Formula Injection Guard**: Prefixing untrusted cells starting with `=`, `+`, `-`, `@` if exported for Excel review.',
    stepByStepExplanation:
      'Step 1: Open source CSV with `DictReader` (`encoding="utf-8-sig"`).\nStep 2: Normalize whitespace and standard formats (e.g., lowercase emails, clean whitespace) on each row.\nStep 3: Validate required fields (`email` format, positive `amount`, non-empty `id`).\nStep 4: Route passing rows to `clean_rows` and failing rows (with `reason` column) to `error_rows`.\nStep 5: Write both CSVs (`newline=""`) and log summary counts cleanly.',
    summary:
      'Resilient CSV automation pairs header-based `DictReader` normalization with non-destructive row-level quarantine and verifiable audit counts.',
    revisionChecklist: [
      'Never crash an entire batch on row #17—quarantine invalid rows with exact error reasons.',
      'Verify `accepted + rejected == total_input` cleanly in audit summaries.',
      'Strip leading/trailing whitespace on every cell before checking empty strings.',
      'Always verify headers exist cleanly in `reader.fieldnames` before looping.',
    ],
    practiceExerciseExtra:
      'Build a CSV sanitizer processing messy student application rows (`full_name`, `email`, `score`) into `clean_students.csv` + `rejected_students.csv` verifying `0 <= score <= 100`.',
    fiveQuestions: [
      {
        question: 'Why does `csv.DictReader` improve maintainability compared to splitting lines with `line.split(",")`?',
        answer:
          '`DictReader` properly handles quoted fields containing commas (`"Chennai, India"`) and lets code reference columns by header name rather than fragile index numbers.',
      },
      {
        question: 'Why is routing bad rows into a `rejected.csv` file far superior to crashing or calling `continue` silently?',
        answer:
          'Silent `continue` hides data loss completely, and crashing halts valid records. Quarantine lets teams fix bad rows cleanly while good records continue flowing.',
      },
      {
        question: 'What invariant should every automated batch audit report assert cleanly?',
        answer:
          '`total_rows_read == clean_rows_written + rejected_rows_written`, proving zero records vanished unnoticed.',
      },
      {
        question: 'Why normalize strings with `.strip()` BEFORE checking `if not cell:`?',
        answer:
          'Cells containing `"   "` spaces appear non-empty unless trimmed first, sneaking invalid blank records past validation.',
      },
      {
        question: 'Why guard exported CSV cells starting with `=`, `+`, `-`, or `@` when humans open outputs in Excel?',
        answer:
          'Spreadsheet apps may execute leading `=` strings as active formulas (CSV Injection) if opened unescaped.',
      },
    ],
  },

  'python-data-handling:note-1': {
    intro:
      'Analytical reports are only as trustworthy as the underlying cleaning and aggregation logic. Python data pipelines must treat missing values explicitly, aggregate accurately by cohort, and never average pre-computed subgroup percentages incorrectly.',
    learningObjectives: [
      'Preserve missing values explicitly (`None`) rather than silently coercing blanks into zeroes.',
      'Aggregate metrics cleanly by cohort (`department`, `level`) using `defaultdict` and numerator/denominator sums.',
      'Avoid the "Average of Averages" weighted-ratio trap across unequal group sizes.',
      'Produce clean summary tables combining counts (`N`), medians, and completion rates.',
    ],
    detailedExplanation:
      'When analyzing course scores or survey ratings in Python, messy exports arrive filled with `"N/A"`, `"null"`, or blank cells. Coercing missing cells into `0` destroys downstream calculations—making an absent learner score look like a 0% exam failure!\n\nClean Python pipelines isolate parsing cleanly: valid numbers become `float`, missing tokens become `None` (counted visibly under missingness metrics), and numeric calculations filter strictly over non-`None` values.\n\nJust as critical is **Weighted Aggregation**. Suppose Track A has 10 students at 90% completion (9 done) and Track B has 90 students at 50% completion (45 done). Averaging percentages blindly `(90 + 50) / 2 = 70%` is flat-out wrong! True aggregate completion equals total numerator divided by total denominator: `(9 + 45) / (10 + 90) = 54%`.',
    keyConcepts:
      '- **Explicit Missingness (`None`)**: Separating "missing/unrecorded" from valid numeric `0` values so averages stay honest.\n- **`collections.defaultdict`**: Grouping container initializing missing cohort buckets automatically during single-pass aggregation.\n- **Weighted Ratio Aggregation**: Computing `sum(numerators) / sum(denominators)` across cohorts rather than averaging subgroup percentages.\n- **Skewed Median vs Mean**: Choosing 50th percentile Median when outliers skew average completion times.\n- **Sample Size (`N`)**: Always printing cohort counts beside percentages so small groups (`2/2 = 100%`) aren’t over-interpreted.',
    stepByStepExplanation:
      'Step 1: Parse messy cells into `Optional[float]` (`None` for `"N/A"`, blanks, errors) while tracking missing counts.\nStep 2: Validate logical ranges (`0 <= score <= 100`) before admitting values.\nStep 3: Accumulate cohort totals using `defaultdict(lambda: {"sum": 0.0, "n": 0})`.\nStep 4: Compute overall rates strictly from `total_num / total_den`, never average of cohort averages.\nStep 5: Print structured cohort summaries displaying both `N` and `Missing`.',
    summary:
      'Honest Python data handling protects missing `None` semantics, tracks sample sizes (`N`), and computes true weighted totals cleanly across cohorts.',
    revisionChecklist: [
      'Never replace blank/unknown ratings with `0`.',
      'Always compute blended ratios via `sum(hits) / sum(total)` across cohorts.',
      'Report sample size `N` alongside every percentage or average.',
      'Use Median whenever extreme outliers pull Mean averages out of shape.',
    ],
    practiceExerciseExtra:
      'Write a Python cohort aggregator reading `(dept, passed_flag)` rows containing missing strings `""` and returning accurate per-department + true overall pass rates.',
    fiveQuestions: [
      {
        question: 'Why does converting blank survey scores into `0` corrupt an analysis?',
        answer:
          'Zero drags Mean averages down artificially and falsely equates non-responses with minimum satisfaction ratings. Track blanks separately as `None`.',
      },
      {
        question: 'Group X has 80% pass rate (5 students) and Group Y has 40% pass rate (95 students). What is the true overall pass rate?',
        answer:
          'Total passed = `4 + 38 = 42` out of `100` students = **42%** (not the unweighted average `60%`).',
      },
      {
        question: 'How does `collections.defaultdict(list)` simplify grouping records in Python?',
        answer:
          'It automatically creates an empty list the first time an unseen key is accessed, avoiding verbose `if key not in d:` boilerplate.',
      },
      {
        question: 'Why must analysts print cohort count `N` alongside percentages like `"100% Completion"`?',
        answer:
          'A tiny sample (`1 of 1 = 100%`) carries tiny statistical weight compared to `90 of 100 = 90%`.',
      },
      {
        question: 'When should Median replace Mean in a Python telemetry summary?',
        answer:
          'Whenever heavy tail outliers (such as a few users leaving a browser open for 90 hours) pull the Mean far above typical learner experience.',
      },
    ],
  },

  'python-data-handling:note-2': {
    intro:
      'Persisting analytical records in relational SQLite databases gives Python apps ACID transactional reliability—provided every query uses parameterized placeholders (`?`) rather than unsafe string formatting.',
    learningObjectives: [
      'Explain how SQL Injection happens when user input is concatenated into SQL strings (`f"SELECT ... {user}"`).',
      'Write 100% parameterized `sqlite3` queries using `?` placeholders.',
      'Enforce database integrity using `PRIMARY KEY`, `NOT NULL`, `UNIQUE`, and `FOREIGN KEY` constraints.',
      'Wrap multi-step inserts safely inside transactions with `with conn:` so failures roll back cleanly.',
    ],
    detailedExplanation:
      'CSV files fail rapidly when concurrent updates occur or when relational links (Students -> Courses -> Enrollments) need strict referential integrity. Python ships **`sqlite3`** right in its standard library—a full transactional SQL engine storing data cleanly in one portable `.db` file.\n\nThe cardinal security rule of database code is **NEVER use Python f-strings or `+` concatenation to insert variables into SQL commands**. Concatenating untrusted user input (`"SELECT * FROM users WHERE email = \'" + email + "\'"`) allows attackers to inject quotes (`\' OR \'1\'=\'1`) that rewrite query logic and exfiltrate or drop entire tables!\n\nPassing parameters cleanly as a tuple `cursor.execute("SELECT * FROM users WHERE email = ?", (email,))` instructs SQLite to treat `(email,)` strictly as passive literal data—making SQL Injection structurally impossible.',
    keyConcepts:
      '- **Parameterized Query (`?`)**: Passing values separately in a tuple so the SQL engine never interprets user text as executable commands.\n- **SQL Injection (SQLi)**: Vulnerability arising when untrusted input alters SQL query structure via string concatenation.\n- **ACID Transaction (`with conn:`)**: Guarantees multi-row updates either commit atomically together or roll back cleanly on error.\n- **Schema Constraints (`NOT NULL`, `UNIQUE`, `CHECK`)**: Database-level guards rejecting corrupt rows regardless of caller bug.\n- **Trailing Comma Tuple (`(val,)`)**: Python syntax required for a 1-element parameter tuple in `cursor.execute(sql, (val,))`.',
    stepByStepExplanation:
      'Step 1: Connect via `with sqlite3.connect("academy.db") as conn:` and enable `PRAGMA foreign_keys = ON;`.\nStep 2: Define normalized tables (`CREATE TABLE IF NOT EXISTS ...`) with `PRIMARY KEY`, `UNIQUE`, and `NOT NULL` rules.\nStep 3: Execute ALL `SELECT`/`INSERT`/`UPDATE`/`DELETE` queries with `?` placeholders and tuple args `(val1, val2)`.\nStep 4: Keep queries atomic inside `with conn:` transactions (remember `with conn:` commits/rolls back, then call `conn.close()` when done).\nStep 5: Fetch results cleanly via `.fetchall()` or `.fetchone()`.',
    summary:
      'Parameterized `sqlite3` queries (`?` placeholders), transactional `with conn:` blocks, and database schema constraints make Python persistence rock-solid and injection-proof.',
    revisionChecklist: [
      'NEVER format user values into SQL using `f"..."`, `.format()`, or `%`.',
      'Remember single-item parameter tuples require a trailing comma: `(student_id,)`.',
      'Enable `PRAGMA foreign_keys = ON` in SQLite when linking child tables.',
      'Close SQLite connections explicitly after transactions finish.',
    ],
    practiceExerciseExtra:
      'Build a parameterized SQLite `CertificateRegistry` supporting `create_table()`, `issue_certificate(cert_id, email, title)`, and `lookup_by_email(email)` tested safely against injection input `"a@b.com\' OR 1=1--"`.',
    fiveQuestions: [
      {
        question: 'Why does `cursor.execute("SELECT * FROM students WHERE id = ?", (sid,))` defeat SQL Injection completely?',
        answer:
          'The SQL command structure is compiled separately from `(sid,)`; SQLite treats `sid` strictly as a literal scalar value rather than SQL syntax.',
      },
      {
        question: 'What Python syntax error or TypeError occurs if you pass `(student_id)` without a comma to `cursor.execute`?',
        answer:
          'Without the trailing comma `(student_id,)`, parentheses evaluate just to the bare `str`/`int` instead of a 1-item tuple, raising `ValueError: parameters are of unsupported type`.',
      },
      {
        question: 'What important check happens if you run `conn.execute("PRAGMA foreign_keys = ON;")` in SQLite?',
        answer:
          'SQLite enforces foreign key constraints, rejecting child inserts referencing non-existent parent IDs (disabled by default in SQLite for backward compatibility).',
      },
      {
        question: 'What does `with conn:` automatically manage in `sqlite3`?',
        answer:
          'It commits the active transaction if the block exits normally, or automatically rolls back partial writes if an exception is raised inside the block.',
      },
      {
        question: 'What role does `UNIQUE` play on an email column inside `CREATE TABLE`?',
        answer:
          'It enforces uniqueness natively at the storage engine layer—guaranteeing duplicate accounts can never sneak in even under concurrent requests.',
      },
    ],
  },
};
