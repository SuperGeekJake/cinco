import { type Component } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";

import { Game } from "./game";
import { Home } from "./home";

export const App: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path="/game/:id" component={Game} />
        <Route path="/" component={Home} />
      </Routes>
    </Router>
  );
};
