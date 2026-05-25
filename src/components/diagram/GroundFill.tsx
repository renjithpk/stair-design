import { useTransform } from '../../context/TransformContext';
import { type Geometry } from '../../utils/geometry';

interface GroundFillProps {
  geo: Geometry;
}

export function GroundFill({ geo }: GroundFillProps) {
  const { tx, ty, bounds: { logicalMinX, logicalMinY } } = useTransform();
  const { plinthH, entrySteps, entryRiser, entryStartX, entryEndX, targetTread, outerBackWallX, outerBackWallRightX, compoundWallBackX } = geo;

  const pts: [number, number][] = [[logicalMinX, -plinthH], [entryStartX, -plinthH]];
  for (let i = 1; i <= entrySteps; i++) {
    pts.push([entryStartX + (i - 1) * targetTread, -plinthH + i * entryRiser]);
    pts.push([entryStartX + i * targetTread, -plinthH + i * entryRiser]);
  }
  // plinth level ends at outer back wall outer face — drop vertically to road level, continue to compound wall
  pts.push([outerBackWallRightX + 2, 0]);
  pts.push([outerBackWallRightX + 2, -plinthH]);
  pts.push([compoundWallBackX, -plinthH]);
  const lineD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${tx(x)} ${ty(y)}`).join(' ');
  // Soil only: the band strictly below plinth/road level (parking area)
  const soilD = `M ${tx(logicalMinX)} ${ty(-plinthH)} L ${tx(compoundWallBackX)} ${ty(-plinthH)} L ${tx(compoundWallBackX)} ${ty(logicalMinY)} L ${tx(logicalMinX)} ${ty(logicalMinY)} Z`;
  // Steps/above-soil area closed with plinth color
  const stepFillD = `${lineD} Z`;

  return (
    <g>
      <path d={soilD} fill="#c4956a" stroke="none" />
      <path d={stepFillD} fill="#e2e8f0" stroke="none" />
      <rect
        x={tx(entryEndX)} y={ty(0)}
        width={tx(outerBackWallRightX) - tx(entryEndX)}
        height={ty(-plinthH) - ty(0)}
        fill="#e2e8f0"
      />
      <path d={lineD} fill="none" stroke="#8b5e3c" strokeWidth={2} />
    </g>
  );
}
