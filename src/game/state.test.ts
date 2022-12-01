import { describe, test, expect } from "vitest";

describe("createGame", () => {
  test("returns the default state if none is provided", () => {
    const results = createGame();
    expect(results.state).toEqual(INIT_STATE);
  });

  test("returns the initial state provided", () => {
    const state = {
      ...INIT_STATE,
      playOrder: ["__CPU_PLAYER_01__"],
    };
    const results = createGame(state);
    expect(results.state).toEqual(state);
  });

  describe("playerJoined", () => {
    test("successfully adds player to game", () => {
      const state = {
        ...INIT_STATE,
        playOrder: ["__CPU_PLAYER_01__"],
      };
      const results = createGame(state);
      results.playerJoined("__CPU_PLAYER_02__");
      expect(results.state).toEqual({
        ...INIT_STATE,
        playOrder: ["__CPU_PLAYER_01__", "__CPU_PLAYER_02__"],
      });
    });
  });
});
