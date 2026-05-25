import { FIXED, type Config } from '../utils/defaults';
import { type Geometry } from '../utils/geometry';

interface FixedChipProps {
  label: string;
  value: string;
}

function FixedChip({ label, value }: FixedChipProps) {
  return (
    <div className="fixed-chip">
      <span className="fixed-chip-label">{label}</span>
      <span className="fixed-chip-value">{value}</span>
    </div>
  );
}

interface RowProps {
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  readOnly?: boolean;
}

function Row({ label, id, value, onChange, step = 1, min = 0, readOnly = false }: RowProps) {
  return (
    <div className="sidebar-row">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        value={value}
        step={step}
        min={min}
        readOnly={readOnly}
        onChange={e => !readOnly && onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}

interface SidebarProps {
  config: Config;
  onChange: (config: Config) => void;
  geo: Geometry;
  open: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function Sidebar({ config, onChange, geo, open, onToggle, onReset }: SidebarProps) {
  const set = (key: keyof Config) => (val: number) => onChange({ ...config, [key]: val });

  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ' sidebar--collapsed'}`}>
      <button className="sidebar-toggle" onClick={onToggle} title={open ? 'Hide controls' : 'Show controls'}>
        {open ? '‹' : '›'}
      </button>

      {open && (
        <div className="sidebar-content">
          <header className="sidebar-header">
            <h1>Stair Design</h1>
          </header>

          <details open>
            <summary>Fixed Constraints</summary>
            <div className="fixed-chips">
              <FixedChip label="Plinth" value={`${FIXED.plinth} ft`} />
              <FixedChip label="Entry rise" value={`${FIXED.entryStepRise}"`} />
<FixedChip label="Plot width" value={`${FIXED.plotWidth} ft`} />
              <FixedChip label="Rear setback" value={`${FIXED.rearSetback} ft`} />
            </div>
          </details>

          <details open>
            <summary>Floor Heights</summary>
            <Row label="Mezzanine clear (ft)" id="mezz-clear" value={config.mezzClear} step={0.5} onChange={set('mezzClear')} />
            <Row label="Ground floor clear (ft)" id="gf-clear" value={config.gfClear} step={0.5} onChange={set('gfClear')} />
            <Row label="First floor clear (ft)" id="ff-clear" value={config.ffClear} step={0.5} onChange={set('ffClear')} />
            <Row label="Slab thickness (in)" id="slab-thick" value={config.slabThick} step={1} onChange={set('slabThick')} />
          </details>

          <details open>
            <summary>Parking-Side Entry</summary>
<Row label="Front door depth (ft)" id="front-door-depth" value={config.frontDoorDepth} step={0.5} min={8} onChange={set('frontDoorDepth')} />
            <Row label="Landing depth (in)" id="landing" value={config.landingDepth} step={6} onChange={set('landingDepth')} />
            <Row label="Car length (m)" id="car-length" value={config.carLength} step={0.1} onChange={set('carLength')} />
          </details>

          <details open>
            <summary>Mezzanine Walls</summary>
            <Row label="Balcony wall offset from compound (in)" id="mezz-balcony-offset" value={config.mezzBalconyWallOffset} step={1} min={0} onChange={set('mezzBalconyWallOffset')} />
            <Row label="Floor wall offset from balcony (ft)" id="mezz-floor-offset" value={config.mezzFloorWallOffset / 12} step={0.5} min={1} onChange={v => set('mezzFloorWallOffset')(v * 12)} />
          </details>

          <details open>
            <summary>Ground Floor Layout</summary>
            <Row label="GF Bathroom width (ft)" id="gf-bathroom-w" value={config.gfBathroomW / 12} step={0.5} min={2} onChange={v => set('gfBathroomW')(v * 12)} />
            <Row label="GF Dining width (ft)" id="gf-dining-w" value={config.gfDiningW / 12} step={0.5} min={4} onChange={v => set('gfDiningW')(v * 12)} />
          </details>

          <details open>
            <summary>First Floor Layout</summary>
            <Row label="Bathroom width (ft)" id="bathroom-w" value={config.bathroomW / 12} step={0.5} min={2} onChange={v => set('bathroomW')(v * 12)} />
            <Row label="Bedroom width (ft)" id="bedroom-w" value={config.bedroomW / 12} step={0.5} min={5} onChange={v => set('bedroomW')(v * 12)} />
          </details>

          <details open>
            <summary>Stairs</summary>
            <Row label="Target riser (in)" id="riser" value={config.targetRiser} step={0.5} onChange={set('targetRiser')} />
            <Row label="Target tread (in)" id="tread" value={config.targetTread} step={0.5} onChange={set('targetTread')} />
            <Row label="Stair 1 X-offset (in)" id="s1-offset" value={config.stair1XOffset} step={6} min={-120} onChange={set('stair1XOffset')} />
            <Row label="Stair 2 X-offset (in)" id="s2-offset" value={config.stair2XOffset} step={6} min={-120} onChange={set('stair2XOffset')} />
          </details>

          <button className="reset-btn" onClick={onReset}>Reset to defaults</button>
        </div>
      )}
    </aside>
  );
}
