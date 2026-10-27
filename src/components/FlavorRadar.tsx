import type { DishProfile } from "@/lib/schemas";

const AXES = ["spicy", "sweet", "sour", "salty", "bitter", "umami"] as const;

// Feature 5: the flavor profile as a six-axis radar chart (scores 0 to 5).
export default function FlavorRadar({ flavor }: { flavor: DishProfile["flavor"] }) {
  const size = 240, c = size / 2, r = 80;
  const point = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
    return [c + Math.cos(a) * r * (v / 5), c + Math.sin(a) * r * (v / 5)];
  };
  const shape = AXES.map((k, i) => point(i, Math.max(0, Math.min(5, flavor[k]))).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-60" role="img" aria-label="Flavor profile">
      {[1, 2, 3, 4, 5].map((ring) => (
        <polygon
          key={ring}
          points={AXES.map((_, i) => point(i, ring).join(",")).join(" ")}
          fill="none"
          stroke="#e7e5e4"
        />
      ))}
      {AXES.map((k, i) => {
        const [x, y] = point(i, 5);
        const [lx, ly] = point(i, 6.3);
        return (
          <g key={k}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="#e7e5e4" />
            <text x={lx} y={ly + 4} textAnchor="middle" fontSize="11" fill="#57534e">
              {k} {flavor[k]}
            </text>
          </g>
        );
      })}
      <polygon points={shape} fill="#f97316" fillOpacity="0.25" stroke="#ea580c" strokeWidth="2" />
    </svg>
  );
}
