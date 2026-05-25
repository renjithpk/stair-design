import { useTransform } from '../../context/TransformContext';
import { FIXED } from '../../utils/defaults';

interface StairFlightProps {
  startX: number;
  startY: number;
  steps: number;
  riserH: number;
  treadW: number;
  dir: 1 | -1;
}

export function StairFlight({ startX, startY, steps, riserH, treadW, dir }: StairFlightProps) {
  const { tx, ty } = useTransform();
  const thick = FIXED.stairSubstrateThick;

  let d = `M ${tx(startX)} ${ty(startY)}`;
  for (let i = 1; i <= steps; i++) {
    const curX = startX + dir * (i - 1) * treadW;
    const curY = startY + i * riserH;
    d += ` L ${tx(curX)} ${ty(curY)}`;
    if (i < steps) {
      d += ` L ${tx(startX + dir * i * treadW)} ${ty(curY)}`;
    }
  }
  const endX = startX + dir * (steps - 1) * treadW;
  const endY = startY + steps * riserH;
  const intersectX = startX - dir * treadW + dir * thick * (treadW / riserH);
  d += ` L ${tx(endX)} ${ty(endY - thick)} L ${tx(intersectX)} ${ty(startY)} Z`;

  const treads = [];
  for (let i = 1; i < steps; i++) {
    const curX = startX + dir * (i - 1) * treadW;
    const nextX = startX + dir * i * treadW;
    const curY = startY + i * riserH;
    const tLeft = Math.min(tx(curX), tx(nextX));
    const tWidth = Math.abs(tx(nextX) - tx(curX));
    const overhang = dir < 0 ? 4 : 0;
    treads.push(
      <rect
        key={i}
        x={tLeft - overhang} y={ty(curY)}
        width={tWidth + 4} height={ty(curY - FIXED.treadThick) - ty(curY)}
        fill="#b45309"
      />
    );
  }

  return (
    <g>
      <path d={d} fill="#ffffff" stroke="#cbd5e1" strokeWidth={1} />
      {treads}
    </g>
  );
}
