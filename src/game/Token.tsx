import { type Component } from "solid-js";

export const Token: Component<{
  id: number;
  value: number | undefined;
  active: boolean;
  onSelect: (tokenID: number) => void;
}> = (props) => {
  let clicking: boolean = false;

  const handleMouseDown = (event: MouseEvent) => {
    if (event.button !== 0 || !props.active || props.value !== undefined)
      return;
    clicking = true;
  };

  const handleMouseUp = () => {
    if (!clicking) return;
    props.onSelect(props.id);
    clicking = false;
  };

  return (
    <button
      class="block w-full relative aspect-square m-0 border-none rounded-sm p-0"
      classList={{
        "bg-light opacity-5 hover:opacity-25 disabled:hover:opacity-5":
          props.value === undefined,
        "bg-red": props.value === 0,
        "bg-blue": props.value === 1,
        "bg-green": props.value === 2,
        "bg-yellow": props.value === 3,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={!props.active}
    />
  );
};
