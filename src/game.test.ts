import { describe, expect, it } from "vitest";
import type { InitApi, UpdateApi } from "@clockwyrks/simple-2d";
import { game, type FacetState } from "./game";

const rows = [
  "R0 A0 R0 J0 B0 S0 M0 C0",
  "C0 R0 B0 S0 M0 A0 J0 C0",
  "B0 S0 M0 R0 A0 C0 J0 B0",
  "M0 A0 C0 J0 B0 S0 R0 M0",
  "A0 C0 J0 B0 S0 M0 R0 A0",
  "J0 B0 S0 M0 R0 A0 C0 J0",
  "S0 M0 R0 A0 C0 J0 B0 S0",
  "R0 A0 C0 J0 B0 S0 M0 R0",
];
async function setup() {
  const sounds: string[] = [];
  const init = {
    input: { register() {}, layout: () => null },
    audio: { load: async () => {} },
    assets: {
      loadImage: async () => ({}) as ImageBitmap,
      load: async () => new Blob([JSON.stringify({})]),
    },
    diagnostics: { register() {} },
  } as unknown as InitApi<FacetState>;
  const [state, debug] = await game.initialize(init);
  const audio = {
    play: (cue: string) => sounds.push(cue),
    loop() {},
    stop() {},
    looping: () => false,
    setMuted() {},
    muted: () => false,
  };
  const input = {
    pressed: () => false,
    value: () => 0,
    pointerSamples: () => [],
    pointer: () => ({ x: 0, y: 0, down: false, device: "mouse", buttons: [] }),
  };
  const update = { audio, input } as unknown as UpdateApi;
  return { state, debug, update, sounds };
}

describe("Facet rules", () => {
  it("deals a run-free board with a legal move", async () => {
    const { state, debug } = await setup();
    const board = debug.dealBoard(state);
    const snap = debug.snapshot(board);
    expect(snap.board.cells).toHaveLength(64);
    expect(snap.legalSwap).toBe(true);
    expect(snap.board.cells.every((g) => g.fell >= g.row + 1)).toBe(true);
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        if (c < 6)
          expect(
            new Set([0, 1, 2].map((j) => snap.board.cells[r * 8 + c + j].kind))
              .size,
          ).toBeGreaterThan(1);
        if (r < 6)
          expect(
            new Set(
              [0, 1, 2].map((j) => snap.board.cells[(r + j) * 8 + c].kind),
            ).size,
          ).toBeGreaterThan(1);
      }
  });
  it("refuses a nonadjacent swap without changing the board", async () => {
    const { state, debug } = await setup();
    const posed = debug.loadBoard(state, rows);
    const refused = debug.requestSwap(posed, 0, 0, 7, 7);
    expect(refused.board).toEqual(posed.board);
    expect(refused.phase).toBe("idle");
    expect(refused.refusal?.a).toEqual({ col: 0, row: 0 });
  });
  it("resolves an accepted swap after its timed travel and scores the run", async () => {
    const { state, debug, update, sounds } = await setup();
    const posed = debug.setScreen(debug.loadBoard(state, rows), "playing");
    const swapped = debug.requestSwap(posed, 1, 0, 1, 1);
    expect(swapped.phase).toBe("swapping");
    const middle = game.update(swapped, update, 0.09);
    expect(middle.phase).toBe("swapping");
    expect(middle.score).toBe(0);
    const resolved = game.update(middle, update, 0.09);
    expect(resolved.phase).toBe("resolving");
    expect(resolved.lastCleared).toBeGreaterThanOrEqual(3);
    expect(resolved.lastPoints).toBeGreaterThanOrEqual(30);
    expect(resolved.score).toBe(resolved.lastPoints);
    expect(sounds).toContain("clear");
  });
  it("spreads a clear through a flawed neighbor and doubles its value", async () => {
    const { state, debug, update } = await setup();
    const board = debug.setGem(debug.loadBoard(state, rows), 0, 1, "C3");
    const swapped = debug.requestSwap(
      debug.setScreen(board, "playing"),
      1,
      0,
      1,
      1,
    );
    const resolved = game.update(swapped, update, 0.18);
    expect(resolved.lastCleared).toBe(4);
    expect(resolved.lastWaves).toBe(1);
    expect(resolved.lastPoints).toBe(50);
  });
  it("leaves a brilliant at the swapped cell after a line of four", async () => {
    const { state, debug, update } = await setup();
    const four = [...rows];
    four[0] = "R0 A0 R0 R0 B0 S0 M0 C0";
    const board = debug.setScreen(debug.loadBoard(state, four), "playing");
    const resolved = game.update(
      debug.requestSwap(board, 1, 0, 1, 1),
      update,
      0.18,
    );
    expect(resolved.lastPoints).toBe(40);
    expect(debug.snapshot(resolved).board.cells[1]).toMatchObject({
      kind: "ruby",
      cut: "brilliant",
      strain: 0,
    });
  });
  it("plays a pointer offer only after release", async () => {
    const { state, debug } = await setup();
    const board = debug.setScreen(debug.loadBoard(state, rows), "playing");
    const down = debug.pointerDown(board, 460, 144, "touch");
    const offered = debug.pointerMove(down, 460, 216, "touch");
    expect(offered.phase).toBe("idle");
    expect(offered.offer).toEqual({ col: 1, row: 1 });
    const played = debug.pointerUp(offered, "touch");
    expect(played.phase).toBe("swapping");
    expect(played.pointer.device).toBe("touch");
  });
  it("poses a flawed gem and reports its exact notation fields", async () => {
    const { state, debug } = await setup();
    const board = debug.setGem(debug.loadBoard(state, rows), 4, 3, "J3s");
    const cell = debug.snapshot(board).board.cells[3 * 8 + 4];
    expect(cell).toMatchObject({
      kind: "jade",
      cut: "star",
      strain: 3,
      fell: 0,
      x: 676,
      y: 360,
    });
  });
});
