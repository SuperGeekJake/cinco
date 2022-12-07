import {
  type Component,
  type JSX,
  type Resource,
  createResource,
  createContext,
  useContext,
} from "solid-js";
import { type Session } from "@supabase/supabase-js";

import { supabase } from "./api";

export const SessionContext = createContext<Resource<Session | null>>();

export const SessionProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  const [session, { mutate }] = createResource(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    registerAuthListener();
    return data.session;
  });

  function registerAuthListener() {
    supabase.auth.onAuthStateChange((_, session) => {
      mutate(session);
    });
  }

  return (
    <SessionContext.Provider value={session}>
      {props.children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const result = useContext(SessionContext);
  if (result === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return result;
};
