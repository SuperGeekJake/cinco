import { Component, createEffect, For } from "solid-js";
import createPanZoom from "panzoom";

import { TokenID, board } from "./game";

export const Board: Component<{
  tokens: Record<TokenID, number>;
  active: boolean;
  onPlaceToken: (tokenId: number) => void;
}> = (props) => {
  let boardElement: HTMLDivElement;
  let currentTarget: TokenID | undefined;
  let isTransforming: boolean = false;

  const handleMouseDown = (tokenID: number) => {
    currentTarget = tokenID;
  };

  const handleMouseUp = () => {
    if (
      isTransforming ||
      !props.active ||
      props.tokens[currentTarget] !== undefined
    )
      return;
    props.onPlaceToken(currentTarget);
    currentTarget = undefined;
  };

  const filterMouseEvent =
    (callback: (tokenID: number) => void, tokenID: number) =>
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      callback(tokenID);
    };

  createEffect(() => {
    const panzoom = createPanZoom(boardElement, {
      bounds: true,
      boundsPadding: 1,
      maxZoom: 4,
      minZoom: 1,
      zoomSpeed: 0.4,
    });

    panzoom.on("panstart", () => {
      isTransforming = true;
    });

    panzoom.on("panend", () => {
      isTransforming = false;
    });

    return () => {
      panzoom.dispose();
    };
  });

  return (
    <div ref={boardElement} class="grid grid-cols-19 gap-1 p-1">
      <For each={board}>
        {(tokenID) => (
          <button
            class={`block w-full relative aspect-square m-0 border-none rounded-sm p-0 ${
              tokenClasses[props.tokens[tokenID]]
            }`}
            onMouseDown={filterMouseEvent(handleMouseDown, tokenID)}
            onMouseUp={filterMouseEvent(handleMouseUp, tokenID)}
          />
        )}
      </For>
    </div>
  );
};

const tokenClasses = {
  undefined: "bg-light opacity-5 hover:opacity-25",
  0: "bg-red",
  1: "bg-blue",
  2: "bg-green",
  3: "bg-yellow",
};
