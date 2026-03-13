# Requirements

## Version 1 — MVP

### Functional Requirements
- FR-1: Display analog clocks for three hardcoded cities: Columbus (OH), New York (NY), Hyderabad (India)
- FR-2: Each clock must show hour, minute, and second hands, updating every second
- FR-3: Each clock must display the city name and timezone abbreviation (e.g., "EST", "IST") as a label
- FR-4: Clocks must show the correct local time for each city's timezone
- FR-5: App must be deployed and accessible on Vercel

### Non-Functional Requirements
- NFR-1: Mobile-friendly — responsive layout that works well on phone screens (320px+)
- NFR-2: Fast initial load — target < 1s first contentful paint on 4G connection
- NFR-3: Minimal bundle size — no heavy dependencies; use browser-native timezone APIs (Intl)
- NFR-4: Smooth animation — clock hands must move fluidly without visible jank

### Acceptance Criteria
- [ ] Three analog clocks render on page load showing correct times for Columbus, New York, and Hyderabad
- [ ] Second hands tick every second in sync with real time
- [ ] City name and timezone abbreviation displayed below each clock
- [ ] Layout is usable on a 375px-wide mobile screen (no horizontal scroll, clocks visible without excessive scrolling)
- [ ] Deployed to Vercel and accessible via public URL
- [ ] First contentful paint under 1 second on simulated 4G

---

## Version 2

### Functional Requirements
- FR-1: Allow users to add/remove cities from a searchable list
- FR-2: Persist selected cities in localStorage

### Non-Functional Requirements
- NFR-1: City search must feel instant (< 100ms response)

### Acceptance Criteria
- [ ] User can add a new city clock from a search interface
- [ ] User can remove an existing city clock
- [ ] Selected cities persist across page reloads
