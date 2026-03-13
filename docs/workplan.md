# Work Plan

## Version 1 — MVP

### Unit 1: Project Scaffolding & Build Setup
- **Addresses**: NFR-2, NFR-3
- **Description**: Initialize Vite project with vanilla JS template, configure Tailwind CSS, set up Vercel deployment config, create the HTML entry point with responsive viewport meta.
- **Inputs**: None
- **Outputs**: Working dev server (`npm run dev`), production build (`npm run build`), base `index.html` with Tailwind loaded.
- **Dependencies**: None
- **Files to Create/Modify**:
  - `package.json`
  - `vite.config.js`
  - `tailwind.config.js`
  - `postcss.config.js`
  - `index.html`
  - `src/style.css`
  - `src/main.js` (empty entry point)
- **Test Plan**:
  - [ ] `npm run dev` starts without errors
  - [ ] `npm run build` produces output in `dist/`
  - [ ] `index.html` loads in browser with Tailwind styles applied
  - [ ] Viewport meta tag present for mobile responsiveness

---

### Unit 2: Timezone Utility Module
- **Addresses**: FR-4
- **Description**: Create a utility module that uses the browser's `Intl.DateTimeFormat` API to get the current hour, minute, and second for a given IANA timezone. Also resolves the timezone abbreviation dynamically.
- **Inputs**: IANA timezone string (e.g., `"America/New_York"`)
- **Outputs**: Object with `{ hours, minutes, seconds, abbreviation }` for the given timezone at the current moment.
- **Dependencies**: None
- **Files to Create/Modify**:
  - `src/time.js`
  - `src/time.test.js`
- **Test Plan**:
  - [ ] `getTimeForTimezone("America/New_York")` returns valid hours (0-23), minutes (0-59), seconds (0-59)
  - [ ] `getTimeForTimezone("Asia/Kolkata")` returns a time offset from UTC by +5:30
  - [ ] `getTimezoneAbbreviation("America/New_York")` returns a non-empty string (e.g., "EST" or "EDT")
  - [ ] Function handles invalid timezone string gracefully

---

### Unit 3: SVG Analog Clock Component
- **Addresses**: FR-1, FR-2, FR-3, NFR-4
- **Description**: Create a reusable function that generates an SVG analog clock face with hour, minute, and second hands. The function takes a container element and city config, renders the clock, and exposes an `update(time)` method to rotate hands. Includes city name and timezone abbreviation label below the clock.
- **Inputs**: DOM container element, city config `{ name, timezone, abbreviation }`, time object `{ hours, minutes, seconds }`
- **Outputs**: Rendered SVG clock in the container with `update()` method for live rotation.
- **Dependencies**: Unit 2
- **Files to Create/Modify**:
  - `src/clock.js`
  - `src/clock.test.js`
- **Test Plan**:
  - [ ] `createClock(container, config)` inserts an SVG element into the container
  - [ ] SVG contains hour, minute, and second hand elements
  - [ ] `update({ hours: 3, minutes: 15, seconds: 45 })` rotates hands to correct angles
  - [ ] City name label is rendered below the clock
  - [ ] Timezone abbreviation is displayed alongside the city name
  - [ ] Clock hands animate smoothly (CSS transition or requestAnimationFrame)

---

### Unit 4: Main App — Layout, Wiring & Deploy
- **Addresses**: FR-1, FR-5, NFR-1, NFR-2
- **Description**: Wire everything together in `main.js`: define the three city configs, create clock instances, start a `setInterval`/`requestAnimationFrame` loop to update all clocks every second. Set up the responsive Tailwind layout (grid/flex) for mobile. Configure Vercel deployment.
- **Inputs**: Clock component (Unit 3), timezone utility (Unit 2)
- **Outputs**: Fully working app with 3 clocks updating live, responsive layout, deployed to Vercel.
- **Dependencies**: Unit 1, Unit 2, Unit 3
- **Files to Create/Modify**:
  - `src/main.js`
  - `index.html` (add clock containers)
  - `vercel.json` (if needed)
- **Test Plan**:
  - [ ] Page renders three clock containers with correct city labels
  - [ ] All three clocks show correct time for their respective timezones
  - [ ] Clocks update every second (second hand visibly moves)
  - [ ] Layout is responsive — no horizontal scroll on 375px viewport
  - [ ] `npm run build` succeeds and `dist/` is deployable
  - [ ] Deployed to Vercel and accessible via public URL

---

## Version 2

### Unit 5: City Search & Selection
- **Addresses**: v2 FR-1, v2 FR-2, v2 NFR-1
- **Description**: Add a searchable city picker UI and persist selections in localStorage.
- **Inputs**: User search input, IANA timezone database
- **Outputs**: Dynamic clock grid based on user-selected cities.
- **Dependencies**: Unit 4
- **Files to Create/Modify**:
  - `src/cities.js`
  - `src/search.js`
  - `src/main.js`
  - `index.html`
- **Test Plan**:
  - [ ] Search input filters city list in real-time
  - [ ] Selecting a city adds a new clock
  - [ ] Removing a city removes its clock
  - [ ] Selections persist across page reloads via localStorage

---

## Requirements Coverage Matrix

### Version 1

| Requirement | Description | Unit(s) | Status |
|-------------|-------------|---------|--------|
| FR-1 | Display analog clocks for three cities | Unit 3, Unit 4 | ✅ |
| FR-2 | Hour, minute, second hands updating every second | Unit 3, Unit 4 | ✅ |
| FR-3 | City name and timezone abbreviation labels | Unit 3 | ✅ |
| FR-4 | Correct local time per timezone | Unit 2 | ✅ |
| FR-5 | Deployed on Vercel | Unit 4 | ✅ |
| NFR-1 | Mobile-friendly responsive layout | Unit 4 | ✅ |
| NFR-2 | Fast initial load (< 1s FCP on 4G) | Unit 1, Unit 4 | ✅ |
| NFR-3 | Minimal bundle size | Unit 1 | ✅ |
| NFR-4 | Smooth clock hand animation | Unit 3 | ✅ |

### Version 2

| Requirement | Description | Unit(s) | Status |
|-------------|-------------|---------|--------|
| v2 FR-1 | Add/remove cities from search | Unit 5 | ✅ |
| v2 FR-2 | Persist cities in localStorage | Unit 5 | ✅ |
| v2 NFR-1 | Search feels instant (< 100ms) | Unit 5 | ✅ |
