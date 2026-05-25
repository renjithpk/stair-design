import { Dimensions } from './Dimensions';
import { FIXED, type Config } from './defaults';

export interface Geometry {
  plinthH: number;
  mezzSlab: number;
  mezzClearIn: number;
  gfClearIn: number;
  mezzToFFIn: number;
  targetTread: number;
  targetRiser: number;
  mezzTop: number;
  ffTop: number;
  steps1: number;
  actualRiser1: number;
  L1: number;
  steps2: number;
  actualRiser2: number;
  L2: number;
  entrySteps: number;
  entryRiser: number;
  headroom: number;
  firstFloorH: number;
  ffWallTop: number;
  mezzFloorWallH: number;
  mainDoorWallX: number;
  carX: number;
  carLengthIn: number;
  carHeight: number;
  entryEndX: number;
  entryStartX: number;
  headroomX: number;
  headroomY1: number;
  headroomY2: number;
  bathroomWallX: number;
  bedroomWallX: number;
  outerBackWallX: number;
  gfDiningWallX: number;
  gfBathroomWallX: number;
  gfBathroomW: number;
  gfDiningW: number;
  compoundWallFrontX: number;
  compoundWallFrontInnerX: number;
  compoundWallBackX: number;
  compoundWallH: number;
  outerBackWallRightX: number;
  mezzBalconyWallX: number;
  mezzFloorWallX: number;
  stair1XOffset: number;
  stair2XOffset: number;
}

export interface Transform {
  tx: (x: number) => number;
  ty: (y: number) => number;
  scale: number;
  svgWidth: number;
  svgHeight: number;
  bounds: {
    logicalMinX: number;
    logicalMaxX: number;
    logicalMinY: number;
    logicalMaxY: number;
  };
}

export function calcGeometry(config: Config): Geometry {
  const dim = new Dimensions(config);

  const entryEndX = dim.mainDoorWallX;
  const entryStartX = entryEndX - dim.entrySteps * dim.entryTread;

  let headroomX = 0, headroomY1 = 0, headroomY2 = 0;
  const xEdge = config.stair2XOffset + dim.L2;
  const stair1StartX = config.stair1XOffset;
  const stair1EndX = dim.L1 + config.stair1XOffset;
  if (xEdge <= stair1EndX && xEdge >= stair1StartX) {
    const treadNum = Math.floor((stair1EndX - xEdge) / dim.targetTread);
    headroomX = xEdge;
    headroomY1 = (treadNum + 1) * dim.actualRiser1;
    headroomY2 = dim.ffTop - dim.mezzSlab;
  } else if (xEdge > stair1EndX) {
    headroomX = stair1EndX / 2;
    headroomY1 = 0;
    headroomY2 = dim.ffTop - dim.mezzSlab;
  }

  return {
    plinthH: dim.plinthH,
    mezzSlab: dim.mezzSlab,
    mezzClearIn: dim.mezzClearIn,
    gfClearIn: dim.gfClearIn,
    mezzToFFIn: dim.mezzToFF,
    targetTread: dim.targetTread,
    targetRiser: dim.targetRiser,
    mezzTop: dim.mezzTop,
    ffTop: dim.ffTop,
    steps1: dim.steps1,
    actualRiser1: dim.actualRiser1,
    L1: dim.L1,
    steps2: dim.steps2,
    actualRiser2: dim.actualRiser2,
    L2: dim.L2,
    entrySteps: dim.entrySteps,
    entryRiser: dim.entryRiser,
    headroom: headroomY2 - headroomY1,
    firstFloorH: dim.firstFloorH,
    ffWallTop: dim.ffWallTop,
    mezzFloorWallH: dim.mezzFloorWallH,
    mainDoorWallX: dim.mainDoorWallX,
    carX: dim.carX,
    carLengthIn: dim.carLengthIn,
    carHeight: dim.carHeight,
    entryEndX,
    entryStartX,
    headroomX,
    headroomY1,
    headroomY2,
    bathroomWallX: dim.bathroomWallX,
    bedroomWallX: dim.bedroomWallX,
    outerBackWallX: dim.outerBackWallX,
    gfDiningWallX: dim.gfDiningWallX,
    gfBathroomWallX: dim.gfBathroomWallX,
    gfBathroomW: config.gfBathroomW,
    gfDiningW: config.gfDiningW,
    compoundWallFrontX: dim.compoundWallFrontX,
    compoundWallFrontInnerX: dim.compoundWallFrontInnerX,
    compoundWallBackX: dim.compoundWallBackX,
    compoundWallH: dim.compoundWallH,
    outerBackWallRightX: dim.outerBackWallX + FIXED.extWallThick,
    mezzBalconyWallX: dim.mezzBalconyWallX,
    mezzFloorWallX: dim.mezzFloorWallX,
    stair1XOffset: config.stair1XOffset,
    stair2XOffset: config.stair2XOffset,
  };
}

const BASE_SCALE = 4; // px per inch at zoom 1
const H_PADDING = 80; // px, SVG horizontal margin inside which no geometry is drawn
const V_PADDING = 80; // px, SVG vertical margin

// Logical canvas bounds (inches). Left edge must clear car + parking area (~18 ft left of x=0).
const CANVAS_LEFT   = -220; // in — enough room for car, parking landing, and entry steps
const CANVAS_RIGHT_MARGIN_STAIR = 80;  // in — breathing room past end of flight 1
const CANVAS_RIGHT_MARGIN_WALL  = 40;  // in — breathing room past outer back wall
const CANVAS_BOTTOM_MARGIN = 24; // in — below plinth grade
const CANVAS_TOP_MARGIN    = 80; // in — above first floor ceiling slab

export function calcTransform(_svgWidth: number, containerHeight: number, geo: Geometry, zoom = 1): Transform {
  const logicalMinX = Math.min(CANVAS_LEFT, geo.compoundWallFrontX - 40);
  const logicalMaxX = Math.max(geo.L1 + CANVAS_RIGHT_MARGIN_STAIR, geo.outerBackWallX + CANVAS_RIGHT_MARGIN_WALL, geo.compoundWallBackX + FIXED.intWallThick + 40);
  const logicalMinY = -geo.plinthH - CANVAS_BOTTOM_MARGIN;
  const logicalMaxY = geo.ffWallTop + CANVAS_TOP_MARGIN;

  const scale = BASE_SCALE * zoom;
  const contentW = (logicalMaxX - logicalMinX) * scale;
  const contentH = (logicalMaxY - logicalMinY) * scale;

  // SVG is at least as tall as the container; grows with zoom so vertical scroll activates when zoomed in
  const fixedSvgWidth = contentW + H_PADDING * 2;
  const fixedSvgHeight = Math.max(containerHeight, contentH + V_PADDING * 2);
  const offsetX = H_PADDING - logicalMinX * scale;
  // logicalMinY (ground bottom) maps to fixedSvgHeight - V_PADDING
  const offsetY = fixedSvgHeight - V_PADDING + logicalMinY * scale;

  return {
    tx: x => offsetX + x * scale,
    ty: y => offsetY - y * scale,
    scale,
    svgWidth: fixedSvgWidth,
    svgHeight: fixedSvgHeight,
    bounds: { logicalMinX, logicalMaxX, logicalMinY, logicalMaxY },
  };
}
