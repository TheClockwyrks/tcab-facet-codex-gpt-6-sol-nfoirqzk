import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import type { ParticleSystem } from "@clockwyrks/particle-runtime";
import { ParticleCanvasPlayer } from "@clockwyrks/particle-runtime/canvas";
import {
  ACTIONS,
  BACK_LABEL,
  BASE_SCORE,
  BEST_CHAIN_LABEL,
  BEST_MOVE_LABEL,
  BINDINGS,
  BOARD_CX,
  BOARD_CY,
  CELL_PITCH,
  CUES,
  FACET_DEBUG_VERSION,
  FALL_SECONDS_PER_ROW,
  FLAWED_SCORE,
  GAMEOVER_ITEMS,
  GAMEOVER_TITLE_TEXT,
  GEM_HIT_R,
  GEM_KINDS,
  GRID_COLS,
  GRID_ROWS,
  HUD_CHAIN_LABEL,
  HUD_LEVEL_LABEL,
  HUD_SCORE_LABEL,
  LAND_MIN_ROWS,
  LEVELCLEAR_ITEMS,
  LEVELCLEAR_TITLE_TEXT,
  LEVEL_TARGET_STEP,
  MATCH_MIN,
  MAX_MULTIPLIER,
  MAX_STRAIN,
  PAUSED_ITEMS,
  PAUSED_TITLE_TEXT,
  PAUSE_LABEL,
  REFUSAL_SECONDS,
  STAGE_W,
  STAGE_H,
  STEP_SECONDS,
  SWAP_SECONDS,
  TAGLINE_TEXT,
  TARGET_MIN_H,
  TARGET_MIN_W,
  TITLE_ITEMS,
  TITLE_TEXT,
  WAVE_SECONDS,
} from "./constants";

export type GemKind =
  "ruby" | "amber" | "citrine" | "jade" | "beryl" | "sapphire" | "amethyst";
export type Cut = "plain" | "brilliant" | "star" | "prism";
export type Screen =
  "title" | "howto" | "playing" | "paused" | "levelclear" | "gameover";
