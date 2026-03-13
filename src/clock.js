/**
 * SVG analog clock renderer.
 *
 * Creates an SVG clock face with hour, minute, and second hands inside a
 * given container element. Exposes an update() method to set hand positions.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const CLOCK_SIZE = 200;
const CENTER = CLOCK_SIZE / 2;

/**
 * Create an SVG analog clock inside the given container.
 *
 * @param {HTMLElement} container - DOM element to append the clock into.
 * @param {{ name: string, timezone: string }} config - City configuration.
 * @returns {{ update: (time: { hours: number, minutes: number, seconds: number }) => void, element: HTMLElement }}
 */
export function createClock(container, config) {
  const wrapper = document.createElement("div");
  wrapper.className = "clock-wrapper flex flex-col items-center";

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`);
  svg.setAttribute("width", CLOCK_SIZE);
  svg.setAttribute("height", CLOCK_SIZE);
  svg.classList.add("clock-svg");

  // Clock face
  const face = createCircle(CENTER, CENTER, 95, "none", "#e2e8f0", 2);
  svg.appendChild(face);

  // Hour markers
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const isQuarter = i % 3 === 0;
    const innerR = isQuarter ? 78 : 82;
    const outerR = 90;
    const x1 = CENTER + innerR * Math.cos(angle);
    const y1 = CENTER + innerR * Math.sin(angle);
    const x2 = CENTER + outerR * Math.cos(angle);
    const y2 = CENTER + outerR * Math.sin(angle);
    const marker = createLine(x1, y1, x2, y2, "#94a3b8", isQuarter ? 2.5 : 1);
    svg.appendChild(marker);
  }

  // Clock hands — each wrapped in a <g> for rotation around center
  const hourGroup = createHandGroup(40, 3.5, "#1e293b");
  const minuteGroup = createHandGroup(60, 2.5, "#475569");
  const secondGroup = createHandGroup(70, 1, "#ef4444");

  svg.appendChild(hourGroup.g);
  svg.appendChild(minuteGroup.g);
  svg.appendChild(secondGroup.g);

  // Center dot (on top of hands)
  const centerDot = createCircle(CENTER, CENTER, 4, "#1e293b", "none", 0);
  svg.appendChild(centerDot);

  wrapper.appendChild(svg);

  // Label
  const label = document.createElement("div");
  label.className = "clock-label text-center mt-2";

  const cityName = document.createElement("div");
  cityName.className = "text-lg font-semibold text-slate-800";
  cityName.textContent = config.name;

  const tzAbbr = document.createElement("div");
  tzAbbr.className = "text-sm text-slate-500 clock-tz";

  label.appendChild(cityName);
  label.appendChild(tzAbbr);
  wrapper.appendChild(label);

  container.appendChild(wrapper);

  function update(time, abbreviation) {
    const hourAngle = ((time.hours % 12) + time.minutes / 60) * 30;
    const minuteAngle = (time.minutes + time.seconds / 60) * 6;
    const secondAngle = time.seconds * 6;

    hourGroup.g.setAttribute("transform", `rotate(${hourAngle}, ${CENTER}, ${CENTER})`);
    minuteGroup.g.setAttribute("transform", `rotate(${minuteAngle}, ${CENTER}, ${CENTER})`);
    secondGroup.g.setAttribute("transform", `rotate(${secondAngle}, ${CENTER}, ${CENTER})`);

    if (abbreviation !== undefined) {
      tzAbbr.textContent = abbreviation;
    }
  }

  return { update, element: wrapper };
}

function createCircle(cx, cy, r, fill, stroke, strokeWidth) {
  const circle = document.createElementNS(SVG_NS, "circle");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", fill);
  circle.setAttribute("stroke", stroke);
  circle.setAttribute("stroke-width", strokeWidth);
  return circle;
}

function createLine(x1, y1, x2, y2, stroke, strokeWidth) {
  const line = document.createElementNS(SVG_NS, "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", stroke);
  line.setAttribute("stroke-width", strokeWidth);
  line.setAttribute("stroke-linecap", "round");
  return line;
}

function createHandGroup(length, width, color) {
  const g = document.createElementNS(SVG_NS, "g");
  const line = createLine(CENTER, CENTER, CENTER, CENTER - length, color, width);
  g.appendChild(line);
  return { g, line };
}
