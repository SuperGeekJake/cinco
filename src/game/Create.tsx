import { type Component, onMount, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { v4 as uuidv4 } from "uuid";

import { Loading } from "../Loading";
import { supabase } from "../api";
import { useSession } from "../session";

export const Create: Component = () => {
  const navigate = useNavigate();

  onMount(async () => {
    const { data, error } = await supabase.functions.invoke("game-action", {
      body: {
        type: "CREATE",
      },
    });

    if (error) throw error;
    navigate(`/game/${data.gameId}`, { replace: true });
  });

  return <Loading />;
};
