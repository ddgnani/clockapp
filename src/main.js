import './style.css';
import { createClock } from './clock.js';
import { getTimeForTimezone, getTimezoneAbbreviation } from './time.js';

const CITIES = [
  { name: 'Columbus', timezone: 'America/New_York' },
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'Hyderabad', timezone: 'Asia/Kolkata' },
];

const app = document.getElementById('app');
const clocks = CITIES.map((city) => createClock(app, city));

function tick() {
  clocks.forEach((clock, i) => {
    const time = getTimeForTimezone(CITIES[i].timezone);
    const abbreviation = getTimezoneAbbreviation(CITIES[i].timezone);
    clock.update(time, abbreviation);
  });
}

tick();
setInterval(tick, 1000);
