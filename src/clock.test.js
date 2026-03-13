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

  it("SVG contains hour, minute, and second hand elements (3 lines inside SVG after markers)", () => {
    createClock(container, config);
    const svg = container.querySelector("svg");
    const lines = svg.querySelectorAll("line");
    // 12 hour markers + 3 hands = 15 lines
    expect(lines.length).toBe(15);
  });

  it("has three clock hand lines with distinct widths", () => {
    createClock(container, config);
    const svg = container.querySelector("svg");
    const lines = Array.from(svg.querySelectorAll("line"));
    // Last 3 lines are the hands
    const hands = lines.slice(-3);
    const widths = hands.map((l) => l.getAttribute("stroke-width"));
    // hour=3.5, minute=2.5, second=1
    expect(widths).toEqual(["3.5", "2.5", "1"]);
  });

  it("update() rotates hands to correct angles for 3:15:45", () => {
    const clock = createClock(container, config);
    clock.update({ hours: 3, minutes: 15, seconds: 45 });

    const svg = container.querySelector("svg");
    const lines = Array.from(svg.querySelectorAll("line"));
    const hands = lines.slice(-3);

    // Hour: (3 + 15/60) * 30 = 97.5
    expect(hands[0].getAttribute("transform")).toContain("97.5");
    // Minute: (15 + 45/60) * 6 = 94.5
    expect(hands[1].getAttribute("transform")).toContain("94.5");
    // Second: 45 * 6 = 270
    expect(hands[2].getAttribute("transform")).toContain("270");
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

  it("clock hands have CSS transition for smooth animation", () => {
    createClock(container, config);
    const svg = container.querySelector("svg");
    const hands = Array.from(svg.querySelectorAll("line")).slice(-3);
    hands.forEach((hand) => {
      expect(hand.style.transition).toContain("transform");
      expect(hand.style.transition).toContain("ease");
    });
  });

  it("second hand position changes between updates", () => {
    const clock = createClock(container, config);
    clock.update({ hours: 12, minutes: 0, seconds: 0 });

    const svg = container.querySelector("svg");
    const secondHand = Array.from(svg.querySelectorAll("line")).slice(-1)[0];
    const firstTransform = secondHand.getAttribute("transform");

    clock.update({ hours: 12, minutes: 0, seconds: 30 });
    const secondTransform = secondHand.getAttribute("transform");

    expect(firstTransform).not.toBe(secondTransform);
  });
});
