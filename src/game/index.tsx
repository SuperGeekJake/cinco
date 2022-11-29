import { Component, createResource, For, Show, onCleanup } from "solid-js";
import { useParams } from "@solidjs/router";
import { type RealtimeChannel } from "@supabase/supabase-js";

import { Board } from "./Board";
import { useSession } from "../session";
import { supabase } from "../api";
import { Loading } from "../Loading";

export * from "./state";
export * from "./Create";

interface State {
  captures: Record<string, number>;
  currentPlayer: number;
  gameover: null | { draw: true } | { winner: string } | { quit: string };
  playOrder: string[];
  players: Record<string, string>;
  status: "PRE" | "LIVE" | "POST";
  tokens: Record<number, number>;
}

export const Game: Component = () => {
  const { id: gameId } = useParams();
  if (!gameId) throw new Error("Game ID parameter is required");

  const session = useSession();
  const { id: userId } = session().user;

  const [game, { mutate }] = createResource<State>(async () => {
    const { data, error } = await supabase
      .from("games")
      .select()
      .eq("id", gameId)
      .single();
    if (error) throw error;
    handleOnFetch();
    return data;
  });

  let channel: RealtimeChannel;
  const handleOnFetch = () => {
    channel = supabase
      .channel(`public:games:id=eq.${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        ({ new: newState }) => {
          mutate(newState as State);
        }
      )
      .subscribe((_, error) => {
        if (error) throw error;
      });
  };

  onCleanup(() => {
    if (channel) channel.unsubscribe();
  });

  const tokenPlaced = () => {
    console.log("token placed");
  };

  return (
    <Show when={!game.loading} fallback={<Loading />}>
      <main class="grid grid-cols-6 h-screen">
        <div class="col-span-full lg:col-span-4 order-2 aspect-square w-full max-w-4xl">
          <Board
            tokens={game().tokens || {}}
            active={game().status === "LIVE"}
            onPlaceToken={tokenPlaced}
          />
        </div>
        <For each={game().playOrder}>
          {(playerID, getIndex) => (
            <div
              class={`col-span-3 lg:col-span-1 order-1 ${
                getIndex() % 2 === 0 ? "lg:order-1" : "lg:order-3"
              }`}
            >
              <div>
                <span
                  classList={{
                    "inline-block py-1 px-4 m-1 rounded-md text-dark font-bold":
                      playerID === userId,
                    "bg-red": 0 === getIndex(),
                    "bg-blue": 1 === getIndex(),
                    "bg-green": 2 === getIndex(),
                    "bg-yellow": 3 === getIndex(),
                  }}
                >
                  {game().players[playerID]}
                </span>
              </div>
              <Show when={game().status !== "PRE"}>
                <div>Captures: {game().captures[playerID]}</div>
              </Show>
            </div>
          )}
        </For>
      </main>
    </Show>
  );
};
