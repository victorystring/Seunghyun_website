# Portfolio QA

final result: passed

## Current page structure

The navigation now opens separate static HTML pages, with the current page marked by `aria-current="page"`. Content pages use a stable sticky header. The homepage contains the video introduction and a compact copyright footer; simulation previews have been removed at the user's request. Watch Simulations and the navigation link open the full gallery. The Contact menu/section and Ph.D. journey section have been removed. Profile details, email, and CV remain available on About; the phone number has been removed at the user's request.

| Page | Content |
| --- | --- |
| `index.html` | Video introduction with direct links to research, simulations, and About |
| `about.html` | Profile, CV/research links, contact details, and two education entries |
| `publications.html` | Separate Papers (two articles) and Patents (three entries) sections |
| `projects.html` | Eight research projects |
| `gallery.html` | All nine simulation videos |
| `blog.html` | Four research-note previews |

Explore My Research opens `publications.html`; Watch Simulations opens `gallery.html`; the hero's About Me link opens `about.html`. The previous scroll-only navigation and resume sidebar handlers have been removed from `js/main.js`. Relative file links support GitHub Pages project hosting without a client-side router.

Migration evidence: `multipage-source.json` records the original entries before splitting them, and `multipage-checks.json` records the browser checks from that migration. Every education, publication, project, and blog entry has the same normalized text as before the move. About details and gallery simulation ordering also match. Screenshots named `pages-<page>-1440.png` and `pages-<page>-320.png` are saved in the evidence folder below; those migration screenshots predate the removal of homepage previews.

All seven pages were exercised through actual menu clicks at 1440, 390, and 320 CSS pixels, including mobile menu expansion. Navigation changes the URL to the correct HTML file, each page marks its active menu item and has one accessible main heading, and no horizontal overflow or name/menu collision occurs. Additional homepage checks pass at 992 and 1024px. The background video still autoplays, pauses, and resumes, and all three hero destinations work. No JavaScript runtime errors or failed local asset responses were reported. `node --check js/main.js` and `git diff --check` also pass.

Subsequent homepage cleanup was checked at 1440px and 390px: main contains only the video introduction, no simulation preview cards or gallery heading remain, the description says mathematical modeling, and the copyright footer uses compact 36px padding. Watch Simulations still opens the gallery with all nine videos. No horizontal overflow or JavaScript runtime errors were reported.

About/Education consolidation: removed Education from the navigation on all six remaining pages and moved both education entries into an Education subsection below the About profile. The standalone `education.html` file was removed. The four activity statistic cards and duplicate completed-project counter were removed; the CV, blog, laboratory links, and profile details remain available. At 1440, 390, and 320px, all six menus link to About successfully and contain no Education item. The two education entries match the original normalized text, and no numeric counters, horizontal overflow, or JavaScript runtime errors remain. Evidence: `about-merged-profile-1440.png`, `about-merged-education-1440.png`, and their 320px counterparts.

Education discovery cue: added a blue View Education link and downward arrow immediately below the About introduction. At 1440 x 900, 390 x 844, and 320 x 568, it is visible before scrolling. Clicking reaches the Education subsection with its heading below the sticky navigation and moves keyboard focus to the named section. No horizontal overflow or runtime errors were reported. Evidence: `about-education-cue-1440.png`, `about-education-cue-390.png`, and `about-education-cue-320.png`.

Publication grouping: replaced the combined visible heading with separate Papers and Patents sections. Each has an equal-level heading; article and patent titles use the next heading level. Papers contains the two journal articles and their original DOI links; Patents contains the three original patent entries, including their in-process labels. All five entries match the original normalized text and order. Chrome checks at 1440, 390, and 320px pass with no horizontal overflow or runtime errors. Evidence: `publication-papers-1440.png`, `publication-patents-1440.png`, and their 320px counterparts.

Full About portrait: replaced the cover-sized background with the original JPEG as a native image, retaining its portrait aspect ratio without cropping. Its height is capped to fit within the opening viewport; stacked mobile layouts use a smaller portrait so the View Education cue remains visible too. Actual Home-to-About menu navigation passed at 1440 x 900, 1440 x 768, 1024 x 720, 768 x 1024, 390 x 844, and 320 x 568. In every case, the entire image is within the first viewport, below the navigation, with the original aspect ratio intact. The Education cue remains visible and reaches its section successfully. No horizontal overflow or runtime errors were reported. Current measurements: `about-portrait-checks.json`. Visual evidence: `about-full-portrait-1440-900.png`, `about-full-portrait-1440-768.png`, `about-full-portrait-390-844.png`, and `about-full-portrait-320-568.png`.

About research interests: appended "I am interested in multiphysics modeling, computational fluid dynamics, and Scientific Machine Learning." to the existing introduction as one flowing paragraph. Reduced the summary's top padding and paragraph/list spacing while retaining the existing 16px type and portrait dimensions. Before/after checks passed at 1440 x 900, 1440 x 768, 1024 x 720, 768 x 1024, 390 x 844, and 320 x 568: portrait bounds are unchanged, contact details, profile buttons, and Education do not move downward, and the profile does not become taller. View Education remains visible in the opening viewport and reaches its section. No horizontal overflow or JavaScript runtime errors were reported; desktop and narrow mobile screenshots were inspected. Measurements: `about-intro-before.json` and `about-intro-after.json`. Visual evidence: `about-research-intro-1440-900.png`, `about-research-intro-1440-768.png`, `about-research-intro-390-844.png`, and `about-research-intro-320-568.png`.

Final About copy and CV updates: replaced both Education descriptions with the user's revised wording about hydrogen-based ironmaking, manufacturing digital twins, and undergraduate research experience. Removed the Phone row from About and replaced the Download CV target with the user's new Google Drive file. These changes supersede the original-copy comparisons above.

