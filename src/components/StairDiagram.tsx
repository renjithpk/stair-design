import { useRef, useState, useEffect } from 'react';
import { TransformContext } from '../context/TransformContext';
import { calcTransform, type Geometry } from '../utils/geometry';
import { FIXED } from '../utils/defaults';
import { formatInches } from '../utils/format';
import { Grid } from './diagram/Grid';
import { GroundFill } from './diagram/GroundFill';
import { Slab } from './diagram/Slab';
import { Wall } from './diagram/Wall';
import { StairFlight } from './diagram/StairFlight';
import { Car } from './diagram/Car';
import { HeadroomIndicator } from './diagram/HeadroomIndicator';
import { DimensionLine } from './diagram/DimensionLine';
import { Label } from './diagram/Label';

interface StairDiagramProps {
  geo: Geometry;
  sidebarOpen: boolean;
  onShowSidebar: () => void;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.2;

interface Measurement { x1: number; y1: number; x2: number; y2: number }

export function StairDiagram({ geo, sidebarOpen, onShowSidebar }: StairDiagramProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [measuring, setMeasuring] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [active, setActive] = useState<Measurement | null>(null);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Scroll to bottom whenever zoom changes to keep the ground pinned
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }, [zoom, size]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.001)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  function getSvgPoint(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (!measuring) return;
    e.preventDefault();
    const { x, y } = getSvgPoint(e);
    setActive({ x1: x, y1: y, x2: x, y2: y });
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!measuring || !active) return;
    const { x, y } = getSvgPoint(e);
    setActive(a => a ? { ...a, x2: x, y2: y } : null);
  }

  function handleMouseUp(e: React.MouseEvent<SVGSVGElement>) {
    if (!measuring || !active) return;
    const { x, y } = getSvgPoint(e);
    const committed = { ...active, x2: x, y2: y };
    const dx = Math.abs(committed.x2 - committed.x1);
    const dy = Math.abs(committed.y2 - committed.y1);
    const dominantPx = Math.max(dx, dy);
    if (dominantPx / transform.scale > 2) setMeasurements(ms => [...ms, committed]);
    setActive(null);
  }

  const transform = calcTransform(size.width, size.height, geo, zoom);
  const {
    plinthH, mezzSlab, mezzClearIn, mezzTop, ffTop,
    mezzToFFIn,
    steps1, actualRiser1, L1,
    steps2, actualRiser2, L2,
    headroom, headroomX, headroomY1, headroomY2,
    targetTread, ffWallTop,
    mainDoorWallX, bathroomWallX, bedroomWallX, outerBackWallX, gfDiningWallX, gfBathroomWallX,
    gfBathroomW, gfDiningW,
    carX, carLengthIn, carHeight,
    compoundWallFrontX, compoundWallFrontInnerX, compoundWallBackX, compoundWallH, outerBackWallRightX,
    mezzBalconyWallX, mezzFloorWallX,
    entryStartX,
    stair1XOffset, stair2XOffset,
  } = geo;

  return (
    <div className="canvas-wrapper">
      {!sidebarOpen && (
        <button className="show-sidebar-btn" onClick={onShowSidebar}>‹ Show controls</button>
      )}
      <div className="bottom-toolbar">
        <button
          className={measuring ? 'active' : ''}
          onClick={() => { setMeasuring(m => !m); setActive(null); }}
          title="Toggle measure mode"
        >⟷ {measuring ? 'Stop measuring' : 'Measure'}</button>
        {measurements.length > 0 && (
          <button onClick={() => setMeasurements([])} title="Clear all measurements">Clear all</button>
        )}
        <div className="toolbar-divider" />
        <button onClick={() => setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP))} title="Zoom in">+</button>
        <span className="zoom-label">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.max(MIN_ZOOM, z - ZOOM_STEP))} title="Zoom out">−</button>
        <button onClick={() => setZoom(1)} title="Reset zoom">↺</button>
      </div>
      <div className="badge">Interactive Cross-Section</div>
      <div ref={areaRef} className="canvas-area">
      <TransformContext.Provider value={transform}>
        <svg
          width={transform.svgWidth}
          height={transform.svgHeight}
          style={{ cursor: measuring ? 'crosshair' : undefined }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Grid />
          <GroundFill geo={geo} />

          <Slab x1={mezzBalconyWallX} x2={Math.max(stair2XOffset, 0)} yBottom={mezzClearIn} yTop={mezzTop} />
          <Wall x={mezzBalconyWallX} yBottom={mezzTop} yTop={mezzTop + 48} />
          <Wall x={mezzFloorWallX} yBottom={mezzTop} yTop={ffWallTop} />
          <Wall x={mainDoorWallX} yBottom={0} yTop={mezzClearIn} />
          <Slab x1={stair2XOffset + L2} x2={outerBackWallRightX} yBottom={ffTop - mezzSlab} yTop={ffTop} />
          <Slab x1={mezzBalconyWallX} x2={outerBackWallRightX} yBottom={ffWallTop} yTop={ffWallTop + mezzSlab} />

          {/* First floor internal walls */}
          <Wall x={bathroomWallX}  yBottom={ffTop} yTop={ffWallTop} thickness={FIXED.intWallThick} />
          <Wall x={bedroomWallX}   yBottom={ffTop} yTop={ffWallTop} thickness={FIXED.intWallThick} />
          <Wall x={outerBackWallX} yBottom={0}     yTop={ffWallTop} />

          {/* Compound boundary walls — fixed 50 ft plot, 4 ft high, 4 in thick, at ground level */}
          <Wall x={compoundWallFrontX} yBottom={-plinthH} yTop={-plinthH + compoundWallH} thickness={4} />
          <Wall x={compoundWallBackX}  yBottom={-plinthH} yTop={-plinthH + compoundWallH} thickness={4} />

          {/* Ground floor partition walls — behind stairs */}
          <Wall x={gfDiningWallX}   yBottom={0} yTop={ffTop - mezzSlab} thickness={FIXED.intWallThick} />
          <Wall x={gfBathroomWallX} yBottom={0} yTop={ffTop - mezzSlab} thickness={FIXED.intWallThick} />

          <Car cx={carX} plinthH={plinthH} carLength={carLengthIn} carHeight={carHeight} />

          <StairFlight startX={L1 + stair1XOffset} startY={0} steps={steps1} riserH={actualRiser1} treadW={targetTread} dir={-1} />
          <StairFlight startX={stair2XOffset} startY={mezzTop} steps={steps2} riserH={actualRiser2} treadW={targetTread} dir={1} />

          <HeadroomIndicator headroom={headroom} headroomX={headroomX} headroomY1={headroomY1} headroomY2={headroomY2} />

          {/* Inline stair labels */}
          <Label x={L1 / 2} y={mezzTop / 2 + 12} text={`${steps1} steps @ ${actualRiser1.toFixed(1)}″`} anchor="middle" fontSize={11} />
          <Label x={L2 / 2} y={mezzTop + mezzToFFIn / 2 + 12} text={`${steps2} steps @ ${actualRiser2.toFixed(1)}″`} anchor="middle" fontSize={11} />

          {/* Vertical left — parking clear height */}
          <DimensionLine x={compoundWallFrontX - 12} y1={-plinthH} y2={mezzClearIn} label={`Parking ht: ${formatInches(plinthH + mezzClearIn)}`} side="left" />

          {/* Entrance height — ground level to mezzanine ceiling, at front door */}
          <DimensionLine x={mainDoorWallX - 12} y1={0} y2={mezzClearIn} label={`Entry ht: ${formatInches(mezzClearIn)}`} side="left" value={mezzClearIn} threshold={FIXED.entryHeightMin} />

          {/* Vertical — heights after flight 1 */}
          <DimensionLine x={L1 + stair1XOffset + 48} y1={0} y2={ffTop - mezzSlab} label={`GF clear ht: ${formatInches(ffTop - mezzSlab)}`} side="right" />

          {/* Mezz→FF stacked above Entry ht, same column */}
          <DimensionLine x={mainDoorWallX - 12} y1={mezzTop} y2={ffTop} label={`Mezz→FF: ${formatInches(mezzToFFIn)}`} side="left" />

          {/* Ground floor room widths */}
          <DimensionLine axis="h" y={-18} x1={gfBathroomWallX + FIXED.intWallThick} x2={gfDiningWallX} label={`GF Bath: ${formatInches(gfBathroomW)}`} />
          <DimensionLine axis="h" y={-18} x1={gfDiningWallX + FIXED.intWallThick} x2={outerBackWallX} label={`Dining: ${formatInches(gfDiningW)}`} />

          {/* Horizontal bottom stack */}
          <DimensionLine axis="h" y={-plinthH - 18} x1={compoundWallFrontInnerX} x2={entryStartX} label={formatInches(entryStartX - compoundWallFrontInnerX)} />
          <DimensionLine axis="h" y={-6} x1={stair1XOffset} x2={stair1XOffset + L1} label={`Flt1: ${formatInches(L1)}`} />
          <DimensionLine axis="h" y={-plinthH + compoundWallH + 6} x1={outerBackWallRightX} x2={compoundWallBackX + 4} label={`Back setback: ${formatInches(compoundWallBackX + 4 - outerBackWallRightX)}`} side="above" />

          {/* Horizontal top stack — flight 2 run */}
          <DimensionLine axis="h" y={ffTop + 20} x1={stair2XOffset} x2={stair2XOffset + L2} label={`Flt2 run: ${formatInches(L2)}`} side="above" />

          {/* Horizontal top stack — first floor room widths (clear interior spans) */}
          <DimensionLine axis="h" y={ffTop + 44} x1={stair2XOffset + L2} x2={bathroomWallX} label={`Landing: ${formatInches(bathroomWallX - (stair2XOffset + L2))}`} value={bathroomWallX - (stair2XOffset + L2)} threshold={FIXED.landingMin} />
          <DimensionLine axis="h" y={ffTop + 44} x1={bathroomWallX + FIXED.intWallThick} x2={bedroomWallX} label={`Bath: ${formatInches(bedroomWallX - bathroomWallX - FIXED.intWallThick)}`} value={bedroomWallX - bathroomWallX - FIXED.intWallThick} threshold={FIXED.bathroomWidthMin} />
          <DimensionLine axis="h" y={ffTop + 44} x1={bedroomWallX + FIXED.intWallThick} x2={outerBackWallX} label={`Bed: ${formatInches(outerBackWallX - bedroomWallX - FIXED.intWallThick)}`} value={outerBackWallX - bedroomWallX - FIXED.intWallThick} threshold={FIXED.bedroomWidthMin} />


          <Label x={-180} y={mezzTop + 15} text="MEZZANINE FLOOR" />
          <Label x={stair2XOffset + L2 + 20} y={ffTop + 15} text="FIRST FLOOR" />

          {/* Ground floor room labels */}
          <Label x={(gfBathroomWallX + FIXED.intWallThick + gfDiningWallX) / 2} y={(ffTop - mezzSlab) / 2} text="BATHROOM" anchor="middle" fontSize={10} />
          <Label x={(gfBathroomWallX + FIXED.intWallThick + gfDiningWallX) / 2} y={(ffTop - mezzSlab) / 2 + 14} text="(ext. door)" anchor="middle" fontSize={9} />
          <Label x={(gfDiningWallX + FIXED.intWallThick + outerBackWallX) / 2} y={(ffTop - mezzSlab) / 2} text="DINING AREA" anchor="middle" fontSize={10} />

          {/* Measurement overlays — snapped to dominant axis */}
          {[...measurements.map((m, i) => ({ m, i, isActive: false })),
            ...(active ? [{ m: active, i: -1, isActive: true }] : [])
          ].map(({ m, i, isActive }) => {
            const dx = Math.abs(m.x2 - m.x1);
            const dy = Math.abs(m.y2 - m.y1);
            const isHorizontal = dx >= dy;
            const dist = (isHorizontal ? dx : dy) / transform.scale;
            const TICK = 6;
            // Snap end point to the dominant axis
            const ex = isHorizontal ? m.x2 : m.x1;
            const ey = isHorizontal ? m.y1 : m.y2;
            const mx = (m.x1 + ex) / 2;
            const my = (m.y1 + ey) / 2;
            const textX = isHorizontal ? mx : ex + 36;
            const textY = isHorizontal ? m.y1 - 10 : my + 4;
            return (
              <g key={isActive ? 'active' : i} style={{ pointerEvents: isActive ? 'none' : 'auto' }}>
                {dist > 0.5 && <>
                  <line x1={m.x1} y1={m.y1} x2={ex} y2={ey} stroke="rgba(0,0,0,0.25)" strokeWidth={1} strokeDasharray="4 3" />
                  {/* start tick */}
                  {isHorizontal
                    ? <line x1={m.x1} y1={m.y1 - TICK} x2={m.x1} y2={m.y1 + TICK} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                    : <line x1={m.x1 - TICK} y1={m.y1} x2={m.x1 + TICK} y2={m.y1} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                  }
                  {/* end tick */}
                  {isHorizontal
                    ? <line x1={ex} y1={ey - TICK} x2={ex} y2={ey + TICK} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                    : <line x1={ex - TICK} y1={ey} x2={ex + TICK} y2={ey} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                  }
                  <text x={textX} y={textY} textAnchor="middle" fill="#b45309" fontSize={11} fontFamily="Outfit" fontWeight={600}>
                    {formatInches(dist)}
                  </text>
                </>}
                {/* Delete button — sits just to the right of the label */}
                {!isActive && dist > 0.5 && (
                  <g style={{ cursor: 'pointer' }} onClick={() => setMeasurements(ms => ms.filter((_, idx) => idx !== i))}>
                    <circle cx={textX + 32} cy={textY - 4} r={5} fill="rgba(0,0,0,0.15)" />
                    <text x={textX + 32} y={textY - 1} textAnchor="middle" fill="rgba(0,0,0,0.5)" fontSize={9} fontFamily="Outfit">×</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </TransformContext.Provider>
      </div>
    </div>
  );
}
