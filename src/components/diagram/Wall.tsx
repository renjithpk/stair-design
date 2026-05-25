import { useTransform } from '../../context/TransformContext';
import { FIXED } from '../../utils/defaults';

interface WallProps {
  x: number;
  yBottom: number;
  yTop: number;
  thickness?: number;
}

export function Wall({ x, yBottom, yTop, thickness = FIXED.extWallThick }: WallProps) {
  const { tx, ty } = useTransform();
  return (
    <rect
      x={tx(x)} y={ty(yTop)}
      width={tx(x + thickness) - tx(x)}
      height={ty(yBottom) - ty(yTop)}
      fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1.5}
    />
  );
}
