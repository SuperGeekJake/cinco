import { type Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";

import { SessionProvider } from "./session";
import { AuthGuard } from "./auth";
import { Game, Create } from "./game";
import { Home } from "./home";

export const App: Component = () => {
  return (
    <Router>
      <SessionProvider>
        <Routes>
          <Route path="/game" component={AuthGuard}>
            <Route path="/:id" component={Game} />
            <Route path="/" component={Create} />
          </Route>
          <Route path="/game/:id" component={Game} />
          <Route path="/" component={Home} />
        </Routes>
      </SessionProvider>
    </Router>
  );
};
