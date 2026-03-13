---
description: Phase 5 unit-by-unit execution cycle — implement, test subagent, UI test subagent, code review subagent, commit
---

# Execution Phase Rules

## Unit-by-Unit Development

1. **Pick the next pending unit** from `docs/workplan.md`.
   Before picking, run the **Parallel Eligibility Check** defined in `.claude/rules/subagents.md`.
   - If eligible parallel pairs exist: offer the user the choice as described there.
   - If the user chooses parallel: follow the **Parallel Execution Protocol** in `.claude/rules/subagents.md`.
   - If the user chooses sequential (or no eligible pairs exist): continue with steps 2–8 below for a single unit.

2. Display the Phase 5 banner with current version and unit name
3. Update `docs/STATE.md` to mark it "in-progress"
4. Implement the unit

5. **Testing** — Update banner status to "testing".
   Spawn the **Test Runner Subagent** via Task tool:
   - Read `.claude/rules/agent-prompts/test-runner.md`
   - Replace `{{UNIT_NAME}}` with the current unit name
   - Replace `{{PROJECT_ROOT}}` with the current working directory
   - Replace `{{TEST_PLAN}}` with the Test Plan checklist from this unit's section in `docs/workplan.md`
   - Pass the resulting prompt to Task tool with `subagent_type: general-purpose`

   After receiving the result:
   - If STATUS: PASS → check off all Test Plan items in `docs/workplan.md` (`- [x]`), then proceed to step 5b (UI testing) or step 6.
   - If STATUS: FAIL → display DETAILS to user, fix the failing tests, then re-run (repeat step 5).
   - If STATUS: UNCOVERED → write missing tests for the uncovered Test Plan items, then re-run (repeat step 5). Do NOT proceed until every Test Plan item has a corresponding test.

   **5b. UI Testing (conditional):**
   If BOTH conditions are true:
   - `has_ui: true` in `docs/STATE.md` Project Flags, AND
   - The current unit's "Files to Create/Modify" contains any path matching:
     `*.{jsx,tsx,vue,svelte,html,css}` OR a path under `ui/`, `frontend/`, `client/`, `web/`, `app/`, or `pages/`

   Then spawn the **UI Testing Subagent**:
   - Read `.claude/rules/agent-prompts/ui-testing.md`
   - Replace `{{UNIT_NAME}}` with the unit name
   - Replace `{{UI_FILES}}` with the matching file paths from the unit
   - Replace `{{FRAMEWORK}}` with the frontend framework from `docs/architecture.md`
   - Replace `{{TEST_PLAN}}` with the Test Plan checklist from this unit's section in `docs/workplan.md`
   - Pass the resulting prompt to Task tool with `subagent_type: general-purpose`

   After receiving the result:
   - STATUS: PASS → check off any UI-related Test Plan items in `docs/workplan.md` (`- [x]`), then proceed to step 6.
   - STATUS: FAIL → display DETAILS, fix issues, re-run both test subagents before proceeding.
   - STATUS: PARTIAL → display failing items to user, ask: "Fix now or proceed with known issues?"
   - STATUS: UNCOVERED → write missing UI tests for the uncovered Test Plan items, then re-run (repeat step 5b). Do NOT proceed until every UI-related Test Plan item has a corresponding test.
   - Append the full UI subagent report to the commit message body as a comment.

6. **Reviewing** — Update banner status to "reviewing".
   Spawn the **Code Review Subagent** via Task tool:
   - Read `.claude/rules/agent-prompts/code-review.md`
   - Replace `{{UNIT_NAME}}` with the current unit name
   - Replace `{{GIT_DIFF}}` with the output of `git diff HEAD`
   - Replace `{{ARCHITECTURE_CONTEXT}}` with the Tech Stack table and relevant ADRs from `docs/architecture.md`
   - Pass the resulting prompt to Task tool with `subagent_type: general-purpose`

   After receiving the result:
   - If STATUS: PASS → proceed to step 7.
   - If STATUS: FAIL → display DETAILS, fix each listed issue, then re-run the test runner subagent (step 5) and code review subagent (step 6) before proceeding.

## Self-Review
The self-review checklist is applied by the Code Review Subagent in step 6. Do not skip step 6.

7. If tests pass and review is clean: mark "complete" in STATE.md, git commit
8. If tests fail or review finds issues: fix, re-test, re-review, do NOT move to next unit

## Test Requirements
- Every work unit must have tests before being marked complete
- Run tests after implementation — do not assume they pass
- Report test results to the user

## Commit Convention
- Commit message format: `feat: [vX - Unit Y] Brief description`
- Example: `feat: [v1 - Unit 3] Add user authentication endpoint`
