interface InputGroupProps {
  label: string;
  unit?: string;
  id: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
  full?: boolean;
}

export function InputGroup({ label, unit, id, value, step = 0.1, onChange, full = false }: InputGroupProps) {
  return (
    <div className={`input-group${full ? ' full' : ''}`}>
      <label htmlFor={id}>
        {label} {unit && <span>({unit})</span>}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}
