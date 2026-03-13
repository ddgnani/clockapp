/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import { createClock } from "./clock.js";

describe("createClock", () => {
  let container;
  const config = { name: "New York", timezone: "America/New_York" };

  beforeEach(() => {
    container = document.createElement("div");
  });

  it("inserts an SVG element into the container", () => {
    createClock(container, config);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg.namespaceURI).toBe("http://www.w3.org/2000/svg");
  });

  it("SVG contains three hand groups", () => {
    createClock(container, config);
    const svg = container.querySelector("svg");
    const groups = svg.querySelectorAll("g");
    expect(groups.length).toBe(3);
  });

  it("each hand group contains a line element", () => {
    createClock(container, config);
    const svg = container.querySelector("svg");
    const groups = svg.querySelectorAll("g");
    groups.forEach((g) => {
      expect(g.querySelector("line")).not.toBeNull();
    });
  });

  it("hand lines have distinct stroke widths", () => {
    createClock(container, config);
    const svg = container.querySelector("svg");
    const groups = Array.from(svg.querySelectorAll("g"));
    const widths = groups.map((g) => g.querySelector("line").getAttribute("stroke-width"));
    // hour=3.5, minute=2.5, second=1
    expect(widths).toEqual(["3.5", "2.5", "1"]);
  });

  it("update() rotates hand groups to correct angles for 3:15:45", () => {
    const clock = createClock(container, config);
    clock.update({ hours: 3, minutes: 15, seconds: 45 });

    const svg = container.querySelector("svg");
    const groups = Array.from(svg.querySelectorAll("g"));

    // Hour: (3 + 15/60) * 30 = 97.5
    expect(groups[0].getAttribute("transform")).toContain("97.5");
    // Minute: (15 + 45/60) * 6 = 94.5
    expect(groups[1].getAttribute("transform")).toContain("94.5");
    // Second: 45 * 6 = 270
    expect(groups[2].getAttribute("transform")).toContain("270");
  });

  it("renders city name label below the clock", () => {
    createClock(container, config);
    const label = container.querySelector(".clock-label");
    expect(label).not.toBeNull();
    expect(label.textContent).toContain("New York");
  });

  it("displays timezone abbreviation when update is called with abbreviation", () => {
    const clock = createClock(container, config);
    clock.update({ hours: 0, minutes: 0, seconds: 0 }, "EST");
    const tzEl = container.querySelector(".clock-tz");
    expect(tzEl.textContent).toBe("EST");
  });

  it("second hand group rotation changes between updates", () => {
    const clock = createClock(container, config);
    clock.update({ hours: 12, minutes: 0, seconds: 0 });

    const svg = container.querySelector("svg");
    const secondGroup = Array.from(svg.querySelectorAll("g"))[2];
    const firstTransform = secondGroup.getAttribute("transform");

    clock.update({ hours: 12, minutes: 0, seconds: 30 });
    const secondTransform = secondGroup.getAttribute("transform");

    expect(firstTransform).not.toBe(secondTransform);
  });
});
