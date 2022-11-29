import { type Component, onMount, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { v4 as uuidv4 } from "uuid";

import { Loading } from "../Loading";
import { supabase } from "../api";
import { useSession } from "../session";

export const Create: Component = () => {
  const navigate = useNavigate();
  const session = useSession();
  const abortController = new AbortController();

  onMount(async () => {
    const gameId = uuidv4();
    const {
      id: playerId,
      user_metadata: { displayname },
    } = session().user;
    const { error } = await supabase
      .from("games")
      .insert({
        id: gameId,
        playOrder: [playerId],
        players: { [playerId]: displayname },
      })
      .abortSignal(abortController.signal);

    if (error) throw error;
    navigate(`/game/${gameId}`);
  });

  onCleanup(() => {
    abortController.abort();
  });

  return <Loading />;
};
