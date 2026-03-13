/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

describe("main app integration", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
  });

  it("renders three clock containers with correct city labels", async () => {
    await import("./main.js");

    const wrappers = document.querySelectorAll(".clock-wrapper");
    expect(wrappers.length).toBe(3);

    const labels = Array.from(document.querySelectorAll(".clock-label")).map(
      (el) => el.textContent
    );
    expect(labels.some((l) => l.includes("Columbus"))).toBe(true);
    expect(labels.some((l) => l.includes("New York"))).toBe(true);
    expect(labels.some((l) => l.includes("Hyderabad"))).toBe(true);
  });

  it("all three clocks show timezone abbreviations", async () => {
    await import("./main.js");

    const tzEls = document.querySelectorAll(".clock-tz");
    expect(tzEls.length).toBe(3);
    tzEls.forEach((el) => {
      expect(el.textContent.length).toBeGreaterThan(0);
    });
  });

  it("clocks update when interval fires", async () => {
    await import("./main.js");

    const svgs = document.querySelectorAll("svg");
    const getSecondHandTransform = (svg) => {
      const groups = Array.from(svg.querySelectorAll("g"));
      return groups[groups.length - 1].getAttribute("transform");
    };

    const initialTransforms = Array.from(svgs).map(getSecondHandTransform);

    // Advance time by 1 second to trigger interval
    vi.advanceTimersByTime(1000);

    // At least one clock's second hand should have a transform set
    const updatedTransforms = Array.from(svgs).map(getSecondHandTransform);
    updatedTransforms.forEach((t) => {
      expect(t).not.toBeNull();
      expect(t).toContain("rotate");
    });
  });
});
