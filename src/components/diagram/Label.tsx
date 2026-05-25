import { useTransform } from '../../context/TransformContext';

interface LabelProps {
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}

export function Label({ x, y, text, fontSize = 13, fontWeight = 600, color = 'rgba(0,0,0,0.6)', anchor = 'start' }: LabelProps) {
  const { tx, ty } = useTransform();
  return (
    <text
      x={tx(x)} y={ty(y)}
      fill={color} fontSize={fontSize} fontFamily="Outfit"
      fontWeight={fontWeight} textAnchor={anchor}
      dominantBaseline="alphabetic"
      className="diagram-label"
    >
      {text}
    </text>
  );
}
