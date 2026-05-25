import { useTransform } from '../../context/TransformContext';
import { formatInches } from '../../utils/format';
import { FIXED } from '../../utils/defaults';

interface HeadroomIndicatorProps {
  headroom: number;
  headroomX: number;
  headroomY1: number;
  headroomY2: number;
}

export function HeadroomIndicator({ headroom, headroomX, headroomY1, headroomY2 }: HeadroomIndicatorProps) {
  const { tx, ty } = useTransform();
  if (headroom <= 0 || headroomY2 <= headroomY1) return null;

  const color = headroom >= FIXED.headroomTarget ? '#10b981' : headroom >= FIXED.headroomMin ? '#eab308' : '#f43f5e';
  const x = tx(headroomX + 5);
  const sy1 = ty(headroomY1);
  const sy2 = ty(headroomY2);
  const midY = (sy1 + sy2) / 2;

  return (
    <g>
      <line x1={x} y1={sy1} x2={x} y2={sy2} stroke={color} strokeWidth={2} strokeDasharray="5,5" />
      <polygon points={`${x},${sy1} ${x - 4},${sy1 - 6} ${x + 4},${sy1 - 6}`} fill={color} />
      <polygon points={`${x},${sy2} ${x - 4},${sy2 + 6} ${x + 4},${sy2 + 6}`} fill={color} />
      <text x={x + 10} y={midY} fill={color} fontSize={14} fontFamily="Outfit" fontWeight={600} dominantBaseline="middle">
        Headroom: {formatInches(headroom)}
      </text>
    </g>
  );
}
