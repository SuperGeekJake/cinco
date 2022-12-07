import { type Game } from "../api";
import { playerJoined } from "./state";

const INIT_STATE: Game = {
  captures: null,
  currentPlayer: null,
  gameover: null,
  id: "144ae1e3-d8c9-4a78-ac0a-f917492b916e",
  playOrder: ["cfaed77a-d0a5-460f-be48-ad4408a42809"],
  players: { "cfaed77a-d0a5-460f-be48-ad4408a42809": "Yake" },
  status: "PRE",
  tokens: null,
};

describe("Game state logic", () => {
  describe("playerJoined", () => {
    test("successfully adds player to game", () => {
      const results = playerJoined(
        INIT_STATE,
        "__CPU_PLAYER_02__",
        "CPU Player 2"
      );
      expect(results).toEqual({
        ...INIT_STATE,
        playOrder: [...INIT_STATE.playOrder, "__CPU_PLAYER_02__"],
        players: {
          ...INIT_STATE.players,
          ["__CPU_PLAYER_02__"]: "CPU Player 2",
        },
      });
    });
  });
});
