import { useTransform } from '../../context/TransformContext';

export function Grid() {
  const { tx, ty, bounds: { logicalMinX, logicalMaxX, logicalMinY, logicalMaxY } } = useTransform();
  const lines = [];

  for (let y = Math.floor(logicalMinY / 12) * 12; y <= logicalMaxY; y += 12) {
    lines.push(<line key={`h${y}`} x1={tx(logicalMinX)} y1={ty(y)} x2={tx(logicalMaxX)} y2={ty(y)} />);
  }
  for (let x = Math.floor(logicalMinX / 12) * 12; x <= logicalMaxX; x += 12) {
    lines.push(<line key={`v${x}`} x1={tx(x)} y1={ty(logicalMinY)} x2={tx(x)} y2={ty(logicalMaxY)} />);
  }

  return <g stroke="rgba(0,0,0,0.03)" strokeWidth={1}>{lines}</g>;
}