export type Phase = "idle" | "swapping" | "resolving";
export type PointerDevice = "mouse" | "pen" | "touch";
export interface CellRef {
  readonly col: number;
  readonly row: number;
}
export interface GemState {
  readonly col: number;
  readonly row: number;
  readonly kind: GemKind | null;
  readonly cut: Cut;
  readonly strain: number;
  readonly fell: number;
}
export interface BoardState {
  readonly cols: number;
  readonly rows: number;
  readonly cells: readonly GemState[];
}
export interface RefusalState {
  readonly a: CellRef;
  readonly b: CellRef;
  readonly timer: number;
}
export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
  readonly device: PointerDevice;
}
export interface FacetState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly board: BoardState;
  readonly phase: Phase;
  readonly chainStep: number;
  readonly swapTimer: number;
  readonly stepTimer: number;
  readonly score: number;
  readonly level: number;
  readonly levelScore: number;
  readonly lastCleared: number;
  readonly lastPoints: number;
  readonly lastWaves: number;
  readonly moveScore: number;
  readonly bestMove: number;
  readonly bestChain: number;
  readonly selection: CellRef | null;
  readonly offer: CellRef | null;
  readonly refusal: RefusalState | null;
  readonly armedTarget: string | null;
  readonly pointer: PointerState;
  readonly simTime: number;
  readonly muted: boolean;
  readonly refillKinds: readonly string[];
  readonly visuals?: Visuals;
  readonly swapA?: CellRef | null;
  readonly swapB?: CellRef | null;
  readonly prismKind?: GemKind | null;
  readonly prismAll?: boolean;
  readonly breaks?: readonly BreakCell[];
  readonly flashes?: readonly CellRef[];
  readonly stepSerial?: number;
  readonly openingProgress?: number;
  readonly newFlaw?: boolean;
  readonly newCut?: boolean;
}
interface BreakCell extends CellRef {
  readonly kind: GemKind | null;
  readonly cut: Cut;
  readonly strain: number;
  readonly wave: number;
}
interface Visuals {
  readonly images: Readonly<Record<string, ImageBitmap>>;
  readonly fx: Readonly<Record<string, ParticleSystem>>;
}
interface Target {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface FacetDebugApi {
  readonly version: number;
  reset(s: DeepReadonly<FacetState>): FacetState;
  reconcile(s: DeepReadonly<FacetState>): FacetState;
  snapshot(s: DeepReadonly<FacetState>): ReturnType<typeof snapshot>;
  setScreen(s: DeepReadonly<FacetState>, screen: Screen): FacetState;
  setMenuIndex(s: DeepReadonly<FacetState>, index: number): FacetState;
  loadBoard(s: DeepReadonly<FacetState>, rows: readonly string[]): FacetState;
  dealBoard(s: DeepReadonly<FacetState>): FacetState;
  clearBoard(s: DeepReadonly<FacetState>): FacetState;
  setGem(
    s: DeepReadonly<FacetState>,
    col: number,
    row: number,
    token: string,
  ): FacetState;
  setRefillKinds(
    s: DeepReadonly<FacetState>,
    col: number,
    kinds: string,
  ): FacetState;
  clearRefillKinds(s: DeepReadonly<FacetState>): FacetState;
  setScore(s: DeepReadonly<FacetState>, points: number): FacetState;
  setLevel(s: DeepReadonly<FacetState>, level: number): FacetState;
  setLevelScore(s: DeepReadonly<FacetState>, points: number): FacetState;
  setBestChain(s: DeepReadonly<FacetState>, chainStep: number): FacetState;
  setBestMove(s: DeepReadonly<FacetState>, points: number): FacetState;
  setMoveScore(s: DeepReadonly<FacetState>, points: number): FacetState;
  setSelection(
    s: DeepReadonly<FacetState>,
    col: number,
    row: number,
  ): FacetState;
  clearSelection(s: DeepReadonly<FacetState>): FacetState;
  setOffer(s: DeepReadonly<FacetState>, col: number, row: number): FacetState;
  clearOffer(s: DeepReadonly<FacetState>): FacetState;
  clearRefusal(s: DeepReadonly<FacetState>): FacetState;
  clearChain(s: DeepReadonly<FacetState>): FacetState;
  requestSwap(
    s: DeepReadonly<FacetState>,
    ca: number,
    ra: number,
    cb: number,
    rb: number,
  ): FacetState;
  pointerDown(
    s: DeepReadonly<FacetState>,
    x: number,
    y: number,
    device?: PointerDevice,
  ): FacetState;
  pointerMove(
    s: DeepReadonly<FacetState>,
    x: number,
    y: number,
    device?: PointerDevice,
  ): FacetState;
  pointerUp(s: DeepReadonly<FacetState>, device?: PointerDevice): FacetState;
}
export const BACKGROUND = "#06131f";
const emptyBoard: BoardState = { cols: 0, rows: 0, cells: [] };
const letters = "RACJBSM";
const kindFromLetter = (c: string): GemKind => {
  const index = letters.indexOf(c);
  if (index < 0) throw new Error(`Invalid kind: ${c}`);
  return GEM_KINDS[index];
};
const indexOf = (c: number, r: number) => r * GRID_COLS + c;
const cellX = (c: number) => BOARD_CX + (c - (GRID_COLS - 1) / 2) * CELL_PITCH;
const cellY = (r: number) => BOARD_CY + (r - (GRID_ROWS - 1) / 2) * CELL_PITCH;
const inBoard = (c: number, r: number) =>
  Number.isInteger(c) &&
  Number.isInteger(r) &&
  c >= 0 &&
  c < GRID_COLS &&
  r >= 0 &&
  r < GRID_ROWS;
function requireCell(c: number, r: number): void {
  if (!inBoard(c, r)) throw new Error(`Cell outside board: ${c},${r}`);
}
function parseToken(token: string, col: number, row: number): GemState {
  const m = /^([RACJBSMX])([0-3])([bs]?)$/.exec(token);
  if (!m || (m[1] === "X" && m[3])) throw new Error(`Invalid token: ${token}`);
  return {
    col,
    row,
    kind: m[1] === "X" ? null : kindFromLetter(m[1]),
    cut:
      m[1] === "X"
        ? "prism"
        : m[3] === "b"
          ? "brilliant"
          : m[3] === "s"
            ? "star"
            : "plain",
    strain: Number(m[2]),
    fell: 0,
  };
}
const plain = (
  col: number,
  row: number,
  kind: GemKind,
  fell = 0,
): GemState => ({ col, row, kind, cut: "plain", strain: 0, fell });
const randomKind = (): GemKind =>
  GEM_KINDS[Math.floor(Math.random() * GEM_KINDS.length)];
const clone = (s: DeepReadonly<FacetState>): FacetState => s as FacetState;
const at = (board: BoardState, c: number, r: number) =>
  board.cells[indexOf(c, r)];
const same = (a: CellRef | null, b: CellRef | null) =>
  !!a && !!b && a.col === b.col && a.row === b.row;
const adjacent = (a: CellRef, b: CellRef) =>
  Math.abs(a.col - b.col) + Math.abs(a.row - b.row) === 1;
interface Run {
  cells: number[];
  kind: GemKind;
  horizontal: boolean;
}
function runs(board: BoardState): Run[] {
  if (!board.cells.length) return [];
  const result: Run[] = [];
  for (const horizontal of [true, false])
    for (let line = 0; line < GRID_ROWS; line++) {
      let start = 0;
      while (start < GRID_COLS) {
        const first = horizontal
          ? at(board, start, line)
          : at(board, line, start);
        let end = start + 1;
        while (
          first.kind &&
          end < GRID_COLS &&
          (horizontal ? at(board, end, line) : at(board, line, end)).kind ===
            first.kind
        )
          end++;
        if (first.kind && end - start >= MATCH_MIN)
          result.push({
            cells: Array.from({ length: end - start }, (_, j) =>
              horizontal ? indexOf(start + j, line) : indexOf(line, start + j),
            ),
            kind: first.kind,
            horizontal,
          });
        start = end;
      }
    }
  return result;
}
function exchanged(board: BoardState, a: CellRef, b: CellRef): BoardState {
  const cells = [...board.cells],
    ai = indexOf(a.col, a.row),
    bi = indexOf(b.col, b.row);
  const ga = cells[ai],
    gb = cells[bi];
  cells[ai] = { ...gb, col: a.col, row: a.row, fell: 0 };
  cells[bi] = { ...ga, col: b.col, row: b.row, fell: 0 };
  return { ...board, cells };
}
function productive(board: BoardState, a: CellRef, b: CellRef): boolean {
  if (!board.cells.length || !adjacent(a, b)) return false;
  if (
    at(board, a.col, a.row).cut === "prism" ||
    at(board, b.col, b.row).cut === "prism"
  )
    return true;
  return runs(exchanged(board, a, b)).length > 0;
}
function legalSwap(board: BoardState): boolean {
  for (let r = 0; r < board.rows; r++)
    for (let c = 0; c < board.cols; c++) {
      if (
        c + 1 < board.cols &&
        productive(board, { col: c, row: r }, { col: c + 1, row: r })
      )
        return true;
      if (
        r + 1 < board.rows &&
        productive(board, { col: c, row: r }, { col: c, row: r + 1 })
      )
        return true;
    }
  return false;
}
function dealBoard(): BoardState {
  for (let attempt = 0; attempt < 10000; attempt++) {
    const cells: GemState[] = [];
    for (let r = 0; r < GRID_ROWS; r++)
      for (let c = 0; c < GRID_COLS; c++) {
        let options = [...GEM_KINDS];
        if (
          c >= 2 &&
          cells[indexOf(c - 1, r)].kind === cells[indexOf(c - 2, r)].kind
        )
          options = options.filter((k) => k !== cells[indexOf(c - 1, r)].kind);
        if (
          r >= 2 &&
          cells[indexOf(c, r - 1)].kind === cells[indexOf(c, r - 2)].kind
        )
          options = options.filter((k) => k !== cells[indexOf(c, r - 1)].kind);
        cells.push(
          plain(
            c,
            r,
            options[Math.floor(Math.random() * options.length)],
            r + 1,
          ),
        );
      }
    const board = { cols: GRID_COLS, rows: GRID_ROWS, cells };
    if (legalSwap(board)) return board;
  }
  throw new Error("Could not deal opening board");
}
function baseState(muted = false, visuals?: Visuals): FacetState {
  return {
    screen: "title",
    menuIndex: 0,
    board: emptyBoard,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    score: 0,
    level: 1,
    levelScore: 0,
    lastCleared: 0,
    lastPoints: 0,
    lastWaves: 0,
    moveScore: 0,
    bestMove: 0,
    bestChain: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    pointer: { x: 0, y: 0, down: false, device: "mouse" },
    simTime: 0,
    muted,
    refillKinds: Array(GRID_COLS).fill(""),
    visuals,
    swapA: null,
    swapB: null,
    prismKind: null,
    prismAll: false,
    breaks: [],
    flashes: [],
    stepSerial: 0,
    openingProgress: 0,
  };
}
function targetList(screen: Screen): Target[] {
  if (screen === "playing")
    return [
      {
        id: "pause",
        x: 1100,
        y: 22,
        w: TARGET_MIN_W + 36,
        h: TARGET_MIN_H + 2,
      },
    ];
  if (screen === "howto")
    return [
      { id: "back", x: 42, y: 28, w: TARGET_MIN_W + 32, h: TARGET_MIN_H },
    ];
  const count =
    screen === "title"
      ? TITLE_ITEMS.length
      : screen === "paused"
        ? PAUSED_ITEMS.length
        : screen === "levelclear"
          ? LEVELCLEAR_ITEMS.length
          : GAMEOVER_ITEMS.length;
  const y = screen === "title" ? 424 : 470;
  return Array.from({ length: count }, (_, i) => ({
    id: `menu-${i}`,
    x: 476,
    y: y + i * 88,
    w: 328,
    h: 76,
  }));
}
const hitTarget = (s: FacetState, x: number, y: number) =>
  targetList(s.screen).find(
    (t) => x >= t.x && y >= t.y && x <= t.x + t.w && y <= t.y + t.h,
  );
function hitCell(x: number, y: number): CellRef | null {
  let found: CellRef | null = null,
    distance = Infinity;
  for (let r = 0; r < GRID_ROWS; r++)
    for (let c = 0; c < GRID_COLS; c++) {
      const d = Math.hypot(x - cellX(c), y - cellY(r));
      if (
        d <= GEM_HIT_R &&
        (d < distance ||
          (d === distance &&
            (r > found!.row || (r === found!.row && c > found!.col))))
      ) {
        found = { col: c, row: r };
        distance = d;
      }
    }
  return found;
}
function requestSwap(s: FacetState, a: CellRef, b: CellRef): FacetState {
  requireCell(a.col, a.row);
  requireCell(b.col, b.row);
  if (s.phase !== "idle" || !productive(s.board, a, b))
    return { ...s, refusal: { a, b, timer: 0 } };
  const ga = at(s.board, a.col, a.row),
    gb = at(s.board, b.col, b.row);
  return {
    ...s,
    board: exchanged(s.board, a, b),
    phase: "swapping",
    swapTimer: 0,
    chainStep: 0,
    moveScore: 0,
    refusal: null,
    swapA: a,
    swapB: b,
    prismKind:
      ga.cut === "prism" ? gb.kind : gb.cut === "prism" ? ga.kind : null,
    prismAll: ga.cut === "prism" && gb.cut === "prism",
  };
}
function freshRound(s: FacetState): FacetState {
  return {
    ...s,
    screen: "playing",
    menuIndex: 0,
    board: dealBoard(),
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    score: 0,
    level: 1,
    levelScore: 0,
    lastCleared: 0,
    lastPoints: 0,
    lastWaves: 0,
    moveScore: 0,
    bestMove: 0,
    bestChain: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    breaks: [],
    flashes: [],
    openingProgress: 0,
  };
}
function quit(s: FacetState): FacetState {
  return {
    ...s,
    screen: "title",
    menuIndex: 0,
    board: emptyBoard,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    breaks: [],
    flashes: [],
  };
}
function menuChoice(s: FacetState): FacetState {
  if (s.screen === "title")
    return s.menuIndex === 0
      ? freshRound(s)
      : { ...s, screen: "howto", menuIndex: 0, armedTarget: null };
  if (s.screen === "paused")
    return s.menuIndex === 0
      ? { ...s, screen: "playing", menuIndex: 0, armedTarget: null }
      : quit(s);
  if (s.screen === "levelclear")
    return s.menuIndex === 0
      ? {
          ...s,
          screen: "playing",
          menuIndex: 0,
          level: s.level + 1,
          levelScore: 0,
          bestChain: 0,
          bestMove: 0,
          board: dealBoard(),
          armedTarget: null,
          openingProgress: 0,
        }
      : quit(s);
  if (s.screen === "gameover")
    return s.menuIndex === 0 ? freshRound(s) : quit(s);
  return s;
}
function pressPointer(
  s: FacetState,
  x: number,
  y: number,
  device: PointerDevice,
): FacetState {
  const next = { ...s, pointer: { x, y, down: true, device } };
  const target = hitTarget(next, x, y);
  if (target)
    return {
      ...next,
      armedTarget: target.id,
      menuIndex: target.id.startsWith("menu-")
        ? Number(target.id.slice(5))
        : next.menuIndex,
    };
  if (next.screen !== "playing" || !next.board.cells.length)
    return { ...next, armedTarget: null };
  const cell = hitCell(x, y);
  if (!cell)
    return { ...next, selection: null, offer: null, armedTarget: null };
  if (
    !next.selection ||
    (!same(next.selection, cell) && !adjacent(next.selection, cell))
  )
    return { ...next, selection: cell, offer: null, armedTarget: null };
  if (same(next.selection, cell))
    return { ...next, offer: null, armedTarget: null };
  return { ...next, offer: cell, armedTarget: null };
}
function movePointer(
  s: FacetState,
  x: number,
  y: number,
  device: PointerDevice,
): FacetState {
  let next = { ...s, pointer: { ...s.pointer, x, y, device } };
  const target = hitTarget(next, x, y);
  if (target?.id.startsWith("menu-") && !next.pointer.down)
    next = { ...next, menuIndex: Number(target.id.slice(5)) };
  if (
    next.screen === "playing" &&
    next.pointer.down &&
    next.selection &&
    !next.armedTarget
  ) {
    const cell = hitCell(x, y);
    if (same(cell, next.selection)) next = { ...next, offer: null };
    else if (cell && adjacent(next.selection, cell))
      next = { ...next, offer: cell };
  }
  return next;
}
function releasePointer(s: FacetState, device: PointerDevice): FacetState {
  let next = { ...s, pointer: { ...s.pointer, down: false, device } };
  const target = hitTarget(next, next.pointer.x, next.pointer.y);
  if (next.armedTarget) {
    const take = target?.id === next.armedTarget ? next.armedTarget : null;
    next = { ...next, armedTarget: null };
    if (take === "pause" && next.screen === "playing")
      return { ...next, screen: "paused", menuIndex: 0 };
    if (take === "back") return back(next);
    if (take?.startsWith("menu-"))
      return menuChoice({ ...next, menuIndex: Number(take.slice(5)) });
    return next;
  }
  if (next.screen === "playing" && next.selection && next.offer) {
    const a = next.selection,
      b = next.offer;
    return requestSwap({ ...next, selection: null, offer: null }, a, b);
  }
  return next;
}
function back(s: FacetState): FacetState {
  if (s.screen === "howto")
    return { ...s, screen: "title", menuIndex: 1, armedTarget: null };
  if (s.screen === "gameover")
    return { ...s, screen: "title", menuIndex: 0, armedTarget: null };
  return s;
}
function resolveStep(s: FacetState): FacetState {
  const board = s.board;
  const allRuns = runs(board);
  const prism = s.chainStep === 1 && (s.prismAll || s.prismKind !== null);
  const wave = new Map<number, number>();
  if (prism) {
    board.cells.forEach((g, i) => {
      if (
        s.prismAll ||
        g.kind === s.prismKind ||
        (g.cut === "prism" &&
          ((s.swapA && i === indexOf(s.swapA.col, s.swapA.row)) ||
            (s.swapB && i === indexOf(s.swapB.col, s.swapB.row))))
      )
        wave.set(i, 0);
    });
  } else for (const run of allRuns) for (const i of run.cells) wave.set(i, 0);
  if (!wave.size) return s;
  const queue = [...wave.keys()];
  for (let qi = 0; qi < queue.length; qi++) {
    const i = queue[qi],
      g = board.cells[i],
      c = g.col,
      r = g.row,
      w = wave.get(i)!;
    const neighbors: CellRef[] = [];
    if (g.cut === "brilliant")
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++)
          if (dx || dy) neighbors.push({ col: c + dx, row: r + dy });
    if (g.cut === "star") {
      for (let x = 0; x < GRID_COLS; x++) neighbors.push({ col: x, row: r });
      for (let y = 0; y < GRID_ROWS; y++) neighbors.push({ col: c, row: y });
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nc = c + dx,
        nr = r + dy;
      if (inBoard(nc, nr) && at(board, nc, nr).strain === MAX_STRAIN)
        neighbors.push({ col: nc, row: nr });
    }
    for (const n of neighbors) {
      if (!inBoard(n.col, n.row)) continue;
      const ni = indexOf(n.col, n.row);
      if (!wave.has(ni)) {
        wave.set(ni, w + 1);
        queue.push(ni);
      }
    }
  }
  const cells = [...board.cells];
  let flaw = false;
  for (const g of board.cells) {
    const i = indexOf(g.col, g.row);
    if (wave.has(i)) continue;
    if (
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(
        ([dx, dy]) =>
          inBoard(g.col + dx, g.row + dy) &&
          wave.has(indexOf(g.col + dx, g.row + dy)),
      )
    ) {
      const strain = Math.min(MAX_STRAIN, g.strain + 1);
      if (strain === MAX_STRAIN && g.strain < MAX_STRAIN) flaw = true;
      cells[i] = { ...g, strain };
    }
  }
  const breaks = [...wave].map(([i, w]) => ({ ...board.cells[i], wave: w }));
  const multiplier = Math.min(s.chainStep, MAX_MULTIPLIER);
  const points = breaks.reduce(
    (sum, g) =>
      sum + (g.strain === MAX_STRAIN ? FLAWED_SCORE : BASE_SCORE) * multiplier,
    0,
  );
  const creations = new Map<number, GemState>();
  if (!prism) {
    for (const run of allRuns) {
      if (run.cells.length < 4) continue;
      const eligible = [s.swapA, s.swapB]
        .filter((ref): ref is CellRef => !!ref)
        .map((ref) => indexOf(ref.col, ref.row));
      const chosen =
        run.cells.find((i) => eligible.includes(i)) ??
        run.cells[Math.floor((run.cells.length - 1) / 2)];
      const old = board.cells[chosen];
      creations.set(chosen, {
        ...old,
        kind: run.cells.length >= 5 ? null : run.kind,
        cut: run.cells.length >= 5 ? "prism" : "brilliant",
        strain: 0,
        fell: 0,
      });
    }
    const horizontal = new Set(
      allRuns.filter((r) => r.horizontal).flatMap((r) => r.cells),
    );
    const vertical = new Set(
      allRuns.filter((r) => !r.horizontal).flatMap((r) => r.cells),
    );
    for (const i of horizontal)
      if (vertical.has(i) && creations.get(i)?.cut !== "prism")
        creations.set(i, {
          ...board.cells[i],
          cut: "star",
          strain: 0,
          fell: 0,
        });
  }
  const settled: Array<GemState | null> = Array(GRID_COLS * GRID_ROWS).fill(
    null,
  );
  for (const [i, g] of creations) settled[i] = g;
  for (let c = 0; c < GRID_COLS; c++) {
    const survivors = [] as GemState[];
    for (let r = GRID_ROWS - 1; r >= 0; r--) {
      const i = indexOf(c, r);
      if (!wave.has(i)) survivors.push(cells[i]);
    }
    let cursor = GRID_ROWS - 1;
    for (const g of survivors) {
      while (cursor >= 0 && settled[indexOf(c, cursor)]) cursor--;
      if (cursor < 0) break;
      settled[indexOf(c, cursor)] = { ...g, row: cursor, fell: cursor - g.row };
      cursor--;
    }
    for (let r = cursor; r >= 0; r--) {
      if (settled[indexOf(c, r)]) continue;
      const letter = s.refillKinds[c]?.[r];
      const kind = letter ? kindFromLetter(letter) : randomKind();
      settled[indexOf(c, r)] = plain(c, r, kind, r + 1);
    }
  }
  const newBoard: BoardState = {
    cols: GRID_COLS,
    rows: GRID_ROWS,
    cells: settled as GemState[],
  };
  return {
    ...s,
    board: newBoard,
    phase: "resolving",
    stepTimer: 0,
    lastCleared: wave.size,
    lastPoints: points,
    lastWaves: Math.max(...wave.values()),
    score: s.score + points,
    levelScore: s.levelScore + points,
    moveScore: s.moveScore + points,
    bestChain: Math.max(s.bestChain, s.chainStep),
    breaks,
    flashes: [...creations.values()].map((g) => ({ col: g.col, row: g.row })),
    stepSerial: (s.stepSerial ?? 0) + 1,
    newFlaw: flaw,
    newCut: creations.size > 0,
  };
}
function stepHold(s: FacetState): number {
  return (
    s.lastWaves * WAVE_SECONDS +
    Math.max(0, ...s.board.cells.map((g) => g.fell)) * FALL_SECONDS_PER_ROW +
    STEP_SECONDS
  );
}
function advance(
  s: FacetState,
  dt: number,
  play?: (cue: string, step?: number) => void,
): FacetState {
  let next = s;
  let remain = dt;
  let guard = 0;
  while (remain > 0 && guard++ < 100) {
    if (next.phase === "idle") break;
    if (next.phase === "swapping") {
      const left = SWAP_SECONDS - next.swapTimer,
        take = Math.min(remain, left);
      remain -= take;
      next = { ...next, swapTimer: next.swapTimer + take };
      if (next.swapTimer + 1e-9 >= SWAP_SECONDS) {
        next = resolveStep({
          ...next,
          phase: "resolving",
          swapTimer: 0,
          chainStep: 1,
          stepTimer: 0,
        });
        if (next.lastCleared) play?.(CUES.clear, next.chainStep);
        if (next.newFlaw) play?.(CUES.flaw);
        if (next.newCut) play?.(CUES.cut);
      }
    } else {
      const hold = stepHold(next),
        left = hold - next.stepTimer,
        take = Math.min(remain, left);
      remain -= take;
      const landAt =
        next.lastWaves * WAVE_SECONDS +
        Math.max(0, ...next.board.cells.map((g) => g.fell)) *
          FALL_SECONDS_PER_ROW;
      if (
        next.stepTimer < landAt &&
        next.stepTimer + take >= landAt &&
        Math.max(...next.board.cells.map((g) => g.fell)) > LAND_MIN_ROWS
      )
        play?.(CUES.land);
      next = { ...next, stepTimer: next.stepTimer + take };
      if (next.stepTimer + 1e-9 >= hold) {
        if (runs(next.board).length) {
          next = resolveStep({
            ...next,
            chainStep: next.chainStep + 1,
            stepTimer: 0,
          });
          play?.(CUES.clear, next.chainStep);
          if (next.newFlaw) play?.(CUES.flaw);
          if (next.newCut) play?.(CUES.cut);
        } else {
          next = {
            ...next,
            phase: "idle",
            chainStep: 0,
            stepTimer: 0,
            bestMove: Math.max(next.bestMove, next.moveScore),
            breaks: [],
            flashes: [],
            swapA: null,
            swapB: null,
            prismKind: null,
            prismAll: false,
          };
          if (next.levelScore >= next.level * LEVEL_TARGET_STEP) {
            next = { ...next, screen: "levelclear", menuIndex: 0 };
            play?.(CUES.levelUp);
          } else if (!legalSwap(next.board)) {
            next = { ...next, screen: "gameover", menuIndex: 0 };
            play?.(CUES.gameOver);
          }
        }
      }
    }
  }
  return next;
}
function snapshot(s: DeepReadonly<FacetState>) {
  const state = clone(s);
  return {
    version: FACET_DEBUG_VERSION,
    screen: s.screen,
    menuIndex: s.menuIndex,
    score: s.score,
    level: s.level,
    levelScore: s.levelScore,
    levelTarget: s.level * LEVEL_TARGET_STEP,
    phase: s.phase,
    chainStep: s.chainStep,
    multiplier: Math.min(s.chainStep, MAX_MULTIPLIER),
    swapTimer: s.swapTimer,
    stepTimer: s.stepTimer,
    stepHold: stepHold(state),
    board: {
      cols: s.board.cols,
      rows: s.board.rows,
      cells: s.board.cells.map((g) => ({
        col: g.col,
        row: g.row,
        x: cellX(g.col),
        y: cellY(g.row),
        kind: g.kind,
        cut: g.cut,
        strain: g.strain,
        fell: g.fell,
      })),
    },
    selection: s.selection,
    offer: s.offer,
    refusal: s.refusal ? { a: s.refusal.a, b: s.refusal.b } : null,
    lastCleared: s.lastCleared,
    lastPoints: s.lastPoints,
    lastWaves: s.lastWaves,
    lastFall: Math.max(0, ...s.board.cells.map((g) => g.fell)),
    moveScore: s.moveScore,
    bestMove: s.bestMove,
    bestChain: s.bestChain,
    legalSwap: legalSwap(state.board),
    refillKinds: [...s.refillKinds],
    pointer: s.pointer,
    armedTarget: s.armedTarget,
    targets: targetList(s.screen),
    muted: s.muted,
    simTime: s.simTime,
  };
}
const integer = (n: number, min = 0) => {
  if (!Number.isInteger(n) || n < min) throw new Error(`Invalid integer: ${n}`);
};
const debug: FacetDebugApi = {
  version: FACET_DEBUG_VERSION,
  reset: (s) => baseState(s.muted, s.visuals as Visuals | undefined),
  reconcile: (s) => clone(s),
  snapshot,
  setScreen: (s, screen) => {
    if (
      ![
        "title",
        "howto",
        "playing",
        "paused",
        "levelclear",
        "gameover",
      ].includes(screen)
    )
      throw new Error("Invalid screen");
    return { ...clone(s), screen };
  },
  setMenuIndex: (s, menuIndex) => {
    integer(menuIndex);
    return { ...clone(s), menuIndex };
  },
  loadBoard: (s, rows) => {
    if (rows.length !== GRID_ROWS) throw new Error("Invalid row count");
    const cells = rows.flatMap((line, r) => {
      const tokens = line.trim().split(/\s+/);
      if (tokens.length !== GRID_COLS) throw new Error("Invalid column count");
      return tokens.map((token, c) => parseToken(token, c, r));
    });
    return { ...clone(s), board: { cols: GRID_COLS, rows: GRID_ROWS, cells } };
  },
  dealBoard: (s) => ({ ...clone(s), board: dealBoard() }),
  clearBoard: (s) => ({ ...clone(s), board: emptyBoard }),
  setGem: (s, col, row, token) => {
    requireCell(col, row);
    if (!s.board.cells.length) throw new Error("No board");
    const cells = [...s.board.cells];
    cells[indexOf(col, row)] = parseToken(token, col, row);
    return { ...clone(s), board: { ...clone(s).board, cells } };
  },
  setRefillKinds: (s, col, kinds) => {
    integer(col);
    if (col >= GRID_COLS || !new RegExp(`^[${letters}]*$`).test(kinds))
      throw new Error("Invalid refill kinds");
    const refillKinds = [...s.refillKinds];
    refillKinds[col] = kinds;
    return { ...clone(s), refillKinds };
  },
  clearRefillKinds: (s) => ({
    ...clone(s),
    refillKinds: Array(GRID_COLS).fill(""),
  }),
  setScore: (s, score) => ({ ...clone(s), score }),
  setLevel: (s, level) => {
    integer(level, 1);
    return { ...clone(s), level };
  },
  setLevelScore: (s, levelScore) => ({ ...clone(s), levelScore }),
  setBestChain: (s, bestChain) => {
    integer(bestChain);
    return { ...clone(s), bestChain };
  },
  setBestMove: (s, bestMove) => ({ ...clone(s), bestMove }),
  setMoveScore: (s, moveScore) => ({ ...clone(s), moveScore }),
  setSelection: (s, col, row) => {
    requireCell(col, row);
    return { ...clone(s), selection: { col, row } };
  },
  clearSelection: (s) => ({ ...clone(s), selection: null }),
  setOffer: (s, col, row) => {
    requireCell(col, row);
    return { ...clone(s), offer: { col, row } };
  },
  clearOffer: (s) => ({ ...clone(s), offer: null }),
  clearRefusal: (s) => ({ ...clone(s), refusal: null }),
  clearChain: (s) => ({
    ...clone(s),
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    breaks: [],
    flashes: [],
  }),
  requestSwap: (s, ca, ra, cb, rb) =>
    requestSwap(clone(s), { col: ca, row: ra }, { col: cb, row: rb }),
  pointerDown: (s, x, y, device = "mouse") =>
    pressPointer(clone(s), x, y, device),
  pointerMove: (s, x, y, device = "mouse") =>
    movePointer(clone(s), x, y, device),
  pointerUp: (s, device = "mouse") => releasePointer(clone(s), device),
};

function rounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
  stroke?: string,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color = "#e9f7f5",
  align: CanvasTextAlign = "center",
  weight = 600,
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px Trebuchet MS, sans-serif`;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
}
function drawButton(
  ctx: CanvasRenderingContext2D,
  t: Target,
  title: string,
  active = false,
) {
  rounded(
    ctx,
    t.x,
    t.y,
    t.w,
    t.h,
    14,
    active ? "#224d62" : "#0d2739",
    active ? "#e4cf86" : "#557d8b",
  );
  label(
    ctx,
    title,
    t.x + t.w / 2,
    t.y + t.h / 2 + 10,
    27,
    active ? "#fff4ca" : "#d5eaed",
  );
}
function drawGem(
  ctx: CanvasRenderingContext2D,
  s: FacetState,
  g: GemState,
  x: number,
  y: number,
  alpha = 1,
) {
  const images = s.visuals?.images;
  if (!images) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;
  let key = g.kind ? `${g.kind}-${g.strain}` : `prism-${g.strain}`;
  if (g.cut === "prism" && g.strain === 0)
    key = `prism-turn/${Math.floor(s.simTime * 10) % 8}`;
  const img = images[key];
  if (img) ctx.drawImage(img, x - 32, y - 32, 64, 64);
  if (g.cut === "brilliant" || g.cut === "star") {
    const overlay = images[g.cut];
    if (overlay) ctx.drawImage(overlay, x - 32, y - 32, 64, 64);
  }
  ctx.restore();
}
function particle(
  ctx: CanvasRenderingContext2D,
  sys: ParticleSystem,
  x: number,
  y: number,
  time: number,
  size: number,
  seed: number,
) {
  if (time < 0 || (time > sys.durationMs / 1000 && !sys.loop)) return;
  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const oc = off.getContext("2d");
  if (oc) {
    const player = new ParticleCanvasPlayer(sys, oc, {
      clear: true,
      seed,
      pixelRadius: 2.2,
    });
    player.update(Math.max(0.001, time));
    ctx.drawImage(off, 0, 0, size, size);
  }
  ctx.restore();
}
function renderBoard(s: FacetState, ctx: CanvasRenderingContext2D) {
  const images = s.visuals?.images;
  if (!s.board.cells.length) return;
  const frame = images?.frame;
  if (frame) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(frame, 320, 76, 640, 640);
  }
  const shatterEnd = s.lastWaves * WAVE_SECONDS;
  const falling = s.phase === "resolving" && s.stepTimer >= shatterEnd;
  for (const g of s.board.cells) {
    const ref = { col: g.col, row: g.row };
    let x = cellX(g.col),
      y = cellY(g.row);
    if (
      s.screen === "playing" &&
      s.phase === "idle" &&
      s.offer &&
      s.selection
    ) {
      if (same(ref, s.selection)) {
        x = cellX(s.offer.col);
        y = cellY(s.offer.row);
      } else if (same(ref, s.offer)) {
        x = cellX(s.selection.col);
        y = cellY(s.selection.row);
      }
    }
    if (s.phase === "swapping" && s.swapA && s.swapB) {
      const t = Math.min(1, s.swapTimer / SWAP_SECONDS);
      if (same(ref, s.swapA)) {
        x = cellX(s.swapB.col) + (cellX(s.swapA.col) - cellX(s.swapB.col)) * t;
        y = cellY(s.swapB.row) + (cellY(s.swapA.row) - cellY(s.swapB.row)) * t;
      }
      if (same(ref, s.swapB)) {
        x = cellX(s.swapA.col) + (cellX(s.swapB.col) - cellX(s.swapA.col)) * t;
        y = cellY(s.swapA.row) + (cellY(s.swapB.row) - cellY(s.swapA.row)) * t;
      }
    }
    if (s.phase === "resolving" && g.fell > 0) {
      const duration = g.fell * FALL_SECONDS_PER_ROW;
      const progress = Math.max(
        0,
        Math.min(1, (s.stepTimer - shatterEnd) / duration),
      );
      y = cellY(g.row) - g.fell * CELL_PITCH * (1 - (1 - (1 - progress) ** 3));
      if (!falling) continue;
    }
    if (
      s.phase === "idle" &&
      s.openingProgress !== undefined &&
      s.openingProgress < 0.55 &&
      g.fell
    ) {
      const duration = Math.max(0.2, g.fell * FALL_SECONDS_PER_ROW);
      const progress = Math.min(1, s.openingProgress / duration);
      y = cellY(g.row) - g.fell * CELL_PITCH * (1 - (1 - (1 - progress) ** 3));
    }
    drawGem(ctx, s, g, x, y);
    if (
      g.cut !== "plain" &&
      s.visuals?.fx["cut-aura"] &&
      s.screen === "playing"
    )
      particle(
        ctx,
        s.visuals.fx["cut-aura"],
        x,
        y,
        s.simTime % 1,
        86,
        indexOf(g.col, g.row) + 17,
      );
  }
  if (s.phase === "resolving" && s.breaks) {
    for (const b of s.breaks) {
      const t = s.stepTimer - b.wave * WAVE_SECONDS;
      if (t < 0 || t > 0.48) continue;
      const frames = images;
      const key = b.kind
        ? `break/${b.kind}/${Math.min(5, Math.floor(t / 0.08))}`
        : null;
      const img = key ? frames?.[key] : undefined;
      if (img) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - t / 0.48);
        ctx.drawImage(img, cellX(b.col) - 32, cellY(b.row) - 32);
        ctx.restore();
      }
      const fx = s.visuals?.fx[b.strain === MAX_STRAIN ? "flawed" : "clear"];
      if (fx)
        particle(
          ctx,
          fx,
          cellX(b.col),
          cellY(b.row),
          t,
          b.strain === MAX_STRAIN ? 122 : 86,
          indexOf(b.col, b.row) + (s.stepSerial ?? 0) * 71,
        );
    }
  }
  if (s.phase === "resolving" && s.flashes && s.visuals?.fx["cut-flash"])
    for (const f of s.flashes)
      particle(
        ctx,
        s.visuals.fx["cut-flash"],
        cellX(f.col),
        cellY(f.row),
        s.stepTimer,
        110,
        indexOf(f.col, f.row) + 991,
      );
  if (s.selection && s.screen === "playing") {
    ctx.strokeStyle = "#fff2b0";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ffe087";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cellX(s.selection.col), cellY(s.selection.row), 35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  if (s.refusal && s.screen === "playing") {
    ctx.strokeStyle = "#ff6e87";
    ctx.lineWidth = 4;
    for (const ref of [s.refusal.a, s.refusal.b]) {
      ctx.beginPath();
      ctx.arc(cellX(ref.col), cellY(ref.row), 35, 0, 7);
      ctx.stroke();
    }
  }
}
function renderHud(s: FacetState, ctx: CanvasRenderingContext2D) {
  rounded(ctx, 38, 28, 250, 88, 15, "#0e2637", "#426777");
  label(ctx, HUD_SCORE_LABEL, 64, 62, 18, "#91b5bd", "left");
  label(ctx, s.score.toLocaleString(), 64, 100, 36, "#f5e7b3", "left");
  rounded(ctx, 344, 24, 590, 82, 15, "#0e2637", "#426777");
  label(ctx, `${HUD_LEVEL_LABEL} ${s.level}`, 366, 57, 23, "#e4e9d4", "left");
  rounded(ctx, 367, 71, 542, 17, 7, "#203f4f");
  rounded(
    ctx,
    367,
    71,
    Math.max(
      0,
      542 * Math.min(1, s.levelScore / (s.level * LEVEL_TARGET_STEP)),
    ),
    17,
    7,
    "#e3bb73",
  );
  if (s.phase === "resolving") {
    label(
      ctx,
      `${HUD_CHAIN_LABEL} ×${Math.min(s.chainStep, MAX_MULTIPLIER)}`,
      996,
      163,
      29,
      "#ffe5a2",
      "left",
    );
  }
  drawButton(ctx, targetList("playing")[0], PAUSE_LABEL);
}
function drawMenu(s: FacetState, ctx: CanvasRenderingContext2D) {
  let heading = "",
    items: readonly string[] = [];
  if (s.screen === "title") {
    GEM_KINDS.forEach((kind, i) =>
      drawGem(
        ctx,
        s,
        plain(i, 0, kind),
        421 + i * 73,
        105 + Math.abs(i - 3) * 7,
      ),
    );
    heading = TITLE_TEXT;
    items = TITLE_ITEMS;
    label(ctx, TAGLINE_TEXT, 640, 322, 23, "#bad8d7");
  }
  if (s.screen === "paused") {
    heading = PAUSED_TITLE_TEXT;
    items = PAUSED_ITEMS;
  }
  if (s.screen === "levelclear") {
    heading = LEVELCLEAR_TITLE_TEXT;
    items = LEVELCLEAR_ITEMS;
  }
  if (s.screen === "gameover") {
    heading = GAMEOVER_TITLE_TEXT;
    items = GAMEOVER_ITEMS;
  }
  if (s.screen !== "title")
    rounded(ctx, 350, 170, 580, 488, 26, "rgba(5,20,33,.93)", "#628999");
  label(
    ctx,
    heading,
    640,
    s.screen === "title" ? 264 : 260,
    s.screen === "title" ? 102 : 55,
    "#f6e6b4",
    "center",
    700,
  );
  if (s.screen === "levelclear") {
    label(ctx, `${HUD_LEVEL_LABEL} ${s.level}`, 640, 322, 25);
    label(ctx, `${BEST_CHAIN_LABEL}  ${s.bestChain}`, 640, 364, 25, "#b9d3d6");
    label(ctx, `${BEST_MOVE_LABEL}  ${s.bestMove}`, 640, 406, 25, "#b9d3d6");
  }
  if (s.screen === "gameover") {
    label(ctx, `${HUD_SCORE_LABEL}  ${s.score.toLocaleString()}`, 640, 345, 32);
    label(ctx, `${HUD_LEVEL_LABEL}  ${s.level}`, 640, 392, 24);
  }
  targetList(s.screen).forEach((t, i) =>
    drawButton(ctx, t, items[i] ?? "", i === s.menuIndex),
  );
}
function drawHowto(ctx: CanvasRenderingContext2D) {
  rounded(ctx, 174, 30, 932, 660, 25, "#0c2436", "#567e8c");
  label(ctx, "HOW TO PLAY", 640, 90, 47, "#f4dfac");
  const lines = [
    "Drag a gem onto a neighboring gem, then let go to swap.",
    "Release back where you began to keep the board as it is.",
    "Line up three of one kind to shatter them. Empty swaps are refused.",
    "Each clear strains its neighbors. A flawed gem breaks when touched",
    "by any clear, and earns double points.",
    "Four in a line leave a BRILLIANT; five leave a PRISM.",
    "Crossing lines leave a STAR. Brilliants take their nearby ring;",
    "stars take a row and column. Swap a prism to clear one kind.",
    "Falling gems can chain. Each chain step scores more.",
    "Meet the level target; the round ends when no move remains.",
    "Play with mouse, pen or touch. ↑ ↓ choose; ↵ / ␣ confirm.",
    "⎋ / P pause or return; M mutes sound.",
  ];
  lines.forEach((line, i) =>
    label(
      ctx,
      line,
      219,
      151 + i * 39,
      21,
      i === 0 ? "#ffe8b4" : "#d1e2e3",
      "left",
      500,
    ),
  );
  drawButton(ctx, targetList("howto")[0], BACK_LABEL);
}
export const game: Game<FacetState, FacetDebugApi> = {
  async initialize(
    api: InitApi<FacetState>,
  ): Promise<[FacetState, FacetDebugApi]> {
    for (const name of ACTIONS)
      api.input.register(name, { keys: [...BINDINGS[name]] });
    const imagePaths: string[] = [];
    for (const kind of GEM_KINDS) {
      for (let strain = 0; strain <= MAX_STRAIN; strain++)
        imagePaths.push(`${kind}-${strain}`);
      for (let frame = 0; frame < 6; frame++)
        imagePaths.push(`break/${kind}/${frame}`);
    }
    for (let strain = 0; strain <= MAX_STRAIN; strain++)
      imagePaths.push(`prism-${strain}`);
    for (let frame = 0; frame < 8; frame++)
      imagePaths.push(`prism-turn/${frame}`);
    imagePaths.push("brilliant", "star", "frame");
    const images = Object.fromEntries(
      await Promise.all(
        imagePaths.map(
          async (key) =>
            [key, await api.assets.loadImage(`gems/${key}.png`)] as const,
        ),
      ),
    );
    const fxNames = ["clear", "flawed", "cut-flash", "cut-aura"];
    const fx = Object.fromEntries(
      await Promise.all(
        fxNames.map(
          async (key) =>
            [
              key,
              await (
                await api.assets.load(`fx/${key}.json`)
              )
                .text()
                .then((v) => JSON.parse(v) as ParticleSystem),
            ] as const,
        ),
      ),
    );
    const audioNames = [
      CUES.select,
      CUES.swap,
      CUES.refuse,
      CUES.clear,
      CUES.land,
      CUES.flaw,
      CUES.cut,
      CUES.levelUp,
      CUES.gameOver,
      "shatter",
      "title",
      "play",
      ...Array.from({ length: MAX_MULTIPLIER }, (_, i) => `chain-${i + 1}`),
    ];
    await Promise.all(
      audioNames.map((key) => api.audio.load(key, `audio/${key}.wav`)),
    );
    const diagnostics: Record<
      string,
      (s: DeepReadonly<FacetState>) => string | number | boolean
    > = {
      screen: (s) => s.screen,
      phase: (s) => s.phase,
      board: (s) => `${s.board.cols}×${s.board.rows}`,
      score: (s) => s.score,
      level: (s) =>
        `${s.level} · ${s.levelScore}/${s.level * LEVEL_TARGET_STEP}`,
      chain: (s) => `${s.chainStep} ×${Math.min(s.chainStep, MAX_MULTIPLIER)}`,
      cleared: (s) => `${s.lastCleared} · ${s.lastPoints} points`,
      waves: (s) => s.lastWaves,
      fall: (s) => Math.max(0, ...s.board.cells.map((g) => g.fell)),
      selection: (s) =>
        s.selection ? `${s.selection.col},${s.selection.row}` : "—",
      offer: (s) => (s.offer ? `${s.offer.col},${s.offer.row}` : "—"),
      best: (s) => `${s.bestMove} · ${s.bestChain}`,
      legal: (s) => legalSwap(clone(s).board),
      pointer: (s) =>
        `${s.pointer.x.toFixed(0)},${s.pointer.y.toFixed(0)} ${s.pointer.device}`,
    };
    for (const [key, source] of Object.entries(diagnostics))
      api.diagnostics.register(key, source);
    return [baseState(false, { images, fx }), debug];
  },
  update(
    state: DeepReadonly<FacetState>,
    api: UpdateApi,
    dt: number,
  ): FacetState {
    let s: FacetState = { ...clone(state), simTime: state.simTime + dt };
    if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());
    s = { ...s, muted: api.audio.muted() };
    const frameCues = new Set<string>();
    let rung = 0;
    const up = api.input.pressed("up");
    const down = api.input.pressed("down");
    if (up || down) {
      const count =
        s.screen === "title"
          ? TITLE_ITEMS.length
          : s.screen === "paused"
            ? PAUSED_ITEMS.length
            : s.screen === "levelclear"
              ? LEVELCLEAR_ITEMS.length
              : s.screen === "gameover"
                ? GAMEOVER_ITEMS.length
                : 0;
      if (count)
        s = {
          ...s,
          menuIndex:
            (s.menuIndex + (up ? count - 1 : 0) + (down ? 1 : 0)) % count,
        };
    }
    if (api.input.pressed("confirm")) s = menuChoice(s);
    if (api.input.pressed("pause")) {
      if (s.screen === "playing") s = { ...s, screen: "paused", menuIndex: 0 };
      else if (s.screen === "paused")
        s = { ...s, screen: "playing", menuIndex: 0 };
    }
    if (api.input.pressed("back")) s = back(s);
    for (const sample of api.input.pointerSamples()) {
      if (!sample.primary) continue;
      const before = s;
      if (sample.type === "down")
        s = pressPointer(s, sample.x, sample.y, sample.device);
      else if (sample.type === "move")
        s = movePointer(s, sample.x, sample.y, sample.device);
      else
        s = releasePointer(
          movePointer(s, sample.x, sample.y, sample.device),
          sample.device,
        );
      if (
        !same(before.selection, s.selection) &&
        s.selection &&
        s.screen === "playing"
      )
        frameCues.add(CUES.select);
      if (before.phase === "idle" && s.phase === "swapping")
        frameCues.add(CUES.swap);
      if (before.refusal !== s.refusal && s.refusal) frameCues.add(CUES.refuse);
    }
    const pointer = api.input.pointer();
    s = {
      ...s,
      pointer: {
        x: pointer.x,
        y: pointer.y,
        down: pointer.down,
        device: pointer.device,
      },
    };
    if (s.screen === "playing") {
      if (s.refusal) {
        const timer = s.refusal.timer + dt;
        s = {
          ...s,
          refusal: timer >= REFUSAL_SECONDS ? null : { ...s.refusal, timer },
        };
      }
      s = {
        ...s,
        openingProgress: Math.min(0.55, (s.openingProgress ?? 0.55) + dt),
      };
      s = advance(s, dt, (cue, step) => {
        frameCues.add(cue);
        if (cue === CUES.clear) rung = Math.max(rung, step ?? 0);
      });
    }
    const titleMusic = s.screen === "title" || s.screen === "howto";
    if (titleMusic) {
      api.audio.stop("play");
      api.audio.loop("title");
    } else {
      api.audio.stop("title");
      api.audio.loop("play");
    }
    for (const cue of frameCues) {
      api.audio.play(cue);
      if (cue === CUES.clear) {
        api.audio.play(`chain-${Math.min(rung, MAX_MULTIPLIER)}`);
        api.audio.play("shatter");
      }
    }
    return s;
  },
  render(state: DeepReadonly<FacetState>, api: RenderApi): void {
    const s = clone(state),
      ctx = api.ctx;
    const glow = ctx.createRadialGradient(640, 380, 70, 640, 380, 760);
    glow.addColorStop(0, "#14384a");
    glow.addColorStop(1, BACKGROUND);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    ctx.strokeStyle = "rgba(123,190,198,.12)";
    for (let x = 0; x < STAGE_W; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - 180, 720);
      ctx.stroke();
    }
    if (s.screen !== "title" && s.screen !== "howto") renderBoard(s, ctx);
    if (
      s.screen === "paused" ||
      s.screen === "levelclear" ||
      s.screen === "gameover"
    ) {
      ctx.fillStyle = "rgba(4, 17, 28, .55)";
      ctx.fillRect(320, 76, 640, 640);
    }
    if (s.screen === "playing") renderHud(s, ctx);
    else if (s.screen === "howto") drawHowto(ctx);
    else drawMenu(s, ctx);
  },
};
