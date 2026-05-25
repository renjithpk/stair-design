import { useTransform } from '../../context/TransformContext';

type DimensionLineBase = { value?: number; threshold?: number };
type DimensionLineProps =
  | ({ axis?: 'v'; x: number; y1: number; y2: number; label: string; side?: 'right' | 'left' } & DimensionLineBase)
  | ({ axis: 'h'; y: number; x1: number; x2: number; label: string; side?: 'above' | 'below' } & DimensionLineBase);

export function DimensionLine(props: DimensionLineProps) {
  const { tx, ty } = useTransform();
  const { value, threshold } = props;
  const color = value !== undefined && threshold !== undefined && value < threshold
    ? '#ef4444'
    : undefined;
  const strokeColor = color ?? 'rgba(0,0,0,0.3)';
  const textColor = color ?? 'rgba(0,0,0,0.8)';

  if (props.axis === 'h') {
    const { y, x1, x2, label, side = 'above' } = props;
    const svgX1 = tx(x1);
    const svgX2 = tx(x2);
    const svgY = ty(y);
    const midX = (svgX1 + svgX2) / 2;
    const labelY = side === 'above' ? svgY - 14 : svgY + 18;

    return (
      <g>
        <line x1={svgX1} y1={svgY} x2={svgX2} y2={svgY} stroke={strokeColor} strokeWidth={1} />
        <line x1={svgX1} y1={svgY - 4} x2={svgX1} y2={svgY + 4} stroke={strokeColor} strokeWidth={1} />
        <line x1={svgX2} y1={svgY - 4} x2={svgX2} y2={svgY + 4} stroke={strokeColor} strokeWidth={1} />
        <text x={midX} y={labelY} fill={textColor} fontSize={11} fontFamily="Outfit" fontWeight={500} textAnchor="middle" dominantBaseline="middle">
          {label}
        </text>
      </g>
    );
  }

  const { x, y1, y2, label, side = 'right' } = props;
  const svgX = tx(x);
  const svgY1 = ty(y1);
  const svgY2 = ty(y2);
  const midY = (svgY1 + svgY2) / 2;
  const labelX = side === 'right' ? svgX + 6 : svgX - 6;
  const anchor = side === 'right' ? 'start' : 'end';

  return (
    <g>
      <line x1={svgX} y1={svgY1} x2={svgX} y2={svgY2} stroke={strokeColor} strokeWidth={1} />
      <line x1={svgX - 4} y1={svgY1} x2={svgX + 4} y2={svgY1} stroke={strokeColor} strokeWidth={1} />
      <line x1={svgX - 4} y1={svgY2} x2={svgX + 4} y2={svgY2} stroke={strokeColor} strokeWidth={1} />
      <text x={labelX} y={midY} fill={textColor} fontSize={11} fontFamily="Outfit" fontWeight={500} textAnchor={anchor} dominantBaseline="middle">
        {label}
      </text>
    </g>
  );
}
