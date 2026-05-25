export const FIXED = {
  plinth: 1.5,        // ft (18 in)
  entryStepRise: 6,   // in
  entryStepTread: 11, // in
  plotWidth: 50,      // ft (600 in)
  rearSetback: 3,     // ft (36 in)

  // Wall thicknesses (in)
  extWallThick: 6,
  intWallThick: 4,

  // Stair rendering (in)
  stairSubstrateThick: 12,  // structural depth of stair slab/stringer
  treadThick: 1.5,         // finish tread thickness

  // Headroom thresholds (in) — IRC R311.7.2 / typical Kerala bye-law
  headroomMin: 84,         // below this: danger
  headroomTarget: 96,      // at or above this: compliant

  // First floor room minimums (in)
  landingMin: 42,          // 3'6"
  bathroomWidthMin: 58,    // 4'10"
  bedroomWidthMin: 132,    // 11'0"
  entryHeightMin: 84,      // 7'0"

  // Car rendering (in) — overall envelope, not internal shape
  carHeight: 55, // typical sedan roof height above ground

  // Compound wall — fixed plot boundary walls (in)
  compoundWallH: 48,          // 4 ft
  compoundSetback: 36,        // 3 ft — gap from plot border (outer face of back compound wall) to outer back wall right face
};

export interface Config {
  mezzClear: number;
  gfClear: number;
  ffClear: number;
  slabThick: number;
  landingDepth: number;
  carLength: number;
  carHeight: number;
  targetRiser: number;
  targetTread: number;
  stair1XOffset: number;
  stair2XOffset: number;
  bathroomW: number;
  bedroomW: number;
  gfBathroomW: number;
  gfDiningW: number;
  frontDoorDepth: number;         // ft — clear parking depth from front compound wall inner face to building outer face
  mezzBalconyWallOffset: number;  // in — gap between compound front wall inner face and mezzanine balcony wall
  mezzFloorWallOffset: number;    // in — distance from balcony wall to mezzanine floor wall
}

export const DEFAULT_CONFIG: Config = {
  // Floor heights (ft)
  mezzClear: 7,
  gfClear: 11,
  ffClear: 10.0,

  // Slab (in)
  slabThick: 6,

  // Parking-side entry
  landingDepth: 24,     // in
  carLength: 4.3,       // m
  carHeight: 55,        // in

  // Stairs
  targetRiser: 6,       // in
  targetTread: 10,      // in
  stair1XOffset: 0,     // in
  stair2XOffset: 0,     // in
  bathroomW: 60,        // in (5 ft)
  bedroomW: 132,        // in (11.5 ft)
  gfBathroomW: 59,      // in (4'11") — ground floor bathroom width
  gfDiningW: 156,       // in (13 ft) — ground floor dining room width
  frontDoorDepth: 20.4,         // ft — clear parking depth (front compound wall inner face → building outer face)
  mezzBalconyWallOffset: 4,     // in — gap from compound front wall inner face to balcony wall
  mezzFloorWallOffset: 54,      // in — distance from balcony wall to mezzanine floor wall
};

export const STORAGE_KEY = 'stair-design';
