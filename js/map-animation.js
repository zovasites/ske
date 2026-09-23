/**
 * SREE KRISHNA ENTERPRIZES - GLOBAL REACH MAP RENDERER
 * Interactive SVG World Map with 22 Export & Import Countries featuring circular flags & animated trade arcs
 */

const SKE_GLOBAL_COUNTRIES = [
  { id: 'sweden', name: 'Sweden', code: 'SE', region: 'Northern Europe', x: 500, y: 70, labelPos: 'top' },
  { id: 'china', name: 'China', code: 'CN', region: 'East Asia', x: 695, y: 140, labelPos: 'top' },
  { id: 'australia', name: 'Australia', code: 'AU', region: 'Oceania', x: 795, y: 370, labelPos: 'right' },
  { id: 'united-states', name: 'United States', code: 'US', region: 'North America', x: 195, y: 165, labelPos: 'left' },
  { id: 'canada', name: 'Canada', code: 'CA', region: 'North America', x: 180, y: 105, labelPos: 'left' },
  { id: 'italy', name: 'Italy', code: 'IT', region: 'Southern Europe', x: 465, y: 175, labelPos: 'bottom' },
  { id: 'belgium', name: 'Belgium', code: 'BE', region: 'Western Europe', x: 445, y: 100, labelPos: 'top' },
  { id: 'germany', name: 'Germany', code: 'DE', region: 'Central Europe', x: 485, y: 115, labelPos: 'right' },
  { id: 'north-korea', name: 'North Korea', code: 'KP', region: 'East Asia', x: 765, y: 125, labelPos: 'top' },
  { id: 'spain', name: 'Spain', code: 'ES', region: 'Southern Europe', x: 410, y: 170, labelPos: 'left' },
  { id: 'france', name: 'France', code: 'FR', region: 'Western Europe', x: 435, y: 135, labelPos: 'left' },
  { id: 'japan', name: 'Japan', code: 'JP', region: 'East Asia', x: 830, y: 150, labelPos: 'right' },
  { id: 'turkey', name: 'Turkey', code: 'TR', region: 'Eurasia', x: 535, y: 160, labelPos: 'top' },
  { id: 'south-korea', name: 'South Korea', code: 'KR', region: 'East Asia', x: 770, y: 165, labelPos: 'bottom' },
  { id: 'ethiopia', name: 'Ethiopia', code: 'ET', region: 'East Africa', x: 515, y: 290, labelPos: 'left' },
  { id: 'vietnam', name: 'Vietnam', code: 'VN', region: 'Southeast Asia', x: 730, y: 220, labelPos: 'right' },
  { id: 'singapore', name: 'Singapore', code: 'SG', region: 'Southeast Asia', x: 720, y: 305, labelPos: 'right' },
  { id: 'bangladesh', name: 'Bangladesh', code: 'BD', region: 'South Asia', x: 665, y: 190, labelPos: 'top' },
  { id: 'thailand', name: 'Thailand', code: 'TH', region: 'Southeast Asia', x: 690, y: 242, labelPos: 'right' },
  { id: 'malaysia', name: 'Malaysia', code: 'MY', region: 'Southeast Asia', x: 700, y: 275, labelPos: 'right' },
  { id: 'sri-lanka', name: 'Sri Lanka', code: 'LK', region: 'South Asia', x: 630, y: 320, labelPos: 'right' },
  { id: 'indonesia', name: 'Indonesia', code: 'ID', region: 'Southeast Asia', x: 760, y: 335, labelPos: 'right' }
];

