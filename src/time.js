/**
 * Timezone utility module.
 *
 * Provides helpers to retrieve the current time components (hours, minutes,
 * seconds) and the short timezone abbreviation for any IANA timezone, using
 * the built-in Intl.DateTimeFormat API with zero external dependencies.
 */

/**
 * Return the current hours, minutes, and seconds for the given IANA timezone.
 *
 * @param {string} timezone - IANA timezone identifier (e.g. "America/New_York").
 * @returns {{ hours: number, minutes: number, seconds: number }}
 * @throws {RangeError} When the timezone string is not a valid IANA identifier.
 * @throws {TypeError} When timezone is not a non-empty string.
 */
export function getTimeForTimezone(timezone) {
  validateTimezone(timezone);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());

  const hours = Number(parts.find((p) => p.type === "hour").value) % 24;
  const minutes = Number(parts.find((p) => p.type === "minute").value);
  const seconds = Number(parts.find((p) => p.type === "second").value);

  return { hours, minutes, seconds };
}

/**
 * Return the short timezone abbreviation for the given IANA timezone at the
 * current moment (e.g. "EST", "EDT", "IST").
 *
 * @param {string} timezone - IANA timezone identifier.
 * @returns {string} Short abbreviation such as "EST" or "IST".
 * @throws {RangeError} When the timezone string is not a valid IANA identifier.
 * @throws {TypeError} When timezone is not a non-empty string.
 */
export function getTimezoneAbbreviation(timezone) {
  validateTimezone(timezone);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName").value;
}

/**
 * Validate that the provided timezone value is a non-empty string.
 * The Intl API itself will throw a RangeError for unrecognised identifiers,
 * but we add an explicit check for null / undefined / non-string values so
 * callers receive a clear TypeError instead of a cryptic failure.
 *
 * @param {*} timezone
 * @throws {TypeError} If timezone is not a non-empty string.
 */
function validateTimezone(timezone) {
  if (typeof timezone !== "string" || timezone.trim() === "") {
    throw new TypeError(
      "timezone must be a non-empty IANA timezone string (e.g. \"America/New_York\")"
    );
  }
}
