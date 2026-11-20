import { BRAND_IMAGES } from '../../constants/legal';
import type { SeedCourseDef, SeedStudyNoteDef } from './departments';

function makeProgNote(cfg: {
  id: string;
  moduleId: string;
  lessonId: string;
  title: string;
  intro: string;
  simple: string;
  detailed: string;
  concepts: string;
  steps: string;
  codeLang: 'html' | 'java' | 'python';
  code: string;
  lineByLine: string;
  output: string;
  debugging: string;
  exercise: string;
  realWorld: string;
  important: string;
  mistakes: string;
  summary: string;
  shortQ: string;
  longQ: string;
  mcq: string;
}): SeedStudyNoteDef {
  return {
    id: cfg.id,
    moduleId: cfg.moduleId,
    lessonId: cfg.lessonId,
    title: cfg.title,
    topicIntroduction: cfg.intro,
    simpleExplanation: cfg.simple,
    detailedExplanation: cfg.detailed,
    keyConcepts: cfg.concepts,
    stepByStepExplanation: cfg.steps,
    practicalExamples: [
      `Working ${cfg.codeLang.toUpperCase()} Example:`,
      '```' + cfg.codeLang,
      cfg.code,
      '```',
      '',
      'Line-by-Line Code Explanation:',
      cfg.lineByLine,
      '',
      'Expected Output:',
      cfg.output,
    ].join('\n'),
    realWorldApplications: cfg.realWorld,
    importantPoints: cfg.important,
    commonMistakes: cfg.mistakes,
    summary: cfg.summary,
    practiceQuestions: [
      '### Short-Answer Questions',
      cfg.shortQ,
      '',
      '### Long-Answer Questions',
      cfg.longQ,
      '',
      '### Multiple-Choice Questions (With Answers & Explanations)',
      cfg.mcq,
    ].join('\n'),
    domainSupplement: [
      '### Errors, Debugging & Practical Coding Exercise',
      cfg.debugging,
      '',
      '**Hands-On Coding Exercise:**',
      cfg.exercise,
    ].join('\n'),
  };
}