function getFlagInnerSvg(id) {
  switch (id) {
    case 'sweden':
      return `
        <circle cx="0" cy="0" r="10" fill="#006AA7" />
        <path d="M -10 -2.5 L 10 -2.5 L 10 2.5 L -10 2.5 Z" fill="#FECC00" />
        <path d="M -4 -10 L 0 -10 L 0 10 L -4 10 Z" fill="#FECC00" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'china':
      return `
        <circle cx="0" cy="0" r="10" fill="#DE2910" />
        <polygon points="-5,-6 -4.2,-3.5 -1.7,-3.5 -3.7,-2 -3,-0.5 -5,-2 -7,-0.5 -6.3,-2 -8.3,-3.5 -5.8,-3.5" fill="#FFDE00" />
        <circle cx="-1" cy="-7" r="0.8" fill="#FFDE00" />
        <circle cx="0.5" cy="-5" r="0.8" fill="#FFDE00" />
        <circle cx="0.5" cy="-2.5" r="0.8" fill="#FFDE00" />
        <circle cx="-1" cy="-0.5" r="0.8" fill="#FFDE00" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'australia':
      return `
        <circle cx="0" cy="0" r="10" fill="#00008B" />
        <path d="M -10 -10 L 0 -10 L 0 0 L -10 0 Z" fill="#00247D" />
        <line x1="-10" y1="-10" x2="0" y2="0" stroke="#FFFFFF" stroke-width="1.5" />
        <line x1="-10" y1="0" x2="0" y2="-10" stroke="#FFFFFF" stroke-width="1.5" />
        <line x1="-5" y1="-10" x2="-5" y2="0" stroke="#CC1111" stroke-width="1.2" />
        <line x1="-10" y1="-5" x2="0" y2="-5" stroke="#CC1111" stroke-width="1.2" />
        <circle cx="5" cy="4" r="1" fill="#FFFFFF" />
        <circle cx="3" cy="-3" r="0.8" fill="#FFFFFF" />
        <circle cx="6" cy="-4" r="0.8" fill="#FFFFFF" />
        <circle cx="7" cy="0" r="0.8" fill="#FFFFFF" />
        <circle cx="-5" cy="5" r="1.5" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'united-states':
      return `
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <path d="M -10 -10 L 10 -10 L 10 -7 L -10 -7 Z" fill="#B22234" />
        <path d="M -10 -4 L 10 -4 L 10 -1 L -10 -1 Z" fill="#B22234" />
        <path d="M -10 2 L 10 2 L 10 5 L -10 5 Z" fill="#B22234" />
        <path d="M -10 8 L 10 8 L 10 10 L -10 10 Z" fill="#B22234" />
        <path d="M -10 -10 L 0 -10 L 0 0 L -10 0 Z" fill="#002664" />
        <circle cx="-7" cy="-7" r="0.7" fill="#FFFFFF" />
        <circle cx="-3" cy="-7" r="0.7" fill="#FFFFFF" />
        <circle cx="-5" cy="-5" r="0.7" fill="#FFFFFF" />
        <circle cx="-7" cy="-3" r="0.7" fill="#FFFFFF" />
        <circle cx="-3" cy="-3" r="0.7" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'canada':
      return `
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <path d="M -10 -10 L -5 -10 L -5 10 L -10 10 Z" fill="#FF0000" />
        <path d="M 5 -10 L 10 -10 L 10 10 L 5 10 Z" fill="#FF0000" />
        <polygon points="0,-5 1.5,-2 4,-3 2.5,0 4,2 1,1.5 0.5,4 -0.5,4 -1,1.5 -4,2 -2.5,0 -4,-3 -1.5,-2" fill="#FF0000" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'italy':
      return `
        <circle cx="0" cy="0" r="10" fill="#F4F5F0" />
        <path d="M -10 -10 L -3.3 -10 L -3.3 10 L -10 10 Z" fill="#008C45" />
        <path d="M 3.3 -10 L 10 -10 L 10 10 L 3.3 10 Z" fill="#CD212A" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'belgium':
      return `
        <circle cx="0" cy="0" r="10" fill="#FDDA24" />
        <path d="M -10 -10 L -3.3 -10 L -3.3 10 L -10 10 Z" fill="#000000" />
        <path d="M 3.3 -10 L 10 -10 L 10 10 L 3.3 10 Z" fill="#EF3340" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'germany':
      return `
        <circle cx="0" cy="0" r="10" fill="#DD0000" />
        <path d="M -10 -10 L 10 -10 L 10 -3.3 L -10 -3.3 Z" fill="#000000" />
        <path d="M -10 3.3 L 10 3.3 L 10 10 L -10 10 Z" fill="#FFCE00" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'north-korea':
      return `
        <circle cx="0" cy="0" r="10" fill="#ED1B2D" />
        <path d="M -10 -10 L 10 -10 L 10 -6 L -10 -6 Z" fill="#024FA2" />
        <path d="M -10 -6 L 10 -6 L 10 -5 L -10 -5 Z" fill="#FFFFFF" />
        <path d="M -10 5 L 10 5 L 10 6 L -10 6 Z" fill="#FFFFFF" />
        <path d="M -10 6 L 10 6 L 10 10 L -10 10 Z" fill="#024FA2" />
        <circle cx="-3.5" cy="0" r="3.2" fill="#FFFFFF" />
        <polygon points="-3.5,-2.5 -2.7,-0.7 -0.8,-0.7 -2.3,0.4 -1.7,2.2 -3.5,1.1 -5.3,2.2 -4.7,0.4 -6.2,-0.7 -4.3,-0.7" fill="#ED1B2D" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'spain':
      return `
        <circle cx="0" cy="0" r="10" fill="#F1BF00" />
        <path d="M -10 -10 L 10 -10 L 10 -5 L -10 -5 Z" fill="#AA151B" />
        <path d="M -10 5 L 10 5 L 10 10 L -10 10 Z" fill="#AA151B" />
        <circle cx="-3" cy="0" r="2" fill="#AA151B" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'france':
      return `
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <path d="M -10 -10 L -3.3 -10 L -3.3 10 L -10 10 Z" fill="#002654" />
        <path d="M 3.3 -10 L 10 -10 L 10 10 L 3.3 10 Z" fill="#ED2939" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'japan':
      return `
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="4.5" fill="#BC002D" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'turkey':
      return `
        <circle cx="0" cy="0" r="10" fill="#E30A17" />
        <circle cx="-2" cy="0" r="4.2" fill="#FFFFFF" />
        <circle cx="-0.8" cy="0" r="3.4" fill="#E30A17" />
        <polygon points="3,-1 3.5,0.2 4.5,0.2 3.7,0.8 4,1.8 3,1.2 2,1.8 2.3,0.8 1.5,0.2 2.5,0.2" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'south-korea':
      return `
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <path d="M -5 0 A 5 5 0 0 1 5 0 A 2.5 2.5 0 0 1 0 0 A 2.5 2.5 0 0 0 -5 0 Z" fill="#CD2E3A" />
        <path d="M 5 0 A 5 5 0 0 1 -5 0 A 2.5 2.5 0 0 1 0 0 A 2.5 2.5 0 0 0 5 0 Z" fill="#0047A0" />
        <circle cx="-7" cy="-7" r="0.7" fill="#000000" />
        <circle cx="7" cy="-7" r="0.7" fill="#000000" />
        <circle cx="-7" cy="7" r="0.7" fill="#000000" />
        <circle cx="7" cy="7" r="0.7" fill="#000000" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'ethiopia':
      return `
        <circle cx="0" cy="0" r="10" fill="#FED100" />
        <path d="M -10 -10 L 10 -10 L 10 -3.3 L -10 -3.3 Z" fill="#009A44" />
        <path d="M -10 3.3 L 10 3.3 L 10 10 L -10 10 Z" fill="#EF3340" />
        <circle cx="0" cy="0" r="4" fill="#0066B3" />
        <polygon points="0,-3 0.8,-0.8 3,-0.8 1.2,0.4 1.8,2.5 0,1.2 -1.8,2.5 -1.2,0.4 -3,-0.8 -0.8,-0.8" fill="#FED100" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'vietnam':
      return `
        <circle cx="0" cy="0" r="10" fill="#DA251D" />
        <polygon points="0,-6 1.8,-1.5 6.5,-1.5 2.8,1.2 4.2,5.8 0,3 -4.2,5.8 -2.8,1.2 -6.5,-1.5 -1.8,-1.5" fill="#FFCD00" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'singapore':
      return `
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <path d="M -10 -10 L 10 -10 L 10 0 L -10 0 Z" fill="#EF3340" />
        <circle cx="-5" cy="-5" r="2.8" fill="#FFFFFF" />
        <circle cx="-4.2" cy="-5" r="2.2" fill="#EF3340" />
        <circle cx="-2.5" cy="-5" r="0.7" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'bangladesh':
      return `
        <circle cx="0" cy="0" r="10" fill="#006A4E" />
        <circle cx="-1" cy="0" r="5.2" fill="#F42A41" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'thailand':
      return `
        <circle cx="0" cy="0" r="10" fill="#241D4F" />
        <path d="M -10 -10 L 10 -10 L 10 -6.5 L -10 -6.5 Z" fill="#A51931" />
        <path d="M -10 -6.5 L 10 -6.5 L 10 -3.2 L -10 -3.2 Z" fill="#FFFFFF" />
        <path d="M -10 3.2 L 10 3.2 L 10 6.5 L -10 6.5 Z" fill="#FFFFFF" />
        <path d="M -10 6.5 L 10 6.5 L 10 10 L -10 10 Z" fill="#A51931" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'malaysia':
      return `
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <path d="M -10 -10 L 10 -10 L 10 -7 L -10 -7 Z" fill="#CC0000" />
        <path d="M -10 -4 L 10 -4 L 10 -1 L -10 -1 Z" fill="#CC0000" />
        <path d="M -10 2 L 10 2 L 10 5 L -10 5 Z" fill="#CC0000" />
        <path d="M -10 8 L 10 8 L 10 10 L -10 10 Z" fill="#CC0000" />
        <path d="M -10 -10 L 0 -10 L 0 0 L -10 0 Z" fill="#000066" />
        <circle cx="-5" cy="-5" r="3.2" fill="#FFCC00" />
        <circle cx="-4" cy="-5" r="2.6" fill="#000066" />
        <circle cx="-3" cy="-5" r="1.2" fill="#FFCC00" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'sri-lanka':
      return `
        <circle cx="0" cy="0" r="10" fill="#8D153A" />
        <circle cx="0" cy="0" r="9.2" fill="none" stroke="#FFBE29" stroke-width="1.2" />
        <path d="M -8 -6 L -5 -6 L -5 6 L -8 6 Z" fill="#00534E" />
        <path d="M -5 -6 L -2 -6 L -2 6 L -5 6 Z" fill="#EB7400" />
        <circle cx="4" cy="0" r="3" fill="#FFBE29" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    case 'indonesia':
      return `
        <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
        <path d="M -10 -10 L 10 -10 L 10 0 L -10 0 Z" fill="#E70011" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />`;
    default:
      return `<circle cx="0" cy="0" r="10" fill="#EA580C" /><circle cx="0" cy="0" r="10" fill="none" stroke="#FFFFFF" stroke-width="1.5" />`;
  }
}

function getSvgFlagDefinition(country) {
  return `<g id="flag-${country.id}">${getFlagInnerSvg(country.id)}</g>`;
}

function initGlobalReachMap() {
  const container = document.getElementById('global-map-canvas');
  if (!container) return;

  const erodeX = 605;
  const erodeY = 255;

  // Build SVG Flag Definitions
  const flagDefs = SKE_GLOBAL_COUNTRIES.map(c => getSvgFlagDefinition(c)).join('\n');

  // Build Animated Trade Arc Paths from Erode, Tamil Nadu to each of the 22 countries
  const tradeArcs = SKE_GLOBAL_COUNTRIES.map((c, i) => {
    const midX = (erodeX + c.x) / 2;
    const midY = (erodeY + c.y) / 2 - Math.min(60, Math.abs(erodeX - c.x) * 0.25 + 15);
    const dur = 2.2 + (i % 6) * 0.35;
    return `
      <path d="M ${erodeX} ${erodeY} Q ${midX} ${midY}, ${c.x} ${c.y}" 
            fill="none" 
            stroke="url(#arcGradOrangeRed)" 
            stroke-width="2" 
            stroke-dasharray="6 4" 
            class="trade-arc trade-arc-${c.id}" 
            opacity="0.85">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="${dur}s" repeatCount="indefinite" />
      </path>
    `;
  }).join('\n');

  // Build Country Nodes with Circular Flags & non-overlapping text positioning
  const countryNodes = SKE_GLOBAL_COUNTRIES.map(c => {
    let textX = 14;
    let textY = 4;
    let anchor = 'start';

    if (c.labelPos === 'left') {
      textX = -14;
      anchor = 'end';
    } else if (c.labelPos === 'top') {
      textX = 0;
      textY = -14;
      anchor = 'middle';
    } else if (c.labelPos === 'bottom') {
      textX = 0;
      textY = 18;
      anchor = 'middle';
    }

    return `
      <g class="country-map-node" data-country="${c.id}" transform="translate(${c.x}, ${c.y})" style="cursor: pointer;">
        <circle cx="0" cy="0" r="13" fill="none" stroke="#F59E0B" opacity="0.3" class="node-pulse-ring">
          <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite" />
        </circle>
        
        <use href="#flag-${c.id}" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="#FFFFFF" stroke-width="1.5" filter="url(#glowSmall)" />

        <g class="country-label-group">
          <text x="${textX}" y="${textY}" 
                font-family="'Inter', 'Segoe UI', sans-serif" 
                font-size="9.5" 
                font-weight="700" 
                fill="#FFFFFF" 
                text-anchor="${anchor}"
                filter="url(#textShadow)">
            ${c.name}
          </text>
        </g>
      </g>
    `;
  }).join('\n');

  container.innerHTML = `
    <svg viewBox="0 0 920 500" class="world-map-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mapOcean" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="50%" stop-color="#1E1B4B" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
        
        <linearGradient id="arcGradOrangeRed" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#EA580C" stop-opacity="0.95" />
          <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.75" />
        </linearGradient>

        <filter id="glowErode" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="glowSmall" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.9" />
        </filter>

        ${flagDefs}
      </defs>

      <rect width="920" height="500" rx="18" fill="url(#mapOcean)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" />

      <g stroke="rgba(255, 255, 255, 0.06)" stroke-width="1" stroke-dasharray="3 6">
        <line x1="0" y1="125" x2="920" y2="125" />
        <line x1="0" y1="250" x2="920" y2="250" />
        <line x1="0" y1="375" x2="920" y2="375" />
        <line x1="230" y1="0" x2="230" y2="500" />
        <line x1="460" y1="0" x2="460" y2="500" />
        <line x1="690" y1="0" x2="690" y2="500" />
      </g>

      <g fill="#1E293B" opacity="0.8" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1">
        <!-- North America & Canada -->
        <path d="M 100 80 Q 180 60, 250 90 T 270 170 T 210 230 T 130 210 T 80 130 Z" />
        <path d="M 210 220 Q 230 270, 220 310 T 190 290 Z" />

        <!-- South America -->
        <path d="M 230 250 Q 300 270, 310 350 T 260 430 T 220 360 T 210 280 Z" />

        <!-- Europe & Scandinavia -->
        <path d="M 420 80 Q 510 60, 530 130 T 470 180 T 400 135 Z" />
        <path d="M 480 65 Q 510 50, 525 95 T 485 110 Z" fill="#24334B" />

        <!-- Africa -->
        <path d="M 410 185 Q 510 175, 530 265 T 480 385 T 410 355 T 390 255 Z" />

        <!-- Asia -->
        <path d="M 520 80 Q 720 60, 800 130 T 820 250 T 710 280 T 600 210 T 530 130 Z" />
        
        <!-- Indian Subcontinent Peninsula (Highlight Origin Base) -->
        <path d="M 575 180 Q 640 180, 640 235 L 610 280 L 575 220 Z" fill="#2C3E5F" opacity="0.95" />

        <!-- Japan Archipelago -->
        <path d="M 795 140 Q 820 150, 810 180 T 790 190 Z" fill="#2E4366" />

        <!-- Southeast Asia & Indonesia Archipelago -->
        <path d="M 680 220 Q 730 215, 735 255 T 690 285 Z" fill="#24334B" />
        <path d="M 720 300 Q 770 305, 765 330 T 715 320 Z" fill="#24334B" />

        <!-- Australia -->
        <path d="M 730 310 Q 830 300, 840 375 T 740 410 T 700 355 Z" />
      </g>

      ${tradeArcs}
      ${countryNodes}

      <!-- Primary Origin Hub: ERODE, TAMIL NADU, INDIA -->
      <g transform="translate(${erodeX}, ${erodeY})">
        <circle cx="0" cy="0" r="22" fill="none" stroke="#EA580C" opacity="0.35">
          <animate attributeName="r" values="8;28" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="14" fill="none" stroke="#F59E0B" opacity="0.5">
          <animate attributeName="r" values="6;20" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.1" dur="1.8s" repeatCount="indefinite" />
        </circle>

        <!-- Indian Circular Flag as Origin Hub -->
        <circle cx="0" cy="0" r="10" fill="#FF9933" />
        <path d="M -10 -3.3 L 10 -3.3 L 10 3.3 L -10 3.3 Z" fill="#FFFFFF" />
        <path d="M -10 3.3 L 10 3.3 L 10 10 L -10 10 Z" fill="#128807" />
        <circle cx="0" cy="0" r="2.5" fill="#000088" />
        <circle cx="0" cy="0" r="10" fill="none" stroke="#FFFFFF" stroke-width="2" filter="url(#glowErode)" />

        <!-- Erode Callout positioned into Central/Western India / Arabian Sea to prevent hiding any countries -->
        <g transform="translate(-70, -35)">
          <line x1="35" y1="11" x2="70" y2="35" stroke="#EA580C" stroke-width="1.5" stroke-dasharray="2 2" />
          <rect x="-63" y="-11" width="126" height="22" rx="11" fill="#0F172A" stroke="#EA580C" stroke-width="1.8" filter="url(#textShadow)" />
          <text x="0" y="3.5" font-family="'Inter', sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.04em">
            ★ ERODE, TAMIL NADU
          </text>
        </g>
      </g>
    </svg>
  `;

  // Render the Country Badges Grid below the map with all 22 countries
  renderCountryGrid();
}

function renderCountryGrid() {
  const container = document.getElementById('global-countries-grid');
  if (!container) return;

  // Dynamically populate all 22 countries with circular flags
  container.innerHTML = SKE_GLOBAL_COUNTRIES.map((c, idx) => `
    <div class="global-country-chip" data-country-id="${c.id}">
      <div class="country-chip-flag-wrap">
        <svg viewBox="-11 -11 22 22" class="country-chip-flag-svg" width="28" height="28">
          ${getFlagInnerSvg(c.id)}
        </svg>
      </div>
      <div class="country-chip-info">
        <span class="country-chip-name">${idx + 1}. ${c.name}</span>
        <span class="country-chip-region">${c.region}</span>
      </div>
    </div>
  `).join('');

  const chips = container.querySelectorAll('.global-country-chip');
  chips.forEach(chip => {
    const countryId = chip.getAttribute('data-country-id');
    chip.addEventListener('mouseenter', () => {
      const node = document.querySelector(`.country-map-node[data-country="${countryId}"]`);
      const arc = document.querySelector(`.trade-arc-${countryId}`);
      if (node) {
        node.style.filter = 'drop-shadow(0 0 10px #F59E0B)';
      }
      if (arc) {
        arc.setAttribute('stroke-width', '3.5');
        arc.style.opacity = '1';
      }
    });

    chip.addEventListener('mouseleave', () => {
      const node = document.querySelector(`.country-map-node[data-country="${countryId}"]`);
      const arc = document.querySelector(`.trade-arc-${countryId}`);
      if (node) {
        node.style.filter = '';
      }
      if (arc) {
        arc.setAttribute('stroke-width', '2');
        arc.style.opacity = '0.85';
      }
    });
  });

  // Attach hover events directly to SVG country pins (highlight arc & glow, absolutely NO movement)
  const mapContainer = document.getElementById('global-map-canvas');
  if (mapContainer) {
    const mapNodes = mapContainer.querySelectorAll('.country-map-node');
    mapNodes.forEach(node => {
      const countryId = node.getAttribute('data-country');
      const arc = mapContainer.querySelector(`.trade-arc-${countryId}`);
      const correspondingChip = container.querySelector(`.global-country-chip[data-country-id="${countryId}"]`);

      node.addEventListener('mouseenter', () => {
        node.style.filter = 'drop-shadow(0 0 10px #F59E0B)';
        if (arc) {
          arc.setAttribute('stroke-width', '3.5');
          arc.style.opacity = '1';
        }
        if (correspondingChip) {
          correspondingChip.style.borderColor = '#F59E0B';
          correspondingChip.style.background = 'rgba(255, 255, 255, 0.18)';
        }
      });

      node.addEventListener('mouseleave', () => {
        node.style.filter = '';
        if (arc) {
          arc.setAttribute('stroke-width', '2');
          arc.style.opacity = '0.85';
        }
        if (correspondingChip) {
          correspondingChip.style.borderColor = '';
          correspondingChip.style.background = '';
        }
      });
    });
  }
}

window.initGlobalReachMap = initGlobalReachMap;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalReachMap);
} else {
  initGlobalReachMap();
}
