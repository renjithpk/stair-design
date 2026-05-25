import { FIXED, type Config } from './defaults';

const IN_PER_FT = 12;
const IN_PER_M  = 39.3701;

export class Dimensions {
  readonly #mezzClearIn: number;
  readonly #gfClearIn: number;
  readonly #ffClearIn: number;
  readonly #slabThick: number;
  readonly #carLengthIn: number;
  readonly #landingDepth: number;
  readonly #targetRiser: number;
  readonly #targetTread: number;
  readonly #bathroomW: number;
  readonly #bedroomW: number;
  readonly #gfBathroomW: number;
  readonly #gfDiningW: number;
  readonly #carHeight: number;
  readonly #frontDoorDepthIn: number;
  readonly #mezzBalconyWallOffset: number;
  readonly #mezzFloorWallOffset: number;

  constructor(config: Config) {
    this.#mezzClearIn  = config.mezzClear * IN_PER_FT;
    this.#gfClearIn    = config.gfClear   * IN_PER_FT;
    this.#ffClearIn    = config.ffClear   * IN_PER_FT;
    this.#slabThick    = config.slabThick;
    this.#carLengthIn  = Math.round(config.carLength * IN_PER_M);
    this.#landingDepth = config.landingDepth;
    this.#targetRiser  = config.targetRiser;
    this.#targetTread  = config.targetTread;
    this.#bathroomW      = config.bathroomW;
    this.#bedroomW       = config.bedroomW;
    this.#gfBathroomW    = config.gfBathroomW;
    this.#gfDiningW      = config.gfDiningW;
    this.#carHeight      = config.carHeight;
    this.#frontDoorDepthIn = config.frontDoorDepth * IN_PER_FT;
    this.#mezzBalconyWallOffset = config.mezzBalconyWallOffset;
    this.#mezzFloorWallOffset = config.mezzFloorWallOffset;
  }

  // --- Floor heights (in) ---
  get plinthH()      { return FIXED.plinth * IN_PER_FT; }
  get mezzSlab()     { return this.#slabThick; }
  get mezzClearIn()  { return this.#mezzClearIn; }
  get gfClearIn()    { return this.#gfClearIn; }
  get mezzTop()      { return this.#mezzClearIn + this.#slabThick; }
  get firstFloorH()  { return this.#ffClearIn; }
  get ffTop()        { return this.#gfClearIn   + this.#slabThick; }
  get mezzToFF()     { return this.ffTop - this.mezzTop; }

  // --- Entry steps (in / count) ---
  get entrySteps()   { return 3; }
  get entryRiser()   { return this.plinthH / this.entrySteps; }
  get entryTread()   { return FIXED.entryStepTread; }

  // --- Parking-side entry wall ---
  // Wall sits flush left of x=0; its right face is the interior floor datum
  get mainDoorWallX()  { return -FIXED.extWallThick; }

  // --- Parking (in) ---
  get carLengthIn()  { return this.#carLengthIn; }
  get carHeight()    { return this.#carHeight; }
  get landingDepth() { return this.#landingDepth; }
  // Front-left corner of parked car: rear bumper flush with landing face (x = -landingDepth)
  get carX()         { return -(this.#landingDepth + this.#carLengthIn); }

  // --- Stair flight 1: ground → mezzanine (in / count) ---
  get steps1()       { return Math.max(1, Math.round(this.mezzTop / this.#targetRiser)); }
  get actualRiser1() { return this.mezzTop / this.steps1; }
  get L1()           { return (this.steps1 - 1) * this.#targetTread; }

  // --- Stair flight 2: mezzanine → first floor (in / count) ---
  get steps2()       { return Math.max(1, Math.round(this.mezzToFF / this.#targetRiser)); }
  get actualRiser2() { return this.mezzToFF / this.steps2; }
  get L2()           { return (this.steps2 - 1) * this.#targetTread; }

  // --- Shared ---
  get targetTread()  { return this.#targetTread; }
  get targetRiser()  { return this.#targetRiser; }

  // --- First floor wall top: FF slab top + first floor clear height ---
  get ffWallTop()      { return this.ffTop + this.#ffClearIn; }

  // --- Mezzanine floor wall: height from mezzTop (mezzToFF + ffTop) ---
  get mezzFloorWallH() { return this.mezzToFF + this.ffTop; }

  // --- First floor room layout (in) — pinned right-to-left from fixed outer back wall ---
  // Outer back wall is fixed: 3 ft (compoundSetback) inside the back compound wall outer face (plot border).
  // Room widths (bedroom, bathroom) cascade leftward from this anchor.
  get outerBackWallX() { return this.compoundWallBackX + FIXED.intWallThick - FIXED.compoundSetback - FIXED.extWallThick; }
  get bedroomWallX()   { return this.outerBackWallX    - FIXED.intWallThick    - this.#bedroomW; }
  get bathroomWallX()  { return this.bedroomWallX      - FIXED.intWallThick    - this.#bathroomW; }

  // --- Ground floor partition walls — relative to outer back wall ---
  get gfDiningWallX()   { return this.outerBackWallX - this.#gfDiningW; }
  get gfBathroomWallX() { return this.gfDiningWallX - FIXED.intWallThick - this.#gfBathroomW; }

  // --- Compound boundary walls ---
  get compoundWallFrontX()      { return -FIXED.extWallThick - this.#frontDoorDepthIn - FIXED.intWallThick; }
  get compoundWallFrontInnerX() { return this.compoundWallFrontX + FIXED.intWallThick; }
  get compoundWallBackX()       { return this.compoundWallFrontX + FIXED.plotWidth * IN_PER_FT - FIXED.intWallThick; }

  // --- Mezzanine walls — anchored to compound front wall ---
  get mezzBalconyWallX() { return this.compoundWallFrontInnerX + this.#mezzBalconyWallOffset; }
  get mezzFloorWallX()   { return this.mezzBalconyWallX + this.#mezzFloorWallOffset; }
  get compoundWallH()      { return FIXED.compoundWallH; }

  // --- Headroom: minimum vertical clearance between flights (in) ---
  get headroom() {
    const xEdge = this.L2;
    if (xEdge <= this.L1 && xEdge >= 0) {
      const treadNum = Math.floor((this.L1 - xEdge) / this.#targetTread);
      const stairHeight = treadNum * this.actualRiser1;
      return (this.ffTop - this.mezzSlab) - stairHeight;
    } else if (xEdge > this.L1) {
      return this.ffTop - this.mezzSlab;
    }
    return 0;
  }
}
