import { useTransform } from '../../context/TransformContext';

// Internal sedan silhouette — normalized to a 100×35 unit bounding box.
// Scaled at render time to match carLengthIn × carHeight from Dimensions.
const BODY_NORM = [
  [0,    8], [-10, 20], [15, 35],
  [65,  35], [ 90, 20], [100,  8],
] as const;
const FRONT_WHEEL_NORM = [15, 8] as const;
const REAR_WHEEL_NORM  = [75, 8] as const;
const NORM_W = 100;
const NORM_H = 35;
const WHEEL_RADIUS_NORM = 8; // as fraction of norm box height

interface CarProps {
  cx: number;       // front-left x of car (in), from Dimensions.carX
  plinthH: number;
  carLength: number; // in, from Dimensions.carLengthIn
  carHeight: number; // in, from Dimensions.carHeight
}

export function Car({ cx, plinthH, carLength, carHeight }: CarProps) {
  const { tx, ty, scale } = useTransform();
  const carY = -plinthH;
  const sx = carLength / NORM_W;
  const sy = carHeight / NORM_H;

  const pts = BODY_NORM
    .map(([nx, ny]) => `${tx(cx + nx * sx)},${ty(carY + ny * sy)}`)
    .join(' ');

  const wheelR = WHEEL_RADIUS_NORM * sy * scale;

  return (
    <g stroke="rgba(0,0,0,0.3)" strokeWidth={2} fill="none">
      <polygon points={pts} />
      <circle cx={tx(cx + FRONT_WHEEL_NORM[0] * sx)} cy={ty(carY + FRONT_WHEEL_NORM[1] * sy)} r={wheelR} />
      <circle cx={tx(cx + REAR_WHEEL_NORM[0]  * sx)} cy={ty(carY + REAR_WHEEL_NORM[1]  * sy)} r={wheelR} />
    </g>
  );
}
