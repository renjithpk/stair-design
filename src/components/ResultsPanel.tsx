import { formatInches } from '../utils/format';
import { type Geometry } from '../utils/geometry';

interface ResultRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function ResultRow({ label, value, highlight }: ResultRowProps) {
  return (
    <div className="result-row">
      <span className="result-label">{label}</span>
      <span className={`result-value${highlight ? ' highlight-blue' : ''}`}>{value}</span>
    </div>
  );
}

interface ResultsPanelProps {
  geo: Geometry;
}

export function ResultsPanel({ geo }: ResultsPanelProps) {
  const { plinthH: _plinthH, mezzSlab: _mezzSlab, mezzClearIn: _mezzClearIn, ffTop, steps1, actualRiser1, L1, steps2, actualRiser2, L2, headroom } = geo;
  const gfTotal = ffTop;
  const headroomClass = headroom >= 96 ? 'safe' : headroom >= 84 ? 'warning' : '';

  return (
    <div className="results-panel">
      <ResultRow label="Ground Floor Total" value={formatInches(gfTotal)} />
      <ResultRow label="Flight 1 (To Mezzanine)" value={`${steps1} steps @ ${actualRiser1.toFixed(1)}"`} highlight />
      <ResultRow label="Flight 1 Length" value={formatInches(L1)} />
      <ResultRow label="Flight 2 (To First Floor)" value={`${steps2} steps @ ${actualRiser2.toFixed(1)}"`} highlight />
      <ResultRow label="Flight 2 Length" value={formatInches(L2)} />
      <div className={`headroom-box${headroomClass ? ' ' + headroomClass : ''}`}>
        <span className="headroom-label">Min Headroom</span>
        <span className="headroom-val">{formatInches(headroom)}</span>
      </div>
    </div>
  );
}
