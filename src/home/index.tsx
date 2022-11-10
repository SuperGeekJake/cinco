import { Component } from "solid-js";
import { A, type AnchorProps } from "@solidjs/router";

export const Home: Component = () => {
  return (
    <main class="flex flex-col h-screen p-10">
      <h1>Cinco</h1>
      <NavButton href="/game">Start New Game</NavButton>
      <NavButton href="/continue">Continue Game</NavButton>
    </main>
  );
};

const NavButton: Component<AnchorProps> = (props) => (
  <A {...props} class="block w-full bg-light text-dark" />
);
