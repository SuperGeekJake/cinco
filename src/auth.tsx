import { type Component, createEffect, Show } from "solid-js";
import { useNavigate, Outlet } from "@solidjs/router";

import { supabase } from "./api";
import { useSession } from "./session";

const UserGuard: Component = () => {
  const navigate = useNavigate();
  const session = useSession();

  createEffect(async () => {
    /* Here null means user is not logged in. It could also be undefined
    which means we don't know yet.*/
    if (session.loading === false && session() === null) {
      // if signup request fails, redirect to home
      // navigate("/", { replace: true });
    }
  });

  return (
    <Show when={session()} fallback="Loading user...">
      <Outlet />
    </Show>
  );
};
