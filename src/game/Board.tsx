import {
  type Component,
  createSignal,
  onMount,
  For,
  onCleanup,
  createEffect,
} from "solid-js";
import createPanZoom, { type PanZoom } from "panzoom";

import { board } from "./state";
import { Token } from "./Token";
import { type Game } from "../api";

export const Board: Component<{
  tokens: Game["tokens"];
  active: boolean;
  onPlaceToken: (tokenId: number) => void;
}> = (props) => {
  let boardElement: HTMLDivElement;
  const [panzooming, setPanzooming] = createSignal<boolean>(false);

  let panzoom: PanZoom;
  onMount(() => {
    panzoom = createPanZoom(boardElement, {
      bounds: true,
      boundsPadding: 1,
      maxZoom: 4,
      minZoom: 1,
      zoomSpeed: 0.4,
    });

    if (!props.active) {
      panzoom.pause();
    }

    panzoom.on("panstart", () => {
      setPanzooming(true);
    });

    panzoom.on("panend", () => {
      setPanzooming(false);
    });
  });

  createEffect((prevActive) => {
    if (prevActive !== props.active) {
      if (props.active) {
        panzoom.resume();
      } else {
        panzoom.pause();
      }
    }
  }, props.active);

  onCleanup(() => {
    panzoom.dispose();
  });

  return (
    <div
      ref={(ref) => (boardElement = ref)}
      class="grid grid-cols-19 gap-1 p-1"
    >
      <For each={board}>
        {(tokenID) => (
          <Token
            id={tokenID}
            value={props.tokens[tokenID]}
            active={props.active && !panzooming()}
            onSelect={props.onPlaceToken}
          />
        )}
      </For>
    </div>
  );
};
