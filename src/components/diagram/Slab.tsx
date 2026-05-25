import { useTransform } from '../../context/TransformContext';

interface SlabProps {
  x1: number;
  x2: number;
  yBottom: number;
  yTop: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export function Slab({ x1, x2, yBottom, yTop, fill = '#f8fafc', stroke = '#cbd5e1', strokeWidth = 2 }: SlabProps) {
  const { tx, ty } = useTransform();
  if (x2 <= x1) return null;
  return (
    <rect
      x={tx(x1)} y={ty(yTop)}
      width={tx(x2) - tx(x1)}
      height={ty(yBottom) - ty(yTop)}
      fill={fill} stroke={stroke} strokeWidth={strokeWidth}
    />
  );
}
