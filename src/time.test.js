/**
 * Tests for the timezone utility module (src/time.js).
 */

import { describe, it, expect } from "vitest";
import { getTimeForTimezone, getTimezoneAbbreviation } from "./time.js";

describe("getTimeForTimezone", () => {
  it("returns valid hours, minutes, and seconds for America/New_York", () => {
    const result = getTimeForTimezone("America/New_York");

    expect(result).toHaveProperty("hours");
    expect(result).toHaveProperty("minutes");
    expect(result).toHaveProperty("seconds");

    expect(result.hours).toBeGreaterThanOrEqual(0);
    expect(result.hours).toBeLessThanOrEqual(23);

    expect(result.minutes).toBeGreaterThanOrEqual(0);
    expect(result.minutes).toBeLessThanOrEqual(59);

    expect(result.seconds).toBeGreaterThanOrEqual(0);
    expect(result.seconds).toBeLessThanOrEqual(59);
  });

  it("returns valid time values for Asia/Kolkata", () => {
    const result = getTimeForTimezone("Asia/Kolkata");

    expect(result.hours).toBeGreaterThanOrEqual(0);
    expect(result.hours).toBeLessThanOrEqual(23);

    expect(result.minutes).toBeGreaterThanOrEqual(0);
    expect(result.minutes).toBeLessThanOrEqual(59);

    expect(result.seconds).toBeGreaterThanOrEqual(0);
    expect(result.seconds).toBeLessThanOrEqual(59);
  });

  it("returns a time for Asia/Kolkata offset from UTC by +5:30", () => {
    const now = new Date();

    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcTotalMinutes = utcHours * 60 + utcMinutes;

    const kolkata = getTimeForTimezone("Asia/Kolkata");
    const kolkataTotalMinutes = kolkata.hours * 60 + kolkata.minutes;

    // Expected offset is +5:30 = 330 minutes.
    // Handle day wrap-around with modular arithmetic.
    const diff =
      ((kolkataTotalMinutes - utcTotalMinutes) % 1440 + 1440) % 1440;

    expect(diff).toBe(330);
  });

  it("throws RangeError for an invalid timezone string", () => {
    expect(() => getTimeForTimezone("Invalid/Timezone")).toThrow(RangeError);
  });

  it("throws TypeError when timezone is null", () => {
    expect(() => getTimeForTimezone(null)).toThrow(TypeError);
  });

  it("throws TypeError when timezone is undefined", () => {
    expect(() => getTimeForTimezone(undefined)).toThrow(TypeError);
  });

  it("throws TypeError when timezone is an empty string", () => {
    expect(() => getTimeForTimezone("")).toThrow(TypeError);
  });

  it("throws TypeError when timezone is a number", () => {
    expect(() => getTimeForTimezone(42)).toThrow(TypeError);
  });
});

describe("getTimezoneAbbreviation", () => {
  it("returns a non-empty string for America/New_York", () => {
    const abbr = getTimezoneAbbreviation("America/New_York");

    expect(typeof abbr).toBe("string");
    expect(abbr.length).toBeGreaterThan(0);
  });

  it("returns a recognisable abbreviation for America/New_York", () => {
    const abbr = getTimezoneAbbreviation("America/New_York");
    // Should be "EST" or "EDT" depending on DST
    expect(["EST", "EDT"]).toContain(abbr);
  });

  it("returns a non-empty string for Asia/Kolkata", () => {
    const abbr = getTimezoneAbbreviation("Asia/Kolkata");

    expect(typeof abbr).toBe("string");
    expect(abbr.length).toBeGreaterThan(0);
  });

  it("throws RangeError for an invalid timezone string", () => {
    expect(() => getTimezoneAbbreviation("Fake/Zone")).toThrow(RangeError);
  });

  it("throws TypeError when timezone is null", () => {
    expect(() => getTimezoneAbbreviation(null)).toThrow(TypeError);
  });

  it("throws TypeError when timezone is an empty string", () => {
    expect(() => getTimezoneAbbreviation("")).toThrow(TypeError);
  });
});
