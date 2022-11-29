import { type Component, Show, createSignal } from "solid-js";
import { Outlet } from "@solidjs/router";
import { v4 as uuidv4 } from "uuid";

import { supabase } from "./api";
import { useSession } from "./session";
import { Loading } from "./Loading";

const supabaseDomain = import.meta.env.VITE_SUPABASE_DOMAIN;

export const AuthGuard: Component = () => {
  const session = useSession();
  return (
    <Show when={!session.loading} fallback={<Loading />}>
      <Show when={session()} fallback={<AuthLogin />}>
        <Outlet />
      </Show>
    </Show>
  );
};

const AuthLogin: Component = () => {
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const emailName = uuidv4();
    const password = uuidv4();
    // @ts-ignore elements doesn't exist on form target
    const displayname = event.target.elements.displayname.value;
    if (!displayname) throw new Error("Display name is required");
    const { error } = await supabase.auth.signUp({
      email: `${emailName}@${supabaseDomain}`,
      password,
      options: {
        data: {
          displayname,
        },
      },
    });

    if (error) throw error;
  };
  return (
    <main class="flex flex-col h-screen p-10">
      <form onSubmit={handleSubmit}>
        <label class="block">
          <span class="block">Choose display name:</span>
          <input class="block text-dark" type="text" name="displayname" />
        </label>
        <button type="submit" disabled={isSubmitting()}>
          Set name
        </button>
      </form>
    </main>
  );
};
