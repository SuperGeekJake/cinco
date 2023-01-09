import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

import {
  createClient,
  SupabaseClient,
  User,
} from "https://esm.sh/@supabase/supabase-js@2.2.3";

interface CreateAction {
  type: "CREATE";
}

interface JoinAction {
  type: "JOIN";
  payload: {
    gameId: string;
  };
}

interface LeaveAction {
  type: "LEAVE";
  payload: {
    gameId: string;
  };
}

interface StartAction {
  type: "START";
  payload: {
    gameId: string;
  };
}

interface TokenAction {
  type: "TOKEN";
  payload: {
    gameId: string;
    tokenId: string;
  };
}

type GameAction =
  | CreateAction
  | JoinAction
  | LeaveAction
  | StartAction
  | TokenAction;

class RequestError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const StandardResponse = (
  // deno-lint-ignore no-explicit-any
  data: any,
  options: { status?: number; headers?: Record<string, string> } = {}
) => {
  return new Response(JSON.stringify(data), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      "Content-Type": "application/json",
      ...options.headers,
    },
    status: options.status ?? 200,
  });
};

const InvalidResponse = (
  message: string,
  options: { status?: number; headers?: Record<string, string> } = {}
) => {
  return StandardResponse(message, { ...options, status: 400 });
};

const actionHandlers = {
  UNKNOWN: async () => {
    return await InvalidResponse("Invalid game action provided");
  },
  CREATE: async (supabase: SupabaseClient, user: User) => {
    const {
      id: playerId,
      user_metadata: { displayname },
    } = user;

    const { data, error } = await supabase
      .from("games")
      .insert({
        playOrder: [playerId],
        players: { [playerId]: displayname },
      })
      .select();
    if (error) throw error;
    return StandardResponse(data);
  },
  JOIN: () => {
    return StandardResponse({});
  },
  LEAVE: () => {
    return StandardResponse({});
  },
  START: () => {
    return StandardResponse({});
  },
  TOKEN: () => {
    return StandardResponse({});
  },
};

const getUser = async (req: Request) => {
  const response = await createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    }
  ).auth.getUser();
  if (response.data.user === null)
    throw new RequestError("Unknown authorization header", 401);
  // Now we can get the session or user object
  return response.data.user as User;
};

serve(async (req: Request) => {
  try {
    if (req.method !== "POST")
      throw new RequestError("Endpoint only accepts POST method", 405);

    const action = await req.json();
    const type: keyof typeof actionHandlers =
      typeof action === "object" &&
      typeof action.type === "string" &&
      actionHandlers[action.type as keyof typeof actionHandlers]
        ? action.type
        : "UNKNOWN";
    const user = await getUser(req);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const response = await actionHandlers[type](supabase, user);
    return response;
  } catch (error) {
    return StandardResponse(error.message, { status: error.status ?? 500 });
  }
});
