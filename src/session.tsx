import {
  type Component,
  type JSX,
  type Resource,
  createResource,
  createContext,
} from "solid-js";
import { type Session } from "@supabase/supabase-js";

import { supabase } from "./api";

export const SessionContext = createContext<Resource<Session | null>>();

export const SessionProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  const [session] = createResource(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  });

  return (
    <SessionContext.Provider value={session}>
      {props.children}
    </SessionContext.Provider>
  );
};