## Earlier video and wordmark revisions

The remaining notes document the preceding single-page implementation and its visual checks. The page structure and navigation above supersede its former anchor destinations.

The source reference defines the title strip to remove, and the user selected the full 2160A case at 2x speed. It does not define a full page mockup; the introduction adapts the existing portfolio.

Source video: `C:/Users/심승현/Desktop/Websites/08.3D_Instability_(520A, 1150A, 2160A, 36kA).mp4`

Crop reference: `C:/Users/심승현/AppData/Local/Temp/codex-clipboard-71e1561b-330e-4a95-a045-3e98e6329809.png`

Evidence folder: `C:/Users/심승현/.codex/visualizations/2026/10/09/01a11e3b-2451-7161-8707-e055be68c45a/video-review/`

## Comparison history

- [P2, fixed] Desktop gallery gutters and narrow-screen About text/buttons caused horizontal overflow. Removed extra gallery row gutters, allowed About buttons to wrap, and allowed long email addresses and project headings to wrap. Final browser widths match 1440, 390, and 320 CSS pixels.
- [P2, fixed] At 320 x 568, the navigation brand and toggle wrapped to two rows and overlapped the introduction. Reduced their size below 361 pixels. The video controls remain within both 568px and 640px viewports. The subsequent wordmark checks below confirm that the revised header also fits without overlap.

Full-view comparison: `hero-source-comparison.png`. Mobile evidence: `hero-mobile.png`, `hero-mobile-small.png`, `hero-mobile-short.png`. Screenshots use density 1.

Autoplay, pause/resume, actual loop wrap, offscreen pause, reduced-motion poster and manual play, both hero links, mobile menu, and gallery order/count have passed Chrome checks. No JavaScript runtime or console errors were reported.

## Source and capture normalization

- Original video: 1920 x 1080. Selected case starts at 48.708s and ends immediately before 72.468s; title-change frames are recorded in `2160a-boundaries.png`.
- Header removal: top 160px; resulting video is 1920 x 920. It is encoded at 2x with no audio, at 30fps, with a duration of 11.866667s and a size of 1,867,465 bytes.
- Source visual truth: `frames/frame-059_91.png`, representing the original interval at the rendered video's 5.6s position. Implementation: `hero-desktop.png`, captured at 1440 x 900 CSS px, density 1, with the video paused at 5.6s.
- Comparison board: `hero-source-comparison.png`, 1480 x 690 px. The source is reduced to 720 x 405; the implementation to 720 x 450, preserving their respective aspect ratios. This comparison verifies the selected footage and header removal; it does not claim pixel-for-pixel fidelity to an unspecified page mockup.
- Focused regions: the attached strip, source title area, visible simulation, and mobile header/footer were inspected directly. The video fills the viewport using cover cropping; portrait views focus on the left simulation area.

## Required fidelity surfaces

- Fonts/typography: existing Poppins family retained; white name and research headline have a clear hierarchy. Desktop, 390px mobile, and both 320px captures show readable text without truncation or navigation overlap.
- Spacing/layout: introduction is on the right on desktop, leaving the main simulation visible on the left. Mobile controls remain within the screen, with no horizontal page overflow. The research anchor leaves room for the fixed navigation; the simulation button opens the full gallery page.
- Colors/tokens: existing blue accent retained, with a dark navy overlay and white foreground. The overlay keeps text legible while allowing the simulation and plots to remain visible.
- Image quality/assets: actual supplied footage is used; the title/logo strip is absent. Scientific views and their order are preserved. A cropped frame from the same 2160A case supplies the poster. No generated visual assets were substituted.
- Copy/content: Seunghyun Sim, CFD/Multiphysics/SciML, and the 2160A caption match the source portfolio and video. Homepage has the first six videos; full gallery has nine with the 3D Arc entry first.

## Verification limits and polish

- Verified with isolated installed Chrome because the in-app browser automation kernel could not initialize. Safari and Firefox were not exercised.
- Native MP4 byte-range requests canceled during seek/navigation were recorded as `ERR_ABORTED`; playback, seeking and actual loop wrap were separately verified successfully.
- No remaining actionable P0/P1/P2 findings. Video brightness and introduction copy can be adjusted after user review.

## Full-name wordmark revision

The user requested a clearer, professional identity in the navigation. Replaced the isolated white S and blue circle with a single-line `Seunghyun Sim` wordmark, using Poppins 600 at 24px (21px on the smallest screens). A separate small research descriptor reads `CFD · Multiphysics · SciML`. The full name stays white on the video and dark mobile header; the light gallery and scrolled header use dark navy. The homepage and gallery share `css/branding.css`.

Evidence: `branding-home-1440.png`, `branding-home-390.png`, `branding-home-320.png`, `branding-home-scrolled.png`, `branding-gallery-1440.png`, and `branding-gallery-320.png` in the evidence folder. Both pages were checked at 1440, 1024, 992, 991, 390, and 320 CSS pixels. All twelve page/viewport checks passed: full name and accessible home-link label, absent circle, expected foreground color before/after scrolling, no horizontal overflow or name/menu collision, seven working mobile menu links, and return-home navigation. No JavaScript runtime errors were reported. Detailed measurements are saved in `branding-checks.json`.

Subsequent content/navigation revisions: removed the Learning progress & Skills section and its sidebar link. Explore My Research now targets Publications (`#page-2`, headed Papers & Patents), with a 90px scroll margin. Watch Simulations opens `gallery.html` directly. Both hero buttons were exercised in Chrome at 1440px and 390px: the publications heading remains below the fixed header, and the gallery displays all nine videos. No JavaScript runtime errors were reported.