export const DEPT1_PROGRAMMING_COURSES: SeedCourseDef[] = [
  // =========================================================================
  // 1. HTML – Complete Web Development Fundamentals
  // =========================================================================
  {
    id: 'html-web-dev-fundamentals',
    departmentId: 'dept_programming_web',
    departmentName: 'Programming & Web Development',
    title: 'HTML Fundamentals',
    category: 'Programming & Web Development',
    level: 'Beginner',
    duration: '6 Weeks',
    thumbnailUrl: BRAND_IMAGES.courseTech,
    shortDescription:
      'Master document structure, semantic HTML5 tags, accessible forms, tables, and media elements from first principles.',
    fullDescription:
      'HTML is the structural foundation of every web page. This course teaches learners how browsers parse markup, how to organize headings, paragraphs, hyperlinks, tables, media, and accessible forms using clean, standards-compliant HTML5.',
    introduction:
      'Every website on the internet begins with HyperText Markup Language (HTML). Before adding visual presentation or server logic, developers must structure information clearly for both human readers and assistive technologies. This course builds complete fluency in modern semantic HTML5.',
    objectives: [
      'Construct valid HTML5 documents using DOCTYPE, head metadata, and body regions.',
      'Organize content hierarchically using semantic tags instead of generic containers.',
      'Build accessible navigation links, structured data tables, and validated input forms.',
      'Embed images, audio, and video elements with proper fallback and alt attributes.',
    ],
    targetAudience:
      'Complete beginners entering web development, students preparing for front-end careers, and professionals who need to author clean, accessible web documents.',
    prerequisites: 'Basic computer literacy and ability to edit plain text files in any code editor.',
    syllabusSummary: [
      'Module 1: Document Anatomy, DOCTYPE, Head Metadata & Text Hierarchy',
      'Module 2: Hyperlinks, Lists, Images, Audio, Video & Structured Tables',
      'Module 3: Semantic Landmarks, Accessible Forms & Input Validation',
    ],
    outcomes: [
      'Write standards-compliant HTML5 pages without relying on visual builders.',
      'Design semantic page landmarks (<header>, <nav>, <main>, <article>, <footer>).',
      'Create multi-field user registration and feedback forms with native HTML validation.',
      'Audit and repair broken links, missing alt descriptions, and heading skip errors.',
    ],
    moduleAssessments: [
      'Module 1 Quiz: Document Anatomy & Text Semantics',
      'Module 2 Practice Lab: Multi-Section Directory & Data Table',
      'Module 3 Assessment: Accessible Admissions Form Build',
    ],
    finalAssessmentTitle: 'Final Assessment: Complete Semantic HTML5 Multi-Page Portal',
    modules: [
      {
        id: 'mod-1',
        title: 'HTML5 Document Structure & Text Hierarchy',
        description: 'Understand tags, elements, attributes, metadata, headings, and text formatting.',
        assessmentTitle: 'Module 1 Check: Document Skeleton & Metadata',
        assessmentCriteria: 'Valid DOCTYPE, proper <head> encoding, and unbroken h1-h3 outline.',
        orderIndex: 1,
      },
      {
        id: 'mod-2',
        title: 'Links, Lists, Tables & Media Elements',
        description: 'Connect pages, present structured data cleanly, and embed accessible media.',
        assessmentTitle: 'Module 2 Check: Course Schedule Table & Media Embed',
        assessmentCriteria: 'Uses <thead>, <tbody>, <th scope>, descriptive alt text, and relative links.',
        orderIndex: 2,
      },
      {
        id: 'mod-3',
        title: 'Semantic Landmarks & Accessible HTML Forms',
        description: 'Replace ambiguous wrappers with landmark tags and build validated forms.',
        assessmentTitle: 'Module 3 Check: Accessible Student Intake Form',
        assessmentCriteria: 'Every input paired with explicit <label for>, fieldset/legend, and constraints.',
        orderIndex: 3,
      },
    ],
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        title: 'Anatomy of an HTML5 Document & Semantic Tags',
        summary: 'Learn how <!DOCTYPE html>, <html>, <head>, and <body> establish a valid web document.',
        objectives: [
          'Distinguish between opening tags, closing tags, attributes, and void elements.',
          'Configure UTF-8 character encoding and responsive viewport metadata.',
          'Structure page hierarchy using <h1> through <h6> accurately.',
        ],
        contentBody:
          'An HTML document is a plain text file saved with a .html extension that instructs a web browser how content is organized.\n\n1. Document Declaration: <!DOCTYPE html> tells modern browsers to render in standards mode rather than legacy quirks mode.\n2. Root Container: <html lang="en"> wraps all markup and informs screen readers and search engines of the primary language.\n3. Head Metadata: Inside <head>, <meta charset="UTF-8"> supports global characters, <meta name="viewport" content="width=device-width, initial-scale=1.0"> enables mobile scaling, and <title> names the browser tab.\n4. Body & Landmarks: Visible content belongs inside <body>, structured with <header>, <nav>, <main>, <section>, <article>, and <footer>.',
        examples:
          '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>RM HEAVEN Academic Brief</title>\n</head>\n<body>\n  <header><h1>RM HEAVEN Curriculum</h1></header>\n  <main>\n    <article>\n      <h2>Why Semantic HTML Matters</h2>\n      <p>Semantic tags describe the meaning of content, not merely its appearance.</p>\n    </article>\n  </main>\n  <footer><p>Academic Publishing Desk</p></footer>\n</body>\n</html>',
        exercisePrompt:
          'Create an index.html file representing a personal academic profile with <!DOCTYPE html>, UTF-8 meta tag, one <h1> heading, two <section> blocks with <h2> headings, and a <footer>.',
        durationMinutes: 25,
        orderIndex: 1,
      },
      {
        id: 'les-2',
        moduleId: 'mod-2',
        title: 'Hyperlinks, Ordered/Unordered Lists & Data Tables',
        summary: 'Build navigation menus, structured lists, and accessible tabular schedules.',
        objectives: [
          'Differentiate absolute URLs from relative internal file paths.',
          'Choose between <ul>, <ol>, and <dl> lists appropriately.',
          'Build accessible tables with <thead>, <tbody>, <tr>, <th scope>, and <td>.',
        ],
        contentBody:
          'Web documents connect through hyperlinks (<a href="...">) and organize grouped facts with lists and tables.\n\n- Anchor Links: Use descriptive link text (e.g., "View Course Syllabus") rather than vague labels like "Click here". Add rel="noopener noreferrer" when using target="_blank".\n- Lists: Use <ul> for unordered items (navigation menus, feature lists), <ol> for numbered procedures, and <dl> for term-definition glossaries.\n- Tables: Reserve <table> strictly for two-dimensional tabular data such as schedules or mark sheets—never for page layout. Always use <th scope="col"> or <th scope="row"> so assistive readers announce headers accurately.',
        examples:
          '<table>\n  <caption>Weekly Study Schedule</caption>\n  <thead>\n    <tr>\n      <th scope="col">Day</th>\n      <th scope="col">Topic</th>\n      <th scope="col">Duration</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Monday</td>\n      <td>Semantic Landmarks</td>\n      <td>45 mins</td>\n    </tr>\n  </tbody>\n</table>',
        exercisePrompt:
          'Write an HTML navigation list with three relative links and a 4-row academic timetable table using <caption>, <thead>, <tbody>, and scope attributes.',
        durationMinutes: 30,
        orderIndex: 2,
      },
      {
        id: 'les-3',
        moduleId: 'mod-2',
        title: 'Images, Figures & Responsive Media Embedding',
        summary: 'Add visual and audio/video resources cleanly with meaningful alt attributes.',
        objectives: [
          'Write clear, concise alt text for informative images and empty alt="" for decorative graphics.',
          'Group captions cleanly with <figure> and <figcaption>.',
          'Provide native controls and fallback messages in <audio> and <video>.',
        ],
        contentBody:
          'Media enriches learning when embedded accessibly.\n\n- Images use the void element <img src="diagram.jpg" alt="Flowchart of document parsing" width="640" height="360" />. Specifying width and height reserves layout space before the image finishes loading.\n- Grouping: Wrap instructional diagrams inside <figure> with a paired <figcaption>.\n- Audio/Video: Always include the controls attribute so learners control playback, and provide descriptive fallback text inside the element.',
        examples:
          '<figure>\n  <img src="dom-tree.png" alt="Diagram showing html parent with head and body children" width="600" height="340" />\n  <figcaption>Figure 1: Standard HTML5 Document Object Tree</figcaption>\n</figure>',
        exercisePrompt:
          'Add two <figure> blocks with proper alt descriptions and explicit width/height attributes, plus an <audio controls> block with two <source> formats.',
        durationMinutes: 25,
        orderIndex: 3,
      },
      {
        id: 'les-4',
        moduleId: 'mod-3',
        title: 'HTML5 Forms, Labels & Native Input Validation',
        summary: 'Collect structured user input reliably with semantic form controls and constraint attributes.',
        objectives: [
          'Pair every input control with an explicit <label for="..."> element.',
          'Select appropriate input types: text, email, tel, number, date, radio, checkbox.',
          'Apply HTML constraint validation attributes (required, minlength, maxlength, pattern, min, max).',
        ],
        contentBody:
          'Forms enable registration, feedback, and search across the web.\n\nEvery form begins with <form action="/submit" method="POST">. Group related controls inside <fieldset> with a descriptive <legend>. Never rely solely on placeholder text as a substitute for <label>—placeholders disappear once a user starts typing, hurting usability and screen-reader navigation.\n\nUse specific input types such as type="email" or type="tel" so mobile keyboards adapt automatically and browsers catch formatting mistakes before submission.',
        examples:
          '<form action="/enroll" method="post">\n  <fieldset>\n    <legend>Student Enrollment Inquiry</legend>\n    <label for="stu-name">Full Name</label>\n    <input id="stu-name" name="fullName" type="text" required minlength="2" maxlength="100" />\n\n    <label for="stu-email">Email Address</label>\n    <input id="stu-email" name="email" type="email" required />\n\n    <button type="submit">Submit Request</button>\n  </fieldset>\n</form>',
        exercisePrompt:
          'Build a complete seminar registration form using <fieldset>, <legend>, name, email, date of birth, radio track choice, and a required terms checkbox.',
        durationMinutes: 35,
        orderIndex: 4,
      },
    ],
    studyNotes: [
      makeProgNote({
        id: 'note-1',
        moduleId: 'mod-1',
        lessonId: 'les-1',
        title: 'Semantic HTML5 Document Structure & Tag Hierarchy',
        intro:
          'Semantic HTML means choosing tags that accurately describe the purpose of content (such as <header>, <main>, <article>, and <footer>) rather than wrapping everything in neutral <div> tags. It is the single highest-impact habit for accessibility, SEO, and maintainable markup.',
        simple:
          'Think of an HTML page like a printed book. A book has a cover title (<head><title>), chapter headings (<h1>, <h2>), paragraphs (<p>), sidebars (<aside>), and a footer note (<footer>). Semantic tags tell the browser which part is the chapter title and which part is the main story.',
        detailed:
          'When a browser downloads an HTML file, it constructs the Document Object Model (DOM) tree and an Accessibility Tree simultaneously. Assistive tools such as screen readers scan landmark elements (<header>, <nav>, <main>, <footer>) and heading levels (<h1>–<h6>) so users can jump straight to the primary content without listening to repeated navigation menus.\n\nSearch engines also weight semantic elements heavily when indexing articles, navigation menus, and dates (<time datetime="2026-11-18">). Using only one <h1> per page for the main page topic and descending sequentially to <h2> and <h3> ensures a clear structural outline.',
        concepts:
          '- DOCTYPE: Declaration forcing HTML5 standards mode.\n- Element vs. Tag: A tag is the markup (<p>); an element is the opening tag, content, and closing tag together.\n- Void Element: An element with no closing tag or inner content, such as <meta>, <br>, <hr>, or <img>.\n- Landmark Element: Structural region (<header>, <nav>, <main>, <aside>, <footer>) exposing navigation points to assistive tools.',
        steps:
          'Step 1: Declare <!DOCTYPE html> on line 1.\nStep 2: Open <html lang="en"> to specify language.\nStep 3: Populate <head> with charset UTF-8, viewport meta, and descriptive <title>.\nStep 4: Inside <body>, place banner branding and primary links in <header> and <nav>.\nStep 5: Place unique core page content inside a single <main> tag, dividing topics with <section> or <article>.\nStep 6: Close with <footer> for copyright and institutional links.',
        codeLang: 'html',
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Course Overview | RM HEAVEN</title>\n</head>\n<body>\n  <header>\n    <nav aria-label="Primary">\n      <a href="/courses">Courses</a>\n      <a href="/internships">Internships</a>\n    </nav>\n  </header>\n  <main>\n    <h1>HTML Web Fundamentals</h1>\n    <section>\n      <h2>Course Syllabus</h2>\n      <p>Learn clean document markup from ground up.</p>\n    </section>\n  </main>\n  <footer>\n    <p>RM HEAVEN Academy</p>\n  </footer>\n</body>\n</html>',
        lineByLine:
          'Line 1 triggers HTML5 standards parsing. Line 2 sets English language context. Lines 4-6 configure Unicode character support, mobile screen scaling, and tab title. Lines 9-14 define the top navigation landmark. Lines 15-21 enclose the primary document heading and syllabus section in <main>. Lines 22-24 define the bottom landmark.',
        output:
          'Browser displays a top navigation bar with clickable links ("Courses", "Internships"), a large H1 title "HTML Web Fundamentals", a subheading "Course Syllabus" with paragraph text, and a footer line "RM HEAVEN Academy".',
        debugging:
          'Common bugs include forgetting closing tags (</section>), nesting <main> inside <header>, or skipping heading levels (jumping from <h1> to <h4>). Validate documents with the W3C Markup Validation Service to catch unclosed tags immediately.',
        exercise:
          'Author a semantic HTML5 syllabus page containing 1 <header>, 1 <nav> with 3 links, 1 <main> with 2 <article> blocks, an <aside> tip box, and 1 <footer>.',
        realWorld:
          'Newsrooms, government portals, banking dashboards, and university learning platforms enforce strict semantic HTML5 and WCAG accessibility standards so every citizen and student can navigate interfaces smoothly.',
        important:
          '- Use exactly one visible <main> element per page.\n- Never skip heading ranks strictly to change font size.\n- Keep <meta charset="UTF-8"> within the first 1024 bytes of <head>.',
        mistakes:
          '- Using <div> for buttons or navigation links instead of <button> and <a>.\n- Placing multiple <h1> elements arbitrarily or picking <h4> simply because it looks smaller.\n- Omitting lang="en" on the <html> element.',
        summary:
          'Semantic HTML5 gives structure and meaning to web documents through standards-compliant landmarks (<header>, <nav>, <main>, <section>, <article>, <footer>) and unbroken heading hierarchies.',
        shortQ:
          'Q1: Why should every HTML5 file begin with <!DOCTYPE html>?\nAnswer: It instructs the browser to render using modern HTML5 standards mode rather than legacy quirks mode.\nQ2: What is the difference between <section> and <article>?\nAnswer: <article> represents self-contained syndicatable content (like a blog post or lesson card), while <section> groups thematically related content within a document.',
        longQ:
          'Q: Explain how semantic HTML landmarks and heading hierarchy improve both accessibility and search engine indexing.\nAnswer Essay Outline: Screen readers rely on landmarks (<nav>, <main>, <footer>) to jump directly past repetitive menus, and generate an outline from <h1>–<h6>. Search crawlers similarly inspect <main>, <article>, and <h1> to distinguish core subject matter from boilerplate headers/footers.',
        mcq:
          '1. Which element represents the dominant, unique content of the <body>?\nA) <div id="top">  B) <main>  C) <section>  D) <header>\nAnswer: B (<main> identifies the primary page content uniquely.)\n\n2. Which tag is a void element requiring no closing tag?\nA) <p>  B) <section>  C) <img>  D) <article>\nAnswer: C (<img> has no inner HTML or closing tag.)',
      }),
      makeProgNote({
        id: 'note-2',
        moduleId: 'mod-3',
        lessonId: 'les-4',
        title: 'Accessible HTML5 Forms, Data Tables & Native Validation',
        intro:
          'Interactive web applications rely on forms to gather enrollment requests, searches, and feedback, and on tables to present structured schedules cleanly. Proper form labeling and built-in validation prevent user frustration and bad data before any script runs.',
        simple:
          'A form is like a paper application sheet: every blank box needs a clear printed label right next to it (<label>), grouped boxes need a section title (<fieldset> + <legend>), and required fields need an asterisk or rule (required) so nobody submits half-empty paperwork.',
        detailed:
          'Connecting a <label> to an <input> via matching for and id attributes makes the label clickable—expanding touch area on phones—and enables screen readers to announce what data each box expects. HTML5 introduces specialized input types (email, tel, number, date, url) and constraint attributes (required, minlength, maxlength, min, max, pattern) that perform immediate client-side format validation cleanly.',
        concepts:
          '- Explicit Label Association: Pairing <label for="x"> with <input id="x">.\n- Constraint Validation: Browser-enforced rules such as required, minlength, and type="email".\n- Method Attribute: GET appends form inputs to URL query strings (for searches); POST sends data inside the request body (for registrations).\n- Scope Attribute: <th scope="col"> links table headers strictly to their columns.',
        steps:
          'Step 1: Choose GET (search/filter) or POST (account/submission) on <form>.\nStep 2: Group logically related inputs inside <fieldset> with a <legend>.\nStep 3: Create an <input> with unique id and descriptive name attribute.\nStep 4: Pair an explicit <label for="..."> immediately above or beside the input.\nStep 5: Apply type, required, minlength, and maxlength constraints.',
        codeLang: 'html',
        code: '<form action="/register" method="post">\n  <fieldset>\n    <legend>Course Enrollment Form</legend>\n    <div>\n      <label for="full-name">Student Full Name</label>\n      <input id="full-name" name="fullName" type="text" required minlength="2" maxlength="80" />\n    </div>\n    <div>\n      <label for="track">Learning Track</label>\n      <select id="track" name="track" required>\n        <option value="">Select a track</option>\n        <option value="html">HTML Web Fundamentals</option>\n        <option value="java">Java Programming</option>\n      </select>\n    </div>\n    <button type="submit">Request Enrollment</button>\n  </fieldset>\n</form>',
        lineByLine:
          'Line 1 sets POST submission to /register. Lines 2-3 group controls under an accessible legend. Lines 5-6 pair label and text input requiring 2-80 characters. Lines 9-14 enforce track selection with an empty default option. Line 15 submits the form.',
        output:
          'Browser renders a bordered fieldset labeled "Course Enrollment Form" with labeled inputs, a dropdown menu, and a clickable "Request Enrollment" button that blocks submission if name is blank or too short.',
        debugging:
          'If clicking Submit reloads the page unexpectedly or fails validation silently, check that name attributes exist on every field, for matches id character-for-character, and the default empty <option value=""> has an empty string value.',
        exercise:
          'Create an HTML form collecting student name, email, study hours per week (number min=1 max=40), preferred course radio buttons, and a reset + submit button pair.',
        realWorld:
          'Bank loan applications, university admissions portals, checkout shipping forms, and medical intake portals depend on accessible HTML5 labels and native validation to reduce drop-off and meet compliance audits.',
        important:
          '- Every interactive input must have a name attribute so its value is transmitted on submit.\n- Never use placeholder text alone in place of <label>.\n- Use <button type="button"> for non-submitting buttons inside a <form>.',
        mistakes:
          '- Forgetting value="" on the placeholder <option> of a required <select>.\n- Using <input type="text"> for emails and dates instead of email/date types.\n- Misspelling the matching id/for pair.',
        summary:
          'Well-engineered HTML5 forms combine <fieldset>, <legend>, explicit <label for> bindings, semantic input types, and declarative constraint attributes.',
        shortQ:
          'Q1: When should you use method="GET" vs method="POST" on an HTML form?\nAnswer: Use GET for idempotent searches/filters where parameters belong in the URL; use POST when submitting private data or creating/updating server records.\nQ2: Why is placeholder not a replacement for <label>?\nAnswer: Placeholders vanish once typing begins and are not reliably exposed as accessible labels.',
        longQ:
          'Q: Describe the accessibility and usability benefits of pairing <fieldset>, <legend>, explicit <label>, and native HTML5 validation attributes.\nAnswer Outline: Fieldsets logically group radio/checkbox sets; explicit labels increase clickable hit targets and inform screen readers; semantic input types trigger optimized touch keyboards; built-in constraints give instant error feedback without extra code.',
        mcq:
          '1. Which attribute links a <label> to an <input id="emailInput">?\nA) name="emailInput"  B) target="emailInput"  C) for="emailInput"  D) link="emailInput"\nAnswer: C (The "for" attribute must match the target element "id".)\n\n2. Which attribute specifies whether a table header applies to a column or row?\nA) role  B) scope  C) axis  D) group\nAnswer: B (<th scope="col"> or <th scope="row">.)',
      }),
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-1',
        quizType: 'module',
        title: 'Module 1 Quiz: Document Anatomy & Semantics',
        description: 'Assess your grasp of HTML5 document boilerplate, metadata, and semantic landmarks.',
        passingPercent: 70,
        questions: [
          {
            id: 'q-1',
            questionText: 'What is the primary purpose of <!DOCTYPE html> at the top of an HTML file?',
            options: [
              'To import external stylesheets',
              'To instruct the browser to use HTML5 standards mode',
              'To define the page title',
              'To encrypt form submissions',
            ],
            correctIndex: 1,
            explanation: '<!DOCTYPE html> switches the browser engine into modern HTML5 standards rendering mode.',
            topicTag: 'Document Anatomy',
            orderIndex: 1,
          },
          {
            id: 'q-2',
            questionText: 'Which HTML5 landmark element wraps the primary navigation menu of a website?',
            options: ['<menu-bar>', '<nav>', '<header-links>', '<div class="nav">'],
            correctIndex: 1,
            explanation: '<nav> explicitly identifies a section containing major navigation links.',
            topicTag: 'Semantic Landmarks',
            orderIndex: 2,
          },
          {
            id: 'q-3',
            questionText: 'Where should <meta charset="UTF-8" /> be placed?',
            options: ['Inside <footer>', 'Inside <main>', 'Inside <head>', 'After </html>'],
            correctIndex: 2,
            explanation: 'Document metadata including character encoding belongs inside the <head> section.',
            topicTag: 'Head Metadata',
            orderIndex: 3,
          },
          {
            id: 'q-4',
            questionText: 'Why should heading levels (<h1> to <h6>) not be skipped arbitrarily?',
            options: [
              'It breaks CSS color inheritance',
              'Screen readers and outlines rely on sequential hierarchy to navigate sections',
              'Browsers refuse to render <h4> without <h3>',
              'It prevents links from opening',
            ],
            correctIndex: 1,
            explanation: 'Assistive technologies use sequential heading order (h1 -> h2 -> h3) to map document structure.',
            topicTag: 'Text Hierarchy',
            orderIndex: 4,
          },
        ],
      },
      {
        id: 'quiz-2',
        quizType: 'final',
        title: 'Final Assessment: Complete Web Development Fundamentals',
        description: 'Comprehensive assessment covering HTML5 semantics, tables, media, and accessible forms.',
        passingPercent: 75,
        questions: [
          {
            id: 'q-5',
            questionText: 'Which table element provides an accessible title describing what the table represents?',
            options: ['<title>', '<legend>', '<caption>', '<summary>'],
            correctIndex: 2,
            explanation: '<caption> placed immediately inside <table> provides the official accessible table title.',
            topicTag: 'Data Tables',
            orderIndex: 1,
          },
          {
            id: 'q-6',
            questionText: 'What alt attribute should a purely decorative divider image use?',
            options: ['alt="decorative image"', 'alt=""', 'Omit the alt attribute completely', 'alt="none"'],
            correctIndex: 1,
            explanation: 'An empty alt="" tells screen readers to skip decorative graphics safely without omitting the attribute.',
            topicTag: 'Accessible Media',
            orderIndex: 2,
          },
          {
            id: 'q-7',
            questionText: 'Which attribute prevents a user from submitting a form while a required field is blank?',
            options: ['validate', 'mandatory', 'required', 'mustfill'],
            correctIndex: 2,
            explanation: 'The boolean attribute "required" triggers native browser validation when left empty.',
            topicTag: 'HTML Forms',
            orderIndex: 3,
          },
          {
            id: 'q-8',
            questionText: 'Which element groups related controls inside a form along with a descriptive caption?',
            options: ['<section> and <title>', '<fieldset> and <legend>', '<group> and <label>', '<article> and <caption>'],
            correctIndex: 1,
            explanation: '<fieldset> paired with <legend> semantically groups related form fields for all users.',
            topicTag: 'HTML Forms',
            orderIndex: 4,
          },
        ],
      },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Capstone: Semantic Multi-Section Academic Brochure & Registration Page',
      instructions:
        'Create a complete, valid HTML5 file featuring semantic landmarks (<header>, <nav>, <main>, <article>, <footer>), a structured course schedule table with <caption> and <th scope>, a <figure> diagram, and an accessible <form> with native validation.',
      dueDate: '2026-12-30',
      maxMarks: 100,
    },
  },

  // =========================================================================
  // 2. HTML – Practical Website Development
  // =========================================================================
  {
    id: 'html-practical-website-dev',
    departmentId: 'dept_programming_web',
    departmentName: 'Programming & Web Development',
    title: 'Practical HTML Website Development',
    category: 'Programming & Web Development',
    level: 'Intermediate',
    duration: '6 Weeks',
    thumbnailUrl: BRAND_IMAGES.courseTech,
    shortDescription:
      'Build real multi-page website architectures using clean HTML5 templates, ARIA landmarks, SEO meta tags, and embedded responsive structures.',
    fullDescription:
      'Bridge the gap from isolated tags to real multi-page production websites. Learners design reusable HTML site architectures, configure OpenGraph/SEO metadata, implement accessible disclosure widgets (<details>/<summary>), and optimize media loading.',
    introduction:
      'Knowing individual HTML tags is only step one; organizing an entire multi-page website cleanly requires architectural planning. This practical course walks through structuring navigation trees, SEO metadata, accessible interactive disclosures, and real-world landing pages.',
    objectives: [
      'Architect clean folder and relative path hierarchies for multi-page websites.',
      'Implement OpenGraph, canonical, and search-friendly <meta> structures.',
      'Use native HTML interactive primitives (<details>, <dialog>, <progress>, <datalist>).',
      'Audit websites using W3C validation and accessibility landmark checklists.',
    ],
    targetAudience:
      'Students who have completed HTML fundamentals and want hands-on experience assembling complete, maintainable multi-page websites.',
    prerequisites: 'Completion of HTML – Complete Web Development Fundamentals or equivalent tag familiarity.',
    syllabusSummary: [
      'Module 1: Multi-Page Information Architecture & Relative Path Routing',
      'Module 2: Search Metadata, OpenGraph Cards & Microdata Semantics',
      'Module 3: Native Interactive HTML Elements & Production QA Checklists',
    ],
    outcomes: [
      'Deliver a cohesive 4-page business/academic site using pure semantic HTML5.',
      'Configure clean social share metadata and search descriptions.',
      'Build zero-script FAQ accordions and autocomplete inputs with native HTML5 tags.',
      'Prepare clean HTML deliverables ready for styling and deployment.',
    ],
    moduleAssessments: [
      'Module 1 Assessment: Multi-Page Sitemap & Relative Link Audit',
      'Module 2 Assessment: Complete SEO & OpenGraph <head> Template',
      'Module 3 Assessment: Native Interactive Components Build',
    ],
    finalAssessmentTitle: 'Final Assessment: 4-Page Institution Website Blueprint',
    modules: [
      {
        id: 'mod-1',
        title: 'Multi-Page Information Architecture',
        description: 'Plan directory trees, shared navigation skeletons, and relative linking.',
        assessmentTitle: 'Module 1 Check: Site Folder Map',
        assessmentCriteria: 'Zero broken relative paths across root and nested pages.',
        orderIndex: 1,
      },
      {
        id: 'mod-2',
        title: 'SEO Metadata & Social Card Markup',
        description: 'Optimize <head> tags for search discovery and clean link previews.',
        assessmentTitle: 'Module 2 Check: Metadata Verification',
        assessmentCriteria: 'Includes title, meta description, canonical, og:title, og:description.',
        orderIndex: 2,
      },
      {
        id: 'mod-3',
        title: 'Native Interactive Elements & Responsive Images',
        description: 'Use <details>, <datalist>, <picture>, and loading="lazy" effectively.',
        assessmentTitle: 'Module 3 Check: Interactive FAQ & Media Page',
        assessmentCriteria: 'Accessible FAQ disclosures and responsive <picture> art direction.',
        orderIndex: 3,
      },
    ],
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        title: 'Multi-Page Folder Organization & Relative Paths',
        summary: 'Organize index.html, sub-pages, assets, and anchor fragment links systematically.',
        objectives: [
          'Explain the difference between ./, ../, and root-relative / paths.',
          'Keep shared header and footer landmarks consistent across pages.',
          'Use skip-to-content links for keyboard accessibility.',
        ],
        contentBody:
          'Real websites consist of connected pages (Home, About, Courses, Contact) organized cleanly inside folders.\n\nA typical static site places index.html at the project root, sub-sections inside folders such as courses/index.html or pages/contact.html, and media in assets/images/. When referencing files from nested folders, ../ navigates one level upward while / resolves from the server root.\n\nAdd a skip link (<a href="#main-content">Skip to main content</a>) as the very first focusable element inside <body> so keyboard users can bypass header navigation effortlessly.',
        examples:
          '<body>\n  <a href="#main-content">Skip to main content</a>\n  <header>\n    <nav aria-label="Primary">\n      <ul>\n        <li><a href="./index.html" aria-current="page">Home</a></li>\n        <li><a href="./courses.html">Courses</a></li>\n        <li><a href="./contact.html">Contact</a></li>\n      </ul>\n    </nav>\n  </header>\n  <main id="main-content">\n    <h1>Welcome</h1>\n  </main>\n</body>',
        exercisePrompt:
          'Sketch a 4-file website structure (index.html, about.html, courses/index.html, contact.html) and write the exact <nav> links needed inside courses/index.html to return to Home and Contact.',
        durationMinutes: 25,
        orderIndex: 1,
      },
      {
        id: 'les-2',
        moduleId: 'mod-2',
        title: 'Production Head Metadata, SEO & OpenGraph',
        summary: 'Write search-friendly titles, descriptions, canonical links, and social share meta tags.',
        objectives: [
          'Craft concise unique <title> and <meta name="description"> values per page.',
          'Define <link rel="canonical"> to prevent duplicate URL indexing.',
          'Add og:title, og:description, og:type, and twitter:card tags.',
        ],
        contentBody:
          'While visitors never read raw <head> markup directly, search engines and messaging apps rely on it every time a page is crawled or shared.\n\nKeep <title> between 50 and 60 characters and <meta name="description"> near 140–155 characters describing the exact page value. Include <link rel="canonical" href="https://example.org/courses" /> when URLs could be accessed with tracking parameters, and include OpenGraph tags so shared URLs render clean previews.',
        examples:
          '<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>Courses | RM HEAVEN Online Academy</title>\n  <meta name="description" content="Explore structured HTML, Java, Python, AI, Design, and Digital Marketing courses at RM HEAVEN." />\n  <link rel="canonical" href="https://rmheaven.academy/courses" />\n  <meta property="og:title" content="Courses | RM HEAVEN" />\n  <meta property="og:type" content="website" />\n</head>',
        exercisePrompt:
          'Author complete <head> metadata sections for two distinct pages: a Course Catalogue page and an Admissions Contact page.',
        durationMinutes: 25,
        orderIndex: 2,
      },
      {
        id: 'les-3',
        moduleId: 'mod-3',
        title: 'Native Interactive HTML: Details, Datalist & Picture',
        summary: 'Deliver accordions, autocomplete suggestions, and responsive images with zero extra scripts.',
        objectives: [
          'Build accessible FAQ accordions using <details> and <summary>.',
          'Provide input autocomplete hints via <datalist>.',
          'Serve screen-appropriate images with <picture> and loading="lazy".',
        ],
        contentBody:
          'Modern HTML5 includes rich native widgets that work reliably without external libraries:\n\n1. <details> & <summary>: Creates an interactive expandable accordion with full keyboard support built directly into the browser.\n2. <datalist>: Connects to an <input list="..."> to offer suggested options while still allowing custom typing.\n3. <picture> & loading="lazy": Allows serving WebP or cropped mobile images via <source media="..."> and defers offscreen image downloads until scrolled near.',
        examples:
          '<section aria-labelledby="faq-heading">\n  <h2 id="faq-heading">Frequently Asked Questions</h2>\n  <details>\n    <summary>How is course enrollment approved?</summary>\n    <p>Submit an enrollment request from the course page; administrators review and unlock dashboard access.</p>\n  </details>\n</section>',
        exercisePrompt:
          'Build a 3-question interactive FAQ section using <details> and <summary>, plus a city search input linked to a 5-city <datalist>.',
        durationMinutes: 30,
        orderIndex: 3,
      },
    ],
    studyNotes: [
      makeProgNote({
        id: 'note-1',
        moduleId: 'mod-1',
        lessonId: 'les-1',
        title: 'Multi-Page Site Architecture, Navigation & Path Resolution',
        intro:
          'Practical website development begins with clean file organization and unambiguous navigation paths. Poorly structured relative links cause broken images and 404 pages whenever files move between folders.',
        simple:
          'Imagine folders on your computer like rooms in a building. "./file.html" means "in this same room", "../file.html" means "step back out to the hallway first", and "/file.html" means "start from the main front door every single time".',
        detailed:
          'In multi-page HTML projects, consistent navigation bars use aria-current="page" on the link matching the active page so assistive tools announce where the learner currently sits in the site tree. Fragment identifiers (#section-id) let users jump directly to a specific heading or form on long documents. Combining clean folder naming (lowercase hyphens, no spaces) with predictable relative paths ensures websites work identically on local machines and cloud web servers.',
        concepts:
          '- Relative Path: Location relative to the current file (./about.html, ../index.html).\n- Root-Relative Path: Location anchored at the web domain root (/courses/index.html).\n- aria-current="page": Accessibility attribute marking the active navigation link.\n- Skip Link: Visually hidden or subtle anchor linking straight to #main-content.',
        steps:
          'Step 1: Name all files and folders in lowercase with hyphens (no spaces or uppercase quirks).\nStep 2: Place the primary home file at index.html in the root.\nStep 3: Add a consistent <header><nav> block across every HTML template.\nStep 4: Set aria-current="page" on the current page link only.\nStep 5: Verify every href and img src works from both root and nested folders.',
        codeLang: 'html',
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>Syllabus Directory</title>\n</head>\n<body>\n  <a href="#main-body">Skip to content</a>\n  <header>\n    <nav aria-label="Site Navigation">\n      <a href="../index.html">Home</a>\n      <a href="./syllabus.html" aria-current="page">Syllabus</a>\n      <a href="../contact.html#support-form">Support Desk</a>\n    </nav>\n  </header>\n  <main id="main-body">\n    <h1>Course Syllabus Directory</h1>\n    <p>Inspect module schedules and assessment outlines.</p>\n  </main>\n</body>\n</html>',
        lineByLine:
          'Line 8 creates a skip anchor targeting id="main-body". Lines 11-13 navigate up one directory (../) for Home/Support and within the current directory (./) for Syllabus, marking Syllabus as active via aria-current="page". Line 13 also appends #support-form to jump directly to the form section.',
        output:
          'Browser displays a skip link followed by three navigation links ("Home", "Syllabus", "Support Desk") and the H1 "Course Syllabus Directory".',
        debugging:
          'When an image or page fails to load inside a subfolder, count the folder depth carefully. If you are inside /courses/java/lesson1.html and want /assets/logo.png, you need ../../assets/logo.png (two levels up).',
        exercise:
          'Create a simulated 3-page navigation bar for an institution portal and annotate how paths change between /index.html and /programs/internships.html.',
        realWorld:
          'Corporate documentation portals, multi-department university sites, and static marketing sites rely on predictable URL hierarchies for long-term link stability and clean bookmarks.',
        important:
          '- Never include spaces in HTML filenames (use web-design.html instead of Web Design.html).\n- Always test links using a local HTTP server rather than double-clicking files when using root-relative paths (/).',
        mistakes:
          '- Using Windows backslash paths (images\\banner.jpg) instead of forward slashes (images/banner.jpg).\n- Leaving aria-current="page" hardcoded on Home across all sub-pages.',
        summary:
          'Clean multi-page HTML architecture depends on lowercase hyphenated paths, accurate ./ and ../ traversal, fragment anchors, and accessible skip/active-page markers.',
        shortQ:
          'Q1: What does "../" mean in an HTML href attribute?\nAnswer: It instructs the browser to move one directory level up from the current file.\nQ2: Why do accessibility standards recommend a skip link at the top of <body>?\nAnswer: It lets keyboard-only and screen-reader users bypass long navigation menus in one press.',
        longQ:
          'Q: Compare relative paths (./ and ../), root-relative paths (/), and full absolute URLs (https://...) in terms of portability and maintenance.\nAnswer Outline: Relative paths work without a domain even offline, root-relative paths stay consistent at any folder depth on a web server, and absolute URLs are required for external sites and canonical/OpenGraph tags.',
        mcq:
          '1. Which attribute indicates the currently active page inside a <nav> list?\nA) active="true"  B) aria-current="page"  C) selected="nav"  D) current-url\nAnswer: B (aria-current="page" communicates active page status to assistive tech.)\n\n2. To link from /courses/html.html up to /contact.html, which path is correct?\nA) ./contact.html  B) ../contact.html  C) ../../contact.html  D) contact.html\nAnswer: B (../ steps up from /courses/ to the root folder.)',
      }),
      makeProgNote({
        id: 'note-2',
        moduleId: 'mod-3',
        lessonId: 'les-3',
        title: 'Native Interactive HTML Widgets & Responsive Media Delivery',
        intro:
          'Many developers reach immediately for complex scripts to build expandable FAQs, input suggestions, and responsive images—even though HTML5 already supplies built-in, zero-dependency elements that are faster and accessible out of the box.',
        simple:
          '<details> is a ready-made accordion box that opens when clicked, <datalist> is a helper suggestion list attached to a text input, and <picture> lets you hand small phones a compact photo while giving wide monitors a high-resolution image.',
        detailed:
          'Using native HTML elements reduces page weight and preserves keyboard navigation automatically. Pressing Enter or Space on a <summary> toggles its parent <details> open state cleanly; adding the boolean "open" attribute displays it expanded initially. Similarly, combining <img loading="lazy" decoding="async" ...> prevents images far below the fold from delaying initial page rendering.',
        concepts:
          '- <details> & <summary>: Built-in collapsible disclosure container.\n- <datalist>: Predefined autocomplete options linked via input list="id".\n- <picture>: Art-direction wrapper containing responsive <source media="..."> rules and a fallback <img>.\n- loading="lazy": Defers image network requests until approaching the viewport.',
        steps:
          'Step 1: Wrap each FAQ item in <details> with the question inside <summary>.\nStep 2: For search inputs, add a <datalist id="topics"> with <option> tags and link via list="topics".\nStep 3: Wrap responsive hero banners in <picture>, placing specific <source media> tags above the default <img> fallback.\nStep 4: Never apply loading="lazy" to the main above-the-fold hero image—apply it to lower-page galleries.',
        codeLang: 'html',
        code: '<section>\n  <h2>Course Finder &amp; FAQ</h2>\n  <label for="course-search">Choose a Topic</label>\n  <input id="course-search" name="topic" list="rm-topics" placeholder="Type to filter..." />\n  <datalist id="rm-topics">\n    <option value="HTML Web Fundamentals"></option>\n    <option value="Java Programming"></option>\n    <option value="Python Automation"></option>\n  </datalist>\n\n  <details open>\n    <summary>What happens after I submit an enrollment request?</summary>\n    <p>An administrator reviews your profile and activates access inside your dashboard.</p>\n  </details>\n</section>',
        lineByLine:
          'Lines 3-9 attach the "rm-topics" datalist to the text input so users see matching suggestions as they type. Lines 11-14 create an expanded FAQ accordion ("open" attribute) whose <summary> toggles the answer paragraph cleanly on click.',
        output:
          'Page displays a labeled text box showing autocomplete dropdown options ("HTML Web Fundamentals", "Java Programming", "Python Automation") and an expandable FAQ block opened by default.',
        debugging:
          'If <datalist> suggestions do not appear, confirm the <input list="..."> value matches <datalist id="..."> exactly. If <picture> always picks the <img>, make sure <source> tags appear BEFORE the fallback <img> tag inside <picture>.',
        exercise:
          'Build an interactive Course Overview page featuring 3 <details> syllabus modules, a <progress value="65" max="100"> bar, and a <datalist> city picker.',
        realWorld:
          'E-commerce product specification accordions, institutional admission FAQs, and lightweight documentation sites prefer <details>/<summary> for instant responsiveness and zero script failure risk.',
        important:
          '- Never lazy-load the primary above-the-fold hero image (it hurts Largest Contentful Paint).\n- Every <picture> element MUST end with one standard <img> element with alt text.',
        mistakes:
          '- Placing <summary> anywhere other than the first child inside <details>.\n- Putting interactive buttons inside <summary> (can confuse screen reader toggles).',
        summary:
          'Native HTML5 elements like <details>, <summary>, <datalist>, and <picture> provide accessible interactivity and optimized media loading cleanly.',
        shortQ:
          'Q1: Which tag must be the first child inside a <details> element?\nAnswer: <summary>.\nQ2: Why should you avoid loading="lazy" on the primary hero banner image?\nAnswer: It delays downloading the most important visible image at the top of the screen.',
        longQ:
          'Q: Explain how <picture> differs from a standard <img> tag and when <picture> should be chosen in practical website development.\nAnswer Outline: A standard <img> displays one source, whereas <picture> allows art direction (cropping differently for mobile portrait vs desktop landscape using <source media="...">) and modern format fallback (WebP with JPEG fallback).',
        mcq:
          '1. Which attribute connects an <input> field to a <datalist id="cities">?\nA) datalist="cities"  B) options="cities"  C) list="cities"  D) for="cities"\nAnswer: C (The "list" attribute references the datalist ID.)\n\n2. What happens when <details open> is rendered?\nA) It disables clicking  B) It is expanded initially on page load  C) It locks the accordion  D) It hides the <summary>\nAnswer: B (The boolean "open" attribute makes the disclosure expanded by default.)',
      }),
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-1',
        quizType: 'module',
        title: 'Module 1 Quiz: Architecture & Metadata',
        description: 'Verify relative path navigation, skip links, and production <head> metadata.',
        passingPercent: 70,
        questions: [
          {
            id: 'q-1',
            questionText: 'Inside /pages/about.html, how do you link back to /index.html at the project root?',
            options: ['./index.html', '../index.html', 'index.html', '.../index.html'],
            correctIndex: 1,
            explanation: '../ steps out of the /pages/ directory up to the root folder.',
            topicTag: 'Path Resolution',
            orderIndex: 1,
          },
          {
            id: 'q-2',
            questionText: 'What is the purpose of <link rel="canonical" href="..." />?',
            options: [
              'Loads the site favicon',
              'Specifies the preferred official URL for search engines',
              'Links an external font',
              'Preloads video files',
            ],
            correctIndex: 1,
            explanation: 'Canonical tags tell search engines which primary URL represents duplicate query variations.',
            topicTag: 'SEO Metadata',
            orderIndex: 2,
          },
          {
            id: 'q-3',
            questionText: 'Which attribute marks the currently active page link for assistive technologies?',
            options: ['aria-current="page"', 'data-active="true"', 'tabindex="0"', 'rel="current"'],
            correctIndex: 0,
            explanation: 'aria-current="page" is the standard WAI-ARIA attribute for active navigation links.',
            topicTag: 'Accessibility',
            orderIndex: 3,
          },
          {
            id: 'q-4',
            questionText: 'Why place a "Skip to main content" link at the top of <body>?',
            options: [
              'To boost download speed',
              'To let keyboard users bypass repetitive navigation menus',
              'To hide the footer',
              'To validate forms automatically',
            ],
            correctIndex: 1,
            explanation: 'Keyboard and screen-reader users can jump straight past header navigation links.',
            topicTag: 'Accessibility',
            orderIndex: 4,
          },
        ],
      },
      {
        id: 'quiz-2',
        quizType: 'final',
        title: 'Final Assessment: Practical HTML5 Website Development',
        description: 'Final assessment covering native widgets, responsive media, and site architecture.',
        passingPercent: 75,
        questions: [
          {
            id: 'q-5',
            questionText: 'Which native element pair creates a collapsible accordion without any script?',
            options: ['<accordion> and <item>', '<details> and <summary>', '<fieldset> and <legend>', '<figure> and <figcaption>'],
            correctIndex: 1,
            explanation: '<details> and <summary> create a native toggleable disclosure panel.',
            topicTag: 'Interactive HTML',
            orderIndex: 1,
          },
          {
            id: 'q-6',
            questionText: 'Inside <picture>, where must the fallback <img> element be placed?',
            options: ['First before any <source>', 'Last after all <source> elements', 'Outside <picture>', 'Inside <head>'],
            correctIndex: 1,
            explanation: 'Browsers evaluate <source> tags in order and require the fallback <img> as the final child.',
            topicTag: 'Responsive Media',
            orderIndex: 2,
          },
          {
            id: 'q-7',
            questionText: 'Which attribute defers downloading an off-screen gallery image until the user scrolls near it?',
            options: ['defer="true"', 'async="image"', 'loading="lazy"', 'scroll="wait"'],
            correctIndex: 2,
            explanation: 'loading="lazy" instructs the browser to defer fetching offscreen images.',
            topicTag: 'Performance',
            orderIndex: 3,
          },
          {
            id: 'q-8',
            questionText: 'What value should be avoided in web URLs and folder names to prevent cross-platform link errors?',
            options: ['Lowercase letters', 'Hyphens (-)', 'Spaces and mixed uppercase/backslash characters', 'Numeric prefixes'],
            correctIndex: 2,
            explanation: 'Spaces and backslashes break or encode inconsistently across web servers.',
            topicTag: 'Architecture',
            orderIndex: 4,
          },
        ],
      },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Capstone: 4-Page Institution Website Architecture',
      instructions:
        'Deliver a cohesive 4-page HTML5 site (index.html, about.html, courses.html, contact.html) featuring complete OpenGraph/SEO <head> metadata, aria-current navigation, a native <details> FAQ block, and a <datalist>-assisted search bar.',
      dueDate: '2026-12-30',
      maxMarks: 100,
    },
  },

  // =========================================================================
  // 3. Java Programming – Beginner to Advanced
  // =========================================================================
  {
    id: 'java-beginner-to-advanced',
    departmentId: 'dept_programming_web',
    departmentName: 'Programming & Web Development',
    title: 'Java Programming',
    category: 'Programming & Web Development',
    level: 'Beginner',
    duration: '10 Weeks',
    thumbnailUrl: BRAND_IMAGES.courseTech,
    shortDescription:
      'Build rock-solid Java fundamentals from JVM setup, data types, and control flow to methods, arrays, and exception handling.',
    fullDescription:
      'Java powers enterprise backends, Android systems, and financial infrastructure worldwide. This comprehensive progression takes learners from writing their very first compiled Java class through loops, methods, collections, file I/O, and safe exception handling.',
    introduction:
      'Java combines strict static type safety with write-once, run-anywhere portability via the Java Virtual Machine (JVM). Mastering Java from scratch gives learners disciplined problem-solving habits applicable across enterprise and algorithmic engineering.',
    objectives: [
      'Explain how javac compiles .java source files into JVM bytecode (.class).',
      'Declare primitive types, Strings, conditionals, and iteration loops accurately.',
      'Modularize programs using reusable static methods, arrays, and ArrayList collections.',
      'Handle runtime failures safely with try-catch-finally and checked/unchecked exceptions.',
    ],
    targetAudience:
      'Aspiring software engineers, computer science students, and professionals building a durable foundation in strongly typed programming.',
    prerequisites: 'No prior coding experience required; basic comfort installing software and typing code.',
    syllabusSummary: [
      'Module 1: JVM Architecture, Variables, Operators & Conditionals',
      'Module 2: Loops, Methods, Recursion & Arrays',
      'Module 3: Strings, ArrayLists, Exception Handling & File I/O',
    ],
    outcomes: [
      'Write, compile, and debug multi-method console Java applications.',
      'Select appropriate loop structures (for, enhanced for-each, while) for data traversal.',
      'Prevent NullPointerException and ArrayIndexOutOfBoundsException systematically.',
      'Read and write structured text records using java.nio / FileWriter.',
    ],
    moduleAssessments: [
      'Module 1 Quiz: Types, Casting & Control Flow',
      'Module 2 Lab: Student Grade Analyzer Using Arrays & Methods',
      'Module 3 Assessment: Exception-Safe Ledger Application',
    ],
    finalAssessmentTitle: 'Final Assessment: Console Student Records & Grade Engine in Java',
    modules: [
      {
        id: 'mod-1',
        title: 'JVM Fundamentals, Data Types & Control Flow',
        description: 'Understand bytecode compilation, primitive types, Scanner input, and if/switch branching.',
        assessmentTitle: 'Module 1 Check: Syntax & Branching',
        assessmentCriteria: 'Correct primitive sizing, integer division awareness, and switch syntax.',
        orderIndex: 1,
      },
      {
        id: 'mod-2',
        title: 'Loops, Reusable Methods & Arrays',
        description: 'Write iterative algorithms, overloaded methods, and single/multi-dimensional arrays.',
        assessmentTitle: 'Module 2 Check: Score Statistics Utility',
        assessmentCriteria: 'Clean method decomposition with zero off-by-one array bounds errors.',
        orderIndex: 2,
      },
      {
        id: 'mod-3',
        title: 'Collections, Exception Handling & Text File I/O',
        description: 'Transition from fixed arrays to ArrayList/HashMap and safeguard I/O operations.',
        assessmentTitle: 'Module 3 Check: Resilient File Parser',
        assessmentCriteria: 'Handles FileNotFoundException and NumberFormatException cleanly.',
        orderIndex: 3,
      },
    ],
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        title: 'How Java Works: JDK, Bytecode & Primitive Types',
        summary: 'Compile your first main method and work safely with int, double, boolean, and String.',
        objectives: [
          'Explain the roles of JDK, JRE, and JVM.',
          'Choose between int, long, double, boolean, and char appropriately.',
          'Avoid integer division truncation when computing averages.',
        ],
        contentBody:
          'Java is both compiled and interpreted. When you run javac Main.java, the compiler checks all data types at compile time and produces platform-independent bytecode (Main.class). The JVM then executes that bytecode cleanly on Windows, macOS, or Linux.\n\nEvery Java application starts inside public static void main(String[] args). Variables must declare a type before storing a value: int holds 32-bit whole numbers, double holds 64-bit decimals, boolean stores true/false, and String holds immutable text.',
        examples:
          'public class CourseCalculator {\n  public static void main(String[] args) {\n    int lessonsCompleted = 7;\n    int totalLessons = 10;\n    double percent = (lessonsCompleted * 100.0) / totalLessons;\n    System.out.println("Progress: " + percent + "%");\n  }\n}',
        exercisePrompt:
          'Write a Java program that stores a student name, 3 integer exam marks, computes the exact decimal average (using double division), and prints "Pass" if average >= 50 else "Review Needed".',
        durationMinutes: 35,
        orderIndex: 1,
      },
      {
        id: 'les-2',
        moduleId: 'mod-2',
        title: 'Loops, Modular Methods & Array Traversal',
        summary: 'Eliminate duplicated logic using parameterized methods and iterate cleanly over arrays.',
        objectives: [
          'Trace for, while, and enhanced for-each loops step by step.',
          'Define methods with explicit return types and parameters.',
          'Find minimum, maximum, and sum across an int[] array.',
        ],
        contentBody:
          'Arrays store fixed-length sequences of elements of the same type using zero-based indices (0 to arr.length - 1). Attempting to read index arr.length throws ArrayIndexOutOfBoundsException.\n\nBreaking repetitive tasks into small static methods—such as computeAverage(int[] scores)—makes programs readable, testable, and reusable across classes.',
        examples:
          'public class ScoreUtils {\n  public static double average(int[] marks) {\n    if (marks.length == 0) return 0.0;\n    int sum = 0;\n    for (int m : marks) {\n      sum += m;\n    }\n    return (double) sum / marks.length;\n  }\n  public static void main(String[] args) {\n    int[] scores = {82, 91, 76, 88};\n    System.out.println("Average: " + average(scores));\n  }\n}',
        exercisePrompt:
          'Write a Java method int countPassing(int[] marks, int threshold) that returns how many scores meet or exceed threshold, and test it from main().',
        durationMinutes: 40,
        orderIndex: 2,
      },
      {
        id: 'les-3',
        moduleId: 'mod-3',
        title: 'ArrayList, HashMap & Try-Catch Exception Handling',
        summary: 'Manage dynamic collections and guard against invalid input or missing files cleanly.',
        objectives: [
          'Use ArrayList<String> and HashMap<String, Integer> for dynamic storage.',
          'Differentiate checked exceptions (IOException) from unchecked exceptions.',
          'Write clean try-with-resources blocks for Scanner or BufferedReader.',
        ],
        contentBody:
          'Unlike fixed arrays, ArrayList<T> grows automatically as elements are added with .add(). HashMap<K, V> maps unique keys (such as student IDs) directly to values for fast lookup.\n\nWhen reading user input or files, unexpected conditions occur. Placing risky code inside try { ... } catch (NumberFormatException e) { ... } lets your program recover gracefully and explain the problem instead of crashing.',
        examples:
          'import java.util.HashMap;\n\npublic class RosterMap {\n  public static void main(String[] args) {\n    HashMap<String, Integer> attendance = new HashMap<>();\n    attendance.put("STU-101", 95);\n    attendance.put("STU-102", 88);\n    try {\n      int parsed = Integer.parseInt("notANumber");\n      System.out.println(parsed);\n    } catch (NumberFormatException ex) {\n      System.out.println("Invalid numeric format handled safely.");\n    }\n    System.out.println("STU-101 Attendance: " + attendance.get("STU-101"));\n  }\n}',
        exercisePrompt:
          'Create an ArrayList<String> of 5 course names, remove one safely, check if a given course exists with .contains(), and print remaining items with a loop.',
        durationMinutes: 40,
        orderIndex: 3,
      },
    ],
    studyNotes: [
      makeProgNote({
        id: 'note-1',
        moduleId: 'mod-1',
        lessonId: 'les-1',
        title: 'Java Compilation Pipeline, Types & Control Flow',
        intro:
          'Understanding how Java verifies types before running code is the key to writing bug-resistant programs. Unlike loosely typed languages, Java forces every variable to state its exact data type up front.',
        simple:
          'Think of Java variables like labeled storage containers: a box labeled "int" only accepts whole numbers, and a box labeled "double" accepts decimals. The Java compiler acts like a strict warehouse inspector who checks every box BEFORE the factory starts running.',
        detailed:
          'Java source files (.java) contain a public class whose name matches the filename exactly (e.g., GradeCheck.java defines public class GradeCheck). When compiled with javac, syntax errors and type mismatches are flagged immediately. Numeric operations obey strict promotion rules: dividing two ints (7 / 2) discards the remainder and yields 3, whereas promoting one operand to double (7.0 / 2) yields 3.5.\n\nString comparison is another critical Java concept: == compares memory references (whether two variables point to the exact same object), while .equals() compares the actual character contents.',
        concepts:
          '- Bytecode (.class): Intermediate instruction format executed by the JVM.\n- Primitive Types: Built-in value types (byte, short, int, long, float, double, boolean, char).\n- Reference Types: Objects accessed by reference (String, arrays, ArrayList).\n- Integer Truncation: Loss of fractional remainder when dividing two integers.',
        steps:
          'Step 1: Name your file identically to the public class (e.g., Evaluator.java).\nStep 2: Define public static void main(String[] args) as the entry point.\nStep 3: Declare variables with the tightest accurate type (int for counts, double for percentages).\nStep 4: Always cast at least one operand to (double) before computing averages.\nStep 5: Compare Strings with a.equals(b), never ==.',
        codeLang: 'java',
        code: 'public class Evaluator {\n  public static void main(String[] args) {\n    String track = "Java";\n    int obtained = 43;\n    int maxMarks = 50;\n    double percentage = ((double) obtained / maxMarks) * 100;\n\n    if (track.equals("Java") && percentage >= 75.0) {\n      System.out.println("Distinction: " + percentage + "%");\n    } else {\n      System.out.println("Score: " + percentage + "%");\n    }\n  }\n}',
        lineByLine:
          'Line 1 declares class Evaluator matching Evaluator.java. Line 2 starts execution. Lines 3-5 store String and integer marks. Line 6 casts obtained to double before dividing by maxMarks so 43/50 yields 0.86 instead of 0. Line 8 compares String content properly using .equals(). Lines 9-11 print the branch outcome.',
        output: 'Distinction: 86.0%',
        debugging:
          'Bug 1: Writing (obtained / maxMarks) * 100 yields 0.0 because integer division happens inside parentheses first. Fix: cast (double) obtained.\nBug 2: Calling track.equals("Java") when track is null throws NullPointerException. Safer alternative: "Java".equals(track).',
        exercise:
          'Write a Java program that takes three integer variables (a, b, c), finds the largest using if-else-if comparisons without helper libraries, and prints whether the average is even or odd after rounding.',
        realWorld:
          'Banking ledgers, enterprise payroll engines, and university exam processing services depend on strong static typing and exact numeric casting so rounding or type errors never corrupt financial or academic figures.',
        important:
          '- Class names start with UpperCamelCase; variables and methods use lowerCamelCase.\n- Use "Literal".equals(variable) to avoid NullPointerException.\n- End every statement with a semicolon (;).',
        mistakes:
          '- Comparing Strings with == instead of .equals().\n- Performing integer division before casting to double.\n- Forgetting braces {} around multi-line if blocks.',
        summary:
          'Java checks types at compile time via javac, relies on public static void main as the entry point, requires explicit decimal casting for division, and compares Strings via .equals().',
        shortQ:
          'Q1: What is the result of 9 / 2 in Java?\nAnswer: 4 (integer division truncates the decimal).\nQ2: Why should Strings be compared with .equals() instead of ==?\nAnswer: == checks object memory addresses, while .equals() checks actual text equality.',
        longQ:
          'Q: Trace what happens from saving HelloWorld.java to seeing output on screen, explaining the roles of javac and the JVM.\nAnswer Outline: javac parses HelloWorld.java, verifies syntax/types, and outputs HelloWorld.class bytecode. The JVM loads HelloWorld.class, verifies bytecode safety, locates main(String[] args), and translates bytecode into host machine instructions.',
        mcq:
          '1. Which statement safely computes the decimal average of int total = 15 and int count = 4?\nA) double avg = total / count;  B) double avg = (double) total / count;  C) int avg = total / 4.0;  D) double avg = (int) total / count;\nAnswer: B (Casting total to double promotes the division to floating-point.)\n\n2. Which exception occurs if you call str.length() when str is null?\nA) ArithmeticException  B) NullPointerException  C) ArrayIndexOutOfBoundsException  D) ClassCastException\nAnswer: B (Invoking a method on a null reference throws NullPointerException.)',
      }),
      makeProgNote({
        id: 'note-2',
        moduleId: 'mod-3',
        lessonId: 'les-3',
        title: 'Java Collections (ArrayList, HashMap) & Exception Safety',
        intro:
          'Fixed arrays work well when size never changes, but real software processes dynamic lists of enrollments, search indexes, and unreliable user input. Java Collections and structured exception handling keep data dynamic and runtime execution resilient.',
        simple:
          'An ArrayList is like an expandable binder where you can add or remove pages anytime, a HashMap is an instant dictionary mapping IDs to names, and try-catch acts like a safety net catching falling plates before they crash your program.',
        detailed:
          'The java.util.ArrayList<E> class uses generics (<String>, <Integer>) to guarantee every item inside the list matches the expected type at compile time. Wrapper classes (Integer, Double, Boolean) allow primitive values to live inside generic collections.\n\nJava divides exceptions into Checked Exceptions (like IOException, which the compiler forces you to catch or declare with throws) and Unchecked RuntimeExceptions (like NumberFormatException or NullPointerException, prevented primarily via defensive coding and validation).',
        concepts:
          '- Generics (<E>): Compile-time type parameters ensuring type safety inside collections.\n- Autoboxing: Automatic conversion between int and Integer.\n- Try-Catch-Finally: Structured blocks separating normal logic, error recovery, and cleanup.\n- Try-With-Resources: Automatically closes files or streams when leaving the try block.',
        steps:
          'Step 1: Import java.util.ArrayList and java.util.HashMap.\nStep 2: Instantiate collections using diamond syntax: ArrayList<String> items = new ArrayList<>();.\nStep 3: Check .containsKey() or null before reading HashMap values into calculations.\nStep 4: Wrap input parsing (Integer.parseInt) and file I/O in targeted try-catch blocks.\nStep 5: Never swallow exceptions with empty catch blocks—log or handle meaningfully.',
        codeLang: 'java',
        code: 'import java.util.ArrayList;\nimport java.util.HashMap;\n\npublic class CourseRoster {\n  public static void main(String[] args) {\n    ArrayList<String> modules = new ArrayList<>();\n    modules.add("Variables");\n    modules.add("Loops");\n    modules.add("Collections");\n\n    HashMap<String, String> grades = new HashMap<>();\n    grades.put("A101", "Distinction");\n\n    String rawScore = "92x";\n    try {\n      int numeric = Integer.parseInt(rawScore);\n      System.out.println("Parsed mark: " + numeric);\n    } catch (NumberFormatException e) {\n      System.out.println("Warning: Invalid score text \"" + rawScore + "\"");\n    }\n    System.out.println("Total modules: " + modules.size() + ", A101: " + grades.getOrDefault("A101", "Pending"));\n  }\n}',
        lineByLine:
          'Lines 1-2 import utility collections. Lines 6-9 dynamically populate an ArrayList of module names. Lines 11-12 store a key-value pair in HashMap. Lines 14-20 attempt Integer.parseInt("92x"), catch NumberFormatException gracefully, and continue execution on line 21 using getOrDefault().',
        output:
          'Warning: Invalid score text "92x"\nTotal modules: 3, A101: Distinction',
        debugging:
          'Avoid raw collections like ArrayList list = new ArrayList() without <> generics—doing so disables compile-time checks and leads to runtime ClassCastException. Also never modify an ArrayList using .remove() directly inside a standard for-each loop (causes ConcurrentModificationException); iterate with an index or Iterator instead.',
        exercise:
          'Build a Java method that reads an ArrayList<String> of numeric strings (including one invalid string like "N/A"), sums all valid integers using try-catch inside the loop, and prints both the sum and skipped entry count.',
        realWorld:
          'Order-processing microservices, CSV import pipelines, and REST request validators use HashMap indexes and targeted exception handling to isolate single malformed records without halting entire batches.',
        important:
          '- Always specify generic types (List<String>, Map<String, Integer>).\n- Catch specific exceptions (NumberFormatException) rather than catching generic Exception everywhere.\n- Use map.getOrDefault(key, fallback) to avoid null checks.',
        mistakes:
          '- Using primitive int inside ArrayList<int> (must use ArrayList<Integer>).\n- Leaving catch blocks empty so failures go completely unnoticed.',
        summary:
          'Java Generics, ArrayList, HashMap, and targeted try-catch exception blocks work together to store dynamic data cleanly and prevent runtime crashes.',
        shortQ:
          'Q1: Why is ArrayList<int> invalid in Java?\nAnswer: Java generics only accept reference types, so the wrapper class ArrayList<Integer> must be used.\nQ2: What does HashMap.getOrDefault(key, defaultVal) prevent?\nAnswer: It prevents returning null when a key is absent from the map.',
        longQ:
          'Q: Contrast fixed arrays (int[]) with ArrayList<Integer> and describe when each is preferred, including how exception handling protects collection lookups.\nAnswer Outline: int[] offers minimal memory overhead and fixed size for dense numeric work; ArrayList provides dynamic resizing and rich helper methods; HashMap handles key-based lookups; catching IndexOutOfBounds or NumberFormat keeps user-facing programs resilient.',
        mcq:
          '1. Which method retrieves the number of items currently stored in an ArrayList named courses?\nA) courses.length  B) courses.count()  C) courses.size()  D) courses.length()\nAnswer: C (Arrays use .length, Strings use .length(), and Collections use .size().)\n\n2. Which block executes whether an exception is thrown or caught?\nA) catch  B) finally  C) retry  D) default\nAnswer: B (The finally block always executes for cleanup.)',
      }),
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-1',
        quizType: 'module',
        title: 'Module 1 Quiz: Java Basics & Control Flow',
        description: 'Test compilation basics, numeric casting, and String comparison.',
        passingPercent: 70,
        questions: [
          {
            id: 'q-1',
            questionText: 'What file extension does compiled Java bytecode have?',
            options: ['.java', '.exe', '.class', '.jvm'],
            correctIndex: 2,
            explanation: 'javac compiles .java source files into .class bytecode files.',
            topicTag: 'JVM Compilation',
            orderIndex: 1,
          },
          {
            id: 'q-2',
            questionText: 'Which expression correctly compares two String variables a and b for equal characters?',
            options: ['a == b', 'a.equals(b)', 'a === b', 'String.same(a, b)'],
            correctIndex: 1,
            explanation: '.equals() checks character content rather than object reference equality.',
            topicTag: 'Strings',
            orderIndex: 2,
          },
          {
            id: 'q-3',
            questionText: 'What is the output of System.out.println(5 / 2); in Java?',
            options: ['2.5', '2', '3', 'Compilation error'],
            correctIndex: 1,
            explanation: 'Both 5 and 2 are int literals, so integer division returns 2.',
            topicTag: 'Numeric Types',
            orderIndex: 3,
          },
          {
            id: 'q-4',
            questionText: 'Which signature is required for Java’s standard program entry point?',
            options: [
              'public void main()',
              'public static void main(String[] args)',
              'private static int start()',
              'static main(args)',
            ],
            correctIndex: 1,
            explanation: 'The JVM invokes public static void main(String[] args) to launch an application.',
            topicTag: 'Main Method',
            orderIndex: 4,
          },
        ],
      },
      {
        id: 'quiz-2',
        quizType: 'final',
        title: 'Final Assessment: Java Beginner to Advanced',
        description: 'Comprehensive assessment covering arrays, collections, and exception safety.',
        passingPercent: 75,
        questions: [
          {
            id: 'q-5',
            questionText: 'How do you access the length of an array named nums vs an ArrayList named list?',
            options: [
              'nums.size() and list.length',
              'nums.length and list.size()',
              'Both use .length()',
              'Both use .count',
            ],
            correctIndex: 1,
            explanation: 'Java arrays expose the .length property while ArrayList implements .size().',
            topicTag: 'Arrays & Collections',
            orderIndex: 1,
          },
          {
            id: 'q-6',
            questionText: 'Which collection stores unique key-value pairs for O(1) average lookup?',
            options: ['ArrayList', 'HashMap', 'LinkedArray', 'Scanner'],
            correctIndex: 1,
            explanation: 'HashMap<K, V> maps unique keys directly to associated values.',
            topicTag: 'HashMap',
            orderIndex: 2,
          },
          {
            id: 'q-7',
            questionText: 'Which exception is thrown when Integer.parseInt("abc") runs?',
            options: [
              'NullPointerException',
              'NumberFormatException',
              'ArrayIndexOutOfBoundsException',
              'IOException',
            ],
            correctIndex: 1,
            explanation: 'Non-numeric text passed to Integer.parseInt raises NumberFormatException.',
            topicTag: 'Exception Handling',
            orderIndex: 3,
          },
          {
            id: 'q-8',
            questionText: 'Why does ArrayList<int> fail to compile?',
            options: [
              'ArrayList cannot store numbers',
              'Generics require object wrapper types such as Integer',
              'int is deprecated in Java',
              'ArrayList only stores String values',
            ],
            correctIndex: 1,
            explanation: 'Java generics operate on reference types; use Integer instead of primitive int.',
            topicTag: 'Generics',
            orderIndex: 4,
          },
        ],
      },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Capstone: Console Student Gradebook & Roster System in Java',
      instructions:
        'Build a multi-method Java console program storing student names and numeric grades in a HashMap<String, ArrayList<Integer>>, computing safe double averages, catching invalid inputs with try-catch, and displaying top performers.',
      dueDate: '2026-12-30',
      maxMarks: 100,
    },
  },

  // =========================================================================
  // 4. Object-Oriented Programming with Java
  // =========================================================================
  {
    id: 'java-oop',
    departmentId: 'dept_programming_web',
    departmentName: 'Programming & Web Development',
    title: 'Object-Oriented Programming with Java',
    category: 'Programming & Web Development',
    level: 'Intermediate',
    duration: '8 Weeks',
    thumbnailUrl: BRAND_IMAGES.courseTech,
    shortDescription:
      'Design clean, extensible software architectures using classes, encapsulation, inheritance, polymorphism, interfaces, and abstract types.',
    fullDescription:
      'Move beyond procedural scripts into structured object-oriented design. Learners model real institutional entities using private state encapsulation, constructor overloading, inheritance hierarchies, dynamic method dispatch, and interface contracts in Java.',
    introduction:
      'Large software systems fail when data and rules are scattered across disconnected functions. Object-Oriented Programming (OOP) organizes code around cohesive domain objects that protect their own invariants and collaborate cleanly through well-defined interfaces.',
    objectives: [
      'Model classes with private fields, validated setters, constructors, and this references.',
      'Apply inheritance (extends) and super constructors carefully without fragile hierarchies.',
      'Leverage runtime polymorphism and @Override to write extensible workflows.',
      'Design decoupled systems using Java interfaces and abstract classes.',
    ],
    targetAudience:
      'Java learners ready to master software architecture principles required for backend engineering and technical interviews.',
    prerequisites: 'Working knowledge of Java variables, loops, methods, and arrays.',
    syllabusSummary: [
      'Module 1: Classes, Objects, Constructors & Encapsulation',
      'Module 2: Inheritance, super, Method Overriding & Polymorphism',
      'Module 3: Abstract Classes, Interfaces & Composition Over Inheritance',
    ],
    outcomes: [
      'Protect object invariants cleanly with encapsulation and immutability.',
      'Implement polymorphic collections where subclasses handle specialized behavior.',
      'Use interfaces cleanly to separate contracts from implementations.',
      'Recognize when composition is safer than deep inheritance chains.',
    ],
    moduleAssessments: [
      'Module 1 Assessment: Encapsulated BankAccount Class',
      'Module 2 Assessment: Polymorphic AssessmentGrader Hierarchy',
      'Module 3 Assessment: Interface-Driven Notification & Payment Model',
    ],
    finalAssessmentTitle: 'Final Assessment: Extensible University Enrollment OOP Model in Java',
    modules: [
      {
        id: 'mod-1',
        title: 'Classes, Constructors & Encapsulation',
        description: 'Hide internal fields behind validated constructors and public methods.',
        assessmentTitle: 'Module 1 Check: Immutable & Encapsulated Models',
        assessmentCriteria: 'No public mutable fields; invalid balances or marks rejected cleanly.',
        orderIndex: 1,
      },
      {
        id: 'mod-2',
        title: 'Inheritance & Runtime Polymorphism',
        description: 'Reuse shared behavior cleanly and dispatch specialized overrides at runtime.',
        assessmentTitle: 'Module 2 Check: Override & Dynamic Dispatch',
        assessmentCriteria: 'Proper @Override annotations and super() constructor chaining.',
        orderIndex: 2,
      },
      {
        id: 'mod-3',
        title: 'Abstraction: Interfaces vs Abstract Classes',
        description: 'Define behavioral contracts and favor composition for modular software.',
        assessmentTitle: 'Module 3 Check: Interface Contract Implementation',
        assessmentCriteria: 'Clean separation of interface signatures and concrete classes.',
        orderIndex: 3,
      },
    ],
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        title: 'Encapsulation, Access Modifiers & Constructors',
        summary: 'Protect class invariants using private fields, constructors, and getters/setters.',
        objectives: [
          'Distinguish private, protected, package-private, and public visibility.',
          'Write parameterized constructors using the "this" keyword.',
          'Validate mutations inside setters rather than exposing public fields.',
        ],
        contentBody:
          'Encapsulation bundles state (fields) and behavior (methods) together while hiding internal details from external callers.\n\nIf a field like enrollmentBalance or score were public, any external line could set score = -500. Marking fields private and validating inside constructors and methods guarantees the object always remains in a valid state.',
        examples:
          'public class StudentRecord {\n  private final String studentId;\n  private int progressPercent;\n\n  public StudentRecord(String studentId) {\n    this.studentId = studentId;\n    this.progressPercent = 0;\n  }\n\n  public void updateProgress(int percent) {\n    if (percent < 0 || percent > 100) {\n      throw new IllegalArgumentException("Progress must be 0..100");\n    }\n    this.progressPercent = percent;\n  }\n\n  public int getProgressPercent() { return progressPercent; }\n}',
        exercisePrompt:
          'Create an encapsulated CourseFee class with private courseTitle and amount, rejecting negative amounts via IllegalArgumentException.',
        durationMinutes: 35,
        orderIndex: 1,
      },
      {
        id: 'les-2',
        moduleId: 'mod-2',
        title: 'Inheritance, Method Overriding & Polymorphism',
        summary: 'Build parent-child class hierarchies and invoke specialized behavior through parent references.',
        objectives: [
          'Extend a superclass with extends and invoke super(...).',
          'Apply @Override safely to prevent accidental signature mismatches.',
          'Demonstrate runtime polymorphism inside a List<ParentType>.',
        ],
        contentBody:
          'Inheritance expresses an "is-a" relationship: a ScholarshipStudent is a Student. Polymorphism ("many forms") allows code written against the superclass reference type to invoke each subclass’s overridden implementation dynamically at runtime.',
        examples:
          'class ProgramMember {\n  protected String name;\n  public ProgramMember(String name) { this.name = name; }\n  public String badgeLabel() { return "Member: " + name; }\n}\n\nclass InternMember extends ProgramMember {\n  public InternMember(String name) { super(name); }\n  @Override\n  public String badgeLabel() { return "Fellowship Intern: " + name; }\n}',
        exercisePrompt:
          'Create a superclass Evaluation with calculateScore() and two subclasses (QuizEvaluation, ProjectEvaluation) stored together in an ArrayList<Evaluation>.',
        durationMinutes: 40,
        orderIndex: 2,
      },
      {
        id: 'les-3',
        moduleId: 'mod-3',
        title: 'Interfaces, Abstract Classes & Composition',
        summary: 'Choose interfaces for capabilities ("can-do") and composition for code reuse.',
        objectives: [
          'Compare abstract classes (shared state + partial code) with interfaces (behavioral contracts).',
          'Implement multiple interfaces on a single Java class cleanly.',
          'Favor composition ("has-a") over unnecessary multi-level inheritance.',
        ],
        contentBody:
          'Java allows a class to extend only one superclass, yet implement many interfaces. Interfaces define WHAT a component can do (e.g., Exportable, Verifiable) without locking callers to a single inheritance tree. Composition ("has-a") builds rich classes by holding references to helper objects inside fields.',
        examples:
          'interface Verifiable {\n  String verificationCode();\n}\n\nclass AcademicCertificate implements Verifiable {\n  private final String code;\n  public AcademicCertificate(String code) { this.code = code; }\n  @Override\n  public String verificationCode() { return code; }\n}',
        exercisePrompt:
          'Design a Gradable interface with boolean isPassing(int score), then implement it in CoursePassRule (70%) and HonoursPassRule (85%).',
        durationMinutes: 40,
        orderIndex: 3,
      },
    ],
    studyNotes: [
      makeProgNote({
        id: 'note-1',
        moduleId: 'mod-1',
        lessonId: 'les-1',
        title: 'Encapsulation, Immutability & Invariant Protection in Java',
        intro:
          'Encapsulation is the cornerstone of maintainable Object-Oriented design. Without it, every file in a project can corrupt shared state silently.',
        simple:
          'Think of encapsulation like the dashboard of a car: you press the accelerator pedal (a public method) rather than reaching under the hood to pull fuel lines directly (private fields). That keeps both you and the engine safe.',
        detailed:
          'An invariant is a rule that must always remain true for an object—for example, a student progress percentage must never drop below 0 or exceed 100. By marking fields private and exposing only controlled constructor parameters and validated methods, the class enforces its own invariants in a single authoritative place.',
        concepts:
          '- Encapsulation: Bundling data with methods and restricting direct external field access.\n- Invariant: A logical constraint that an object always maintains.\n- final field: A field assigned once inside a constructor that cannot be reassigned.\n- Constructor Overloading: Defining multiple constructors with distinct parameter signatures.',
        steps:
          'Step 1: Mark every instance field private.\nStep 2: Use private final for identity fields that should never change (e.g., studentId).\nStep 3: Validate arguments at the start of every constructor and setter.\nStep 4: Avoid returning mutable internal lists directly; return List.copyOf(items).',
        codeLang: 'java',
        code: 'public class EnrollmentAccount {\n  private final String studentId;\n  private int creditsEarned;\n\n  public EnrollmentAccount(String studentId, int initialCredits) {\n    if (studentId == null || studentId.isBlank()) {\n      throw new IllegalArgumentException("Valid studentId required");\n    }\n    this.studentId = studentId;\n    this.creditsEarned = Math.max(0, initialCredits);\n  }\n\n  public void addCredits(int credits) {\n    if (credits <= 0) throw new IllegalArgumentException("Credits must be positive");\n    this.creditsEarned += credits;\n  }\n\n  public int getCreditsEarned() { return creditsEarned; }\n}',
        lineByLine:
          'Lines 2-3 declare private encapsulated state. Lines 5-11 validate studentId and clamp initial credits safely. Lines 13-16 allow positive credit additions while preventing negative manipulation. Line 18 provides read access safely.',
        output: 'Attempting addCredits(-5) throws IllegalArgumentException immediately instead of silently lowering credits.',
        debugging:
          'Watch out for exposing internal arrays or lists via getters (e.g., return this.scores;). External code could modify the returned list behind the object’s back; return Collections.unmodifiableList(scores) or a defensive copy instead.',
        exercise:
          'Write an encapsulated CourseBatch class with a private maxSeats capacity and private ArrayList<String> enrolledStudents that refuses new enrollments once capacity is reached.',
        realWorld:
          'Banking accounts, identity tokens, order totals, and flight booking seat inventories rely on strict Java encapsulation to guarantee consistency under heavy enterprise traffic.',
        important:
          '- Always check constructor arguments BEFORE assigning fields.\n- Keep getters side-effect free.',
        mistakes:
          '- Leaving fields public or default package-private out of habit.\n- Writing meaningless setters for every field blindly (even IDs that should stay immutable).',
        summary:
          'Encapsulation isolates internal state using private/final modifiers and validates every mutation so objects never enter illegal states.',
        shortQ:
          'Q1: What is an object invariant?\nAnswer: A condition about an object’s fields that must remain true throughout its lifetime.\nQ2: Why mark an ID field private final?\nAnswer: So it can only be set once at object creation and never accidentally overwritten.',
        longQ:
          'Q: Explain why blind getters and setters for every field undermine encapsulation, and show how domain-specific methods improve Java class design.\nAnswer Outline: Exposing raw setBalance(val) lets callers bypass rules. Domain methods like addCredits(delta) or enrollStudent(id) enforce business rules atomically.',
        mcq:
          '1. Which visibility modifier restricts field access strictly to the declaring class?\nA) protected  B) public  C) private  D) static\nAnswer: C (private hides fields from all external classes.)\n\n2. What keyword refers to the current object instance inside a constructor?\nA) super  B) self  C) this  D) me\nAnswer: C (Java uses "this", not "self".)',
      }),
      makeProgNote({
        id: 'note-2',
        moduleId: 'mod-3',
        lessonId: 'les-3',
        title: 'Polymorphism, Interfaces & Composition Over Inheritance',
        intro:
          'True OOP flexibility comes from writing modules that depend on interfaces rather than rigid concrete classes, letting teams add new features without modifying tested core logic.',
        simple:
          'An electrical wall socket is an interface: whether you plug in a desk lamp, laptop charger, or projector, the socket does not care about the appliance’s brand—only that it obeys the plug standard.',
        detailed:
          'Interfaces allow unrelated classes to share a capability contract (such as Payable or CertificateIssuer). At runtime, Java’s JVM performs dynamic method dispatch on overridden methods based on the actual object created in memory, not just the declared variable type. Meanwhile, favoring composition ("holds a reference to an interface") avoids brittle multi-tier inheritance hierarchies.',
        concepts:
          '- Polymorphism: One interface reference invoking distinct subclass implementations dynamically.\n- @Override: Compiler safeguard verifying you genuinely overrode a parent/interface method.\n- Interface: Pure capability contract supporting multiple implementations.\n- Composition: Assembling behavior by storing helper objects inside fields.',
        steps:
          'Step 1: Identify varying behavior (e.g., grading rules, export formats) and extract an interface.\nStep 2: Create focused concrete classes implementing that interface.\nStep 3: Annotate every implemented method with @Override.\nStep 4: Accept the interface type in service constructors/parameters rather than concrete subclasses.',
        codeLang: 'java',
        code: 'import java.util.List;\n\ninterface GradingPolicy {\n  boolean passed(int score);\n}\n\nclass StandardPolicy implements GradingPolicy {\n  @Override public boolean passed(int score) { return score >= 60; }\n}\n\nclass HonoursPolicy implements GradingPolicy {\n  @Override public boolean passed(int score) { return score >= 80; }\n}\n\npublic class AssessmentRunner {\n  public static void main(String[] args) {\n    List<GradingPolicy> policies = List.of(new StandardPolicy(), new HonoursPolicy());\n    for (GradingPolicy p : policies) {\n      System.out.println("Score 75 passed? " + p.passed(75));\n    }\n  }\n}',
        lineByLine:
          'Lines 3-5 declare the GradingPolicy contract. Lines 7-13 define two concrete strategies. Line 17 stores both objects inside a List<GradingPolicy>. Line 19 dispatches the correct passed(75) rule dynamically per object.',
        output:
          'Score 75 passed? true\nScore 75 passed? false',
        debugging:
          'Without @Override, misspelling a method name (e.g., passd(int score)) silently creates a brand-new method instead of overriding the parent contract. Always write @Override so javac catches typos immediately.',
        exercise:
          'Define a Deliverable interface with String generateSummary(), implement it in PdfGuide and QuizAssessment, and print all summaries in one loop.',
        realWorld:
          'Payment gateways (Stripe, UPI, Card adapters), storage drivers, and notification dispatchers in enterprise Java backends depend on interfaces so providers can be swapped cleanly.',
        important:
          '- Use "extends" for single class inheritance; use "implements" for one or more interfaces.\n- Prefer "Program to an interface, not an implementation."',
        mistakes:
          '- Creating deep 5-level inheritance trees simply to share two utility methods.\n- Omitting @Override on subclass methods.',
        summary:
          'Interfaces and runtime polymorphism decouple callers from specific implementations, making Java codebases clean, testable, and extensible.',
        shortQ:
          'Q1: How many classes vs interfaces can a single Java class inherit/implement?\nAnswer: A class can extend at most 1 superclass, but can implement any number of interfaces.\nQ2: What does @Override catch at compile time?\nAnswer: Signature typos or wrong parameter types when overriding a method.',
        longQ:
          'Q: Compare abstract classes and interfaces in Java, and explain why engineers frequently favor composition over inheritance.\nAnswer Outline: Abstract classes hold shared instance state and partial concrete code for tight "is-a" hierarchies; interfaces define pluggable "can-do" contracts across unrelated classes; composition keeps dependencies flexible and prevents fragile base-class breakage.',
        mcq:
          '1. Which relationship is best modeled by composition rather than inheritance?\nA) Intern is a Student  B) Course has a GradingPolicy  C) SavingsAccount is a BankAccount  D) Square is a Shape\nAnswer: B ("Has-a" relationships belong to composition.)\n\n2. Which keyword invokes a parent class constructor from a subclass?\nA) parent()  B) this()  C) super()  D) base()\nAnswer: C (super(...) invokes the superclass constructor.)',
      }),
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-1',
        quizType: 'module',
        title: 'Module 1 Quiz: Encapsulation & Constructors',
        description: 'Assess field visibility, constructor design, and invariant protection.',
        passingPercent: 70,
        questions: [
          {
            id: 'q-1',
            questionText: 'Why should instance fields normally be declared private?',
            options: [
              'To speed up compilation',
              'To prevent external code from corrupting class invariants',
              'To allow subclass access from other packages',
              'Because Java forbids public variables',
            ],
            correctIndex: 1,
            explanation: 'Private fields ensure all state transitions pass through validated class methods.',
            topicTag: 'Encapsulation',
            orderIndex: 1,
          },
          {
            id: 'q-2',
            questionText: 'What does "this.name = name;" resolve inside a constructor?',
            options: [
              'Calls a static method',
              'Distinguishes the instance field from the local parameter of the same name',
              'Creates a superclass reference',
              'Deletes the parameter',
            ],
            correctIndex: 1,
            explanation: 'this.name points to the current object field while name points to the parameter.',
            topicTag: 'Constructors',
            orderIndex: 2,
          },
          {
            id: 'q-3',
            questionText: 'What happens when a constructor declares private Student()?',
            options: [
              'External classes cannot instantiate Student directly with new Student()',
              'The class cannot compile',
              'Methods become static automatically',
              'Subclasses override it',
            ],
            correctIndex: 0,
            explanation: 'Private constructors restrict instantiation to factory methods or singleton patterns inside the class.',
            topicTag: 'Visibility',
            orderIndex: 3,
          },
          {
            id: 'q-4',
            questionText: 'Which exception is idiomatic to throw when a method receives an out-of-range numeric parameter?',
            options: ['NullPointerException', 'IllegalArgumentException', 'IOException', 'ArithmeticException'],
            correctIndex: 1,
            explanation: 'IllegalArgumentException signals clearly that a caller passed an invalid argument value.',
            topicTag: 'Validation',
            orderIndex: 4,
          },
        ],
      },
      {
        id: 'quiz-2',
        quizType: 'final',
        title: 'Final Assessment: Object-Oriented Programming with Java',
        description: 'Comprehensive assessment on inheritance, polymorphism, and interfaces.',
        passingPercent: 75,
        questions: [
          {
            id: 'q-5',
            questionText: 'At runtime, when Parent ref = new Child(); ref.action(); runs, which version of action() executes?',
            options: [
              'Always Parent.action()',
              'Child.action() if overridden in Child',
              'Neither; it throws a compile error',
              'Only if action() is static',
            ],
            correctIndex: 1,
            explanation: 'Dynamic method dispatch selects the overridden method of the actual runtime object (Child).',
            topicTag: 'Polymorphism',
            orderIndex: 1,
          },
          {
            id: 'q-6',
            questionText: 'Which keyword is used when a class adopts an interface contract?',
            options: ['extends', 'inherits', 'implements', 'uses'],
            correctIndex: 2,
            explanation: 'Classes extend a superclass and implement interfaces.',
            topicTag: 'Interfaces',
            orderIndex: 2,
          },
          {
            id: 'q-7',
            questionText: 'Can you instantiate an abstract class directly using new AbstractClass()?',
            options: ['Yes, always', 'No, abstract classes cannot be instantiated directly', 'Only inside main()', 'Only if it has fields'],
            correctIndex: 1,
            explanation: 'Abstract classes serve as incomplete base types and require a concrete subclass.',
            topicTag: 'Abstraction',
            orderIndex: 3,
          },
          {
            id: 'q-8',
            questionText: 'Why do engineers prefer composition ("has-a") over deep inheritance chains?',
            options: [
              'Composition compiles twice as fast',
              'Composition avoids tight coupling and allows swapping behaviors cleanly at runtime',
              'Java prohibits more than 2 subclasses',
              'Composition removes the need for constructors',
            ],
            correctIndex: 1,
            explanation: 'Composition keeps classes decoupled and prevents brittle parent-class side effects.',
            topicTag: 'OOP Architecture',
            orderIndex: 4,
          },
        ],
      },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Capstone: Interface-Driven Learning Portal Domain Model in Java',
      instructions:
        'Implement an OOP Java package modeling Person, Student, Admin, Gradable (interface), and CourseBatch (with capacity invariant & defensive list getters), plus a Main runner proving polymorphic evaluation.',
      dueDate: '2026-12-30',
      maxMarks: 100,
    },
  },

  // =========================================================================
  // 5. Advanced Java Programming
  // =========================================================================
  {
    id: 'java-advanced',
    departmentId: 'dept_programming_web',
    departmentName: 'Programming & Web Development',
    title: 'Advanced Java Programming',
    category: 'Programming & Web Development',
    level: 'Advanced',
    duration: '10 Weeks',
    thumbnailUrl: BRAND_IMAGES.courseTech,
    shortDescription:
      'Master Java Generics, Lambda expressions, Streams API, Optional, multithreading concurrency, and clean I/O pipelines.',
    fullDescription:
      'Built for engineers scaling up into modern backend Java development. Master type-safe generic utilities, functional pipelines with Lambdas and Streams, null-safe Optional chaining, and thread-safe concurrency primitives.',
    introduction:
      'Modern enterprise Java relies heavily on declarative Streams, functional interfaces, generic abstractions, and safe concurrency. This course equips experienced Java learners with the tools to write expressive, scalable production code.',
    objectives: [
      'Write generic classes and bounded wildcard methods (<T extends Comparable<T>>).',
      'Process collections cleanly using Lambda expressions, map, filter, and Collectors.',
      'Eliminate null crashes using Optional<T> and immutable collections.',
      'Coordinate concurrent tasks safely using ExecutorService and ConcurrentHashMap.',
    ],
    targetAudience:
      'Students who know core OOP Java and want to master modern Java 17+ idioms for backend systems and technical interviews.',
    prerequisites: 'Completion of Object-Oriented Programming with Java.',
    syllabusSummary: [
      'Module 1: Advanced Generics, Custom Exceptions & Functional Interfaces',
      'Module 2: Java Streams API, Lambdas & Optional Pipelines',
      'Module 3: Concurrency, ExecutorService & Thread-Safe Collections',
    ],
    outcomes: [
      'Refactor verbose imperative loops into crisp, bug-free Stream pipelines.',
      'Build reusable generic repositories and comparators.',
      'Diagnose and eliminate race conditions using Executors and thread-safe maps.',
      'Write clean Optional-returning service APIs.',
    ],
    moduleAssessments: [
      'Module 1 Assessment: Generic Repository Utility',
      'Module 2 Assessment: Enrollment Analytics with Streams API',
      'Module 3 Assessment: Thread-Safe Concurrent Task Processor',
    ],
    finalAssessmentTitle: 'Final Assessment: Concurrent Student Analytics Pipeline in Java',
    modules: [
      {
        id: 'mod-1',
        title: 'Generics & Functional Interfaces',
        description: 'Bounded type parameters, custom checked/unchecked exceptions, and Predicate/Function.',
        assessmentTitle: 'Module 1 Check: Generic Max & Filter Utility',
        assessmentCriteria: 'Compiles without unchecked casts.',
        orderIndex: 1,
      },
      {
        id: 'mod-2',
        title: 'Lambdas, Streams & Optional',
        description: 'Filter, transform, group, and aggregate data declaratively without mutating source lists.',
        assessmentTitle: 'Module 2 Check: Stream Grouping Report',
        assessmentCriteria: 'Uses groupingBy, filtering, and Optional.orElseThrow cleanly.',
        orderIndex: 2,
      },
      {
        id: 'mod-3',
        title: 'Multithreading & ExecutorService Concurrency',
        description: 'Run parallel tasks cleanly using thread pools, Callable/Future, and synchronization.',
        assessmentTitle: 'Module 3 Check: Thread-Safe Counter & Pool',
        assessmentCriteria: 'Zero race conditions under multi-threaded execution.',
        orderIndex: 3,
      },
    ],
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        title: 'Bounded Generics & Built-In Functional Interfaces',
        summary: 'Create type-safe reusable algorithms with <T extends ...> and Predicate/Function.',
        objectives: [
          'Define generic methods and classes safely.',
          'Apply bounded wildcards (? extends Number) appropriately.',
          'Use Predicate<T>, Function<T, R>, and Consumer<T> lambdas.',
        ],
        contentBody:
          'Generics parameterize types just like methods parameterize values. With bounded type parameters (<T extends Comparable<T>>), a single utility method can rank scores, dates, or names without duplicating logic.\n\nA Functional Interface contains exactly one abstract method and can be implemented concisely using a Lambda expression such as s -> s.length() > 3.',
        examples:
          'import java.util.List;\nimport java.util.function.Predicate;\n\npublic class GenericFilter {\n  public static <T> int countMatching(List<T> items, Predicate<T> rule) {\n    int count = 0;\n    for (T item : items) {\n      if (rule.test(item)) count++;\n    }\n    return count;\n  }\n  public static void main(String[] args) {\n    List<Integer> marks = List.of(45, 78, 92, 61);\n    System.out.println(countMatching(marks, m -> m >= 70));\n  }\n}',
        exercisePrompt:
          'Write a generic method <T extends Comparable<T>> T findMax(List<T> items) throwing IllegalArgumentException if items is empty.',
        durationMinutes: 40,
        orderIndex: 1,
      },
      {
        id: 'les-2',
        moduleId: 'mod-2',
        title: 'Java Streams API & Null-Safe Optional Chaining',
        summary: 'Transform collections lazily and model missing values explicitly.',
        objectives: [
          'Distinguish intermediate operations (filter, map, sorted) from terminal operations (toList, count, collect).',
          'Group records cleanly using Collectors.groupingBy.',
          'Chain Optional.map and Optional.orElse safely without .get() traps.',
        ],
        contentBody:
          'The Streams API treats data processing as a clean pipeline: source -> intermediate transforms -> terminal result. Because streams do not mutate the original collection, pipelines remain predictable and easy to reason about.\n\nPair lookup methods with Optional<T> return values instead of returning raw null, forcing callers to explicitly handle absence via orElse(), orElseGet(), or orElseThrow().',
        examples:
          'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class StreamSummary {\n  public static void main(String[] args) {\n    List<String> courses = List.of("Java Core", "Python Data", "HTML Basics", "Java OOP");\n    List<String> javaTracks = courses.stream()\n      .filter(c -> c.startsWith("Java"))\n      .map(String::toUpperCase)\n      .collect(Collectors.toList());\n    System.out.println(javaTracks);\n  }\n}',
        exercisePrompt:
          'Given a list of StudentScore(name, department, score), use a Java Stream to compute the average score of students in "AI & Data" safely.',
        durationMinutes: 45,
        orderIndex: 2,
      },
      {
        id: 'les-3',
        moduleId: 'mod-3',
        title: 'Concurrency with ExecutorService & Thread-Safe Structures',
        summary: 'Manage worker thread pools safely without manual Thread lifecycle bugs.',
        objectives: [
          'Explain race conditions and atomic operations (AtomicInteger).',
          'Submit tasks to Executors.newFixedThreadPool and shut down cleanly.',
          'Use ConcurrentHashMap instead of unsynchronized HashMap across threads.',
        ],
        contentBody:
          'Modern servers run tasks concurrently across multiple CPU cores. Manually spawning raw new Thread(...) instances wastes resources and risks memory leaks. Production Java uses ExecutorService thread pools paired with Callable/Future and atomic/concurrent data structures (AtomicInteger, ConcurrentHashMap) to prevent lost updates.',
        examples:
          'import java.util.concurrent.*;\nimport java.util.concurrent.atomic.AtomicInteger;\n\npublic class PoolDemo {\n  public static void main(String[] args) throws InterruptedException {\n    ExecutorService pool = Executors.newFixedThreadPool(2);\n    AtomicInteger completed = new AtomicInteger(0);\n    for (int i = 1; i <= 4; i++) {\n      int id = i;\n      pool.submit(() -> {\n        completed.incrementAndGet();\n        System.out.println("Processed task #" + id);\n      });\n    }\n    pool.shutdown();\n    pool.awaitTermination(5, TimeUnit.SECONDS);\n    System.out.println("Total completed: " + completed.get());\n  }\n}',
        exercisePrompt:
          'Create a fixed thread pool of 3 workers submitting 6 Callable<Integer> grading tasks, collect all Future results, and print the total sum after shutdown.',
        durationMinutes: 45,
        orderIndex: 3,
      },
    ],
    studyNotes: [
      makeProgNote({
        id: 'note-1',
        moduleId: 'mod-2',
        lessonId: 'les-2',
        title: 'Java Streams API, Functional Pipelines & Optional',
        intro:
          'Before Java 8, filtering and summarizing data required nested for-loops, temporary lists, and repeated null checks. Streams and Optional allow engineers to express intent cleanly with zero side effects.',
        simple:
          'A Stream is like an assembly-line conveyor belt: items enter from a list, pass through inspection stations (filter) and shaping stations (map), and finish inside a final shipping box (collect). Nothing changes on the original shelf.',
        detailed:
          'Streams are lazy: intermediate steps like .filter() and .map() do not execute until a terminal operation (such as .collect(), .count(), or .findFirst()) requests output. Streams also cannot be reused once consumed. Optional<T> acts as an explicit container holding either one non-null value or empty state, eliminating silent NullPointerExceptions across service boundaries.',
        concepts:
          '- Intermediate Operation: Lazy Stream step returning another Stream (filter, map, distinct).\n- Terminal Operation: Eager step producing a final value or collection (collect, reduce, findFirst).\n- Method Reference: Compact lambda shorthand such as String::toUpperCase.\n- Optional<T>: Null-safe single-value container enforcing explicit absence handling.',
        steps:
          'Step 1: Call .stream() on any Collection.\nStep 2: Apply .filter(predicate) to narrow items.\nStep 3: Transform values with .map(fn).\nStep 4: Terminate with .toList() / .collect(Collectors.groupingBy(...)) / .findFirst().\nStep 5: Unwrap Optional results using .orElse(...) or .orElseThrow(...), never bare .get().',
        codeLang: 'java',
        code: 'import java.util.*;\n\npublic class AnalyticsPipeline {\n  public static Optional<String> topCourse(List<String> titles) {\n    return titles.stream()\n      .filter(t -> t != null && !t.isBlank())\n      .map(String::trim)\n      .sorted(Comparator.comparingInt(String::length).reversed())\n      .findFirst();\n  }\n\n  public static void main(String[] args) {\n    List<String> list = List.of("Java", "Python for Automation", "HTML");\n    String result = topCourse(list).orElse("No courses available");\n    System.out.println("Longest title: " + result);\n  }\n}',
        lineByLine:
          'Line 5 creates a Stream from titles. Line 6 safely skips null/blank items. Line 7 trims whitespace via method reference. Line 8 sorts descending by string length. Line 9 returns an Optional<String> of the first match. Line 14 provides a fallback if the list was empty.',
        output: 'Longest title: Python for Automation',
        debugging:
          'Do not modify the underlying List inside a .forEach() lambda, and avoid reusing a Stream variable after calling a terminal method (throws IllegalStateException: stream has already been operated upon or closed).',
        exercise:
          'Write a Stream pipeline taking List<Integer> scores, keeping scores >= 50, computing average via .mapToInt(Integer::intValue).average(), and handling empty input via .orElse(0.0).',
        realWorld:
          'Enterprise reporting dashboards, log aggregators, and catalog search filters rely heavily on Streams for readable data transformations.',
        important:
          '- Never call Optional.get() without first checking or using .orElseThrow().\n- Avoid calling Optional as a class field or method parameter; keep it as a return type.',
        mistakes:
          '- Expecting a Stream without a terminal operation to run.\n- Mutating external variables inside .map() or .filter() lambdas.',
        summary:
          'Java Streams turn collection filtering, mapping, and aggregation into lazy, immutable pipelines, while Optional eliminates unchecked null propagation.',
        shortQ:
          'Q1: Why is a Stream pipeline called "lazy"?\nAnswer: Intermediate operations like filter and map do not process elements until a terminal operation executes.\nQ2: What happens if you call .collect() twice on the same Stream object?\nAnswer: An IllegalStateException is thrown because streams are single-use.',
        longQ:
          'Q: Explain the difference between intermediate and terminal Stream operations and how Optional improves API contracts.\nAnswer Outline: Intermediate operations chain lazily to compose transforms; terminal operations trigger execution and close the stream; returning Optional<T> communicates possible absence explicitly at the type level.',
        mcq:
          '1. Which is a terminal Stream operation?\nA) .filter()  B) .map()  C) .sorted()  D) .collect()\nAnswer: D (.collect() triggers evaluation and produces a collection.)\n\n2. Which Optional method avoids throwing when empty by returning a fallback value?\nA) .get()  B) .orElse(defaultVal)  C) .isPresent()  D) .empty()\nAnswer: B (.orElse provides a default when Optional is empty.)',
      }),
      makeProgNote({
        id: 'note-2',
        moduleId: 'mod-3',
        lessonId: 'les-3',
        title: 'Concurrency, Thread Pools & Race Condition Prevention',
        intro:
          'As applications handle thousands of simultaneous students or batch jobs, sequential single-threaded execution becomes a bottleneck. Correct concurrency speeds up work while protecting shared memory from subtle corruption.',
        simple:
          'Think of two clerks trying to update the same paper counter simultaneously without taking turns: both read "10", both write "11", and one update vanishes. Thread-safe tools like AtomicInteger and thread pools act like an organized ticketing desk.',
        detailed:
          'A race condition occurs when multiple threads read and modify shared mutable state simultaneously, producing unpredictable results depending on CPU scheduling timing. Using Executors.newFixedThreadPool(n) bounds resource usage cleanly, Callable<T>/Future<T> returns computed values safely, and ConcurrentHashMap / AtomicInteger replace manual synchronized blocks for high-throughput counters and maps.',
        concepts:
          '- Race Condition: Timing-dependent bug from unsynchronized concurrent writes.\n- ExecutorService: Managed pool reusing worker threads cleanly.\n- Future<T>: Handle representing the eventual result of an async Callable task.\n- AtomicInteger: Lock-free thread-safe integer supporting incrementAndGet().',
        steps:
          'Step 1: Create an ExecutorService pool sized cleanly for your workload.\nStep 2: Prefer immutable task inputs and Callable results over shared mutable globals.\nStep 3: Use AtomicInteger or ConcurrentHashMap wherever threads must share state.\nStep 4: Always call pool.shutdown() and pool.awaitTermination(...) so the JVM exits cleanly.',
        codeLang: 'java',
        code: 'import java.util.concurrent.*;\n\npublic class CertificateBatch {\n  public static void main(String[] args) throws Exception {\n    ExecutorService pool = Executors.newFixedThreadPool(2);\n    Callable<String> job = () -> "Generated certificate on " + Thread.currentThread().getName();\n    Future<String> future = pool.submit(job);\n    System.out.println(future.get());\n    pool.shutdown();\n  }\n}',
        lineByLine:
          'Line 5 allocates a 2-thread worker pool. Line 6 defines a Callable returning a String result. Line 7 schedules the job asynchronously and receives a Future handle. Line 8 blocks cleanly until the worker finishes and returns the text. Line 9 releases pool threads.',
        output: 'Generated certificate on pool-1-thread-1',
        debugging:
          'Never forget pool.shutdown()—non-daemon pool threads keep the Java process alive indefinitely even after main() finishes! Also avoid nested locks to prevent deadlocks.',
        exercise:
          'Simulate 10 concurrent student logins incrementing a visit count using AtomicInteger vs plain int in a fixed pool of 4 threads, printing the final count.',
        realWorld:
          'Web servers, scheduled report generators, and bulk email/certificate dispatchers rely on managed Executor pools to maximize throughput safely.',
        important:
          '- Never use unsynchronized HashMap across writing threads.\n- Prefer immutable DTOs when passing work between threads.',
        mistakes:
          '- Forgetting ExecutorService.shutdown().\n- Calling Thread.run() directly instead of Thread.start() or pool.submit() (runs synchronously on caller thread).',
        summary:
          'Managed ExecutorService pools, Future handles, and atomic/concurrent data structures allow Java applications to scale across CPU cores without race conditions.',
        shortQ:
          'Q1: Why is AtomicInteger safer than count++ across two threads?\nAnswer: count++ performs three separate steps (read, add, write) and loses updates; AtomicInteger performs an indivisible atomic operation.\nQ2: What happens if you omit pool.shutdown()?\nAnswer: Background worker threads keep running and prevent the JVM from exiting.',
        longQ:
          'Q: Explain what causes a race condition and compare using synchronized blocks vs ConcurrentHashMap / AtomicInteger in modern Java.\nAnswer Outline: Race conditions occur during non-atomic read-modify-write interleaving; synchronized provides mutual exclusion at higher contention cost, whereas AtomicInteger (CAS) and ConcurrentHashMap (bucket-level concurrency) minimize blocking cleanly.',
        mcq:
          '1. Which interface represents a concurrent task that returns a value and may throw a checked exception?\nA) Runnable  B) Callable<V>  C) Consumer<V>  D) Supplier<V>\nAnswer: B (Callable<V> returns a Future<V> result unlike void Runnable.)\n\n2. Which map implementation is safe for concurrent writes from multiple threads?\nA) HashMap  B) TreeMap  C) ConcurrentHashMap  D) LinkedHashMap\nAnswer: C (ConcurrentHashMap supports safe concurrent updates.)',
      }),
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-2',
        quizType: 'module',
        title: 'Module 2 Quiz: Generics, Streams & Optional',
        description: 'Verify type-safe generic programming and declarative Streams pipelines.',
        passingPercent: 70,
        questions: [
          {
            id: 'q-1',
            questionText: 'Which operation triggers execution of a lazy Java Stream pipeline?',
            options: ['.filter()', '.map()', '.collect()', '.peek()'],
            correctIndex: 2,
            explanation: '.collect() is a terminal operation that evaluates the pipeline.',
            topicTag: 'Streams API',
            orderIndex: 1,
          },
          {
            id: 'q-2',
            questionText: 'What is the safest way to unwrap an Optional<String> with a default value?',
            options: ['opt.get()', 'opt.orElse("Default")', 'opt.toString()', '(String) opt'],
            correctIndex: 1,
            explanation: 'orElse returns the contained value or the fallback cleanly without throwing.',
            topicTag: 'Optional',
            orderIndex: 2,
          },
          {
            id: 'q-3',
            questionText: 'What does <T extends Comparable<T>> enforce on type T?',
            options: [
              'T must be an integer',
              'T must implement comparison via compareTo()',
              'T must be immutable',
              'T cannot be a class',
            ],
            correctIndex: 1,
            explanation: 'Upper bounded generics require T to implement Comparable<T>.',
            topicTag: 'Generics',
            orderIndex: 3,
          },
          {
            id: 'q-4',
            questionText: 'Which functional interface accepts one argument and returns a boolean test result?',
            options: ['Function<T, R>', 'Consumer<T>', 'Predicate<T>', 'Supplier<T>'],
            correctIndex: 2,
            explanation: 'Predicate<T> defines boolean test(T t) used heavily in Stream.filter().',
            topicTag: 'Functional Interfaces',
            orderIndex: 4,
          },
        ],
      },
      {
        id: 'quiz-2',
        quizType: 'final',
        title: 'Final Assessment: Advanced Java Programming',
        description: 'Final assessment covering Streams, Concurrency, and Thread-Safe design.',
        passingPercent: 75,
        questions: [
          {
            id: 'q-5',
            questionText: 'Why does ExecutorService improve over manually creating new Thread() per request?',
            options: [
              'It disables multithreading',
              'It reuses a bounded worker pool and prevents thread exhaustion',
              'It removes the need for AtomicInteger',
              'It compiles lambdas to C++',
            ],
            correctIndex: 1,
            explanation: 'Fixed thread pools cap memory/CPU thread overhead cleanly.',
            topicTag: 'Concurrency',
            orderIndex: 1,
          },
          {
            id: 'q-6',
            questionText: 'Which class provides lock-free thread-safe integer increments?',
            options: ['SafeInt', 'AtomicInteger', 'VolatileInt', 'ThreadInteger'],
            correctIndex: 1,
            explanation: 'java.util.concurrent.atomic.AtomicInteger uses atomic CPU instructions.',
            topicTag: 'Thread Safety',
            orderIndex: 2,
          },
          {
            id: 'q-7',
            questionText: 'What does Future.get() do if the background Callable task has not finished yet?',
            options: [
              'Returns null immediately',
              'Cancels the task',
              'Blocks until the result becomes available',
              'Restarts the Executor',
            ],
            correctIndex: 2,
            explanation: 'Future.get() waits cleanly until the async computation completes.',
            topicTag: 'Futures',
            orderIndex: 3,
          },
          {
            id: 'q-8',
            questionText: 'What happens if you try to iterate and modify a standard HashMap concurrently across threads?',
            options: [
              'Silent lock',
              'Potential data corruption or ConcurrentModificationException',
              'Automatic switch to ConcurrentHashMap',
              'Compile-time error',
            ],
            correctIndex: 1,
            explanation: 'HashMap is not thread-safe; concurrent mutation risks infinite loops or exceptions.',
            topicTag: 'Thread-Safe Collections',
            orderIndex: 4,
          },
        ],
      },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Capstone: Stream-Powered & Concurrent Log Aggregator in Java',
      instructions:
        'Build an Advanced Java utility that processes a list of student activity events in parallel using ExecutorService, aggregates totals in a ConcurrentHashMap / Streams Collectors.groupingBy, and safely queries top metrics via Optional.',
      dueDate: '2026-12-30',
      maxMarks: 100,
    },
  },

  // =========================================================================
  // 6. Python Programming – Beginner to Advanced
  // =========================================================================
  {
    id: 'python-beginner-to-advanced',
    departmentId: 'dept_programming_web',
    departmentName: 'Programming & Web Development',
    title: 'Python Programming',
    category: 'Programming & Web Development',
    level: 'Beginner',
    duration: '10 Weeks',
    thumbnailUrl: BRAND_IMAGES.courseTech,
    shortDescription:
      'Learn Python from clean indentation and core data structures to functions, comprehensions, OOP, modules, and error handling.',
    fullDescription:
      'Python combines human-readable syntax with industrial strength across automation, AI, and analytics. Progress systematically from variables, loops, lists, and dictionaries through modular functions, generators, OOP classes, and clean file/exception management.',
    introduction:
      'Python is renowned as the clearest first programming language and one of the most productive tools in engineering and AI. This course emphasizes writing idiomatic ("Pythonic") code cleanly from day one.',
    objectives: [
      'Write clean Python syntax respecting indentation rules, dynamic variables, and f-strings.',
      'Select effectively among list, tuple, set, and dictionary data structures.',
      'Build reusable functions, list comprehensions, and modular Python packages.',
      'Implement Python OOP classes, context managers (with open), and try-except-else handling.',
    ],
    targetAudience:
      'Beginners starting programming, data science learners, and software engineers adding Python fluency.',
    prerequisites: 'No prior coding experience required.',
    syllabusSummary: [
      'Module 1: Variables, Strings, Conditionals & Loops',
      'Module 2: Lists, Dictionaries, Sets, Functions & Comprehensions',
      'Module 3: File I/O, Exceptions, Python OOP & Decorators/Generators',
    ],
    outcomes: [
      'Author multi-module Python scripts following PEP 8 style clarity.',
      'Transform nested datasets cleanly with dictionary and list comprehensions.',
      'Manage text/JSON files safely using context managers (with).',
      'Build maintainable Python classes with __init__ and __repr__.',
    ],
    moduleAssessments: [
      'Module 1 Assessment: String & Numeric Logic Exercises',
      'Module 2 Assessment: Inventory Dictionary Manager',
      'Module 3 Assessment: Object-Oriented Grade Tracker with JSON Persistence',
    ],
    finalAssessmentTitle: 'Final Assessment: Modular Course Progress Tracker in Python',
    modules: [
      {
        id: 'mod-1',
        title: 'Python Foundations, Strings & Control Flow',
        description: 'Variables, f-strings, boolean logic, if/elif/else, and for/while loops.',
        assessmentTitle: 'Module 1 Check: Control Flow & Loops',
        assessmentCriteria: 'Proper indentation and zero off-by-one range bugs.',
        orderIndex: 1,
      },
      {
        id: 'mod-2',
        title: 'Data Structures, Functions & Comprehensions',
        description: 'Lists, tuples, sets, dictionaries, default arguments, and *args/**kwargs.',
        assessmentTitle: 'Module 2 Check: Dictionary Lookup & Comprehension',
        assessmentCriteria: 'Uses .get() safely and clean comprehensions.',
        orderIndex: 2,
      },
      {
        id: 'mod-3',
        title: 'Exceptions, Context Managers & Pythonic OOP',
        description: 'Safe file I/O with "with", try/except/finally, classes, and generators.',
        assessmentTitle: 'Module 3 Check: Class + Exception Safe File Export',
        assessmentCriteria: 'Uses with open(...) and custom exception validation.',
        orderIndex: 3,
      },
    ],
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        title: 'Indentation, Variables, F-Strings & Control Flow',
        summary: 'Write readable Python conditions and loops using strict 4-space indentation.',
        objectives: [
          'Use PEP 8 snake_case naming and consistent 4-space indentation.',
          'Format readable output using f-strings.',
          'Write clean if/elif/else chains and range()-based loops.',
        ],
        contentBody:
          'Unlike languages that mark blocks with curly braces {}, Python uses whitespace indentation (4 spaces per level) to define which statements belong inside an if, for, or def block.\n\nPython uses dynamic typing: names attach to objects at runtime (`score = 88`), and f-strings (`f"Student scored {score}%"`) embed expressions cleanly.',
        examples:
          'course_name = "Python Core"\nscores = [72, 85, 91, 64]\n\nfor idx, mark in enumerate(scores, start=1):\n    status = "Distinction" if mark >= 85 else "Pass"\n    print(f"Student {idx} ({course_name}): {mark} -> {status}")',
        exercisePrompt:
          'Write a Python loop from 1 to 20 that prints numbers divisible by 3 as "Three", divisible by 5 as "Five", and skips even numbers unless divisible by 10.',
        durationMinutes: 30,
        orderIndex: 1,
      },
      {
        id: 'les-2',
        moduleId: 'mod-2',
        title: 'Lists, Dictionaries, Sets & Comprehensions',
        summary: 'Store, deduplicate, and transform structured records efficiently.',
        objectives: [
          'Choose tuples for fixed records, sets for uniqueness, and dicts for key lookup.',
          'Read dictionary keys safely with dict.get(key, default).',
          'Write crisp list and dict comprehensions with conditional filters.',
        ],
        contentBody:
          'Python’s four core collections solve distinct jobs:\n- list ([...]): Ordered, mutable sequence.\n- tuple ((...)): Ordered, immutable sequence (e.g., coordinates or fixed pairs).\n- set ({...}): Unordered collection of unique items supporting fast membership (`x in seen`).\n- dict ({k: v}): Fast hash-based key-value mapping. Always use `record.get("city", "Unknown")` instead of `record["city"]` when a key might be missing!',
        examples:
          'marks = {"Ananya": 92, "Vikram": 68, "Meera": 88}\nhonours = [name for name, score in marks.items() if score >= 85]\nprint("Honours list:", honours)\nprint("Missing lookup:", marks.get("Ravi", 0))',
        exercisePrompt:
          'Given a list of duplicate course tags ["python", "java", "python", "html", "java"], build a dictionary counting tag occurrences and a sorted list of unique tags.',
        durationMinutes: 35,
        orderIndex: 2,
      },
      {
        id: 'les-3',
        moduleId: 'mod-3',
        title: 'Context Managers, Exceptions & Python Classes',
        summary: 'Safeguard file operations with "with open" and encapsulate domain models cleanly.',
        objectives: [
          'Read and write UTF-8 files cleanly using with open(..., encoding="utf-8").',
          'Handle FileNotFoundError and ValueError cleanly.',
          'Define Python classes with __init__, properties, and __repr__.',
        ],
        contentBody:
          'Context managers (`with open("notes.txt", "w", encoding="utf-8") as f:`) guarantee that files close automatically even if an exception fires mid-write.\n\nCombining targeted `try / except` blocks with clean classes (`class LessonTracker:`) structures larger Python applications without spaghetti global state.',
        examples:
          'class StudyModule:\n    def __init__(self, title, lessons_total):\n        if lessons_total <= 0:\n            raise ValueError("lessons_total must be positive")\n        self.title = title\n        self.lessons_total = lessons_total\n\n    def __repr__(self):\n        return f"StudyModule(title={self.title!r}, lessons={self.lessons_total})"\n\nmod = StudyModule("Python Functions", 4)\nprint(mod)',
        exercisePrompt:
          'Create a StudentProfile class with a method save_summary(filename) using with open() and handle missing directory errors gracefully.',
        durationMinutes: 40,
        orderIndex: 3,
      },
    ],
    studyNotes: [
      makeProgNote({
        id: 'note-1',
        moduleId: 'mod-2',
        lessonId: 'les-2',
        title: 'Python Core Collections, Mutability & Comprehensions',
        intro:
          'Most Python bugs stem from picking the wrong collection or overlooking mutability side effects. Mastering list, tuple, set, and dict unlocks clean, expressive programs.',
        simple:
          'A list is a numbered shopping list you can edit; a tuple is a sealed envelope you cannot change; a set is a guest badge basket that automatically removes duplicates; and a dictionary is a phonebook mapping names to details.',
        detailed:
          'Lists support indexing, slicing (`items[1:4]`), and in-place mutation (`.append()`, `.sort()`). Notice a classic Python pitfall: assigning `copy_list = original` creates an alias to the SAME list in memory; use `original.copy()` for a real shallow copy. Sets compute union (`|`), intersection (`&`), and difference (`-`) cleanly in O(1) average lookup time. Comprehensions (`[x * 2 for x in nums if x > 0]`) build new filtered sequences in one clear expression.',
        concepts:
          '- Mutable vs Immutable: Lists/dicts/sets can change in place; ints/strings/tuples cannot.\n- Aliasing: Two variables pointing to the same mutable object.\n- List Comprehension: Compact syntax `[expr for item in iterable if condition]`.\n- Safe Dictionary Lookup: `.get(key, fallback)` prevents KeyError crashes.',
        steps:
          'Step 1: Pick dict when looking up by named keys; pick set when checking uniqueness.\nStep 2: Use `dict.get(key, default)` for optional keys.\nStep 3: Avoid mutable default arguments like `def add(item, bucket=[]):`—use `bucket=None` instead!\nStep 4: Prefer comprehensions for simple 1-line transforms; use normal loops when logic spans multiple branches.',
        codeLang: 'python',
        code: 'enrollments = [\n    ("student_1", "Python"),\n    ("student_2", "Java"),\n    ("student_1", "Python"),\n    ("student_3", "HTML"),\n]\n\nunique_pairs = set(enrollments)\ncounts = {}\nfor _, course in unique_pairs:\n    counts[course] = counts.get(course, 0) + 1\n\npopular = [c for c, n in counts.items() if n >= 1]\nprint("Unique counts:", counts)\nprint("Active courses:", sorted(popular))',
        lineByLine:
          'Lines 1-6 define raw tuple pairs containing a duplicate entry. Line 8 converts the list into a set of tuples, eliminating the duplicate ("student_1", "Python"). Lines 9-11 count courses using .get(course, 0) + 1. Line 13 builds a list comprehension, and lines 14-15 display the results.',
        output:
          "Unique counts: {'Python': 1, 'Java': 1, 'HTML': 1}\nActive courses: ['HTML', 'Java', 'Python']",
        debugging:
          'Beware the infamous mutable default argument bug: `def register(name, items=[]):` shares the same list across every call! Always write `def register(name, items=None): if items is None: items = []`.',
        exercise:
          'Given a list of dictionaries representing assignments `[{"title": "A1", "marks": 85}, {"title": "A2", "marks": 42}]`, write a comprehension extracting titles with marks >= 50 and compute the average marks safely.',
        realWorld:
          'Data cleaning scripts, backend API serializers, and automated test suites rely on sets for deduplication and dictionary lookups for fast record joining.',
        important:
          '- Never use `== None`; always write `is None` or `is not None`.\n- Never modify a list while iterating directly over it—iterate over a copy or build a new filtered list.',
        mistakes:
          '- Using mutable list `[]` as a function default parameter.\n- Expecting `list.sort()` to return a new list (`.sort()` modifies in place and returns `None`; use `sorted(list)` for a new list).',
        summary:
          'Choosing cleanly between list, tuple, set, and dict—while respecting mutability and comprehensions—makes Python code fast, clear, and resilient.',
        shortQ:
          'Q1: What is the difference between list.sort() and sorted(list)?\nAnswer: .sort() mutates the list in place and returns None; sorted() returns a brand-new sorted list leaving the original untouched.\nQ2: How do you safely avoid KeyError when reading a dictionary?\nAnswer: Use my_dict.get(key, default_value).',
        longQ:
          'Q: Explain the mutable default argument pitfall in Python functions and show how to solve it cleanly.\nAnswer Outline: Python evaluates default parameter expressions once when def executes, not per function call. If a default is [], every call appends to the same list. Setting default=None and initializing inside the function body prevents shared-state bugs.',
        mcq:
          '1. Which literal creates an empty dictionary vs an empty set in Python?\nA) {} creates a set; set() creates a dict  B) {} creates a dict; set() creates a set  C) [] creates a set  D) () creates a dict\nAnswer: B ({} is always an empty dict; an empty set requires set().)\n\n2. What does `nums = [1, 2, 3]; b = nums; b.append(4); print(len(nums))` output?\nA) 3  B) 4  C) Error  D) None\nAnswer: B (b and nums reference the same list object in memory.)',
      }),
      makeProgNote({
        id: 'note-2',
        moduleId: 'mod-3',
        lessonId: 'les-3',
        title: 'Safe File I/O, Context Managers & Exception Handling in Python',
        intro:
          'Programs interacting with external files or user input regularly encounter missing files, encoding differences, and malformed entries. Python context managers and try-except blocks keep resource handling clean and leak-free.',
        simple:
          'Opening a file with "with open(...)" is like an automatic door closer: the moment you finish reading or even if you stumble inside (an error occurs), Python automatically locks and closes the file behind you.',
        detailed:
          'Python’s `try ... except SpecificError ... else ... finally` provides fine-grained error control. Code in `else` runs ONLY if `try` succeeded with zero exceptions, keeping your `try` block minimal. Meanwhile `with open(path, "r", encoding="utf-8") as handle:` invokes the object’s `__enter__` and `__exit__` methods, guaranteeing file descriptors are released promptly.',
        concepts:
          '- Context Manager: Object supporting `with` for deterministic setup/cleanup.\n- encoding="utf-8": Prevents OS-dependent character corruption across Windows and Linux.\n- Exception Hierarchy: Specific exceptions (`ValueError`, `FileNotFoundError`) precede broad catches.\n- Raise Statement: Explicitly triggers meaningful errors on invalid inputs (`raise ValueError(...)`).',
        steps:
          'Step 1: Wrap file reads/writes inside `with open(path, mode, encoding="utf-8") as f:`.\nStep 2: Keep `try` focused tightly around the lines that might fail.\nStep 3: Catch specific errors (`FileNotFoundError`, `ValueError`), never a bare `except:`.\nStep 4: Validate function arguments with explicit `raise ValueError` when invariants break.',
        codeLang: 'python',
        code: 'def load_scores(raw_lines):\n    valid = []\n    for line in raw_lines:\n        text = line.strip()\n        if not text:\n            continue\n        try:\n            score = int(text)\n        except ValueError:\n            print(f"Skipping invalid entry: {text!r}")\n        else:\n            if 0 <= score <= 100:\n                valid.append(score)\n    return valid\n\nsample = ["85", " ", "ninety", "94", "150"]\nprint("Accepted scores:", load_scores(sample))',
        lineByLine:
          'Lines 3-6 ignore blank lines. Lines 7-10 isolate int() parsing in try/except ValueError so non-numeric lines print a clear warning. Lines 11-13 run only on valid integers and accept 0..100 into valid. Lines 16-17 test mixed input safely.',
        output:
          "Skipping invalid entry: 'ninety'\nAccepted scores: [85, 94]",
        debugging:
          'Never write a bare `except:` because it silently catches SystemExit and KeyboardInterrupt (Ctrl+C), trapping users inside frozen scripts! At minimum catch specific errors like `(ValueError, OSError)`.',
        exercise:
          'Write a Python function `safe_read_lines(path)` that opens a UTF-8 file using `with open`, catches `FileNotFoundError`, returns `[]` with a warning message, and otherwise returns stripped non-empty lines.',
        realWorld:
          'Automated grading pipelines, ETL data ingestion tools, and backend configuration loaders depend on UTF-8 context managers and explicit ValueError/OSError guards.',
        important:
          '- Always specify `encoding="utf-8"` when opening text files.\n- Use `pathlib.Path` for clean cross-platform file paths.',
        mistakes:
          '- Writing bare `except:` or `except Exception: pass`.\n- Calling `open()` without `with` and forgetting `.close()` when an error happens.',
        summary:
          'Context managers guarantee clean file closure while targeted `try / except / else` blocks separate error handling from valid processing.',
        shortQ:
          'Q1: Why is `except:` without an exception type dangerous in Python?\nAnswer: It catches system interrupts like KeyboardInterrupt (Ctrl+C) and hides unexpected bugs.\nQ2: When does the `else` block after `try / except` run?\nAnswer: Only when the `try` block finishes without raising any exception.',
        longQ:
          'Q: Explain how Python’s `with open(...)` context manager prevents resource leaks compared to manual `f = open(...)` and `f.close()` calls.\nAnswer Outline: If an exception occurs between open() and close(), manual .close() is skipped, leaving file handles open and potentially losing buffered writes. The `with` protocol automatically runs cleanup inside `__exit__` regardless of errors.',
        mcq:
          '1. Which mode opens a file for writing and overwrites existing content?\nA) "r"  B) "w"  C) "a"  D) "x"\nAnswer: B ("w" writes/truncates; "a" appends; "r" reads.)\n\n2. Which exception is raised when attempting `int("hello")`?\nA) TypeError  B) KeyError  C) ValueError  D) ZeroDivisionError\nAnswer: C (Type matches string, but its value cannot convert to int -> ValueError.)',
      }),
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-2',
        quizType: 'module',
        title: 'Module 2 Quiz: Python Collections & Functions',
        description: 'Assess list, tuple, set, dictionary behavior, and function defaults.',
        passingPercent: 70,
        questions: [
          {
            id: 'q-1',
            questionText: 'Which data structure automatically stores only unique items?',
            options: ['list', 'tuple', 'set', 'string'],
            correctIndex: 2,
            explanation: 'A Python set guarantees uniqueness among hashable items.',
            topicTag: 'Sets',
            orderIndex: 1,
          },
          {
            id: 'q-2',
            questionText: 'What does `sorted([3, 1, 2])` return?',
            options: ['None', '[1, 2, 3]', '[3, 1, 2]', '(1, 2, 3)'],
            correctIndex: 1,
            explanation: 'sorted() returns a new sorted list leaving the input untouched.',
            topicTag: 'Lists',
            orderIndex: 2,
          },
          {
            id: 'q-3',
            questionText: 'Why should `items=None` be used instead of `items=[]` as a default parameter?',
            options: [
              'Lists cannot be parameters in Python',
              'A mutable default list is shared across every call to that function',
              'None runs faster than []',
              '[] causes a SyntaxError',
            ],
            correctIndex: 1,
            explanation: 'Default mutable objects are evaluated once at function definition time.',
            topicTag: 'Functions',
            orderIndex: 3,
          },
          {
            id: 'q-4',
            questionText: 'Which expression safely reads "city" from dict `user` defaulting to "N/A"?',
            options: ['user["city"] or "N/A"', 'user.get("city", "N/A")', 'user.fetch("city")', 'user.has("city")'],
            correctIndex: 1,
            explanation: 'dict.get(key, default) returns the default safely without raising KeyError.',
            topicTag: 'Dictionaries',
            orderIndex: 4,
          },
        ],
      },
      {
        id: 'quiz-2',
        quizType: 'final',
        title: 'Final Assessment: Python Beginner to Advanced',
        description: 'Comprehensive assessment covering file I/O, OOP, exceptions, and idioms.',
        passingPercent: 75,
        questions: [
          {
            id: 'q-5',
            questionText: 'What guarantees automatic file closure even when an error interrupts reading?',
            options: ['try/continue', 'with open(...) context manager', 'import sys', 'global file handle'],
            correctIndex: 1,
            explanation: 'Context managers automatically invoke __exit__ cleanup.',
            topicTag: 'File I/O',
            orderIndex: 1,
          },
          {
            id: 'q-6',
            questionText: 'In a Python class, what is the role of `__init__(self, ...)`?',
            options: [
              'Destroys the object',
              'Initializes newly created object attributes',
              'Imports external libraries',
              'Converts the class to JSON',
            ],
            correctIndex: 1,
            explanation: '__init__ runs right after object creation to set initial instance state.',
            topicTag: 'Python OOP',
            orderIndex: 2,
          },
          {
            id: 'q-7',
            questionText: 'Which comprehension returns squares of even numbers in `range(6)`?',
            options: [
              '[x * x for x in range(6) if x % 2 == 0]',
              '(x * x where x is even)',
              '{x: x if even}',
              'for x in range(6): x * x',
            ],
            correctIndex: 0,
            explanation: 'List comprehensions place the output expression first, followed by for and optional if.',
            topicTag: 'Comprehensions',
            orderIndex: 3,
          },
          {
            id: 'q-8',
            questionText: 'Which exception is raised by dividing an integer by 0 in Python?',
            options: ['ValueError', 'ZeroDivisionError', 'IndexError', 'TypeError'],
            correctIndex: 1,
            explanation: 'Division by zero raises ZeroDivisionError.',
            topicTag: 'Exceptions',
            orderIndex: 4,
          },
        ],
      },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Capstone: CLI Study Log & Quiz Scorer in Python',
      instructions:
        'Write a Python application using OOP classes, dictionary lookups, safe try-except input parsing, and `with open(..., encoding="utf-8")` JSON or text persistence to record study hours and compute module averages.',
      dueDate: '2026-12-30',
      maxMarks: 100,
    },
  },

  // =========================================================================
  // 7. Python for Automation
  // =========================================================================
  {
    id: 'python-automation',
    departmentId: 'dept_programming_web',
    departmentName: 'Programming & Web Development',
    title: 'Python Automation',
    category: 'Programming & Web Development',
    level: 'Intermediate',
    duration: '6 Weeks',
    thumbnailUrl: BRAND_IMAGES.courseTech,
    shortDescription:
      'Automate repetitive file organization, CSV/report batching, scheduled workflows, and safe CLI tools with standard Python libraries.',
    fullDescription:
      'Turn manual repetitive computer chores into reliable, logged Python workflows. Learners automate directory sorting with pathlib, batch-clean CSV reports, validate inputs safely, use subprocess/logging responsibly, and build dry-run-safe CLI utilities.',
    introduction:
      'Every workplace spends hours renaming files, merging spreadsheets, checking broken links, and formatting text reports. Python’s standard library (pathlib, csv, json, logging, argparse) turns hours of manual clicking into repeatable, auditable scripts.',
    objectives: [
      'Traverse and organize directory trees safely using pathlib.Path.',
      'Automate CSV and JSON report normalization without corrupting headers.',
      'Add --dry-run safety modes and structured logging to automation scripts.',
      'Handle file collisions, permissions, and scheduling reliably.',
    ],
    targetAudience:
      'Python learners, operations analysts, and developers looking to automate administrative and file-processing workflows.',
    prerequisites: 'Completion of Python basics (loops, functions, dictionaries, and file I/O).',
    syllabusSummary: [
      'Module 1: Pathlib File System Automation & Safe Dry-Run Design',
      'Module 2: Batch CSV, JSON & Text Report Processing Pipelines',
      'Module 3: Structured Logging, Argparse CLIs & Error Recovery',
    ],
    outcomes: [
      'Build file-organizer utilities with zero accidental overwrites.',
      'Merge and clean multi-file CSV datasets automatically.',
      'Instrument automation scripts with rotating logs and summary reports.',
      'Package reusable command-line scripts with argparse.',
    ],
    moduleAssessments: [
      'Module 1 Assessment: File Categorizer with Dry-Run Mode',
      'Module 2 Assessment: CSV Attendance Deduplicator',
      'Module 3 Assessment: Logged CLI Report Generator',
    ],
    finalAssessmentTitle: 'Final Assessment: Automated Course Archive & CSV Summary Tool',
    modules: [
      {
        id: 'mod-1',
        title: 'File System Automation with pathlib & shutil',
        description: 'Inspect extensions, compute safe destinations, and prevent overwrites.',
        assessmentTitle: 'Module 1 Check: Collision-Safe Mover',
        assessmentCriteria: 'Implements dry-run flag and unique filename fallback.',
        orderIndex: 1,
      },
      {
        id: 'mod-2',
        title: 'CSV & JSON Report Automation',
        description: 'Read, normalize whitespace, validate fields, and export summary CSVs.',
        assessmentTitle: 'Module 2 Check: Batch CSV Normalizer',
        assessmentCriteria: 'Uses csv.DictReader with newline="" and utf-8.',
        orderIndex: 2,
      },
      {
        id: 'mod-3',
        title: 'CLI Arguments & Audit Logging',
        description: 'Replace print() guesswork with Python logging and argparse.',
        assessmentTitle: 'Module 3 Check: Production Automation Script',
        assessmentCriteria: 'Logs timestamps, counts, and skips malformed rows safely.',
        orderIndex: 3,
      },
    ],
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        title: 'Modern File Automation Using pathlib.Path',
        summary: 'Filter directories, inspect extensions, and simulate moves safely with dry_run.',
        objectives: [
          'Replace brittle string concatenation with Path objects.',
          'Check Path.exists(), .is_file(), and .suffix accurately.',
          'Always test destructive or move automation with dry_run=True first.',
        ],
        contentBody:
          'Modern Python automation replaces `os.path.join` string surgery with `from pathlib import Path`. A Path object joins subdirectories cleanly with `/` (`folder / "notes.pdf"`), checks existence, and extracts `.stem` and `.suffix` cleanly across Windows and Linux.\n\nGolden rule of automation: always implement a `dry_run` flag that logs planned actions before actually moving or deleting any file.',
        examples:
          'from pathlib import Path\n\ndef plan_organization(base_dir: Path, dry_run: bool = True):\n    for item in base_dir.iterdir():\n        if item.is_file():\n            ext = item.suffix.lower().lstrip(".") or "other"\n            target_dir = base_dir / ext\n            print(f"[{\'DRY\' if dry_run else \'MOVE\'}] {item.name} -> {target_dir / item.name}")',
        exercisePrompt:
          'Write a Python function using pathlib.Path that lists every .pdf and .txt file inside a folder along with its size in KB, skipping subdirectories.',
        durationMinutes: 30,
        orderIndex: 1,
      },
      {
        id: 'les-2',
        moduleId: 'mod-2',
        title: 'Batch Processing CSV & JSON Reports',
        summary: 'Clean messy spreadsheet exports into reliable normalized CSVs.',
        objectives: [
          'Read rows cleanly by header name using csv.DictReader.',
          'Write CSV files properly with newline="" and encoding="utf-8".',
          'Log skipped malformed rows instead of crashing mid-batch.',
        ],
        contentBody:
          'Most business automation involves CSV and JSON exports. Using `csv.DictReader` lets your code refer to columns by header name (`row["email"]`) rather than fragile numeric column positions that break whenever someone reorders spreadsheet columns.\n\nAlways open CSV files with `newline=""` so Python’s csv module handles line endings cleanly without introducing blank rows on Windows.',
        examples:
          'import csv\nimport io\n\nraw = "name,email,score\\nAsha , ASHA@EXAMPLE.COM , 88\\nRavi,invalid,abc\\n"\nreader = csv.DictReader(io.StringIO(raw))\nvalid_rows = []\nfor row in reader:\n    try:\n        score = int(row["score"].strip())\n        valid_rows.append({"name": row["name"].strip(), "email": row["email"].strip().lower(), "score": score})\n    except ValueError:\n        print("Skipped malformed score for:", row["name"])\nprint("Cleaned:", valid_rows)',
        exercisePrompt:
          'Write a Python function that reads a multi-row CSV string, trims whitespace from every field, removes duplicate emails (case-insensitive), and counts how many duplicates were dropped.',
        durationMinutes: 35,
        orderIndex: 2,
      },
      {
        id: 'les-3',
        moduleId: 'mod-3',
        title: 'Logging, Argparse & Idempotent Automation Workflows',
        summary: 'Build command-line utilities that leave clear audit trails and handle re-runs cleanly.',
        objectives: [
          'Configure Python’s logging module with level and timestamp formatting.',
          'Accept CLI flags (--input, --dry-run) using argparse.',
          'Design idempotent scripts that can safely run twice on the same directory.',
        ],
        contentBody:
          'An automation script running unattended needs structured logs (`logging.info`, `logging.warning`) rather than scattered print statements. Designing scripts to be idempotent means running the script twice in a row produces the exact same clean state without creating duplicate copies or crashing on already-existing folders (`mkdir(parents=True, exist_ok=True)`).',
        examples:
          'import logging\n\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")\n\ndef run_sync(count: int, dry_run: bool):\n    logging.info("Starting batch sync (dry_run=%s) for %d records", dry_run, count)\n    logging.info("Batch completed cleanly.")\n\nrun_sync(12, True)',
        exercisePrompt:
          'Write an argparse configuration accepting `--source` (required string), `--min-size` (int default 0), and `--execute` (boolean flag defaulting to False so dry-run is safe by default).',
        durationMinutes: 35,
        orderIndex: 3,
      },
    ],
    studyNotes: [
      makeProgNote({
        id: 'note-1',
        moduleId: 'mod-1',
        lessonId: 'les-1',
        title: 'Pathlib File Automation, Dry-Run Safety & Collision Handling',
        intro:
          'File-system automation eliminates tedious manual sorting and renaming, yet an unchecked move or overwrite bug can erase hours of work in milliseconds. Safe design patterns make automation both fast and trustworthy.',
        simple:
          'A dry-run mode is like an architect reviewing blueprints on paper before swinging a hammer: the script prints every file move it WOULD make so you can verify everything before allowing actual changes.',
        detailed:
          'Using `pathlib.Path`, developers inspect directory trees cleanly (`folder.glob("*.csv")` or `.rglob("*.pdf")`). Creating target folders via `target.mkdir(parents=True, exist_ok=True)` avoids FileExistsError when re-running scripts. Crucially, before calling `src.rename(dest)` or `shutil.move`, checking `if dest.exists()` prevents silent overwrites by generating a timestamped or numbered fallback name.',
        concepts:
          '- Pathlib: Object-oriented filesystem paths joining cleanly with `/`.\n- Dry-Run Flag: Simulation mode logging planned file operations without modifying disk state.\n- Idempotency: Running a task multiple times produces the same clean result.\n- Name Collision Guard: Checking `dest.exists()` before moving or renaming.',
        steps:
          'Step 1: Convert raw directory inputs into `Path(input_dir).resolve()`.\nStep 2: Validate `if not root.is_dir(): raise ValueError(...)`.\nStep 3: Default `dry_run=True` during testing.\nStep 4: Ensure destination directory exists with `mkdir(parents=True, exist_ok=True)`.\nStep 5: Check for filename collisions before moving.',
        codeLang: 'python',
        code: 'from pathlib import Path\n\ndef unique_destination(dest: Path) -> Path:\n    if not dest.exists():\n        return dest\n    counter = 1\n    while True:\n        candidate = dest.with_name(f"{dest.stem}_{counter}{dest.suffix}")\n        if not candidate.exists():\n            return candidate\n        counter += 1\n\nprint("Helper ready:", unique_destination(Path("report.pdf")))',
        lineByLine:
          'Lines 3-5 return dest immediately if no file exists there. Lines 6-11 append _1, _2, etc. before the file extension (.stem + counter + .suffix) until an unused filename is found.',
        output: 'Helper ready: report.pdf',
        debugging:
          'Avoid `os.rename()` across different disk drives/partitions on some OS configurations—prefer `shutil.move(str(src), str(dest))` for cross-filesystem moves.',
        exercise:
          'Write an idempotent Python script plan that scans a simulated list of filenames and groups them into "documents", "images", and "archives" folders while flagging potential name collisions.',
        realWorld:
          'Hospital imaging archives, legal document intake folders, and build artifact cleaners rely on collision-safe Python pathlib routines.',
        important:
          '- Always check `item.is_file()` inside loops so directories are not accidentally moved.\n- Never run recursive delete automation without explicit dry-run verification.',
        mistakes:
          '- Hardcoding Windows paths like "C:\\Users\\..." directly inside reusable scripts.\n- Overwriting identically named files from different subfolders silently.',
        summary:
          'Reliable Python file automation combines pathlib, exist_ok directory creation, collision checking, and dry-run verification.',
        shortQ:
          'Q1: What does `target.mkdir(parents=True, exist_ok=True)` do?\nAnswer: Creates missing parent directories and succeeds silently if target already exists.\nQ2: Why default destructive automation flags to dry-run?\nAnswer: To verify planned moves/renames safely before modifying actual files.',
        longQ:
          'Q: Explain what makes an automation script "idempotent" and list three design choices that achieve idempotency in Python file scripts.\nAnswer Outline: An idempotent script yields the same final result whether run once or five times. Achieved via exist_ok=True, skipping files already inside target folders, and collision checks.',
        mcq:
          '1. For a Path p = Path("notes/module_01.pdf"), what is `p.suffix`?\nA) module_01  B) .pdf  C) pdf  D) notes\nAnswer: B (.suffix includes the leading dot.)\n\n2. Which module works alongside pathlib to copy files across directories cleanly?\nA) math  B) shutil  C) random  D) statistics\nAnswer: B (shutil provides copy2, move, and rmtree utilities.)',
      }),
      makeProgNote({
        id: 'note-2',
        moduleId: 'mod-2',
        lessonId: 'les-2',
        title: 'Automating CSV Normalization, Validation & Audit Logging',
        intro:
          'Raw spreadsheets exported by users frequently contain extra spaces, mixed-case emails, blank rows, and invalid numbers. Automating CSV normalization saves hours and protects downstream databases.',
        simple:
          'Think of csv.DictReader as a smart assistant that reads each spreadsheet row like a labeled dictionary ("Name": "Asha", "Score": "88") instead of forcing you to guess whether Score is column 2 or column 5.',
        detailed:
          'When processing CSV files, naive `.split(",")` code breaks immediately whenever a text field contains a comma inside quotes (e.g., `"Chennai, India"`). Python’s built-in `csv` module parses RFC-4180 quotes, escapes, and multi-line fields accurately. Pairing `csv.DictReader` with `logging` creates an audit log showing total rows read, cleaned rows exported, and exact line numbers of rejected entries.',
        concepts:
          '- csv.DictReader: Maps each CSV row to a dictionary keyed by header names.\n- newline="": Required parameter on `open()` when reading/writing CSV files with the csv module.\n- Structured Logging: Recording timestamped INFO/WARNING events to console or log files.\n- Data Normalization: Trimming whitespace, standardizing lowercase emails, and validating types.',
        steps:
          'Step 1: Open CSV input with `encoding="utf-8-sig"` (strips Excel UTF-8 BOM headers cleanly) and `newline=""`.\nStep 2: Validate required headers exist in `reader.fieldnames`.\nStep 3: Normalize each row inside a targeted `try/except ValueError` block.\nStep 4: Write valid rows via `csv.DictWriter` and log a clear final summary count.',
        codeLang: 'python',
        code: 'import csv\nimport io\nimport logging\n\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")\n\ncsv_data = "full_name,email,hours\\nMeera Nair,MEERA@ACADEMY.ORG,12\\nBroken Row,bad,NaN\\n"\nreader = csv.DictReader(io.StringIO(csv_data))\nclean = []\nfor line_num, row in enumerate(reader, start=2):\n    try:\n        hrs = float(row["hours"].strip())\n        clean.append({\n            "full_name": row["full_name"].strip(),\n            "email": row["email"].strip().lower(),\n            "hours": hrs,\n        })\n    except (ValueError, AttributeError):\n        logging.warning("Row %d rejected: invalid hours=%r", line_num, row.get("hours"))\n\nlogging.info("Normalized %d valid rows.", len(clean))\nprint(clean)',
        lineByLine:
          'Line 5 configures INFO-level logging. Line 8 wraps input text with DictReader. Line 10 tracks spreadsheet line numbers starting at row 2 (after header). Lines 11-18 validate hours as float and normalize text. Lines 19-20 log exact row warnings on failure without crashing.',
        output:
          "WARNING: Row 3 rejected: invalid hours='NaN'\nINFO: Normalized 1 valid rows.\n[{'full_name': 'Meera Nair', 'email': 'meera@academy.org', 'hours': 12.0}]",
        debugging:
          'If Excel exports show weird characters at the start of the first header (`\\ufefffull_name`), switch `encoding="utf-8"` to `encoding="utf-8-sig"` when opening for reading.',
        exercise:
          'Extend the snippet above to write the cleaned rows back into an `io.StringIO` buffer using `csv.DictWriter` and verify the output headers and values.',
        realWorld:
          'HR attendance importers, student roster sync jobs, and finance reconciliation utilities use this exact pattern daily.',
        important:
          '- Never split CSV strings manually with `line.split(",")`.\n- Track row numbers so humans can fix rejected source rows immediately.',
        mistakes:
          '- Forgetting `newline=""` when opening files for `csv.writer` (adds extra blank lines on Windows).\n- Not stripping Excel’s UTF-8 BOM with `utf-8-sig`.',
        summary:
          'Combining csv.DictReader/DictWriter, utf-8-sig, targeted validation, and structured logging produces production-grade spreadsheet automation.',
        shortQ:
          'Q1: Why is `line.split(",")` unsafe for parsing CSV files?\nAnswer: Quoted fields containing commas (e.g., "Chennai, TN") get split incorrectly into extra columns.\nQ2: What problem does `encoding="utf-8-sig"` solve when reading CSV exports?\nAnswer: It strips the invisible Byte Order Mark (BOM) inserted by tools like Excel.',
        longQ:
          'Q: Describe a complete defensive pipeline for automating batch CSV ingestion, from header checks to error reporting.\nAnswer Outline: Open with utf-8-sig and newline="", verify required columns in reader.fieldnames, normalize and type-cast row-by-row inside try/except tracking exact line numbers, write valid rows atomically, and log final accepted vs rejected counts.',
        mcq:
          '1. Which class writes dictionaries as rows using explicit column headers?\nA) csv.ListWriter  B) csv.DictWriter  C) json.Writer  D) csv.HeaderWriter\nAnswer: B (csv.DictWriter pairs fieldnames with dictionary rows.)\n\n2. Which logging level best fits skipping a malformed row while continuing the batch?\nA) CRITICAL  B) WARNING  C) DEBUG  D) NOTSET\nAnswer: B (WARNING indicates a recoverable anomaly worth operator attention.)',
      }),
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-1',
        quizType: 'module',
        title: 'Module 1 Quiz: File Automation & Safety',
        description: 'Verify pathlib methods, collision prevention, and dry-run practices.',
        passingPercent: 70,
        questions: [
          {
            id: 'q-1',
            questionText: 'In pathlib, how do you join folder Path("courses") with "syllabus.pdf"?',
            options: ['Path("courses") + "syllabus.pdf"', 'Path("courses") / "syllabus.pdf"', 'Path("courses").concat("syllabus.pdf")', 'Path.merge()'],
            correctIndex: 1,
            explanation: 'pathlib overloads the / operator for clean OS-independent path joining.',
            topicTag: 'Pathlib',
            orderIndex: 1,
          },
          {
            id: 'q-2',
            questionText: 'What does a dry-run mode do in an automation script?',
            options: [
              'Deletes temporary files faster',
              'Previews/logs planned actions without modifying actual files',
              'Runs without logging',
              'Compresses output into zip archives',
            ],
            correctIndex: 1,
            explanation: 'Dry-run lets operators verify what changes would occur safely.',
            topicTag: 'Safety Patterns',
            orderIndex: 2,
          },
          {
            id: 'q-3',
            questionText: 'Which property extracts the filename without its extension from `Path("report_q1.pdf")`?',
            options: ['.name', '.stem', '.suffix', '.parent'],
            correctIndex: 1,
            explanation: '.stem returns "report_q1", while .name returns "report_q1.pdf".',
            topicTag: 'Pathlib',
            orderIndex: 3,
          },
          {
            id: 'q-4',
            questionText: 'What makes an automation task "idempotent"?',
            options: [
              'It runs only once ever',
              'Re-running it produces the same end state without errors or duplicates',
              'It executes on multiple cores',
              'It disables exceptions',
            ],
            correctIndex: 1,
            explanation: 'Idempotent scripts handle repeated execution cleanly.',
            topicTag: 'Reliability',
            orderIndex: 4,
          },
        ],
      },
      {
        id: 'quiz-2',
        quizType: 'final',
        title: 'Final Assessment: Python for Automation',
        description: 'Assess CSV parsing, encoding safety, CLI arguments, and logging.',
        passingPercent: 75,
        questions: [
          {
            id: 'q-5',
            questionText: 'Why open CSV files with `newline=""` when passing them to Python’s csv module?',
            options: [
              'To strip all text newlines',
              'To allow the csv module to translate line endings cleanly without blank rows',
              'To encrypt the file',
              'Because Python 3 rejects files without it',
            ],
            correctIndex: 1,
            explanation: 'csv handles universal newline translation internally when newline="" is specified.',
            topicTag: 'CSV Processing',
            orderIndex: 1,
          },
          {
            id: 'q-6',
            questionText: 'Which standard library module parses command-line flags like `--dry-run` cleanly?',
            options: ['csv', 'argparse', 'shutil', 'pathlib'],
            correctIndex: 1,
            explanation: 'argparse builds help menus, type conversion, and CLI flags.',
            topicTag: 'CLI Tools',
            orderIndex: 2,
          },
          {
            id: 'q-7',
            questionText: 'Why prefer `csv.DictReader` over `csv.reader`?',
            options: [
              'It supports Excel binary .xlsx files',
              'It accesses columns by header name rather than fragile column numbers',
              'It deletes duplicate rows automatically',
              'It compresses text',
            ],
            correctIndex: 1,
            explanation: 'Column-name access stays resilient if spreadsheet columns reorder.',
            topicTag: 'CSV Processing',
            orderIndex: 3,
          },
          {
            id: 'q-8',
            questionText: 'Which encoding removes leading BOM bytes in Excel-exported UTF-8 CSV files?',
            options: ['ascii', 'latin-1', 'utf-8-sig', 'utf-32'],
            correctIndex: 2,
            explanation: 'utf-8-sig strips the UTF-8 Byte Order Mark cleanly.',
            topicTag: 'Encodings',
            orderIndex: 4,
          },
        ],
      },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Capstone: Logged CSV Cleaner & Safe File Organizer CLI',
      instructions:
        'Build an automation script accepting --dry-run and --input, cleaning duplicate student email rows via csv.DictReader, logging skipped malformed rows with line numbers, and writing clean output with pathlib.',
      dueDate: '2026-12-30',
      maxMarks: 100,
    },
  },

  // =========================================================================
  // 8. Python Data Handling and Applications
  // =========================================================================
  {
    id: 'python-data-handling',
    departmentId: 'dept_programming_web',
    departmentName: 'Programming & Web Development',
    title: 'Python Data Handling',
    category: 'Programming & Web Development',
    level: 'Advanced',
    duration: '8 Weeks',
    thumbnailUrl: BRAND_IMAGES.courseTech,
    shortDescription:
      'Process structured datasets, JSON API payloads, vectorized tabular calculations, missing-value cleaning, and applied Python data pipelines.',
    fullDescription:
      'Learn how real-world Python applications ingest, validate, aggregate, and persist structured datasets. Cover nested JSON normalization, tabular filtering/grouping, handling missing/outlier values, SQLite persistence via sqlite3, and building clean reusable data pipelines.',
    introduction:
      'Applications rarely receive neat, ready-to-plot tables. Real datasets arrive as nested JSON responses, incomplete CSV extracts, and relational tables. This course equips learners to clean, join, summarize, and store structured data systematically in Python.',
    objectives: [
      'Parse, flatten, and validate nested JSON records using Python.',
      'Perform filtering, grouping, sorting, and summary statistics cleanly.',
      'Detect and handle missing values, duplicates, and type mismatches accurately.',
      'Persist structured application data safely using parameterized sqlite3 queries.',
    ],
    targetAudience:
      'Intermediate Python learners preparing for data engineering, analytics applications, and backend Python systems.',
    prerequisites: 'Solid grasp of Python collections, functions, file handling, and exceptions.',
    syllabusSummary: [
      'Module 1: Structured JSON Pipelines, Flattening & Schema Validation',
      'Module 2: Grouping, Aggregations, Missing-Data Strategies & Statistics',
      'Module 3: Relational Data Persistence with Python sqlite3 & End-to-End Pipelines',
    ],
    outcomes: [
      'Transform nested JSON feeds into flat analytical tables.',
      'Prevent SQL injection completely using parameterized queries in Python.',
      'Compute weighted averages, medians, and grouped cohort metrics accurately.',
      'Deliver reproducible Python data pipelines with clear summary reports.',
    ],
    moduleAssessments: [
      'Module 1 Assessment: Nested JSON Enrollment Flattener',
      'Module 2 Assessment: Missing-Value Cleaner & Cohort Aggregator',
      'Module 3 Assessment: Parameterized SQLite Reporting Pipeline',
    ],
    finalAssessmentTitle: 'Final Assessment: End-to-End Academic Analytics Pipeline in Python',
    modules: [
      {
        id: 'mod-1',
        title: 'Nested JSON Processing & Data Validation',
        description: 'Navigate nested dictionaries cleanly and serialize normalized outputs.',
        assessmentTitle: 'Module 1 Check: JSON Normalization',
        assessmentCriteria: 'Safely handles missing nested keys without KeyError.',
        orderIndex: 1,
      },
      {
        id: 'mod-2',
        title: 'Tabular Grouping, Cleaning & Statistics',
        description: 'Impute or filter missing metrics, deduplicate records, and summarize cohorts.',
        assessmentTitle: 'Module 2 Check: Grouped Statistical Report',
        assessmentCriteria: 'Accurate mean, median, and per-department aggregation.',
        orderIndex: 2,
      },
      {
        id: 'mod-3',
        title: 'Parameterized SQLite Persistence in Python',
        description: 'Store and query structured application records safely with sqlite3.',
        assessmentTitle: 'Module 3 Check: Safe SQLite Pipeline',
        assessmentCriteria: 'Uses ? placeholders and context transactions cleanly.',
        orderIndex: 3,
      },
    ],
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        title: 'Parsing & Flattening Nested JSON Payloads',
        summary: 'Convert hierarchical JSON structures into clean flat row dictionaries.',
        objectives: [
          'Serialize and parse JSON with json.dumps / json.loads.',
          'Extract deeply nested optional keys safely.',
          'Validate record shapes before downstream calculations.',
        ],
        contentBody:
          'Modern web services communicate predominantly via JSON. When JSON arrives deeply nested (for example, a student object holding a nested "enrollment" dictionary and a list of module scores), flat table exports require normalizing each nested layer cleanly.\n\nUse `json.loads()` to parse JSON strings into Python dicts/lists and chain `.get("key", {})` so absent optional branches never trigger AttributeError or KeyError.',
        examples:
          'import json\n\npayload = \'{"student": {"name": "Kavya", "city": "Madurai"}, "scores": [84, 90, 87]}\'\ndata = json.loads(payload)\nflat = {\n    "name": data.get("student", {}).get("name", "Unknown"),\n    "city": data.get("student", {}).get("city", "Unknown"),\n    "avg_score": round(sum(data.get("scores", [])) / max(1, len(data.get("scores", []))), 2),\n}\nprint(json.dumps(flat, indent=2))',
        exercisePrompt:
          'Parse a JSON array of 3 course objects where one lacks an optional "tags" array, flatten into summary dicts showing title and tag_count, and print cleanly.',
        durationMinutes: 35,
        orderIndex: 1,
      },
      {
        id: 'les-2',
        moduleId: 'mod-2',
        title: 'Grouping, Aggregation & Handling Missing Values',
        summary: 'Compute group metrics with collections.defaultdict and statistics while preserving data integrity.',
        objectives: [
          'Group records cleanly using defaultdict(list).',
          'Distinguish between dropping missing values vs imputing median/mean.',
          'Compute mean, median, and counts accurately via Python’s statistics module.',
        ],
        contentBody:
          'Grouping and summarizing raw records is the heart of Python data handling. When numeric fields contain `None` or blank strings, blindly replacing missing scores with `0` falsely drags down averages!\n\nInstead, decide transparently whether to omit missing measurements (`[v for v in vals if v is not None]`) or impute using the cohort median—always documenting the choice clearly in output metadata.',
        examples:
          'from collections import defaultdict\nimport statistics\n\nrecords = [\n    {"dept": "Programming", "score": 88},\n    {"dept": "Programming", "score": None},\n    {"dept": "Programming", "score": 94},\n    {"dept": "Design", "score": 82},\n]\n\ngroups = defaultdict(list)\nfor r in records:\n    if r["score"] is not None:\n        groups[r["dept"]].append(r["score"])\n\nfor dept, vals in groups.items():\n    print(dept, "-> count:", len(vals), "mean:", statistics.mean(vals))',
        exercisePrompt:
          'Compute both mean and median for two departments while ignoring None values, and print the count of missing records detected per department.',
        durationMinutes: 40,
        orderIndex: 2,
      },
      {
        id: 'les-3',
        moduleId: 'mod-3',
        title: 'Relational Application Storage with Python sqlite3',
        summary: 'Persist structured Python application data safely using parameterized SQL.',
        objectives: [
          'Open connections cleanly and enable atomic transactions with `with conn:`.',
          'Create relational tables and insert/query rows safely.',
          'Prevent SQL injection strictly via `?` parameter placeholders.',
        ],
        contentBody:
          'Python includes `sqlite3` built into the standard library—requiring zero external database servers for local applications, utilities, and test suites.\n\nCRITICAL SECURITY RULE: Never build SQL strings using f-strings (`f"SELECT * FROM users WHERE name = \'{user_input}\'"`). Always pass values via tuple placeholders (`conn.execute("SELECT * FROM users WHERE name = ?", (user_input,))`) so sqlite3 treats user input strictly as data, never executable SQL.',
        examples:
          'import sqlite3\n\nwith sqlite3.connect(":memory:") as conn:\n    conn.execute("CREATE TABLE scores (student TEXT, track TEXT, mark INTEGER)")\n    conn.execute("INSERT INTO scores VALUES (?, ?, ?)", ("Arjun", "Python", 91))\n    rows = conn.execute("SELECT student, mark FROM scores WHERE track = ?", ("Python",)).fetchall()\n    print("Query result:", rows)',
        exercisePrompt:
          'Create an in-memory sqlite3 database with a `courses` table (id, title, hours), insert 3 rows with `executemany` and `?` placeholders, and query courses exceeding 20 hours.',
        durationMinutes: 40,
        orderIndex: 3,
      },
    ],
    studyNotes: [
      makeProgNote({
        id: 'note-1',
        moduleId: 'mod-2',
        lessonId: 'les-2',
        title: 'Data Cleaning, Missing Values & Cohort Aggregation in Python',
        intro:
          'Analytical conclusions are only as reliable as the underlying data cleaning. Mixing missing nulls with zeroes or double-counting duplicate records distorts metrics and misleads decisions.',
        simple:
          'If three students took a quiz and one student was absent (marked None), you divide the sum by 3—not 4—unless you want the absent student treated as scoring zero.',
        detailed:
          'Python data pipelines separate cleaning from aggregation: first deduplicate by a natural key (e.g., studentId + assignmentId), coerce types safely, filter or explicitly impute missing measurements, and then group using `collections.defaultdict(list)` or tabular tools. Using `statistics.median()` alongside `statistics.mean()` protects reports from extreme outliers skewing conclusions.',
        concepts:
          '- Missing-Value Filtering vs Imputation: Omitting absent values vs substituting median/mean.\n- Deduplication Key: Unique tuple identifying distinct business events.\n- defaultdict(list): Automatically initializes empty list buckets when grouping.\n- Median vs Mean: Median resists single extreme outlier distortion.',
        steps:
          'Step 1: Inspect incoming fields for None, empty strings, and out-of-range numbers.\nStep 2: Deduplicate records using a set of primary keys.\nStep 3: Bucket valid measurements per category via `defaultdict(list)`.\nStep 4: Compute count, mean, and median via `statistics`.\nStep 5: Output both metrics and missing-row counts so reports remain transparent.',
        codeLang: 'python',
        code: 'from collections import defaultdict\nimport statistics\n\nrows = [\n    ("S1", "Python", 80),\n    ("S2", "Python", None),\n    ("S3", "Python", 92),\n    ("S1", "Python", 80),\n]\n\nseen = set()\ngrouped = defaultdict(list)\nmissing = 0\n\nfor sid, track, score in rows:\n    if (sid, track) in seen:\n        continue\n    seen.add((sid, track))\n    if score is None:\n        missing += 1\n    else:\n        grouped[track].append(score)\n\nfor track, vals in grouped.items():\n    print(track, "n=", len(vals), "mean=", statistics.mean(vals), "missing=", missing)',
        lineByLine:
          'Lines 10-18 deduplicate student-track pairs via the seen set. Lines 19-22 separate missing None entries from valid scores. Lines 24-25 report clean count, mean, and missing tally.',
        output: 'Python n= 2 mean= 86 missing= 1',
        debugging:
          'Calling `statistics.mean([])` on an empty list raises `StatisticsError: mean requires at least one data point`. Always guard `if vals:` before calling mean or median!',
        exercise:
          'Build a Python aggregator calculating per-city student averages and reporting any city that only had missing scores without crashing on StatisticsError.',
        realWorld:
          'Academic outcome dashboards, clinical trial summaries, and financial KPI reporting systems enforce strict missing-value separation to avoid misleading averages.',
        important:
          '- Never silently treat None as 0 without explicit domain justification.\n- Guard empty lists before calling `statistics.mean()` or `min()/max()`.',
        mistakes:
          '- Double-counting duplicated records during joins or imports.\n- Reporting only mean when a single extreme outlier heavily skews the cohort.',
        summary:
          'Clean Python data handling deduplicates events, distinguishes missing nulls from zero values, groups safely with defaultdict, and guards statistical calls on empty buckets.',
        shortQ:
          'Q1: Why is `mean` often paired with `median` in data reports?\nAnswer: Extreme outliers pull the mean sharply, whereas the median stays representative of the typical value.\nQ2: What happens if you call `statistics.mean([])`?\nAnswer: Python raises StatisticsError.',
        longQ:
          'Q: Discuss the trade-offs between dropping missing values vs imputing the mean/median in a student assessment dataset.\nAnswer Outline: Dropping preserves observed distribution accuracy when missingness is random; mean/median imputation keeps sample counts intact for downstream fixed-width models but reduces variance artificially and can bias results if absence correlates with struggle.',
        mcq:
          '1. Which class from `collections` avoids manual key-existence checks when grouping items into lists?\nA) Counter  B) defaultdict(list)  C) namedtuple  D) deque\nAnswer: B (defaultdict(list) initializes [] automatically on first key access.)\n\n2. Which exception occurs if `statistics.median([])` runs?\nA) KeyError  B) StatisticsError  C) ZeroDivisionError  D) ValueError\nAnswer: B (statistics raises StatisticsError on empty sequences.)',
      }),
      makeProgNote({
        id: 'note-2',
        moduleId: 'mod-3',
        lessonId: 'les-3',
        title: 'Parameterized SQLite Persistence & Injection-Safe Python Apps',
        intro:
          'In-memory Python variables disappear when a script terminates. Python’s built-in sqlite3 module gives applications durable, queryable relational storage inside a single portable file—provided queries are parameterized safely.',
        simple:
          'Parameterized SQL uses "?" placeholders like a mail merge form: SQLite reads the command structure FIRST, then fills in the user’s text strictly as a literal string so nobody can trick the database with clever quotes.',
        detailed:
          'Every database mutation in `sqlite3` runs inside a transaction. Wrapping writes in `with conn:` commits changes automatically when the block finishes cleanly, or rolls them back entirely if any exception fires. Setting `conn.row_factory = sqlite3.Row` allows reading query columns by name (`row["title"]`) rather than fragile numeric indices (`row[0]`).',
        concepts:
          '- SQL Injection: Attack where user input alters SQL command structure via string concatenation.\n- Parameterized Query: Separating SQL template (`WHERE id = ?`) from bound values `(uid,)`.\n- Transaction Rollback: Automatic undo on exception inside `with conn:`.\n- sqlite3.Row: Dict-like row factory enabling named column access.',
        steps:
          'Step 1: Open connection (`sqlite3.connect(db_path)`) and configure `conn.row_factory = sqlite3.Row`.\nStep 2: Use `with conn:` around CREATE/INSERT/UPDATE transactions.\nStep 3: Always pass dynamic values inside tuples using `?` placeholders—note single-item tuples require a trailing comma: `(value,)`!\nStep 4: Close the connection cleanly when finished.',
        codeLang: 'python',
        code: 'import sqlite3\n\nconn = sqlite3.connect(":memory:")\nconn.row_factory = sqlite3.Row\n\nwith conn:\n    conn.execute("CREATE TABLE courses (id TEXT PRIMARY KEY, title TEXT, weeks INTEGER)")\n    conn.executemany(\n        "INSERT INTO courses (id, title, weeks) VALUES (?, ?, ?)",\n        [("py-auto", "Python Automation", 6), ("java-core", "Java Core", 10)],\n    )\n\nrows = conn.execute("SELECT title, weeks FROM courses WHERE weeks >= ?", (8,)).fetchall()\nfor r in rows:\n    print(f"{r[\'title\']} ({r[\'weeks\']} weeks)")\nconn.close()',
        lineByLine:
          'Line 4 enables column access by name. Lines 6-11 create the table and batch-insert two rows safely using `?` placeholders. Line 13 queries with a single-element parameter tuple `(8,)` (trailing comma mandatory!). Lines 14-16 print results and close the connection.',
        output: 'Java Core (10 weeks)',
        debugging:
          'Two frequent sqlite3 pitfalls: (1) Passing `(8)` instead of `(8,)` passes an int rather than a 1-element tuple and raises `ProgrammingError: parameters are of unsupported type`. (2) Using `with conn:` commits transactions, NOT closes the connection—still call `conn.close()` or `contextlib.closing`.',
        exercise:
          'Build an in-memory sqlite3 tracker for course quiz attempts (`student`, `quiz`, `score`), write a function recording a new score with `?`, and query the highest score per student.',
        realWorld:
          'Desktop tools, mobile app local caches, telemetry collectors, and analytical staging jobs depend on parameterized SQLite pipelines.',
        important:
          '- NEVER interpolate variables into SQL using f-strings or `%` formatting.\n- Always include the trailing comma on 1-item parameter tuples: `(param,)`.',
        mistakes:
          '- Writing `conn.execute("SELECT * FROM users WHERE email = \'" + email + "\'")` (vulnerable to SQL injection).\n- Forgetting `(x,)` comma in single-parameter queries.',
        summary:
          'Python’s sqlite3 module enables reliable relational persistence when combined with `with conn:` atomic transactions, `sqlite3.Row`, and `?` parameter binding.',
        shortQ:
          'Q1: Why is `WHERE name = ?` with `(user_input,)` required instead of f-strings?\nAnswer: It prevents SQL injection by ensuring user input is strictly treated as data, not SQL syntax.\nQ2: Why is the trailing comma needed in `(8,)`?\nAnswer: Without the comma, Python evaluates `(8)` as the integer 8 rather than a 1-element tuple.',
        longQ:
          'Q: Explain how `with conn:` transaction management behaves when an exception occurs midway through two database inserts in Python sqlite3.\nAnswer Outline: `with conn:` begins a transaction; if the second insert raises an error, sqlite3 automatically rolls back the first insert so partial/corrupted state is never committed.',
        mcq:
          '1. What does setting `conn.row_factory = sqlite3.Row` allow?\nA) Multi-user locking  B) Accessing selected columns by name like row["title"]  C) Skipping ? placeholders  D) Faster disk encryption\nAnswer: B (sqlite3.Row supports name-based and index-based column lookup.)\n\n2. Which execute call is syntactically valid in Python sqlite3?\nA) conn.execute("SELECT * FROM c WHERE id=?", ("py1"))  B) conn.execute("SELECT * FROM c WHERE id=?", ("py1",))  C) conn.execute("SELECT * FROM c WHERE id=$1", "py1")  D) conn.execute(f"SELECT * FROM c WHERE id={id}")\nAnswer: B (Single parameter requires a 1-tuple ("py1",).)',
      }),
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-1',
        quizType: 'module',
        title: 'Module 1 Quiz: JSON & Data Cleaning',
        description: 'Assess nested JSON parsing and missing-value rules.',
        passingPercent: 70,
        questions: [
          {
            id: 'q-1',
            questionText: 'Which function parses a JSON string into Python dictionaries and lists?',
            options: ['json.dumps()', 'json.loads()', 'json.write()', 'json.decode_csv()'],
            correctIndex: 1,
            explanation: 'json.loads() ("load string") deserializes JSON text into Python objects.',
            topicTag: 'JSON',
            orderIndex: 1,
          },
          {
            id: 'q-2',
            questionText: 'Why should missing quiz scores (None) NOT automatically be replaced with 0 during mean calculation?',
            options: [
              'Python crashes on 0',
              'Treating unsubmitted/absent entries as 0 artificially lowers cohort averages',
              '0 is a string in JSON',
              'None takes more RAM',
            ],
            correctIndex: 1,
            explanation: 'Missing values and genuine 0% scores mean very different things analytically.',
            topicTag: 'Data Cleaning',
            orderIndex: 2,
          },
          {
            id: 'q-3',
            questionText: 'Which exception occurs if you call `statistics.mean([])` on an empty list?',
            options: ['ZeroDivisionError', 'StatisticsError', 'ValueError', 'KeyError'],
            correctIndex: 1,
            explanation: 'Python’s statistics module raises StatisticsError when input has no data points.',
            topicTag: 'Statistics',
            orderIndex: 3,
          },
          {
            id: 'q-4',
            questionText: 'How can you group items into lists by key cleanly without manual key initialization?',
            options: ['dict()', 'collections.defaultdict(list)', 'set()', 'tuple()'],
            correctIndex: 1,
            explanation: 'defaultdict(list) automatically creates an empty list when encountering a new key.',
            topicTag: 'Grouping',
            orderIndex: 4,
          },
        ],
      },
      {
        id: 'quiz-2',
        quizType: 'final',
        title: 'Final Assessment: Python Data Handling & Applications',
        description: 'Assess end-to-end JSON/tabular pipelines and SQLite persistence.',
        passingPercent: 75,
        questions: [
          {
            id: 'q-5',
            questionText: 'Which SQLite query call prevents SQL injection safely?',
            options: [
              'conn.execute(f"SELECT * FROM u WHERE id={uid}")',
              'conn.execute("SELECT * FROM u WHERE id=?", (uid,))',
              'conn.execute("SELECT * FROM u WHERE id=" + uid)',
              'conn.execute("SELECT * FROM u WHERE id=?", uid)',
            ],
            correctIndex: 1,
            explanation: 'Bound tuples with ? placeholders separate code from user data cleanly.',
            topicTag: 'SQLite Security',
            orderIndex: 1,
          },
          {
            id: 'q-6',
            questionText: 'When a transaction inside `with conn:` raises an exception, what happens?',
            options: [
              'Half the rows stay committed',
              'SQLite rolls back uncommitted writes in that transaction',
              'The table is dropped',
              'Python ignores the exception',
            ],
            correctIndex: 1,
            explanation: 'Context transactions rollback cleanly on error.',
            topicTag: 'Transactions',
            orderIndex: 2,
          },
          {
            id: 'q-7',
            questionText: 'What does `conn.row_factory = sqlite3.Row` enable?',
            options: [
              'Automatic JSON export',
              'Reading row columns by column name',
              'Multithreaded writes',
              'Encryption',
            ],
            correctIndex: 1,
            explanation: 'sqlite3.Row supports dictionary-style field lookup.',
            topicTag: 'SQLite',
            orderIndex: 3,
          },
          {
            id: 'q-8',
            questionText: 'Why pair `statistics.median()` with `statistics.mean()` in reports?',
            options: [
              'Median handles strings',
              'Median reveals skew when extreme outliers distort the mean',
              'Mean only works on integers',
              'Median removes None automatically',
            ],
            correctIndex: 1,
            explanation: 'Median is robust against extreme high or low outliers.',
            topicTag: 'Analytics',
            orderIndex: 4,
          },
        ],
      },
    ],
    assignment: {
      id: 'assign-1',
      title: 'Capstone: JSON-to-SQLite Student Performance Pipeline in Python',
      instructions:
        'Ingest a nested JSON dataset with missing fields and duplicates, clean and compute per-department statistics (count, mean, median), and store results safely into sqlite3 using parameterized queries.',
      dueDate: '2026-12-30',
      maxMarks: 100,
    },
  },
];
