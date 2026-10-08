import { companyProfile } from '@/lib/data/masterBrief'

// A seven-segment gauge, one arc per GREATER outcome.
const CX = 200
const CY = 200
const R_OUT = 180
const R_IN = 118
const GAP = 1.6 // degrees between segments

function polar(r: number, deg: number) {
  const rad = (Math.PI / 180) * deg
  return [CX + r * Math.cos(rad), CY - r * Math.sin(rad)]
}

function arc(startDeg: number, endDeg: number) {
  const [x1, y1] = polar(R_OUT, startDeg)
  const [x2, y2] = polar(R_OUT, endDeg)
  const [x3, y3] = polar(R_IN, endDeg)
  const [x4, y4] = polar(R_IN, startDeg)
  return `M${x1} ${y1} A${R_OUT} ${R_OUT} 0 0 0 ${x2} ${y2} L${x3} ${y3} A${R_IN} ${R_IN} 0 0 1 ${x4} ${y4}Z`
}

const SHADES = ['#c9e9e2', '#a6dacf', '#7fc9b9', '#55b6a2', '#2ea48d', '#09947d', '#07705e']

export function GreaterDial() {
  const items = companyProfile.greaterFramework
  const step = 180 / items.length
  const needleDeg = 180 - step * 4.6 // pointing into "T"
  const [nx, ny] = polar(150, needleDeg)

  return (
    <figure className="w-full max-w-[520px] mx-auto">
      <svg
        viewBox="0 0 400 230"
        role="img"
        aria-label="A gauge with seven segments: Growth, Resilience, Efficiency, Agility, Thrivability, Engagement and Results"
        className="w-full h-auto"
      >
        {items.map((item, i) => {
          const start = 180 - i * step - GAP / 2
          const end = 180 - (i + 1) * step + GAP / 2
          const [lx, ly] = polar((R_OUT + R_IN) / 2, 180 - (i + 0.5) * step)
          return (
            <g key={`${item.key}-${i}`}>
              <path d={arc(start, end)} fill={SHADES[i]} />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-heading"
                fontWeight={700}
                fontSize={22}
                fill={i > 3 ? '#ffffff' : '#172624'}
              >
                {item.key}
              </text>
            </g>
          )
        })}
        <line x1={CX} y1={CY} x2={nx} y2={ny} stroke="#172624" strokeWidth={5} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={13} fill="#172624" />
        <circle cx={CX} cy={CY} r={5} fill="#ffffff" />
      </svg>
      <figcaption className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-body">
        {items.map((item, i) => (
          <span key={`${item.title}-${i}`}>
            <strong className="text-primary-deeper">{item.key}</strong>
            {item.title.slice(1)}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
