import type { StudyNoteUpgradeSpec } from './noteUpgradeHelper';

export const DEPT3_NOTE_UPGRADES: Record<string, StudyNoteUpgradeSpec> = {
  // 16. Graphic Designing Fundamentals
  'graphic-designing-fundamentals:note-1': {
    intro:
      'Great graphic design is organized visual communication—not decorating blank pages with shiny gradients or extra fonts. Before picking colors or typography, designers establish Visual Hierarchy, 12-column grids, and deliberate whitespace using the four CRAP principles: Contrast, Repetition, Alignment, and Proximity.',
    learningObjectives: [
      'Apply Contrast, Repetition, Alignment, and Proximity (CRAP) to eliminate cluttered layouts.',
      'Guide viewer eye movement cleanly across primary, secondary, and tertiary focal points.',
      'Construct structured margins, columns, and gutters on responsive and print grids.',
      'Use negative whitespace strategically to elevate institutional clarity and polish.',
    ],
    simpleExplanation:
      'Think of Visual Hierarchy like clear road signs: one bold directional headline tells you immediately where you are, smaller crisp labels give timing details, and generous empty margin space keeps your eyes calm instead of drowning in bumper-to-bumper visual traffic.',
    detailedExplanation:
      'Untrained designers frequently emphasize everything at once—huge bright badges, drop shadows on every box, and zero empty margins. When everything shouts loudly, viewers feel overwhelmed and skip reading.\n\nStructured composition restores calm clarity through CRAP:\n1. Contrast: Differentiate distinct roles unmistakably (headline vs body copy, primary button vs link) in scale, weight, or hue rather than making timid tweaks.\n2. Repetition: Repeat brand colors (`#761D2D` Maroon, `#D5B77A` Champagne Gold), corner radii, and spacing multiples consistently so multi-page brochures feel cohesive.\n3. Alignment: Anchor every block to invisible shared grid edges—never mix randomly centered snippets beside left-aligned paragraphs.\n4. Proximity: Place related titles, captions, and controls tight together while opening generous margins between separate groups.\n\nWhitespace (negative space) is an active structural ingredient, never wasted blank area—it frames headlines cleanly and signals calm academic prestige.',
    keyConcepts:
      '- **Visual Hierarchy**: Deliberate ranking of scale, weight, and contrast guiding eyes cleanly from focal headline (Level 1) to details (Level 3).\n- **CRAP Principles**: Contrast, Repetition, Alignment, and Proximity—the four foundational laws of disciplined composition.\n- **Grid & Gutters**: Invisible vertical columns and consistent spacing channels aligning imagery, cards, and copy mathematically.\n- **Negative Whitespace**: Intentional breathing room surrounding headlines, cards, and margins enhancing clarity.\n- **Focal Point**: Single primary visual anchor winning immediate first-glance attention.',
    stepByStepExplanation:
      'Step 1: Identify one Primary Message, one Secondary Supporting Context, and one Clear Action before styling.\nStep 2: Set generous outer margins and enable crisp 8px spacing baselines plus column guides.\nStep 3: Establish clear scale contrast (48pt headline vs 16pt body) and verify squint-test dominance.\nStep 4: Group tightly related title + caption + action pairs via Proximity while widening gaps between separate cards.\nStep 5: Check every edge for clean shared alignment and strip decorative borders that add visual clutter.',
    practicalExampleExtra:
      'Squint Test Audit: Blur your eyes looking at a finished course poster from arm’s length—Title, Date/Venue, and Call-to-Action should stand out in clean descending prominence without muddy mid-tones.',
    realWorldApplications:
      'Executive annual reports, university admission brochures, SaaS landing hero sections, event posters, and mobile onboarding cards.',
    importantPoints:
      '- Never surround every text block in heavy borders when Proximity and Whitespace already separate groups.\n- Strong Contrast creates calm order; timid half-differences look like accidental errors.\n- Generous whitespace signals luxury professionalism across institutional communications.',
    commonMistakes:
      '- Center-aligning long 6-line body paragraphs (destroys clean left reading anchor).\n- Cramming decorative shapes into every corner because blank space feels "unfinished".\n- Placing three competing focal visuals shouting at identical size and saturation.',
    summary:
      'Visual Hierarchy and the four CRAP principles—backed by disciplined grids and generous whitespace—make complex layouts effortless to scan and unmistakably refined.',
    revisionChecklist: [
      'Rank canvas elements strictly into Level 1, Level 2, and Level 3 priority.',
      'Align every block along crisp grid edges; keep multi-line prose left-aligned.',
      'Separate distinct groups cleanly with whitespace rather than heavy borders.',
      'Run the quick squint test to confirm single focal dominance.',
    ],
    practiceExerciseExtra:
      'Sketch two wireframes for an RM HEAVEN Internship Fair flyer: one breaking Alignment and Proximity, and a corrected version applying 8px spacing multiples and clean left-aligned grids.',
    fiveQuestions: [
      {
        question: 'Why does filling every corner of a flyer with shapes and badges backfire?',
        answer:
          'Zero whitespace destroys focal hierarchy; viewers cannot tell where to look first and perceive clutter rather than clarity.',
      },
      {
        question: 'Explain Proximity using a course card containing Title, Duration, and Enroll Button.',
        answer:
          'Tight spacing binds Title, Duration, and Button inside one shared unit, while wider outer gaps separate Card A cleanly from neighboring Card B.',
      },
      {
        question: 'Why should multi-line editorial paragraphs be left-aligned rather than centered?',
        answer:
          'Left alignment establishes a crisp straight left edge where readers’ eyes return effortlessly line after line.',
      },
      {
        question: 'What does Contrast teach about differing visual weights?',
        answer:
          'If two elements serve different roles, make their scale, weight, or color unmistakably distinct rather than timid half-steps.',
      },
      {
        question: 'What quick visual check confirms your hierarchy works before exporting?',
        answer:
          'The Squint Test: blurring your eyes at the design should still reveal #1 headline, #2 visual/subhead, and #3 action in clear order.',
      },
    ],
  },

  'graphic-designing-fundamentals:note-2': {
    intro:
      'Typography and color discipline carry 80% of a brand’s emotional authority before a viewer reads the third sentence. Pairing editorial serif headings with crisp sans-serif UI text, enforcing the 60-30-10 color balance, and matching RGB vs CMYK export profiles prevent blurry printouts and unreadable interfaces.',
    learningObjectives: [
      'Combine editorial Serif headings cleanly with crisp Sans-Serif body copy using modular scales.',
      'Apply the 60-30-10 color ratio (`#F8F4ED` Ivory, `#292323` Charcoal, `#761D2D`/`#D5B77A` accents).',
      'Verify WCAG AA contrast compliance (>=4.5:1 for normal text) before publishing UIs.',
      'Choose sRGB PNG/SVG/WebP for screens vs 300 DPI CMYK PDF with bleed for commercial print.',
    ],
    simpleExplanation:
      'Typography and color act like formal attire for your message: pairing one classic serif voice with one crisp clean voice—supported by calm ivory surfaces and restrained maroon/gold accents—commands instant respect, whereas six clashing fonts look chaotic.',
    detailedExplanation:
      'Beginner designs commonly suffer from font overload (mixing four novelty scripts) and color competition (every card painted neon red). Professional brands enforce restraint through clear scales and strict color roles.\n\nFirst, restrict projects to two font families maximum: a refined serif (`Cormorant Garamond` / `Playfair Display`) for headings paired with a clean sans-serif (`Plus Jakarta Sans` / `Inter`) for body text and dense study tables. Follow a consistent 1.25x Modular Type Scale with comfortable `1.5–1.65` line height and `60–75` character width.\n\nSecond, structure color around the 60-30-10 ratio: 60% calm canvas (`#F8F4ED` Warm Ivory or `#FFFFFF`), 30% ink/surfaces (`#292323` Charcoal), and 10% focused brand accents (`#761D2D` Maroon + `#D5B77A` Gold). Always test foreground/background contrast (`>=4.5:1` for regular copy—pale gold text on pale ivory fails readability!).\n\nFinally, export purposefully: screens require sRGB SVG/PNG/WebP, whereas physical certificates and brochures require 300 DPI CMYK PDFs with `3mm` edge bleeds.',
    keyConcepts:
      '- **Modular Type Scale**: Mathematical ratio (`1.25x`) linking `H1 -> H2 -> H3 -> Body -> Caption` harmoniously.\n- **Line Measure & Leading**: Ideal paragraph width (`60–75` chars) paired with `1.5x` line spacing for comfortable reading.\n- **60-30-10 Rule**: Color budget allocating 60% calm background canvas, 30% supporting ink/surfaces, and 10% brand accents.\n- **WCAG AA Contrast**: Minimum `4.5:1` luminance contrast for regular text ensuring universal legibility.\n- **RGB vs CMYK**: Additive screen gamut (`sRGB`) vs subtractive print ink gamut (`CMYK` at 300 DPI + bleed).',
    stepByStepExplanation:
      'Step 1: Select maximum two complementary fonts—one expressive Display voice and one crisp UI sans-serif.\nStep 2: Build modular size steps (`14px -> 16px -> 20px -> 25px -> 32px`) with `line-height: 1.55` on body copy.\nStep 3: Assign palette roles cleanly: 60% Ivory/White, 30% Charcoal ink, 10% Deep Maroon & Gold accents.\nStep 4: Test every button and caption for `>=4.5:1` contrast (use Gold on Dark Maroon or borders, never small body copy on Ivory).\nStep 5: Export SVG for logos, WebP/PNG for web screens, or 300 DPI CMYK PDF with `3mm` bleed for print.',
    practicalExampleExtra:
      'Contrast Check: Deep Maroon `#761D2D` text on Warm Ivory `#F8F4ED` exceeds `7.5:1` WCAG AAA cleanly; `#D5B77A` Champagne Gold shines on crisp 1px borders or dark `#761D2D` badges.',
    realWorldApplications:
      'Academic brand style guides, digital certificate PDFs ready for print, editorial web typography, and accessible SaaS interfaces.',
    importantPoints:
      '- Never sacrifice legibility for ultra-pale low-contrast aesthetics.\n- Two font families with varied weights look cleaner than four competing fonts.\n- Export brand crests as SVG vectors on websites for infinite retina sharpness.',
    commonMistakes:
      '- Placing thin pale gold or soft gray text onto white/ivory cards (`<2.5:1` contrast).\n- Sending screen `72 DPI` RGB files straight to commercial print shops.\n- Letting body lines stretch full `1,200px` monitor width without container limits.',
    summary:
      'Modular typography scales paired with 60-30-10 color balance, WCAG contrast verification, and RGB/CMYK export discipline yield clear institutional refinement.',
    revisionChecklist: [
      'Cap typography at 1–2 font families with clear modular size contrast.',
      'Maintain 60-30-10 balance keeping 60%+ calm neutral breathing space.',
      'Verify >=4.5:1 text contrast on every button, badge, and caption.',
      'Export SVG/PNG/WebP in sRGB for web; 300 DPI CMYK + 3mm bleed for print.',
    ],
    practiceExerciseExtra:
      'Define exact hex pairings using Deep Maroon (`#761D2D`), Warm Ivory (`#F8F4ED`), Champagne Gold (`#D5B77A`), and Charcoal (`#292323`) for Header Banner, Primary Button, Body Card, and Certificate Border.',
    fiveQuestions: [
      {
        question: 'Why must Champagne Gold (`#D5B77A`) NOT be used for tiny 13px body copy on Warm Ivory (`#F8F4ED`)?',
        answer:
          'Gold on light ivory has weak luminance contrast well below 4.5:1 WCAG AA; reserve Gold for borders, icons, or accents over Dark Maroon.',
      },
      {
        question: 'How does the 60-30-10 rule prevent visual fatigue on dashboards?',
        answer:
          'Keeping 60% calm neutral canvas and 30% Charcoal ink lets 10% Maroon/Gold accents highlight important actions cleanly.',
      },
      {
        question: 'What is ideal line width ("measure") and line height for long study articles?',
        answer: 'Roughly 60–75 characters per line paired with 1.5–1.65 line-height.',
      },
      {
        question: 'What goes wrong when sending a `72 DPI` RGB PNG directly to a commercial printer?',
        answer:
          'Low pixel density prints blurry edges, bright RGB colors shift muddy in CMYK ink, and missing 3mm bleeds leave uneven white trim edges.',
      },
      {
        question: 'Why export brand crests as SVG rather than flat JPEG files on web portals?',
        answer: 'SVGs use vector paths staying razor-sharp at every display zoom at tiny file sizes.',
      },
    ],
  },

  // 17. UI / UX Design
  'ui-ux-design:note-1': {
    intro:
      'User Interface (UI) crafts clean visual screens, whereas User Experience (UX) shapes the complete end-to-end journey ensuring learners accomplish tasks without confusion. Grounding wireframes in User Flows and Jakob Nielsen’s Usability Heuristics prevents stylish apps that baffle users.',
    learningObjectives: [
      'Distinguish UI surface aesthetics clearly from underlying UX task flows.',
      'Map complete happy-path, validation-error, and empty-state User Flows prior to styling.',
      'Apply Nielsen’s Usability Heuristics including System Status Visibility and Error Prevention.',
      'Build clear greyscale wireframes validating structure before color polish.',
    ],
    simpleExplanation:
      'Think of UX as designing an intuitive airport terminal—clear baggage flow, readable gate signs, and smooth security lanes—while UI chooses refined flooring, calm lighting, and crisp sign typography. Pretty marble floors never fix confusing hallways.',
    detailedExplanation:
      'Jumping straight into colorful mockups before mapping user goals guarantees expensive rework when edge cases appear late. Disciplined UX starts with Task Flows and Low-Fidelity Wireframes.\n\nEvery complete User Flow documents three crucial paths: (1) Happy Path (Student views course -> enrolls -> launches Study Note -> marks complete); (2) Error Path (wrong login password, failed network save, expired session); and (3) Empty/First-Time Path (helpful onboarding guidance when a new user has zero saved notes yet).\n\nAuditing wireframes early against Jakob Nielsen’s Usability Heuristics catches hidden friction:\n- Visibility of System Status: Show immediate progress ("Saving note...", "2 of 4 notes completed").\n- Recognition Rather Than Recall: Pair clear icons with readable 1–2 word labels instead of mystery icons.\n- Error Prevention: Inline validation cues and safe confirmation dialogs before destructive deletes.',
    keyConcepts:
      '- **UX vs UI**: UX governs end-to-end usability, task speed, and mental models; UI governs visual controls, typography, and spacing.\n- **User Flow**: Diagram mapping every step, branch condition, empty state, and error recovery path.\n- **System Status Visibility**: Updating users promptly on saving, loading, uploads, or enrollment approval.\n- **Error Prevention**: Designing clear constraints and safe defaults preventing accidental mistakes.\n- **Low-Fidelity Wireframe**: Fast grayscale layout focusing strictly on hierarchy and actions before color.',
    stepByStepExplanation:
      'Step 1: Interview 3–5 real learners to pinpoint confusion moments before sketching screens.\nStep 2: Map the end-to-end User Flow covering Empty State, Happy Path, and Error Recovery.\nStep 3: Sketch greyscale Low-Fidelity Wireframes highlighting the single primary action per screen.\nStep 4: Audit wireframes against Nielsen’s Heuristics (Status Visibility, Clear Labels, Error Prevention).\nStep 5: Validate flow clarity with real test users before applying brand colors.',
    practicalExampleExtra:
      'Flow Upgrade: Display exact enrollment status ("Request Submitted — Under Admin Review") alongside a helpful module preview instead of showing a silent spinner or blank screen.',
    realWorldApplications:
      'Online course registration flows, multi-step checkouts, mobile banking transfers, and clinical intake forms.',
    importantPoints:
      '- Never design purely for the Happy Path—empty, loading, and error states break apps most often.\n- Mystery unlabeled icons force cognitive guesswork; pair icons cleanly with short text labels.\n- Greyscale wireframes expose weak hierarchy immediately before color distracts reviewers.',
    commonMistakes:
      '- Picking colors and shadows on Screen 1 before mapping Steps 2–5.\n- Showing cryptic errors ("Error 400") without telling users how to fix it.\n- Designing blank white Empty States with zero onboarding guidance.',
    summary:
      'Strong UX/UI starts with thorough User Flows (happy, empty, and error states), low-fidelity wireframes, and heuristic audits for status feedback and error prevention.',
    revisionChecklist: [
      'Map Happy, Empty, Loading, and Error states on every key screen.',
      'Display clear text + visual feedback during async submissions and saves.',
      'Pair navigation icons with concise labels so users never guess.',
      'Validate greyscale wireframes before investing hours in color polish.',
    ],
    practiceExerciseExtra:
      'Sketch a 4-state Student Study Note Workspace flow covering First-Time Unread, Active Reading, Offline/Save Recovery, and Course Note Completion.',
    fiveQuestions: [
      {
        question: 'Explain UI vs UX using an online course enrollment flow.',
        answer:
          'UX ensures steps from browsing courses to seeing approval status feel logical and clear; UI crafts the maroon buttons, cards, typography, and spacing.',
      },
      {
        question: 'Why must designers explicitly plan Empty States alongside the Happy Path?',
        answer:
          'New students see empty lists on Day 1; guided empty states help users start instead of staring at blank screens.',
      },
      {
        question: 'Give one concrete example of "Visibility of System Status" in an LMS.',
        answer:
          'Showing button loading states, "Note Completed" confirmation pills, and updated `2 of 4 Read` progress counters.',
      },
      {
        question: 'Why avoid designing navigation strictly with unlabeled minimalist icons?',
        answer:
          'Unfamiliar icons force guesswork; pairing crisp icons with 1–2 word labels speeds recognition instantly.',
      },
      {
        question: 'Why validate greyscale wireframes before high-fidelity brand styling?',
        answer:
          'Greyscale strips color distraction so reviewers catch broken flows and buried buttons early.',
      },
    ],
  },

  'ui-ux-design:note-2': {
    intro:
      'Interfaces look finished on static mockups only until real fingers tap crowded mobile buttons or keyboard-only users lose focus inside custom menus. Designing full Component States, WCAG touch accessibility, and structured Usability Testing ensures products work effortlessly for everyone.',
    learningObjectives: [
      'Specify all 5 interactive component states (`Default`, `Hover`, `Focus`, `Disabled`, `Error`) cleanly.',
      'Enforce `>=44x44px` mobile touch targets and clear visible keyboard `:focus` rings.',
      'Ensure color-blind safety by pairing hue with icons and actionable inline text.',
      'Run 5-user task-based Usability Tests observing clicks silently without leading hints.',
    ],
    simpleExplanation:
      'Static screenshots show how a car looks parked in a showroom; Component States test headlights, brakes, and warning gauges, while Usability Testing watches actual drivers navigate real streets without someone whispering directions.',
    detailedExplanation:
      'Great digital craft lives inside interactive feedback and inclusive engineering:\n\n1. Complete Component States: Every button, input, and selector requires clear styling for Default, Hover, Active, Keyboard Focus-Visible, Loading, Disabled, and Error. Omitting `:focus` outlines shuts out keyboard navigators. Likewise, never show errors with red borders alone—pair `#B4434D` error borders with crisp exclamation icons and clear fix instructions.\n2. Mobile Ergonomics: Mobile thumbs need minimum `44x44px` touch targets with safe separation so destructive "Delete" actions never sit beside primary "Save" buttons.\n3. Real Usability Testing: Observing 5 realistic learners attempt unguided tasks ("Open Note 2 and quiz yourself using AI Tutor") uncovers ~80% of navigation blockers. Facilitators stay quiet instead of coaching testers toward buttons.',
    keyConcepts:
      '- **Interactive Component States**: Complete visual matrix covering Default, Hover, Focus, Active, Disabled, Loading, and Error.\n- **Keyboard Focus Ring**: High-contrast visible outline tracking keyboard `Tab` movement across buttons and links.\n- **Touch Target Ergonomics**: Mobile clickable controls spanning at least `44x44px` with safe spacing.\n- **Color-Blind Safe Feedback**: Combining hue with text messages and crisp status icons.\n- **Non-Leading Usability Testing**: Observing realistic users attempt unguided tasks silently.',
    stepByStepExplanation:
      'Step 1: Audit every button, input, and tab to ensure all 5 core states (`Default`, `Hover`, `Focus`, `Disabled`, `Error`) exist clearly.\nStep 2: Verify `>=44px` mobile touch targets and safe spacing around Delete/Unpublish actions.\nStep 3: Pair validation colors with explicit readable error guidance and icons.\nStep 4: Write 3 realistic task prompts avoiding UI button names inside instructions.\nStep 5: Observe 5 testers silently, log misclicks, and fix recurring blockers immediately.',
    practicalExampleExtra:
      'Non-Leading Prompt: Ask "Show how you would review Note 2 and check your understanding" instead of saying "Click the Study Notes tab then click Practice Quiz."',
    realWorldApplications:
      'Accessible campus portals, responsive checkout flows, screen-reader-friendly admin dashboards, and mobile study workspaces.',
    importantPoints:
      '- Never strip `:focus` outlines for aesthetics; style clean high-contrast `:focus-visible` rings.\n- Five quiet task tests beat fifty opinionated design meetings.\n- Keep destructive buttons spaced cleanly away from primary Save actions.',
    commonMistakes:
      '- Disabling Save buttons silently without explaining which field failed validation.\n- Asking "Do you like this maroon card?" instead of giving a realistic task.\n- Packing `24x24px` mobile buttons tightly side by side.',
    summary:
      'Production UI/UX specifies all interactive keyboard and error states, protects 44px touch targets and accessibility, and validates layouts via silent 5-user task tests.',
    revisionChecklist: [
      'Design Default, Hover, Focus-Visible, Disabled, Loading, and Error states cleanly.',
      'Keep mobile tap targets >=44x44px with safe spacing around destructive controls.',
      'Pair error/success colors with explicit icons and helpful text.',
      'Run silent unguided task tests rather than asking opinion polls.',
    ],
    practiceExerciseExtra:
      'Write 3 non-leading Usability Test tasks for the RM HEAVEN Course Workspace (`Study Notes` + `AI Tutor`) and define one clear pass signal per task.',
    fiveQuestions: [
      {
        question: 'Why must form errors show an icon and text guidance rather than a red border alone?',
        answer:
          'Users with color-vision deficiency or screen readers miss pure color cues; text + icons explain exactly what failed and how to fix it.',
      },
      {
        question: 'What is the minimum recommended touch-target size for mobile buttons?',
        answer: 'At least `44x44px` with clean spacing between neighboring controls.',
      },
      {
        question: 'Why should facilitators stay silent when testers hesitate during a Usability Test?',
        answer:
          'Coaching hides real navigation flaws; silent observation exposes unclear labels and broken mental models accurately.',
      },
      {
        question: 'Why is deleting keyboard `:focus` outlines an accessibility failure?',
        answer:
          'Keyboard-only navigators rely completely on visible focus rings to track which button or field is active.',
      },
      {
        question: 'Roughly how many realistic test users uncover ~80% of major UX blockers?',
        answer: 'Five carefully chosen users performing realistic unguided tasks.',
      },
    ],
  },

  // 18. Figma Practical Course
  'figma-practical-course:note-1': {
    intro:
      'Loose static Groups in Figma warp and overlap whenever copy translates or screens shrink from desktop to phone width. Mastering proper Frames and Auto Layout turns rigid artboards into responsive CSS-Flexbox-aligned components.',
    learningObjectives: [
      'Explain why semantic Frames replace loose Groups in real UI construction.',
      'Configure Auto Layout direction, gaps, padding, and `Hug` vs `Fill Container` constraints.',
      'Build nested responsive cards adapting cleanly from `1280px` desktop down to `375px` mobile.',
      'Apply consistent 4px / 8px spatial scales cleanly across frames.',
    ],
    simpleExplanation:
      'A Group is like taping paper cutouts together—moving one stretches pieces weirdly. An Auto Layout Frame works like an expandable bookshelf: add two extra lines of text, and inner padding and card height stretch cleanly with zero collisions.',
    detailedExplanation:
      'Plain Groups cannot enforce padding, fills, clipping bounds, or responsive Flexbox spacing. Frames act as true containers supporting fills, border strokes, `Clip Content`, and Auto Layout.\n\nAuto Layout mirrors CSS Flexbox: Vertical/Horizontal flow, Item Gap (`4px`/`8px` steps), and Padding. Mastering Resizing Constraints makes responsive UI effortless:\n- `Hug Contents`: Shrinks/grows tightly around child text (buttons, pills).\n- `Fill Container`: Stretches cleanly across parent width so multi-line headlines wrap downward smoothly instead of overflowing borders.\n- `Fixed Size`: Locked strict width/height reserved for avatars, crests, and icons.',
    keyConcepts:
      '- **Frame vs Group**: Responsive container supporting padding, fills, Auto Layout, and clipping versus passive layer grouping.\n- **Auto Layout**: Figma’s CSS-Flexbox layout engine dynamically positioning stacked/row children with gap and padding.\n- **Hug Contents**: Sizing tightly around internal items (buttons, status pills).\n- **Fill Container**: Stretching child layers cleanly across available parent width so long text wraps neatly.\n- **8px Spatial Scale**: Restricting gaps/padding to tidy multiples (`4, 8, 12, 16, 24, 32px`).',
    stepByStepExplanation:
      'Step 1: Convert loose layer Groups cleanly into named Frames (`CourseCard`, `HeaderRow`).\nStep 2: Apply vertical Auto Layout (`Shift + A`) on cards (`24px` padding, `16px` gap).\nStep 3: Set inner titles and paragraphs to `Fill Container` width + `Hug Contents` height so lines wrap cleanly.\nStep 4: Set buttons horizontally (`Hug` width, `12px/20px` padding, `8px` icon gap).\nStep 5: Resize outer cards from `420px` down to `320px` to verify smooth wrapping with zero overlaps.',
    practicalExampleExtra:
      'Stress Test: Paste a 14-word course title into your Auto Layout card; if nothing clips sideways and the button pushes cleanly downward, constraints are solid.',
    realWorldApplications:
      'Responsive SaaS component kits, mobile-ready landing sections, dynamic data cards, and developer-ready handoffs.',
    importantPoints:
      '- Always test Auto Layout cards with extra-long text before shipping.\n- Card titles and body text almost always need `Fill Container` width.\n- Follow `4px`/`8px` steps matching Tailwind CSS spacing seamlessly.',
    commonMistakes:
      '- Leaving card titles on `Hug Contents` width (text slices straight outside card boundaries).\n- Drawing flat rectangles behind text instead of styling the Auto Layout Frame directly.\n- Leaving unnamed default layers (`Frame 482`).',
    summary:
      'Semantic Frames powered by Auto Layout, `Hug` vs `Fill Container` constraints, and 8px spacing create responsive UIs matching CSS Flexbox cleanly.',
    revisionChecklist: [
      'Use Frames—never raw Groups—for every interactive component.',
      'Apply background fill and padding directly onto the Auto Layout Frame.',
      'Set card copy layers to `Fill Container` width so long text wraps vertically.',
      'Test narrow mobile widths alongside desktop sizes.',
    ],
    practiceExerciseExtra:
      'List exact Auto Layout stack direction, padding, and `Hug`/`Fill` settings for an RM HEAVEN Study Note Card (`Header` + `Title` + `Summary` + `Action Footer`).',
    fiveQuestions: [
      {
        question: 'Why apply button fill and padding directly on an Auto Layout Frame instead of drawing a rectangle behind text?',
        answer:
          'Putting background and padding on the Auto Layout Frame ensures the button resizes dynamically whenever label text changes.',
      },
      {
        question: 'When a multi-line title shoots horizontally outside a narrow mobile card, what constraint was missed?',
        answer: 'The text layer needs horizontal `Fill Container` and vertical `Hug Contents`.',
      },
      {
        question: 'Contrast `Hug Contents` vs `Fill Container`.',
        answer:
          '`Hug` fits tightly around children (ideal for buttons/pills); `Fill` expands across available parent width (ideal for wrapping card text).',
      },
      {
        question: 'What CSS layout standard mirrors Figma Auto Layout?',
        answer: 'CSS Flexbox (`display: flex`, `flex-direction`, `gap`, `padding`).',
      },
      {
        question: 'Why enforce `4px / 8px` spacing scales inside Figma?',
        answer:
          'Creates consistent rhythm and translates cleanly to Tailwind utility tokens during frontend implementation.',
      },
    ],
  },

  'figma-practical-course:note-2': {
    intro:
      'Updating button radii or brand maroon shades across 50 screens manually breeds bugs. Scalable Figma teams combine Main Components, Variants, Component Properties, and Design Tokens (Variables) so entire product libraries stay synchronized and effortless to code.',
    learningObjectives: [
      'Build Main Components propagating visual edits automatically to all Instances.',
      'Organize styles and states cleanly via Component Variants (`Style`, `Size`, `State`).',
      'Use Text, Boolean, and Instance Swap Component Properties instead of detaching instances.',
      'Create semantic Color/Spacing Variables (`brand/primary`, `surface/ivory`) for crisp Dev Mode handoff.',
    ],
    simpleExplanation:
      'A Main Component acts like a master rubber stamp: adjust the stamp’s corner radius once and 50 screens update together. Semantic Variables act like named recipe labels connecting Figma colors straight to CSS tokens.',
    detailedExplanation:
      'Copying flat frames creates color drift within weeks. Figma enforces unified craft across three layers:\n\n1. Main Components & Variants: Keep master elements tidy on a dedicated `Components` page and group states (`Style=Primary|Outline`, `State=Default|Hover|Disabled`) inside one Variant Set.\n2. Component Properties: Expose Boolean toggles (`hasLeadingIcon`), Text props (`label`), and Icon Swaps so teammates tailor instances cleanly without clicking "Detach Instance".\n3. Semantic Variables & Dev Mode: Bind semantic tokens (`surface/ivory = #F8F4ED`, `brand/maroon = #761D2D`, `accent/gold = #D5B77A`, `ink/charcoal = #292323`) rather than unnamed hex values, letting engineers inspect exact code tokens rapidly.',
    keyConcepts:
      '- **Main Component vs Instance**: Single source-of-truth master template versus synchronized child copies allowing safe text/icon overrides.\n- **Component Variants**: Grouping related states/styles (`Primary/Secondary`, `Default/Hover/Disabled`) under tidy property dropdowns.\n- **Component Properties**: Declarative controls (`Boolean`, `Text`, `Swap`) preventing accidental detaching.\n- **Semantic Variables (Tokens)**: Role-based named variables (`brand/primary`, `surface/card`) bridging Figma and React/CSS.\n- **Detaching Anti-Pattern**: Breaking an instance’s master link and losing future global updates.',
    stepByStepExplanation:
      'Step 1: Register brand colors and spacing steps as Semantic Variables.\nStep 2: Create a clean Main Component using Auto Layout fills bound to Variables.\nStep 3: Group states and styles cleanly inside one Variant Component Set.\nStep 4: Expose Text and Boolean Properties (`hasIcon`, `label`) so variants require zero detaching.\nStep 5: Verify Dev Mode shows clean semantic variable names and Flexbox rules.',
    practicalExampleExtra:
      'Token Map: `surface/canvas` -> `#F8F4ED` (`bg-[#F8F4ED]`), `brand/maroon` -> `#761D2D` (`bg-[#761D2D]`), `accent/gold` -> `#D5B77A` (`border-[#D5B77A]`).',
    realWorldApplications:
      'Multi-brand design systems, enterprise EdTech libraries, cross-platform token sync, and fast Figma-to-React delivery.',
    importantPoints:
      '- Avoid clicking "Detach Instance" over small label tweaks—add Component Properties instead.\n- Name tokens by semantic purpose (`surface/card`), not raw shade (`ivory-100`).\n- Store Main Components on a dedicated Components page cleanly.',
    commonMistakes:
      '- Scattering 30 disconnected button masters instead of one Variant Set.\n- Applying raw hex codes instead of Semantic Variables.\n- Handing messy unnamed layers (`Vector 99 copy`) to engineers.',
    summary:
      'Main Components, Variants, Component Properties, and Semantic Variables create unified design systems ready for rapid frontend handoff.',
    revisionChecklist: [
      'Consolidate styles and states into clean Variant Sets.',
      'Use Boolean/Text Component Properties instead of detaching instances.',
      'Bind fills and spacing to Semantic Variables.',
      'Audit Dev Mode layer names and tokens before engineering handoff.',
    ],
    practiceExerciseExtra:
      'Specify Variant axes (`Style`, `Size`, `State`), exposed Properties, and Semantic Variables for an RM HEAVEN Action Button Component Set.',
    fiveQuestions: [
      {
        question: 'Why is detaching Component Instances considered a design-system anti-pattern?',
        answer:
          'Detaching breaks the live link to the Main Component, excluding that element from future global color, radius, or spacing fixes.',
      },
      {
        question: 'How do Boolean Properties cut Component Variant bloat in half?',
        answer:
          'One `hasLeadingIcon` Boolean switch toggles icon visibility dynamically without duplicating separate "With Icon" and "No Icon" variant rows.',
      },
      {
        question: 'Why name a Figma variable `surface/ivory` or `brand/primary` instead of `color-1`?',
        answer:
          'Semantic role names clarify exact intended context and simplify future dark/theme adjustments cleanly.',
      },
      {
        question: 'What belongs on a clean Figma File Handoff checklist for Dev Mode?',
        answer:
          'Meaningful Frame names, active Auto Layout constraints, Semantic Variables, all interactive states, and zero leftover scratch artboards.',
      },
      {
        question: 'Why isolate Main Components on a separate Components page?',
        answer:
          'Prevents accidental deletion during page iterations and gives designers and engineers a single tidy master catalog.',
      },
    ],
  },

  // 19. Canva Professional Design
  'canva-professional-design:note-1': {
    intro:
      'Dropping text straight into a generic Canva template makes a brand look identical to thousands of unrelated pages. Professional Canva execution starts with a locked Brand Kit and disciplined template reconstruction matching real institutional identity.',
    learningObjectives: [
      'Configure a Canva Brand Kit storing exact hex palettes, typography pairs, and transparent crests.',
      'Reconstruct starting Canva templates systematically to enforce brand colors and hierarchy.',
      'Enforce two-font discipline and sharp alignment using Ruler Guides (`Shift + R`).',
      'Protect photo-over-text legibility cleanly with restrained overlays and breathing margins.',
    ],
    simpleExplanation:
      'Using an unedited template is like wearing a borrowed suit with someone else’s badge still pinned on. Locking your Brand Kit—Maroon, Ivory, Gold, and Serif/Sans pairings—tailors layouts cleanly to look custom-authored for RM HEAVEN.',
    detailedExplanation:
      'Speed tools empower rapid output, yet undisciplined template edits shatter institutional polish.\n\nProfessional teams establish Brand Infrastructure first:\n1. Brand Kit Discipline: Save verified hexes (`#761D2D`, `#8F2638`, `#F8F4ED`, `#D5B77A`, `#292323`), lock heading serif + body sans fonts, and store crisp transparent crests.\n2. Template Surgery: Strip cartoon stickers, playful doodles, and unrelated neon hues immediately. Swap backgrounds to `#F8F4ED` Ivory or `#761D2D` Maroon, snap edges cleanly to Ruler Guides (`Shift + R`), and edit long text down concisely rather than shrinking font sizes unreadable.\n3. Contrast Discipline: Never run thin light copy directly across busy sunny photographs without a calm subtle dark scrim overlay.',
    keyConcepts:
      '- **Canva Brand Kit**: Vault locking institutional hexes, typography styles, and transparent emblems across files.\n- **Template Reconstruction**: Using templates purely for structural skeleton while replacing colors, fonts, icons, and photos systematically.\n- **Ruler & Margin Guides**: Built-in alignment rails (`Shift + R`) preserving balanced outer breathing space.\n- **Hierarchy Calibration**: Tightening copy and rebalancing font scales after inserting real headlines.\n- **Visual Restraint**: Removing tacky stickers and cartoon clipart that lower academic prestige.',
    stepByStepExplanation:
      'Step 1: Configure Brand Kit hexes, heading/body fonts, and transparent Lion Crest PNG/SVG.\nStep 2: Pick a template strictly for grid structure—never for decorative icons or colors.\nStep 3: Strip cartoon shapes, apply official Ivory/Maroon palette roles, and set Brand Kit fonts.\nStep 4: Toggle Margin & Ruler Guides (`Shift + R`), align left edges cleanly, and trim excess words.\nStep 5: Preview at compact mobile width before exporting.',
    practicalExampleExtra:
      '5-Step Cleanup: Strip cartoon clipart -> Apply Brand Hexes -> Lock 2 Brand Fonts -> Snap to Ruler Guides -> Check mobile contrast.',
    realWorldApplications:
      'Campus webinar promos, LinkedIn carousels, internship announcement banners, and polished executive decks.',
    importantPoints:
      '- Never let default template colors override your institutional Brand Kit.\n- Trim wordy headlines instead of shrinking copy down to microscopic `7pt` text.\n- Use subtle dark gradient scrims when placing white headlines over photography.',
    commonMistakes:
      '- Leaving leftover template pinks/blues clashing beside Deep Maroon crests.\n- Cramming 50-word paragraphs into tight headline boxes.\n- Placing thin white letters over bright highlights without contrast overlays.',
    summary:
      'Canva achieves custom executive polish when governed by a locked Brand Kit, systematic template reconstruction, aligned Ruler Guides, and visual restraint.',
    revisionChecklist: [
      'Lock official hexes, two fonts, and transparent crest in Brand Kit first.',
      'Delete cartoon stickers and unrelated template fonts immediately.',
      'Enable Margins & Guides (`Shift + R`) for crisp shared edge alignment.',
      'Guarantee >=4.5:1 text contrast over photos via calm scrim overlays.',
    ],
    practiceExerciseExtra:
      'Write a 5-step checklist converting a bright generic startup flyer template into an authoritative RM HEAVEN Admissions Banner.',
    fiveQuestions: [
      {
        question: 'Why establish a Canva Brand Kit before creating campaign graphics?',
        answer:
          'Locks exact brand hexes, typography, and transparent logos in one click so multi-week output remains visually unified.',
      },
      {
        question: 'What goes wrong when pasting a 25-word paragraph into a 6-word template headline box?',
        answer:
          'Copy collides with borders or shrinks into unreadable tiny mobile print; concise headline editing is essential.',
      },
      {
        question: 'How do you fix thin white headlines sitting unreadably across bright background photos?',
        answer:
          'Insert a subtle semi-transparent charcoal/maroon overlay scrim behind the text or frame copy cleanly on an ivory card.',
      },
      {
        question: 'What gets deleted immediately when adapting any Canva starter layout?',
        answer:
          'Playful cartoon clipart, mismatched neon hues, thick drop shadows, and unrelated placeholder template fonts.',
      },
      {
        question: 'Which Canva shortcut displays crisp Ruler & Margin alignment guides?',
        answer: '`Shift + R`.',
      },
    ],
  },

  'canva-professional-design:note-2': {
    intro:
      'A crisp widescreen banner fails immediately if automated resizing clips headlines inside vertical Instagram Stories or square feeds. Deliberate Multi-Format Adaptation and format-accurate Exporting protect every campaign pixel from web compression blur and print edge clipping.',
    learningObjectives: [
      'Reflow master compositions cleanly across `16:9` widescreen, `1:1`, `4:5` portrait, and `9:16` Story canvases.',
      'Respect top/bottom mobile UI Safe Zones on Stories and Reels.',
      'Select exact Canva export formats (Transparent PNG/SVG, high-quality JPG, PDF Standard vs PDF Print CMYK + Bleed).',
      'Preserve sharp headline readability and unobstructed crests across all social placements.',
    ],
    simpleExplanation:
      'Shrinking a wide cinema billboard straight onto a tall phone leaves tiny illegible text and huge dead bars. Real adaptation rearranges elements thoughtfully per frame while keeping copy clear of phone caption bars.',
    detailedExplanation:
      'Flagship announcements ship simultaneously across `1920x1080` (`16:9`) web heroes, `1080x1350` (`4:5`) mobile feeds, `1080x1920` (`9:16`) Stories, and `A4` Print Flyers.\n\nSwitching landscape (`16:9`) to vertical (`9:16`) requires re-stacking split columns cleanly top-to-bottom, enlarging font weights for pocket screens, and leaving top `150px` and bottom `250px` free of key buttons or dates where app captions sit.\n\nChoose export specs by medium:\n- Vector Logos & Crisp Graphics: `SVG` or `Transparent PNG`.\n- Photo-Heavy Web Assets: Crisp `JPG` (`85%`) or compressed `PNG`.\n- Digital PDFs: `PDF Standard` (RGB).\n- Print Shops: `PDF Print` (CMYK + Crop Marks & Bleed).',
    keyConcepts:
      '- **Aspect Ratio Adaptation**: Deliberately re-composing columns and font sizes per canvas ratio rather than passive scaling.\n- **Platform Safe Zones**: Clear inner region inside `9:16` / `4:5` designs avoiding app handles and bottom caption bars.\n- **PDF Standard vs PDF Print**: Screen-ready lightweight RGB PDF vs commercial 300 DPI CMYK PDF with crop marks & bleed.\n- **Transparent PNG / SVG**: Crisp alpha-transparent formats layering cleanly over colored cards.\n- **Campaign Batch Consistency**: Unified headline hierarchy and badge positions across multi-size packs.',
    stepByStepExplanation:
      'Step 1: Perfect the flagship layout (`4:5` or `16:9`) first before resizing variants.\nStep 2: Duplicate into target sizes (`1080x1350`, `1080x1920`, `1920x1080`).\nStep 3: Reflow landscape horizontal columns cleanly into vertical mobile stacks.\nStep 4: Keep headlines/CTAs clear of top `150px` and bottom `250px` UI zones on `9:16`.\nStep 5: Export matching each destination (PNG/SVG for crisp type/logos, PDF Print CMYK + Bleed strictly for printers).',
    practicalExampleExtra:
      'Export Rule: Web crest -> `SVG`/`Transparent PNG`. Instagram carousel -> `PNG (1080x1350)`. Print poster -> `PDF Print (CMYK + Crop marks & bleed)`.',
    realWorldApplications:
      'Omnichannel admissions campaigns, print + digital campus kits, multi-slide carousels, and downloadable PDF internship guides.',
    importantPoints:
      '- Bottom `250px` on `9:16` Reels/Stories gets covered by app captions and message bars.\n- `4:5` portrait captures maximum mobile vertical viewport height cleanly.\n- Keep Crop Marks & Bleed strictly on physical print PDFs—never email bleed files to casual digital readers.',
    commonMistakes:
      '- Cropping wide posters lazily into square feeds, slicing crest edges.\n- Exporting crisp vector text banners as blurry low-quality JPGs.\n- Mailing `PDF Standard` RGB files to commercial offset printers.',
    summary:
      'Smart Multi-Format Adaptation reflows elements per ratio and Safe Zone, backed by exact sRGB digital vs CMYK print export settings.',
    revisionChecklist: [
      'Reflow side-by-side landscape columns cleanly into vertical stacks on mobile sizes.',
      'Respect top/bottom UI Safe Zones on `9:16` Stories and Reels.',
      'Use PNG/SVG for crisp type/logos; reserve JPG cleanly for rich photos.',
      'Pick `PDF Print` + CMYK + Bleed exclusively for physical press output.',
    ],
    practiceExerciseExtra:
      'Document pixel sizes, vertical reflow notes, and export formats to launch one RM HEAVEN announcement across LinkedIn, Instagram `4:5`, Mobile Story `9:16`, and Campus `A4` Print.',
    fiveQuestions: [
      {
        question: 'Why does `1080x1350` (`4:5`) attract stronger mobile feed attention than `16:9`?',
        answer: 'Portrait height covers far more vertical screen area while users scroll phones.',
      },
      {
        question: 'What happens to a button placed in the bottom `250px` of a `9:16` Story/Reel?',
        answer: 'Platform captions, handles, and reply bars cover it completely.',
      },
      {
        question: 'Which Canva PDF preset belongs strictly to physical print vendors?',
        answer: '`PDF Print` with CMYK color mode and Crop Marks + Bleed enabled.',
      },
      {
        question: 'Why export crisp Maroon-on-Ivory typography banners as PNG instead of low-quality JPG?',
        answer: 'JPG adds compression speckles around sharp contrasting letters, whereas lossless PNG preserves crisp edges.',
      },
      {
        question: 'What else changes besides pixel height when adapting `16:9` horizontal banners to `9:16` vertical?',
        answer: 'Internal structure shifts from horizontal columns into stacked vertical tiers with larger mobile headlines.',
      },
    ],
  },

  // 20. Brand Identity & Logo Designing
  'brand-identity-logo-designing:note-1': {
    intro:
      'Memorable logos work equally crisp on a 16px favicon, an embroidered polo, and a 20-foot conference banner. Designing Monochrome-First in pure mathematical vectors—free of fragile glows and hairline curls—separates timeless emblems from amateur graphics.',
    learningObjectives: [
      'Design bold iconic silhouettes strictly in 100% black-and-white monochrome first.',
      'Stress-test emblem legibility cleanly at micro `24px` favicon scales.',
      'Deliver a responsive multi-lockup suite (Primary Emblem, Horizontal Navbar, Standalone Mark).',
      'Eliminate fragile effects (blurry shadows, raster photos, <1pt hairlines) from master vector paths.',
    ],
    simpleExplanation:
      'If a logo looks decent only thanks to shiny metallic bevels and neon glows, the silhouette underneath is weak. Carve an unmistakable pure black-and-white wax-seal silhouette first—and gold or maroon will elevate it effortlessly afterward.',
    detailedExplanation:
      'Beginners pack miniature lines, multi-stop gradients, and tiny slogans inside emblems—which melt into muddy blur inside `36px` mobile headers or printed pens.\n\nMaster identity craft obeys four laws:\n1. Monochrome-First Proof: Validate positive/negative space cleanly in flat `#000000` on `#FFFFFF` first.\n2. Pure Mathematical Vectors: Build exclusively with crisp Bezier paths (`SVG`/`EPS`)—zero raster bitmaps.\n3. Minimum-Size Test: Inspect shrunk down to `24x24px` favicon proportions; merge tiny gaps that clog shut.\n4. Responsive Lockups: Ship Primary Full Crest + Wordmark, Horizontal Compact Lockup (for wide top navbars), and Standalone Icon/Monogram (for avatars and watermarks).',
    keyConcepts:
      '- **Monochrome-First Rule**: Validating pure silhouette balance in black-and-white before testing color palettes.\n- **Vector Geometry**: Resolution-independent Bezier curves scaling cleanly from `16px` icons to banners.\n- **Responsive Lockup Family**: Matched variants (Primary Stacked, Horizontal Navbar, Standalone Icon) fitting diverse aspect spaces.\n- **Optical Kerning**: Visual spacing refinements between letter pairs (`R M`, `A V`) giving calm typographic rhythm.\n- **Clearspace Margin**: Protected exclusion zone barring surrounding headlines or borders from crowding the emblem.',
    stepByStepExplanation:
      'Step 1: Research positioning words and competitors first so the mark avoids tired lightbulbs or cliché shields.\nStep 2: Sketch bold simplified geometry on paper before opening vector software.\nStep 3: Construct crisp Bezier paths strictly in flat `#000000` black.\nStep 4: Run the `24px` Favicon Shrink Test and thicken or merge fragile narrow gaps.\nStep 5: Package Primary, Horizontal, Standalone Icon, and Reversed White/Gold lockups with defined Clearspace.',
    practicalExampleExtra:
      'Navbar Lockup Rule: Reserve tall stacked Crest medallions for Hero sections and Certificates; pair a clean Crest + horizontal "RM HEAVEN" wordmark inside `64px` top sticky headers.',
    realWorldApplications:
      'Institutional university seals, SaaS icons, packaging marks, and responsive web navigation headers.',
    importantPoints:
      '- A logo identifies uniquely; it does not need to illustrate every service literally.\n- Include dark-surface reversed variants alongside light-surface versions.\n- Optical alignment beats blind ruler centering on asymmetrical shapes.',
    commonMistakes:
      '- Embedding blurry drop shadows or soft raster textures inside master logos.\n- Using wispy hairlines that vanish on stitch embroidery or mobile favicons.\n- Providing only one giant tall PNG with no horizontal compact variant.',
    summary:
      'Timeless identity marks combine Monochrome-First silhouettes, pure vector paths passing `24px` shrink tests, optical kerning, and responsive multi-lockup systems.',
    revisionChecklist: [
      'Approve flat black-and-white silhouettes completely before adding colors.',
      'Deliver 100% pure vector geometry (`SVG`/`EPS`/`PDF`) with zero embedded rasters.',
      'Verify details stay sharp and un-clogged at `24x24px` scale.',
      'Supply Primary, Horizontal Navbar, Icon-Only, and Reversed Dark/Light lockups.',
    ],
    practiceExerciseExtra:
      'Define exact Clearspace ratios, minimum pixel dimensions, and reversed Maroon-surface rules for a Horizontal Navbar vs Standalone Monogram lockup.',
    fiveQuestions: [
      {
        question: 'Why finalize logo geometry in flat black-and-white before applying brand colors?',
        answer:
          'Monochrome exposes weak silhouettes, poor spacing, and fragile details without flashy gradients hiding structural bugs.',
      },
      {
        question: 'What happens to delicate `0.25pt` inner hairlines on small mobile icons or shirt embroidery?',
        answer: 'Fine lines blur out on pixels or disappear under thread needles; bold geometry survives cleanly.',
      },
      {
        question: 'Why deliver Horizontal AND Standalone Icon lockups alongside the Primary Crest?',
        answer:
          'Wide shallow `64px` navbars require horizontal alignment for readability, while square avatars and favicons require a compact emblem.',
      },
      {
        question: 'What purpose does a defined Logo Clearspace buffer serve?',
        answer: 'Prevents neighboring buttons, copy, or borders from suffocating institutional prestige.',
      },
      {
        question: 'Why must master logos live in vector formats (`SVG`/`EPS`) rather than raster photo editors?',
        answer: 'Vectors scale infinitely crisp without pixelation on 4K displays or auditorium banners.',
      },
    ],
  },

  'brand-identity-logo-designing:note-2': {
    intro:
      'A standalone logo file never secures long-term identity consistency—clear documented governance does. Comprehensive Brand Guidelines empower designers, developers, coordinators, and print vendors to reproduce color, typography, photography, and layouts cleanly every time.',
    learningObjectives: [
      'Structure a practical, scannable Brand Guidelines guide covering digital and print channels.',
      'Document synchronized Color Token specs (`Hex`, `RGB`, `CMYK`, and contrast rules).',
      'Provide clear visual Logo Misuse ("Don’t") guards preventing stretching or low-contrast use.',
      'Extend standards cohesively across web UI, graduation certificates, and slide decks.',
    ],
    simpleExplanation:
      'A Brand Guide is the official recipe manual for institutional presentation—showing exact Maroon/Ivory/Gold pairings, typography hierarchies, and clear "Never Stretch or Add Neon Glows" examples so every team hits identical quality.',
    detailedExplanation:
      'Without clear rules, brand integrity drifts fast across departments.\n\nA complete operational style guide includes:\n1. Voice & Positioning: Concise tone traits plus short copy Do/Don’t samples.\n2. Logo System & Misuse Guards: Lockups, Clearspace diagrams, minimum scales, and visual Don’t rules (no stretching, no shadows, no dark logo over dark background).\n3. Color Architecture: Synchronized `Hex`, `RGB`, and `CMYK` specs paired with accessible foreground/background rules (`#761D2D` Maroon on `#F8F4ED` Ivory passes AAA).\n4. Typography & Collateral Mockups: Exact heading serif + UI sans sizing plus real templates for Diplomas, Course Cards, and Slide Decks.',
    keyConcepts:
      '- **Brand Guidelines**: Authoritative rulebook governing logo usage, color spaces, typography scales, and collateral consistency.\n- **Multi-Space Color Spec**: Synchronized `Hex` (CSS), `RGB` (screens), and `CMYK` (print) codes.\n- **Logo Misuse Visuals**: Explicit prohibited transformations protecting mark integrity.\n- **Brand Consistency**: Cumulative recognition and credibility built through uniform visual rigor across channels.\n- **Collateral Application**: Verified mockups proving rules across stationery, certificates, and portals.',
    stepByStepExplanation:
      'Step 1: Capture Brand Voice & Positioning concisely on Page 1.\nStep 2: Map Logo Lockups, Clearspace margins, minimum scales, and 6 explicit Logo Misuse examples.\nStep 3: Publish full `Hex`, `RGB`, and `CMYK` tables including verified contrast pairings.\nStep 4: Specify Serif Display + Sans Body typography scales across headings, copy, and captions.\nStep 5: Include live certificate, web banner, and slide examples plus starter template links.',
    practicalExampleExtra:
      'Contrast Rule Entry: Primary Light Banner = `#761D2D` Maroon Ink over `#F8F4ED` Warm Ivory. Dark Accent Banner = `#FFFFFF` + `#D5B77A` Gold highlights over `#761D2D` Deep Maroon.',
    realWorldApplications:
      'Agency client handoffs, multi-campus university style guides, SaaS UI kits, and corporate franchise documentation.',
    importantPoints:
      '- Keep Brand Guidelines practical with quick tables and visual comparisons rather than bloated filler.\n- Specify both dark-surface and light-surface reversed logo lockups cleanly.\n- Attach ready-to-use Canva/Figma templates alongside rules so busy staff comply effortlessly.',
    commonMistakes:
      '- Writing abstract essays while missing exact Hex or CMYK print codes.\n- Omitting minimum pixel/mm logo sizes.\n- Failing to show real desktop/mobile collateral proof.',
    summary:
      'Comprehensive Brand Guidelines protect prestige across teams by codifying Lockups, Clearspace, Hex/RGB/CMYK tables, Typography scales, and real collateral standards.',
    revisionChecklist: [
      'Publish synchronized Hex, RGB, and CMYK codes plus safe contrast rules.',
      'Display clear Logo Misuse prohibitions (no stretching, shadows, or busy backdrops).',
      'Specify exact Minimum Sizes and Clearspace margins.',
      'Prove rules visually across both screens and print certificates.',
    ],
    practiceExerciseExtra:
      'Draft a crisp 1-page Quick Reference Brand Sheet for RM HEAVEN covering Voice, Palette Contrast Do/Don’t table, Font Pair, and Logo Clearspace.',
    fiveQuestions: [
      {
        question: 'Why must Brand Guidelines publish Hex, RGB, AND CMYK color codes together?',
        answer:
          'CSS developers need Hex, digital displays use RGB, and offset printers require calibrated CMYK profiles for accurate Deep Maroon ink.',
      },
      {
        question: 'Why include visual "Logo Misuse" examples inside a style guide?',
        answer:
          'Showing stretching, drop shadows, or poor contrast visually prevents casual distortion by non-designer teams.',
      },
      {
        question: 'What happens over a year if a brand launches a great logo without typography or spacing rules?',
        answer:
          'Teams introduce clashing fonts, random hues, and crowded margins, eroding institutional polish.',
      },
      {
        question: 'Why document approved Text-on-Surface pairings inside Color Architecture?',
        answer:
          'Eliminates unreadable low-contrast combinations (such as small gold captions over pale ivory).',
      },
      {
        question: 'What makes busy teams actually follow Brand Guidelines daily?',
        answer: 'Short scannable tables paired with downloadable starter templates in Canva, Figma, and SVG.',
      },
    ],
  },

  // 21. Photo Editing & Image Manipulation
  'photo-editing-image-manipulation:note-1': {
    intro:
      'Destructive photo editing—erasing original pixels permanently or baking contrast filters onto raw layers—traps editors whenever revisions arrive. Professional retouchers work 100% Non-Destructively via Adjustment Layers, Layer Masks, Smart Objects, and Histogram reading.',
    learningObjectives: [
      'Structure clean non-destructive layer stacks keeping raw original pixels untouched.',
      'Use Layer Masks (`White = Reveal`, `Black = Hide`) instead of destructive Eraser strokes.',
      'Diagnose clipped shadows and blown highlights directly on tonal Histograms.',
      'Use Smart Objects so scaling or filter revisions preserve full crispness.',
    ],
    simpleExplanation:
      'Destructive erasing is cutting a physical photograph with scissors—trimmed corners vanish forever. Layer Masking lays a reversible black-and-white stencil over the photo: paint black to hide, paint white anytime to bring details straight back.',
    detailedExplanation:
      'Client requests constantly evolve ("Bring back that sleeve fold" or "Warm the skin tone slightly"). Professionals protect every pixel across three pillars:\n\n1. Reversible Layer Masks: Masks store grayscale transparency (`White` reveals, `Black` hides, `Gray` feathers smoothly) allowing endless edge refinement without erasing raw pixels.\n2. Live Adjustment Layers & Smart Objects: Never bake `Curves` or `Levels` destructively onto background layers. Stacked Adjustment Layers stay re-tunable and maskable anytime, while Smart Objects shield original resolution across multiple resizes.\n3. Reading the Histogram: Laptop screens fool eyes under varying room brightness; tonal Histograms reveal left-edge black crushing and right-edge white blowout objectively.',
    keyConcepts:
      '- **Non-Destructive Editing**: Keeping raw source pixels untouched behind reversible masks, live adjustments, and Smart Objects.\n- **Layer Mask**: Grayscale visibility stencil (`White Reveals`, `Black Conceals`) replacing destructive Eraser tools.\n- **Adjustment Layer**: Independent live color/contrast layer tunable infinitely without mutating underlying pixels.\n- **Smart Object**: Protective container preserving source resolution across repeated scales and re-editable filters.\n- **Tonal Histogram**: Graph displaying shadow, midtone, and highlight distribution to spot clipping.',
    stepByStepExplanation:
      'Step 1: Keep the original raw photo untouched and locked cleanly at the base of the stack.\nStep 2: Wrap placed graphics or portraits inside Smart Objects before resizing.\nStep 3: Inspect the Histogram first—balance tones smoothly with live `Curves` Adjustment Layers without crushing edges.\nStep 4: Cut subjects or apply selective brightening cleanly via Layer Masks.\nStep 5: Archive layered masters (`.PSD`/`.TIFF`) separately before exporting flattened JPG/WebP versions.',
    practicalExampleExtra:
      'Targeted Portrait Light: Add a gentle brightening `Curves` layer, invert its mask completely Black, then brush softly at 15% Flow White over facial features to lift clarity naturally.',
    realWorldApplications:
      'Executive headshots, e-commerce white-balance prep, interior architectural photography, and editorial publishing.',
    importantPoints:
      '- Always archive layered master files separately from flattened web JPEGs.\n- `Curves` and selective `Hue/Saturation` beat brute-force `Contrast` sliders.\n- Monitor bright highlights against the Histogram right wall before final save.',
    commonMistakes:
      '- Using the Eraser tool on primary subject layers.\n- Shrinking regular raster layers tiny and scaling them back up fuzzy without Smart Objects.\n- Baking heavy vignettes directly onto source images.',
    summary:
      'Layer Masks, live Adjustment Layers, Smart Objects, and Histogram calibration enable crisp natural retouching with 100% reversible editing freedom.',
    revisionChecklist: [
      'Preserve raw source pixels untouched at the bottom layer.',
      'Replace Eraser deletions completely with reversible Black/White Masks.',
      'Check Histograms to prevent crushed shadows or blown highlights.',
      'Save layered master files prior to flattening JPG/PNG exports.',
    ],
    practiceExerciseExtra:
      'Outline a 4-layer non-destructive stack to brighten an underexposed portrait subject slightly while subtly darkening and warming a busy room background.',
    fiveQuestions: [
      {
        question: 'In a Layer Mask, what do pure White, pure Black, and 50% Gray do?',
        answer: 'White reveals 100%, Black hides 100%, and 50% Gray blends semi-transparently.',
      },
      {
        question: 'Why place `Curves` as an Adjustment Layer instead of using direct destructive Image adjustments?',
        answer: 'Adjustment Layers stay re-editable, maskable, and toggleable forever without degrading original pixels.',
      },
      {
        question: 'What problem do Smart Objects prevent when resizing an imported layer repeatedly?',
        answer: 'Preserves full original pixel resolution so scaling down then back up stays crisp instead of blurry.',
      },
      {
        question: 'What does a spike pressed tight against the far-right Histogram edge warn about?',
        answer: 'Clipped white highlights—detail in bright shirts or skies hit pure 255 white and vanished.',
      },
      {
        question: 'Why keep a layered master file alongside flattened PNG/JPG exports?',
        answer: 'Flattened exports merge masks and layers; layered masters make future copy or tone revisions instant.',
      },
    ],
  },

  'photo-editing-image-manipulation:note-2': {
    intro:
      'Fake photo composites expose themselves in seconds via white halo fringes, mismatched lighting angles, clashing shadow temperatures, and missing floor shadows. Seamless compositing aligns Light Direction, Black-Point Color Matching, Perspective, and Two-Stage Grounding Shadows.',
    learningObjectives: [
      'Clean wispy hair and translucent subject cutouts free of bright outline halos.',
      'Match black-point floors, brightness contrast, and color warmth using clipped Adjustment Layers.',
      'Build convincing Contact + Directional Cast Shadows matching scene light geometry.',
      'Align camera horizon eye-level, focus blur, and film grain consistently.',
    ],
    simpleExplanation:
      'Pasting an outdoor bright photo into a cozy candlelit studio fails because cool blue outdoor tones clash against warm walls AND the person floats without crisp dark grounding shadows right beneath their shoes.',
    detailedExplanation:
      'Believable compositing rests on four physical realities:\n\n1. Halo-Free Edge Decontamination: Use `Select and Mask` refinement + clipped edge-color painting so white sky halos never cling to dark hair or blazers.\n2. Single Key Light & Horizon Alignment: Verify highlight direction and eye-level perspective agree before placing subjects.\n3. Black-Point & Temperature Matching: Clip `Curves` and `Color Balance` layers strictly onto the pasted subject (`Alt/Opt` click) so deepest blazer shadows match background dark density and warm/cool tint.\n4. Two-Stage Grounding Shadows: Pair a crisp razor-dark Contact Shadow right where soles meet floors (`Multiply` blend mode) with a softer feathered Directional Cast Shadow.',
    keyConcepts:
      '- **Edge Halo / Fringing**: Leftover bright pixels clinging around poorly extracted cutouts.\n- **Key Light Consistency**: Aligning highlights and shadows across all elements to one shared light source.\n- **Black-Point & Color Matching**: Synchronizing darkest shadow floor and warm/cool temperature between subject and scene.\n- **Two-Stage Grounding Shadow**: Crisp narrow Contact Shadow at physical touchpoint plus wider soft Cast Shadow.\n- **Clipping Mask**: Restricting an Adjustment Layer strictly to the single layer immediately beneath.',
    stepByStepExplanation:
      'Step 1: Verify scene Key Light direction and camera horizon BEFORE masking the subject.\nStep 2: Refine cutout masks with edge decontamination so zero bright halos remain.\nStep 3: Scale subject naturally to scene horizon and add subtle matching lens blur.\nStep 4: Clip `Curves` and `Color Balance` layers strictly onto the subject until black shadows and tints match.\nStep 5: Paint tight `Multiply` Contact Shadows + soft Cast Shadows, unified with gentle film grain.',
    practicalExampleExtra:
      'Shadow Tip: Never paint shadows using 100% pure black on `Normal` blend mode—sample the floor’s deepest dark hue, set `Multiply`, and blend two soft dark layers preserving wood/marble grain.',
    realWorldApplications:
      'E-commerce product lifestyle staging, corporate portrait swaps, hero key art, and editorial book covers.',
    importantPoints:
      '- Light direction conflicts ruin realism faster than minor edge softness.\n- Tight Contact Shadows right beneath bases cure "floating sticker" illusions instantly.\n- Clip tonal adjustments strictly to the foreground subject.',
    commonMistakes:
      '- Slapping glowing Drop Shadows behind standing people.\n- Skipping black-point shadow depth alignment.\n- Combining crisp ultra-sharp cutouts over heavily blurred soft backgrounds with zero blur match.',
    summary:
      'Realistic composites fuse decontaminated cutouts with consistent Key Light geometry, clipped Black-Point color harmony, and Two-Stage Contact + Cast Shadows.',
    revisionChecklist: [
      'Confirm Key Light direction and horizon line match across both photos.',
      'Remove bright edge halos via Select & Mask decontamination.',
      'Match black-point depth and warmth via clipped `Curves` / `Color Balance`.',
      'Paint tight `Multiply` Contact Shadows + soft Directional Cast Shadows.',
    ],
    practiceExerciseExtra:
      'Audit a pasted studio product sitting on warm marble: identify 3 physical realism gaps and outline exact layer steps to ground and color-match it cleanly.',
    fiveQuestions: [
      {
        question: 'Why does a sharp dark Contact Shadow right under shoe soles fix the "floating sticker" look?',
        answer:
          'Physical contact blocks ambient light completely along tight seams, visually anchoring object weight to the floor.',
      },
      {
        question: 'What happens if you tune a `Curves` Adjustment Layer above a pasted cutout WITHOUT clipping it?',
        answer: 'It alters both the subject and entire background together rather than unifying their mismatched tones.',
      },
      {
        question: 'Name two physical clues exposing fake composites instantly.',
        answer: 'Opposite Key Light directions, mismatched black-point shadow depth/warmth, or wrong horizon scale.',
      },
      {
        question: 'Why paint composite floor shadows on `Multiply` blend mode instead of flat `Normal` gray?',
        answer: '`Multiply` darkens surface tones realistically while keeping marble, wood, or carpet texture visible.',
      },
      {
        question: 'How do retouchers eliminate faint white sky halos lingering along dark hair?',
        answer: 'Enable Select & Mask edge decontamination or paint softly along edges inside a clipped `Darken`/`Multiply` layer.',
      },
    ],
  },

  // 22. Social Media Creative Designing
  'social-media-creative-designing:note-1': {
    intro:
      'Social media graphics never sit quietly in galleries—users scroll past them rapidly on 6-inch phones. Stopping thumbs inside 1.5 seconds requires bold hook headlines, uncluttered photography, strict UI Safe Zones, and readable miniature hierarchy.',
    learningObjectives: [
      'Design Thumb-Stopping hooks readable cleanly during fast mobile scroll.',
      'Apply the 3-Second Value Rule: crisp Outcome Hook, clean anchor visual, clear next cue.',
      'Protect top/bottom mobile UI Safe Zones on `4:5` feeds and `9:16` Stories.',
      'Separate punchy visual headlines from dense prose placed neatly in post captions.',
    ],
    simpleExplanation:
      'A mobile social banner acts like a roadside billboard seen at 60 km/h: nobody reads a six-bullet paragraph inside a square card—they catch ONE clear 5-word promise, strong visual contrast, and decide instantly whether to tap.',
    detailedExplanation:
      'Underperforming graphics fail because designers review them zoomed full-screen on huge monitors. Shrunk to handheld phone scale, `11pt` captions vanish completely.\n\nMobile-first social engineering follows four rules:\n1. 25% Miniature Preview Check: Zoom canvas down to 25%—your 4–7 word Outcome Headline must read cleanly within 1.5 seconds.\n2. Visual vs Caption Split: Put the emotional hook promise on the visual; place long schedules, links, and eligibility notes cleanly inside the text caption.\n3. Safe Zones & Ratios: Use `1080x1350` (`4:5`) for dominant vertical feed height; keep `1080x1920` (`9:16`) text clear of top `150px` handles and bottom `250px` caption bars.\n4. Brand Authority: Choose calm `#761D2D` Maroon + `#F8F4ED` Ivory rigor instead of spammy neon stickers.',
    keyConcepts:
      '- **Thumb-Stopping Hook**: Crisp 4–7 word outcome headline earning 1.5s scroll pause on mobile.\n- **Visual-vs-Caption Discipline**: Offloading dense bullet lists into post captions so graphics remain spacious.\n- **Platform Safe Zone**: Uncovered center region inside `9:16` / `4:5` clear of app handles and caption bars.\n- **25% Miniature Test**: Previewing layouts at phone-feed proportions before export.\n- **Outcome Headline**: Leading with clear learner benefit rather than vague corporate announcements.',
    stepByStepExplanation:
      'Step 1: Distill the core promise into one crisp 4–7 word outcome headline.\nStep 2: Set mobile dimensions (`1080x1350` feed or `1080x1920` Story) with Safe Zone guides on.\nStep 3: Establish high-contrast foreground typography (`#761D2D` on `#F8F4ED` or `#FFFFFF` on `#761D2D`) paired with one clean focal image.\nStep 4: Move registration URLs, phone numbers, and detailed syllabi into the post caption.\nStep 5: Shrink zoom down to 25% to confirm effortless 1.5-second readability.',
    practicalExampleExtra:
      'Headline Sharpening: Weak: "RM HEAVEN announces new HTML program for beginners." Strong: "Build Real Semantic Websites from Scratch" + small subtitle "Guided Portfolio Track · Enroll Now".',
    realWorldApplications:
      'LinkedIn promos, Instagram admissions visuals, YouTube mobile thumbnails, and WhatsApp announcement cards.',
    importantPoints:
      '- Visuals win curiosity and stop scrolling; captions close details.\n- Zooming down to 25% reveals tiny illegible copy faster than any rulebook.\n- Leave calm breathing space—cluttered posters get skipped instantly.',
    commonMistakes:
      '- Pasting 80-word syllabus paragraphs onto an Instagram image.\n- Placing small text inside the bottom `250px` of a `9:16` Story.\n- Overusing bright cartoonish arrows that undermine academic trust.',
    summary:
      'Effective social creative designing engineers 1.5-second mobile legibility, crisp value hooks, protected UI Safe Zones, and balanced visual-vs-caption clarity.',
    revisionChecklist: [
      'Limit image copy to concise 4–7 word hooks checked at 25% miniature zoom.',
      'Move dense schedule details cleanly into accompanying captions.',
      'Respect top/bottom UI Safe Zones on `9:16` and `4:5` assets.',
      'Uphold luxury brand contrast without loud spammy stickers.',
    ],
    practiceExerciseExtra:
      'Convert a dense 55-word internship poster into a clean `4:5` mobile brief specifying 6-word Hook Headline, visual focus, Safe Zone margin, and companion text caption.',
    fiveQuestions: [
      {
        question: 'Why place detailed schedules and phone info in the caption rather than inside the social image?',
        answer:
          'Crowded tiny text causes instant scroll abandonment on phones; bold clean posters earn attention so readers expand captions willingly.',
      },
      {
        question: 'What does zooming your design canvas down to 25% test effectively?',
        answer: 'Simulated mobile phone scroll scale—revealing whether main headlines read cleanly without squinting.',
      },
      {
        question: 'Why keep critical text out of the bottom `250px` of `9:16` Stories and Reels?',
        answer: 'Platform usernames, captions, and reply bars overlay bottom edges completely.',
      },
      {
        question: 'Why does `1080x1350` (`4:5`) beat landscape `16:9` inside mobile feeds?',
        answer: 'Portrait frames occupy nearly twice the vertical viewport screen height.',
      },
      {
        question: 'Why does restrained `#761D2D` Maroon + `#F8F4ED` Ivory design build stronger EdTech credibility?',
        answer: 'Institutional calm signals quality education instead of looking like clickbait ads.',
      },
    ],
  },

  'social-media-creative-designing:note-2': {
    intro:
      'Single static posts earn fleeting views, whereas structured Educational Carousels and repeatable Creative Series build loyal audiences who save, share, and enroll. Engineering slide momentum, One-Concept-Per-Slide clarity, and master Series Grids multiplies output quality sustainably.',
    learningObjectives: [
      'Structure Educational Carousels cleanly across Cover Hook, Sequential Teaching Slides, and Action Finale.',
      'Build effortless swipe flow using visual continuity, numbered indicators (`02/06`), and open loops.',
      'Enforce strict One-Concept-Per-Slide limits (`<=35 words`) for instant handheld scanning.',
      'Standardize weekly Creative Series Master Templates slashing recurring production time.',
    ],
    simpleExplanation:
      'An Educational Carousel works like sleek flashcards: Slide 1 hooks curiosity ("5 HTML Mistakes Beginners Make"), Slides 2–6 teach one quick mistake + fix each without prose walls, and Slide 7 invites readers to save and explore the course.',
    detailedExplanation:
      'Algorithms on LinkedIn and Instagram reward deep engagement—measured strongly by Full Swipes and Saves rather than hollow passive likes.\n\nGreat Carousels follow a rhythmic teaching arc:\n1. Cover Hook (Slide 1): Specific payoff promise + clear visual `Swipe ->` cue.\n2. One-Idea Teaching Slides (Slides 2–N): Enforcing strictly One Concept Per Slide (`<=35 words`, big `24–36px+` mobile clarity) with numbered progress markers (`02 / 06`) and continuous edge accents pulling thumbs smoothly right.\n3. Action Finale (Last Slide): Concise Saveable Checklist + relevant enrollment next step.\n\nBehind the scenes, reusable Weekly Series Templates ("Concept Breakdown", "Before vs After") lock shared headers, margins, and typography scales so teams ship cohesive carousels fast every week.',
    keyConcepts:
      '- **Educational Carousel Arc**: Deliberate swipe narrative: `Slide 1 Hook` -> `1-Idea Slides` -> `Summary & CTA Finale`.\n- **One-Concept-Per-Slide Rule**: Dedicating each slide cleanly to one crisp bite-sized insight (`<=35 words`).\n- **Swipe Momentum Cues**: Numbered counters (`02/06`), edge-crossing visuals, and directional cues prompting right-swipes.\n- **Saveable Value Asset**: Concise summary checklist or quick code tip motivating followers to bookmark for revision.\n- **Creative Series System**: Reusable master templates standardized across recurring weekly formats.',
    stepByStepExplanation:
      'Step 1: Script a tight 6–7 slide outline BEFORE touching layout (`<=35 words` per middle slide).\nStep 2: Design Slide 1 with an unmistakable audience hook and clear `Swipe ->` affordance.\nStep 3: Pin consistent top series headers (`RM HEAVEN GUIDE`) and bottom slide counters (`02/06`).\nStep 4: Show visual Right/Wrong or Before/After examples instead of prose walls.\nStep 5: Finish with a crisp Bookmark Checklist + next course step, and save master frames as a reusable Series Template.',
    practicalExampleExtra:
      '7-Slide Blueprint: S1 "5 Beginner SEO Fixes" | S2–S6 One mistake + quick fix per slide | S7 "5-Point SEO Checklist — Save & Enroll".',
    realWorldApplications:
      'LinkedIn B2B carousels, Instagram EdTech study-note explainers, product walkthrough decks, and alumni story series.',
    importantPoints:
      '- Bookmarks (`Saves`) and full swipe-throughs signal high audience value far more than shallow likes.\n- Split dense ideas cleanly into Slides 2 and 3 rather than squeezing 120 words onto one card.\n- Consistent series branding trains audience recognition weekly.',
    commonMistakes:
      '- Cramming dense textbook paragraphs onto Slide 2.\n- Ending abruptly without a Summary or clear next step.\n- Redesigning spacing and page counters from zero every week.',
    summary:
      'High-retention Carousels pair curiosity-driven Slide 1 hooks with One-Concept-Per-Slide clarity, swipe momentum cues, and repeatable Series Templates.',
    revisionChecklist: [
      'Open Slide 1 with a specific learner payoff + clear swipe cue.',
      'Enforce strictly One Concept (`<=35 words`) per middle slide.',
      'Maintain fixed headers, corner styles, and slide numbers (`01/06`).',
      'End with a Saveable Summary Card + clear course/internship next step.',
    ],
    practiceExerciseExtra:
      'Outline a 6-slide RM HEAVEN Carousel teaching "Reading a Confusion Matrix Clearly" with exact Slide 1 Hook, Slides 2–5 ideas, and Slide 6 CTA.',
    fiveQuestions: [
      {
        question: 'Why do Educational Carousels outperform isolated static images for sustainable organic reach?',
        answer:
          'Swiping increases reading dwell time, earns high-signal Bookmark Saves, and often triggers second-impression feeds showing Slide 2.',
      },
      {
        question: 'What happens when Slide 2 contains three tiny dense paragraphs?',
        answer: 'Mobile readers bail out immediately; strictly One Concept (`<=35 words`) keeps swipes effortless.',
      },
      {
        question: 'Why display consistent counters (`02 / 07`) across middle slides?',
        answer: 'Shows finite clean progression and builds natural swipe momentum toward the finale.',
      },
      {
        question: 'What belongs on the final slide of a high-converting EdTech carousel?',
        answer: 'A concise Bookmarkable Summary Checklist paired with one relevant next course/enrollment link.',
      },
      {
        question: 'How does a Creative Series Template System elevate weekly marketing output?',
        answer: 'Standardized recurring masters enforce visual polish while cutting repetitive layout work.',
      },
    ],
  },
};
